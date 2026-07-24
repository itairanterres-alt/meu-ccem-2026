// Interface do cliente de dados — a MESMA para o app real (Supabase, via
// supabaseClient.ts) e para o modo demo (demoClient.ts, em memória, com as
// 40 questões reais da amostra). As telas (features/) só conhecem este
// contrato; trocar de demo para produção é trocar a implementação injetada
// em main.tsx, sem tocar UI.
//
// Os nomes espelham as RPCs do schema aprovado (rpc_entrar_sessao,
// rpc_ver_item, rpc_responder, rpc_distribuicao, rpc_contagem_respostas)
// para que a migração para o SupabaseClient real seja mecânica.

import type {
  ContagemRespostas,
  ItemAluno,
  LinhaDistribuicao,
  Letra,
  Questao,
  QuestaoRascunho,
  Sessao,
  SessaoQuestao,
} from './types'

export interface NovaSessaoInput {
  professorId: string
  titulo: string
  fase: number
  ucSlug: string
  spReferencia: string | null
  turma: string
  questaoIds: string[] // ordem de seleção = ordem inicial
}

export interface SessaoClient {
  // ---------- Professor: montar e conduzir ----------
  listarBancoQuestoes(filtro?: { fase?: number; ucSlug?: string }): Promise<Questao[]>
  // Importação (Porta A: JSON já no schema canônico; Porta B: parseColado()
  // no cliente). Ambas as portas convergem aqui — o cliente só recebe
  // rascunhos já estruturados, nasce status 'pendente', versao 1.
  importarQuestoes(rascunhos: QuestaoRascunho[], autorId: string): Promise<Questao[]>
  criarSessao(input: NovaSessaoInput): Promise<Sessao>
  abrirSessao(sessaoId: string): Promise<Sessao>
  listarItens(sessaoId: string): Promise<SessaoQuestao[]>
  avancar(sessaoId: string): Promise<SessaoQuestao> // aguardando -> aberta (embaralha alternativas)
  travar(sessaoQuestaoId: string): Promise<void>
  encerrarSessao(sessaoId: string): Promise<Sessao>
  contagemRespostas(sessaoQuestaoId: string): Promise<ContagemRespostas>
  // Contador cru de participantes — usado pela projeção enquanto a sessão
  // está 'aberta' e nenhum item foi aberto ainda (contagemRespostas exige
  // um sessaoQuestaoId, que só existe depois do 1º avançar).
  contagemParticipantes(sessaoId: string): Promise<number>

  // ---------- Aluno ----------
  entrarSessao(codigo: string, alunoId: string): Promise<{ sessaoId: string; status: string }>
  responder(sessaoQuestaoId: string, alunoId: string, letra: Letra): Promise<void>

  // ---------- Compartilhado (aluno e projeção) ----------
  verItem(sessaoQuestaoId: string, viewerId: string): Promise<ItemAluno>
  distribuicao(sessaoQuestaoId: string): Promise<LinhaDistribuicao[]>
  getSessao(sessaoId: string): Promise<Sessao>

  // ---------- Realtime ----------
  // Retorna função de unsubscribe. No demo, é polling leve; em produção,
  // Supabase Realtime (postgres_changes) nas tabelas sessoes/sessao_questoes.
  subscribeSessao(sessaoId: string, onChange: () => void): () => void
}
