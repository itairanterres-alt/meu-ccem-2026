// Carga inicial das questões-semente no Supabase real (Passo C do handoff,
// opção "a": script de seed único). Insere QUESTOES_SEED (src/lib/questoes-seed.ts)
// nas tabelas `questoes` + `questao_alternativas`, com o documento canônico
// completo no `payload` — a mesma estratégia de payload do supabaseClient.ts.
//
// Roda com a SERVICE ROLE key (bypassa RLS): é carga administrativa, não uma
// importação de docente. `criado_por` aponta para um profile de admin já
// existente (o admin precisa ter feito o primeiro login para o trigger
// handle_new_user ter criado a linha em profiles).
//
// USO (a partir de sessao-questoes/):
//   SUPABASE_URL=https://<ref>.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=<service_role key> \
//   SEED_AUTOR_ID=<uuid do profile admin> \
//   npm run seed:questoes
//
// - SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY: painel Supabase → Settings → API.
//   NUNCA comitar a service_role key nem expô-la no front (ela ignora RLS).
// - SEED_AUTOR_ID: id do profile (= auth.users.id) de um admin do seed.sql.
//   Descubra com:  select id, email from public.profiles where role='admin';
//
// Idempotência: por padrão o script ABORTA se a tabela `questoes` já tiver
// linhas, para não duplicar. Use SEED_FORCE=1 para inserir mesmo assim.

import { createClient } from '@supabase/supabase-js'
import { QUESTOES_SEED } from '../src/lib/questoes-seed'
import type { QuestaoSeed } from '../src/lib/questoes-seed'

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const autorId = process.env.SEED_AUTOR_ID
const force = process.env.SEED_FORCE === '1'
const LOTE = 100 // linhas de `questoes` por chunk

function exigir(nome: string, valor: string | undefined): string {
  if (!valor) {
    console.error(`Falta a variável de ambiente ${nome}. Veja o cabeçalho de scripts/seed-questoes.ts.`)
    process.exit(1)
  }
  return valor
}

// Documento canônico completo para a coluna `payload` — espelha
// payloadCanonico() de src/lib/supabaseClient.ts. Campos que a semente não
// traz nascem nos defaults do schema (questão 'pendente' pode estar
// incompleta; a curadoria completa depois).
function payloadCanonico(q: QuestaoSeed, criadaPor: string, criadaEm: string) {
  return {
    tipo: 'questao',
    fase_alvo: q.fase_alvo,
    uc_slug: q.uc_slug,
    sp_referencia: q.sp_referencia,
    tema: q.tema,
    subtema: null,
    area_clinica: null,
    nivel_bloom: null,
    dificuldade_editorial: q.dificuldade_editorial,
    competencia_dcn_2025: [] as string[],
    cenario_origem: ['nao_especificado'],
    tags: [] as string[],
    texto_base: q.texto_base,
    enunciado: q.enunciado,
    alternativas: q.alternativas,
    oa_slugs: [] as string[],
    referencia: null,
    fonte_geracao: 'humano',
    status_curadoria: 'pendente',
    disponibilidade: 'disponivel',
    versao: 1,
    uso_em_avaliacoes: { total_avaliativo: 0, ultima_avaliacao_em: null, historico: [] },
    performance: { n_respostas_treino: 0, n_respostas_avaliativo: 0 },
    auditoria: { criada_por: criadaPor, criada_em: criadaEm, proveniencia: q._proveniencia },
  }
}

async function main() {
  const URL = exigir('SUPABASE_URL', url)
  const KEY = exigir('SUPABASE_SERVICE_ROLE_KEY', serviceKey)
  const AUTOR = exigir('SEED_AUTOR_ID', autorId)

  const sb = createClient(URL, KEY, { auth: { persistSession: false } })

  // Sanidade: o autor precisa existir em profiles (FK criado_por).
  const { data: autorRow, error: eAutor } = await sb
    .from('profiles')
    .select('id, email, role')
    .eq('id', AUTOR)
    .maybeSingle()
  if (eAutor) throw eAutor
  if (!autorRow) {
    console.error(
      `SEED_AUTOR_ID ${AUTOR} não existe em profiles. O admin precisa ter feito o 1º login (magic link) antes.`
    )
    process.exit(1)
  }

  const { count, error: eCount } = await sb
    .from('questoes')
    .select('id', { count: 'exact', head: true })
  if (eCount) throw eCount
  if ((count ?? 0) > 0 && !force) {
    console.error(
      `A tabela questoes já tem ${count} linha(s). Abortando para não duplicar. Use SEED_FORCE=1 para forçar.`
    )
    process.exit(1)
  }

  console.log(`Carregando ${QUESTOES_SEED.length} questões (autor: ${autorRow.email})…`)
  const criadaEm = new Date().toISOString()
  let totalQuestoes = 0
  let totalAlternativas = 0

  for (let i = 0; i < QUESTOES_SEED.length; i += LOTE) {
    const chunk = QUESTOES_SEED.slice(i, i + LOTE)

    const linhasQuestao = chunk.map((q) => ({
      payload: payloadCanonico(q, AUTOR, criadaEm),
      enunciado: q.enunciado,
      texto_base: q.texto_base,
      fase_alvo: q.fase_alvo,
      uc_slug: q.uc_slug,
      sp_referencia: q.sp_referencia,
      tema: q.tema,
      dificuldade_editorial: q.dificuldade_editorial,
      fonte_geracao: 'humano',
      criado_por: AUTOR,
    }))

    // insert em lote devolve as linhas na MESMA ordem do array enviado,
    // então casamos cada alternativa ao id gerado por índice.
    const { data: inseridas, error: e1 } = await sb
      .from('questoes')
      .insert(linhasQuestao)
      .select('id')
    if (e1) throw e1
    if (!inseridas || inseridas.length !== chunk.length) {
      throw new Error(`Esperava ${chunk.length} ids, recebi ${inseridas?.length ?? 0}`)
    }

    const linhasAlt = chunk.flatMap((q, idx) =>
      q.alternativas.map((a) => ({
        questao_id: inseridas[idx].id,
        letra: a.letra,
        texto: a.texto,
        correta: !!a.correta,
        justificativa: a.justificativa ?? '',
      }))
    )
    const { error: e2 } = await sb.from('questao_alternativas').insert(linhasAlt)
    if (e2) throw e2

    totalQuestoes += chunk.length
    totalAlternativas += linhasAlt.length
    console.log(`  ${totalQuestoes}/${QUESTOES_SEED.length} questões…`)
  }

  console.log(`\nConcluído: ${totalQuestoes} questões e ${totalAlternativas} alternativas inseridas.`)
}

main().catch((e) => {
  console.error('\nFalha na carga:', e instanceof Error ? e.message : e)
  process.exit(1)
})
