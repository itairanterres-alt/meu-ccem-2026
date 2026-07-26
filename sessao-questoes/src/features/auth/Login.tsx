import { useState } from 'react'
import { Btn, Card, ErrorBanner, PageHeader } from '../../ui/kit'
import { useAuth } from './AuthContext'
import { emailInstitucionalValido } from '../../lib/supabaseAuth'

// Login por magic link institucional (modo produção). Não pede senha: o
// aluno/professor recebe um link no e-mail @unidavi.edu.br e o clique
// estabelece a sessão. O trigger handle_new_user cria o profile no primeiro
// acesso (role 'aluno'); admins são promovidos por seed.sql.
export function Login() {
  const { enviarMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function enviar() {
    const e = email.trim().toLowerCase()
    if (!emailInstitucionalValido(e)) {
      return setErro('Use o seu e-mail institucional (@unidavi.edu.br).')
    }
    setErro(null)
    setEnviando(true)
    try {
      await enviarMagicLink(e)
      setEnviado(true)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível enviar o link.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <PageHeader
          title="Sessão de Questões"
          subtitle="Curso de Medicina · UNIDAVI Rio do Sul"
        />
        {enviado ? (
          <Card className="p-6 flex flex-col gap-3 text-center">
            <div className="text-green font-semibold">Link enviado!</div>
            <p className="text-sm text-textSec">
              Enviamos um link de acesso para <strong>{email.trim().toLowerCase()}</strong>. Abra o
              e-mail no mesmo aparelho e toque no link para entrar.
            </p>
            <button
              className="text-sm text-blue underline mt-1"
              onClick={() => {
                setEnviado(false)
                setEmail('')
              }}
            >
              Usar outro e-mail
            </button>
          </Card>
        ) : (
          <Card className="p-6 flex flex-col gap-4">
            <p className="text-sm text-textSec">
              Entre com o seu e-mail institucional. Você receberá um link de acesso — sem senha.
            </p>
            <div>
              <label className="block text-sm font-semibold text-textSec mb-2">
                E-mail institucional
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && enviar()}
                type="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="nome@unidavi.edu.br"
                className="w-full rounded-lg border-2 border-border px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blueAcc"
              />
            </div>
            {erro && <ErrorBanner message={erro} />}
            <Btn onClick={enviar} disabled={enviando} className="w-full text-lg py-4">
              {enviando ? 'Enviando…' : 'Receber link de acesso'}
            </Btn>
          </Card>
        )}
        <p className="text-xs text-textMuted mt-4 text-center">
          Atividade formativa. Não compõe nota.
        </p>
      </div>
    </div>
  )
}
