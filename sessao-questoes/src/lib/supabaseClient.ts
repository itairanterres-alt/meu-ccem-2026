// Implementação de produção do SessaoClient — chama as RPCs do schema
// aprovado (supabase/migrations/20260724100300_rpcs_realtime.sql) via
// supabase-js. Mesmo contrato do demoClient (src/lib/demoClient.ts).
//
// Não testado contra um projeto Supabase ao vivo nesta sessão (nenhum
// projeto provisionado ainda) — a fidelidade ao schema foi validada no
// smoke test em Postgres local (ver docs/revisao-schema.md). Antes de ir a
// produção: gerar database.types.ts com `supabase gen types typescript` e
// trocar os `as any` por tipos gerados.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type {
  ContagemRespostas,
  ItemAluno,
  Letra,
  LinhaDistribuicao,
  Questao,
  Sessao,
  SessaoQuestao,
} from './types'
import type { NovaSessaoInput, SessaoClient } from './api'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export function criarSupabaseClient(): SupabaseClient | null {
  if (!url || !anonKey) return null
  return createClient(url, anonKey)
}

function mustClient(sb: SupabaseClient | null): SupabaseClient {
  if (!sb) {
    throw new Error(
      'Supabase não configurado — defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (.env local) ou use o modo demo.'
    )
  }
  return sb
}

export function makeSupabaseSessaoClient(sb: SupabaseClient | null): SessaoClient {
  return {
    async listarBancoQuestoes(filtro) {
      const client = mustClient(sb)
      let q = client.from('questoes').select('*, questao_alternativas(*)')
      if (filtro?.fase !== undefined) q = q.eq('fase_alvo', filtro.fase)
      if (filtro?.ucSlug !== undefined) q = q.eq('uc_slug', filtro.ucSlug)
      const { data, error } = await q
      if (error) throw error
      return (data ?? []).map(rowParaQuestao)
    },

    async criarSessao(input: NovaSessaoInput) {
      const client = mustClient(sb)
      const { data: sessao, error: e1 } = await client
        .from('sessoes')
        .insert({
          professor_id: input.professorId,
          titulo: input.titulo,
          fase: input.fase,
          uc_slug: input.ucSlug,
          sp_referencia: input.spReferencia,
          turma: input.turma,
        })
        .select()
        .single()
      if (e1) throw e1
      const linhas = input.questaoIds.map((questao_id, idx) => ({
        sessao_id: sessao.id,
        questao_id,
        ordem: idx + 1,
        ordem_alternativas: embaralharLetras(),
      }))
      const { error: e2 } = await client.from('sessao_questoes').insert(linhas)
      if (e2) throw e2
      return rowParaSessao(sessao)
    },

    async abrirSessao(sessaoId: string) {
      const client = mustClient(sb)
      const { data, error } = await client
        .from('sessoes')
        .update({ status: 'aberta', aberta_em: new Date().toISOString() })
        .eq('id', sessaoId)
        .select()
        .single()
      if (error) throw error
      return rowParaSessao(data)
    },

    async listarItens(sessaoId: string) {
      const client = mustClient(sb)
      const { data, error } = await client
        .from('sessao_questoes')
        .select('*')
        .eq('sessao_id', sessaoId)
        .order('ordem')
      if (error) throw error
      return (data ?? []).map(rowParaItem)
    },

    async avancar(sessaoId: string) {
      // Em produção isto seria uma RPC dedicada (rpc_avancar_item) para
      // manter a transição atômica no servidor; aqui, duas chamadas.
      const client = mustClient(sb)
      const { data: itens, error: e1 } = await client
        .from('sessao_questoes')
        .select('*')
        .eq('sessao_id', sessaoId)
        .eq('estado', 'aguardando')
        .order('ordem')
        .limit(1)
      if (e1) throw e1
      const proximo = itens?.[0]
      if (!proximo) throw new Error('Não há próximo item')
      const { data, error: e2 } = await client
        .from('sessao_questoes')
        .update({ estado: 'aberta', aberta_em: new Date().toISOString() })
        .eq('id', proximo.id)
        .select()
        .single()
      if (e2) throw e2
      await client
        .from('sessoes')
        .update({ status: 'em_andamento', questao_atual: proximo.id })
        .eq('id', sessaoId)
      return rowParaItem(data)
    },

    async travar(sessaoQuestaoId: string) {
      const client = mustClient(sb)
      const { error } = await client
        .from('sessao_questoes')
        .update({ estado: 'travada', travada_em: new Date().toISOString() })
        .eq('id', sessaoQuestaoId)
      if (error) throw error
    },

    async encerrarSessao(sessaoId: string) {
      const client = mustClient(sb)
      const { data, error } = await client
        .from('sessoes')
        .update({ status: 'encerrada', encerrada_em: new Date().toISOString() })
        .eq('id', sessaoId)
        .select()
        .single()
      if (error) throw error
      return rowParaSessao(data)
    },

    async contagemRespostas(sessaoQuestaoId: string): Promise<ContagemRespostas> {
      const client = mustClient(sb)
      const { data, error } = await client.rpc('rpc_contagem_respostas', {
        p_sessao_questao_id: sessaoQuestaoId,
      })
      if (error) throw error
      return data as ContagemRespostas
    },

    async contagemParticipantes(sessaoId: string) {
      const client = mustClient(sb)
      const { data, error } = await client.rpc('rpc_contagem_participantes', { p_sessao_id: sessaoId })
      if (error) throw error
      return data as number
    },

    async entrarSessao(codigo: string, _alunoId: string) {
      const client = mustClient(sb)
      const { data, error } = await client.rpc('rpc_entrar_sessao', { p_codigo: codigo })
      if (error) throw error
      return { sessaoId: data.sessao_id, status: data.status }
    },

    async responder(sessaoQuestaoId: string, _alunoId: string, letra: Letra) {
      const client = mustClient(sb)
      const { error } = await client.rpc('rpc_responder', {
        p_sessao_questao_id: sessaoQuestaoId,
        p_alternativa: letra,
      })
      if (error) throw error
    },

    async verItem(sessaoQuestaoId: string, _viewerId: string): Promise<ItemAluno> {
      const client = mustClient(sb)
      const { data, error } = await client.rpc('rpc_ver_item', {
        p_sessao_questao_id: sessaoQuestaoId,
      })
      if (error) throw error
      return data as ItemAluno
    },

    async distribuicao(sessaoQuestaoId: string): Promise<LinhaDistribuicao[]> {
      const client = mustClient(sb)
      const { data, error } = await client.rpc('rpc_distribuicao', {
        p_sessao_questao_id: sessaoQuestaoId,
      })
      if (error) throw error
      return data as LinhaDistribuicao[]
    },

    async getSessao(sessaoId: string) {
      const client = mustClient(sb)
      const { data, error } = await client.from('sessoes').select('*').eq('id', sessaoId).single()
      if (error) throw error
      return rowParaSessao(data)
    },

    subscribeSessao(sessaoId: string, onChange: () => void) {
      const client = mustClient(sb)
      const channel = client
        .channel(`sessao:${sessaoId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sessoes', filter: `id=eq.${sessaoId}` },
          onChange
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sessao_questoes', filter: `sessao_id=eq.${sessaoId}` },
          onChange
        )
        .subscribe()
      return () => {
        client.removeChannel(channel)
      }
    },
  }
}

function embaralharLetras(): Letra[] {
  const a: Letra[] = ['A', 'B', 'C', 'D']
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---------- mapeamento linha-do-banco -> tipo de domínio ----------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowParaSessao(row: any): Sessao {
  return {
    id: row.id,
    professor_id: row.professor_id,
    titulo: row.titulo,
    fase: row.fase,
    uc_slug: row.uc_slug,
    sp_referencia: row.sp_referencia,
    turma: row.turma,
    codigo: row.codigo,
    status: row.status,
    questao_atual: row.questao_atual,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowParaItem(row: any): SessaoQuestao {
  return {
    id: row.id,
    sessao_id: row.sessao_id,
    questao_id: row.questao_id,
    ordem: row.ordem,
    estado: row.estado,
    ordem_alternativas: row.ordem_alternativas,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowParaQuestao(row: any): Questao {
  return {
    id: row.id,
    enunciado: row.enunciado,
    texto_base: row.texto_base,
    fase_alvo: row.fase_alvo,
    uc_slug: row.uc_slug,
    sp_referencia: row.sp_referencia,
    tema: row.tema,
    dificuldade_editorial: row.dificuldade_editorial,
    status: row.status,
    versao: row.versao,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    alternativas: (row.questao_alternativas ?? []).map((a: any) => ({
      letra: a.letra,
      texto: a.texto,
      correta: a.correta,
      justificativa: a.justificativa,
    })),
  }
}
