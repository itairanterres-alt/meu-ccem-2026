// Tipos alinhados ao schema aprovado (supabase/migrations/) e ao contrato
// institucional schema_questao_med_unidavi.json. Ver docs/revisao-schema.md.

export type Letra = 'A' | 'B' | 'C' | 'D'

export type ItemEstado = 'aguardando' | 'aberta' | 'travada' | 'discutida'
export type SessaoStatus = 'rascunho' | 'aberta' | 'em_andamento' | 'encerrada'
export type QuestaoStatus = 'pendente' | 'curado' | 'suspenso' | 'arquivado'

// Enums canônicos de schema_questao_med_unidavi.json — mantidos em sincronia manual.
export type AreaClinica =
  | 'ciclo_basico'
  | 'clinica_medica'
  | 'cirurgia'
  | 'ginecologia_obstetricia'
  | 'pediatria'
  | 'medicina_familia_comunidade'
  | 'saude_mental'
  | 'urgencia_emergencia'

export type NivelBloom = 'conhecimento' | 'compreensao' | 'aplicacao' | 'analise' | 'sintese' | 'avaliacao'

export interface Alternativa {
  letra: Letra
  texto: string
  correta?: boolean // só presente quando o consumidor tem direito de ver (pós-travamento / staff)
  justificativa?: string
}

/** Campos de uma questão ainda sem identidade no banco — saída da importação (Porta A/B), antes de confirmar. */
export interface QuestaoRascunho {
  enunciado: string
  texto_base: string | null
  fase_alvo: number
  uc_slug: string
  sp_referencia: string | null
  tema: string | null
  subtema: string | null
  area_clinica: AreaClinica | null
  nivel_bloom: NivelBloom | null
  dificuldade_editorial: 'facil' | 'medio' | 'dificil' | null
  competencia_dcn_2025: string[] // dcn2025_comp_01..27
  oa_slugs: string[]
  tags: string[]
  referencia: string | null
  fonte_geracao: string
  alternativas: Alternativa[] // sempre as 4, com `correta` e `justificativa`
}

/** Questão como o BANCO institucional a guarda (staff), já com identidade. */
export interface Questao extends QuestaoRascunho {
  id: string
  status: QuestaoStatus
  versao: number
}

/** Item da sessão como o ALUNO vê via rpc_ver_item — gabarito-safe até travar. */
export interface ItemAluno {
  sessao_questao_id: string
  estado: ItemEstado
  ordem: number
  enunciado: string
  texto_base: string | null
  alternativas: { posicao: number; letra: Letra; texto: string }[]
  minha_resposta?: Letra
  // presentes só após travamento:
  gabarito?: Letra
  justificativas?: Record<Letra, string>
  acertei?: boolean
}

export interface LinhaDistribuicao {
  posicao: number
  letra: Letra
  texto: string
  correta: boolean
  contagem: number
}

export interface SessaoQuestao {
  id: string
  sessao_id: string
  questao_id: string
  ordem: number
  estado: ItemEstado
  ordem_alternativas: Letra[]
}

export interface Sessao {
  id: string
  professor_id: string
  titulo: string
  fase: number
  uc_slug: string
  sp_referencia: string | null
  turma: string
  codigo: string
  status: SessaoStatus
  questao_atual: string | null // sessao_questao_id
}

export interface ContagemRespostas {
  respostas: number
  conectados: number
}
