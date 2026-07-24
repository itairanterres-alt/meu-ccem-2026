// Implementação em memória do SessaoClient — mesmo contrato do Supabase real,
// para rodar e demonstrar o fluxo de ponta a ponta sem projeto Supabase ao
// vivo. Replica deliberadamente as regras de negócio do schema aprovado:
//   * uma resposta por aluno por item, imutável
//   * gabarito/correta nunca visível com o item 'aberta'
//   * alternativas embaralhadas por item (ordem_alternativas)
//   * distribuição só após travar
// Isso não é um mock burro — é o mesmo comportamento que as RPCs terão em
// produção, então serve como especificação executável.

import type {
  ContagemRespostas,
  ItemAluno,
  Letra,
  LinhaDistribuicao,
  Questao,
  Sessao,
  SessaoQuestao,
  SessaoStatus,
} from './types'
import type { NovaSessaoInput, SessaoClient } from './api'
import { QUESTOES_SEED } from './questoes-seed'

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function gerarCodigo(existentes: Set<string>): string {
  const alfabeto = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // sem I,L,O,0,1
  let cod = ''
  do {
    cod = Array.from({ length: 6 }, () => alfabeto[Math.floor(Math.random() * alfabeto.length)]).join('')
  } while (existentes.has(cod))
  return cod
}

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface Resposta {
  sessaoId: string
  sessaoQuestaoId: string
  alunoId: string
  letra: Letra
}

class DemoStore {
  questoes: Questao[] = QUESTOES_SEED.map((q, i) => ({
    id: `q_${i + 1}`,
    enunciado: q.enunciado,
    texto_base: q.texto_base,
    fase_alvo: q.fase_alvo,
    uc_slug: q.uc_slug,
    sp_referencia: q.sp_referencia,
    tema: q.tema,
    dificuldade_editorial: q.dificuldade_editorial,
    status: 'pendente',
    versao: 1,
    alternativas: q.alternativas,
  }))

  sessoes = new Map<string, Sessao>()
  itens = new Map<string, SessaoQuestao>() // por sessao_questao_id
  itensPorSessao = new Map<string, string[]>() // sessaoId -> [sessaoQuestaoId em ordem]
  participantes = new Map<string, Set<string>>() // sessaoId -> alunoIds
  respostas: Resposta[] = []
  codigos = new Set<string>()
  listeners = new Map<string, Set<() => void>>() // sessaoId -> callbacks

  notify(sessaoId: string) {
    this.listeners.get(sessaoId)?.forEach((cb) => cb())
  }
}

const store = new DemoStore()

// ---------- Persistência entre abas ----------
// O store é um singleton do módulo JS: vive só na aba que o carregou. Mas o
// fluxo real precisa do professor numa aba e de vários alunos em outras
// (ver identity.ts). Serializamos a parte mutável em localStorage a cada
// escrita e reidratamos ao ler o evento `storage` (que o navegador dispara
// nas OUTRAS abas, nunca na que escreveu — dispensa eco local). Não é
// Supabase Realtime de verdade, mas o comportamento observável é o mesmo:
// mudança em uma aba aparece nas demais.
const STORAGE_KEY = 'sessao-questoes:demo-store:v1'

interface Persistido {
  sessoes: [string, Sessao][]
  itens: [string, SessaoQuestao][]
  itensPorSessao: [string, string[]][]
  participantes: [string, string[]][]
  respostas: Resposta[]
  codigos: string[]
}

function persistir() {
  const payload: Persistido = {
    sessoes: [...store.sessoes.entries()],
    itens: [...store.itens.entries()],
    itensPorSessao: [...store.itensPorSessao.entries()],
    participantes: [...store.participantes.entries()].map(([k, v]) => [k, [...v]]),
    respostas: store.respostas,
    codigos: [...store.codigos],
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

function reidratar() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  try {
    const p: Persistido = JSON.parse(raw)
    store.sessoes = new Map(p.sessoes)
    store.itens = new Map(p.itens)
    store.itensPorSessao = new Map(p.itensPorSessao)
    store.participantes = new Map(p.participantes.map(([k, v]) => [k, new Set(v)]))
    store.respostas = p.respostas
    store.codigos = new Set(p.codigos)
  } catch {
    // estado corrompido em localStorage — mantém o que já está em memória
  }
}

reidratar()
window.addEventListener('storage', (e) => {
  if (e.key !== STORAGE_KEY) return
  reidratar()
  for (const sessaoId of store.listeners.keys()) store.notify(sessaoId)
})

// Simula latência de rede para o fluxo parecer real (e expor bugs de corrida
// que uma implementação síncrona esconderia).
const NET_DELAY_MS = 120
function tick<T>(fn: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn())
      } catch (e) {
        reject(e)
      }
    }, NET_DELAY_MS)
  })
}

function questaoAlternativasCanonicas(questaoId: string) {
  const q = store.questoes.find((x) => x.id === questaoId)
  if (!q) throw new Error('Questão não encontrada')
  return q
}

export const demoClient: SessaoClient = {
  async listarBancoQuestoes(filtro) {
    return tick(() =>
      store.questoes.filter(
        (q) => (filtro?.fase === undefined || q.fase_alvo === filtro.fase) &&
               (filtro?.ucSlug === undefined || q.uc_slug === filtro.ucSlug)
      )
    )
  },

  async criarSessao(input: NovaSessaoInput) {
    return tick(() => {
      const id = uid('sessao')
      const codigo = gerarCodigo(store.codigos)
      store.codigos.add(codigo)
      const sessao: Sessao = {
        id,
        professor_id: input.professorId,
        titulo: input.titulo,
        fase: input.fase,
        uc_slug: input.ucSlug,
        sp_referencia: input.spReferencia,
        turma: input.turma,
        codigo,
        status: 'rascunho',
        questao_atual: null,
      }
      store.sessoes.set(id, sessao)
      const itemIds: string[] = []
      input.questaoIds.forEach((questaoId, idx) => {
        const sqId = uid('sq')
        const sq: SessaoQuestao = {
          id: sqId,
          sessao_id: id,
          questao_id: questaoId,
          ordem: idx + 1,
          estado: 'aguardando',
          ordem_alternativas: embaralhar<Letra>(['A', 'B', 'C', 'D']),
        }
        store.itens.set(sqId, sq)
        itemIds.push(sqId)
      })
      store.itensPorSessao.set(id, itemIds)
      store.participantes.set(id, new Set())
      persistir()
      return sessao
    })
  },

  async abrirSessao(sessaoId: string) {
    return tick(() => {
      const s = store.sessoes.get(sessaoId)
      if (!s) throw new Error('Sessão não encontrada')
      const atualizada: Sessao = { ...s, status: 'aberta' as SessaoStatus }
      store.sessoes.set(sessaoId, atualizada)
      persistir()
      store.notify(sessaoId)
      return atualizada
    })
  },

  async listarItens(sessaoId: string) {
    return tick(() => {
      const ids = store.itensPorSessao.get(sessaoId) ?? []
      return ids.map((id) => store.itens.get(id)!).sort((a, b) => a.ordem - b.ordem)
    })
  },

  async avancar(sessaoId: string) {
    return tick(() => {
      const s = store.sessoes.get(sessaoId)
      if (!s) throw new Error('Sessão não encontrada')
      const ids = store.itensPorSessao.get(sessaoId) ?? []
      const itens = ids.map((id) => store.itens.get(id)!).sort((a, b) => a.ordem - b.ordem)
      const proximo = itens.find((i) => i.estado === 'aguardando')
      if (!proximo) throw new Error('Não há próximo item — sessão já percorreu todas as questões')
      const atualizado: SessaoQuestao = { ...proximo, estado: 'aberta' }
      store.itens.set(atualizado.id, atualizado)
      store.sessoes.set(sessaoId, { ...s, status: 'em_andamento', questao_atual: atualizado.id })
      persistir()
      store.notify(sessaoId)
      return atualizado
    })
  },

  async travar(sessaoQuestaoId: string) {
    return tick(() => {
      const item = store.itens.get(sessaoQuestaoId)
      if (!item) throw new Error('Item não encontrado')
      store.itens.set(sessaoQuestaoId, { ...item, estado: 'travada' })
      persistir()
      store.notify(item.sessao_id)
    })
  },

  async encerrarSessao(sessaoId: string) {
    return tick(() => {
      const s = store.sessoes.get(sessaoId)
      if (!s) throw new Error('Sessão não encontrada')
      const atualizada: Sessao = { ...s, status: 'encerrada' }
      store.sessoes.set(sessaoId, atualizada)
      persistir()
      store.notify(sessaoId)
      return atualizada
    })
  },

  async contagemRespostas(sessaoQuestaoId: string): Promise<ContagemRespostas> {
    return tick(() => {
      const item = store.itens.get(sessaoQuestaoId)
      if (!item) throw new Error('Item não encontrado')
      const respostas = store.respostas.filter((r) => r.sessaoQuestaoId === sessaoQuestaoId).length
      const conectados = store.participantes.get(item.sessao_id)?.size ?? 0
      return { respostas, conectados }
    })
  },

  async contagemParticipantes(sessaoId: string) {
    return tick(() => store.participantes.get(sessaoId)?.size ?? 0)
  },

  async entrarSessao(codigo: string, alunoId: string) {
    return tick(() => {
      const s = [...store.sessoes.values()].find(
        (x) => x.codigo === codigo.trim().toUpperCase() && (x.status === 'aberta' || x.status === 'em_andamento')
      )
      if (!s) throw new Error('Sessão não encontrada ou não está aberta')
      let set = store.participantes.get(s.id)
      if (!set) {
        set = new Set()
        store.participantes.set(s.id, set)
      }
      set.add(alunoId)
      persistir()
      store.notify(s.id)
      return { sessaoId: s.id, status: s.status }
    })
  },

  async responder(sessaoQuestaoId: string, alunoId: string, letra: Letra) {
    return tick(() => {
      const item = store.itens.get(sessaoQuestaoId)
      if (!item) throw new Error('Item não encontrado')
      const s = store.sessoes.get(item.sessao_id)
      if (!s || s.status !== 'em_andamento' || item.estado !== 'aberta') {
        throw new Error('Este item não está aberto para respostas')
      }
      const participantes = store.participantes.get(item.sessao_id)
      if (!participantes?.has(alunoId)) throw new Error('Você não entrou nesta sessão')
      const jaRespondeu = store.respostas.some(
        (r) => r.sessaoQuestaoId === sessaoQuestaoId && r.alunoId === alunoId
      )
      if (jaRespondeu) throw new Error('Resposta já registrada — não é possível alterar')
      store.respostas.push({ sessaoId: item.sessao_id, sessaoQuestaoId, alunoId, letra })
      persistir()
      store.notify(item.sessao_id)
    })
  },

  async verItem(sessaoQuestaoId: string, viewerId: string): Promise<ItemAluno> {
    return tick(() => {
      const item = store.itens.get(sessaoQuestaoId)
      if (!item) throw new Error('Item não encontrado')
      if (item.estado === 'aguardando') throw new Error('Item ainda não foi aberto')
      const q = questaoAlternativasCanonicas(item.questao_id)

      const alternativas = item.ordem_alternativas.map((letra, idx) => {
        const alt = q.alternativas.find((a) => a.letra === letra)!
        return { posicao: idx + 1, letra, texto: alt.texto }
      })

      const minhaResposta = store.respostas.find(
        (r) => r.sessaoQuestaoId === sessaoQuestaoId && r.alunoId === viewerId
      )

      const resultado: ItemAluno = {
        sessao_questao_id: item.id,
        estado: item.estado,
        ordem: item.ordem,
        enunciado: q.enunciado,
        texto_base: q.texto_base,
        alternativas,
        minha_resposta: minhaResposta?.letra,
      }

      if (item.estado === 'travada' || item.estado === 'discutida') {
        const correta = q.alternativas.find((a) => a.correta)!
        resultado.gabarito = correta.letra
        resultado.justificativas = Object.fromEntries(
          q.alternativas.map((a) => [a.letra, a.justificativa ?? ''])
        ) as Record<Letra, string>
        resultado.acertei = minhaResposta?.letra === correta.letra
      }

      return resultado
    })
  },

  async distribuicao(sessaoQuestaoId: string): Promise<LinhaDistribuicao[]> {
    return tick(() => {
      const item = store.itens.get(sessaoQuestaoId)
      if (!item) throw new Error('Item não encontrado')
      if (item.estado !== 'travada' && item.estado !== 'discutida') {
        throw new Error('Distribuição disponível apenas após travar o item')
      }
      const q = questaoAlternativasCanonicas(item.questao_id)
      return item.ordem_alternativas.map((letra, idx) => {
        const alt = q.alternativas.find((a) => a.letra === letra)!
        const contagem = store.respostas.filter(
          (r) => r.sessaoQuestaoId === sessaoQuestaoId && r.letra === letra
        ).length
        return { posicao: idx + 1, letra, texto: alt.texto, correta: !!alt.correta, contagem }
      })
    })
  },

  async getSessao(sessaoId: string) {
    return tick(() => {
      const s = store.sessoes.get(sessaoId)
      if (!s) throw new Error('Sessão não encontrada')
      return s
    })
  },

  subscribeSessao(sessaoId: string, onChange: () => void) {
    let set = store.listeners.get(sessaoId)
    if (!set) {
      set = new Set()
      store.listeners.set(sessaoId, set)
    }
    set.add(onChange)
    return () => {
      store.listeners.get(sessaoId)?.delete(onChange)
    }
  },
}

// Exposto só para a tela de "escolher questões" do professor no demo —
// em produção isso vem de listarBancoQuestoes / import real.
export function _demoQuestoesDisponiveis() {
  return store.questoes
}
