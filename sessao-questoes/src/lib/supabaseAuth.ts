// Ponte entre supabase.auth (magic link) e a Identidade abstrata que as
// telas consomem. Toda a mecânica do schema (RLS + RPCs security definer)
// ancora em auth.uid(); aqui só resolvemos "quem é o usuário logado" a
// partir da sessão do supabase-js + a linha em `profiles` (que o trigger
// handle_new_user cria no primeiro login, role 'aluno' por padrão).
//
// Usa o MESMO cliente singleton do supabaseClient.ts — ver a nota lá sobre
// por que a instância precisa ser única.

import type { Session } from '@supabase/supabase-js'
import { criarSupabaseClient } from './supabaseClient'
import type { Identidade } from './identity'

const DOMINIO_INSTITUCIONAL = '@unidavi.edu.br'

export function emailInstitucionalValido(email: string): boolean {
  return email.trim().toLowerCase().endsWith(DOMINIO_INSTITUCIONAL)
}

// Resolve a Identidade do usuário atualmente logado (sessão + profiles).
// Retorna null se não há sessão. Se a linha em profiles ainda não existir
// (janela rara entre o insert em auth.users e o trigger), cai para os
// metadados da própria sessão com role 'aluno'.
export async function carregarIdentidadeSupabase(): Promise<Identidade | null> {
  const sb = criarSupabaseClient()
  if (!sb) return null

  const { data: sessionData } = await sb.auth.getSession()
  const session = sessionData.session
  if (!session) return null

  return identidadeDaSessao(session)
}

async function identidadeDaSessao(session: Session): Promise<Identidade> {
  const sb = criarSupabaseClient()
  const user = session.user

  let nome = (user.user_metadata?.nome as string | undefined) ?? ''
  let role: Identidade['role'] = 'aluno'

  if (sb) {
    const { data: profile } = await sb
      .from('profiles')
      .select('nome, role')
      .eq('id', user.id)
      .maybeSingle()
    if (profile) {
      nome = (profile.nome as string) || nome
      role = (profile.role as Identidade['role']) ?? 'aluno'
    }
  }

  if (!nome) nome = (user.email ?? '').split('@')[0]

  return { id: user.id, nome, role }
}

// Dispara o magic link. emailRedirectTo aponta para a origem+caminho atual
// (sem o fragmento de rota do HashRouter) — o PKCE volta com ?code=... na
// query e o supabase-js troca por sessão no carregamento.
export async function enviarMagicLink(email: string): Promise<void> {
  const sb = criarSupabaseClient()
  if (!sb) throw new Error('Supabase não configurado.')
  if (!emailInstitucionalValido(email)) {
    throw new Error(`Use o seu e-mail institucional (${DOMINIO_INSTITUCIONAL}).`)
  }
  const redirectTo = window.location.origin + window.location.pathname
  const { error } = await sb.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: { emailRedirectTo: redirectTo },
  })
  if (error) throw error
}

export async function sairSupabase(): Promise<void> {
  const sb = criarSupabaseClient()
  if (!sb) return
  await sb.auth.signOut()
}

// Assina mudanças de sessão (login/logout/refresh). Retorna unsubscribe.
export function onAuthChange(cb: () => void): () => void {
  const sb = criarSupabaseClient()
  if (!sb) return () => {}
  const { data } = sb.auth.onAuthStateChange(() => cb())
  return () => data.subscription.unsubscribe()
}
