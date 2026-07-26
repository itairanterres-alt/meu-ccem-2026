// Provedor único de identidade para as telas — o "provedor equivalente" que
// o handoff previu para substituir os acessos diretos a identity.ts. As
// features (professor, aluno, importação) leem `useAuth()` e não sabem se a
// identidade veio do modo demo (personas em sessionStorage) ou da auth real
// (magic link + profiles). Trocar de demo para produção é só VITE_DATA_MODE.
//
// - Modo demo:     identidade vem de identity.ts (sessionStorage). Uma aba =
//                  um usuário; o professor entra como PROFESSOR_DEMO, o aluno
//                  escolhe persona. Sem e-mail, sem rede.
// - Modo supabase: identidade vem de supabase.auth + profiles. Login por
//                  magic link institucional; role definido pelo profile.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEMO_MODE } from '../../lib/client'
import {
  lerIdentidade,
  salvarIdentidade,
  sairIdentidade,
  type Identidade,
} from '../../lib/identity'
import {
  carregarIdentidadeSupabase,
  enviarMagicLink as enviarMagicLinkSupabase,
  onAuthChange,
  sairSupabase,
} from '../../lib/supabaseAuth'

interface AuthContextValue {
  identidade: Identidade | null
  carregando: boolean
  modo: 'demo' | 'supabase'
  // Modo demo: fixa a identidade da aba (persona professor/aluno).
  entrarComoDemo: (identidade: Identidade) => void
  // Modo supabase: dispara o magic link institucional.
  enviarMagicLink: (email: string) => Promise<void>
  sair: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [identidade, setIdentidade] = useState<Identidade | null>(() =>
    DEMO_MODE ? lerIdentidade() : null
  )
  // No modo supabase começamos carregando (precisamos consultar a sessão);
  // no demo já sabemos a identidade de forma síncrona.
  const [carregando, setCarregando] = useState(!DEMO_MODE)

  useEffect(() => {
    if (DEMO_MODE) return
    let vivo = true
    const resolver = async () => {
      const id = await carregarIdentidadeSupabase()
      if (vivo) {
        setIdentidade(id)
        setCarregando(false)
      }
    }
    resolver()
    // Reage a login (retorno do magic link), logout e refresh de token.
    const off = onAuthChange(resolver)
    return () => {
      vivo = false
      off()
    }
  }, [])

  const entrarComoDemo = useCallback((nova: Identidade) => {
    salvarIdentidade(nova)
    setIdentidade(nova)
  }, [])

  const enviarMagicLink = useCallback(async (email: string) => {
    await enviarMagicLinkSupabase(email)
  }, [])

  const sair = useCallback(async () => {
    if (DEMO_MODE) {
      sairIdentidade()
      setIdentidade(null)
    } else {
      await sairSupabase()
      setIdentidade(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        identidade,
        carregando,
        modo: DEMO_MODE ? 'demo' : 'supabase',
        entrarComoDemo,
        enviarMagicLink,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
