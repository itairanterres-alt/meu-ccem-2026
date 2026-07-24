// Tipos alinhados ao schema aprovado (supabase/migrations/) e ao contrato
// institucional schema_questao_med_unidavi.json. Ver docs/revisao-schema.md.

export type Letra = 'A' | 'B' | 'C' | 'D'

export type ItemEstado = 'aguardando' | 'aberta' | 'travada' | 'discutida'
export type SessaoStatus = 'rascunho' | 'aberta' | 'em_andamento' | 'encerrada'
export type QuestaoStatus = 'pendente' | 'curado' | 'suspenso' | 'arquivado'

export interface Alternativa {
  letra: Letra
  texto: string
  correta?: boolean // só presente quando o consumidor tem direito de ver (pós-travamento / staff)
  justificativa?: string
}

/** Questão como o BANCO institucional a guarda (staff). */
export interface Questao {
  id: string
  enunciado: string
  texto_base: string | null
  fase_alvo: number
  uc_slug: string
  sp_referencia: string | null
  tema: string | null
  dificuldade_editorial: 'facil' | 'medio' | 'dificil' | null
  status: QuestaoStatus
  versao: number
  alternativas: Alternativa[] // sempre as 4, com `correta` e `justificativa`
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
