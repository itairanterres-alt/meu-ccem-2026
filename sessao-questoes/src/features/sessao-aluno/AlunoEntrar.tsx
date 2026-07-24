import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Btn, Card, ErrorBanner, PageHeader } from '../../ui/kit'
import { client } from '../../lib/client'
import { alunoDemo, lerIdentidade, salvarIdentidade } from '../../lib/identity'

const PERSONAS_DEMO = [1, 2, 3, 4]

export function AlunoEntrar() {
  const navigate = useNavigate()
  const identidadeAtual = lerIdentidade()
  const [personaEscolhida, setPersonaEscolhida] = useState(
    identidadeAtual?.role === 'aluno' ? identidadeAtual.id : ''
  )
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [entrando, setEntrando] = useState(false)

  async function entrar() {
    if (!personaEscolhida) return setErro('Escolha quem você é (modo demo).')
    if (codigo.trim().length < 6) return setErro('Digite o código de 6 caracteres da sessão.')
    setErro(null)
    setEntrando(true)
    const identidade = alunoDemo(Number(personaEscolhida.replace('aluno_', '')))
    try {
      const { sessaoId } = await client.entrarSessao(codigo, identidade.id)
      salvarIdentidade(identidade)
      navigate(`/aluno/${sessaoId}`)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao entrar')
    } finally {
      setEntrando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        <PageHeader title="Entrar na sessão" subtitle="Digite o código mostrado na projeção" />
        <Card className="p-5 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-textSec mb-2">
              Você é (modo demo — abra uma aba por aluno)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PERSONAS_DEMO.map((n) => {
                const id = `aluno_${n}`
                const ativo = personaEscolhida === id
                return (
                  <button
                    key={id}
                    onClick={() => setPersonaEscolhida(id)}
                    className={`rounded-lg border-2 py-3 text-sm font-bold min-h-[44px] ${
                      ativo ? 'border-blue bg-blueLight text-blue' : 'border-border text-textSec'
                    }`}
                  >
                    {n}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-textSec mb-2">Código da sessão</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="ABC123"
              inputMode="text"
              autoCapitalize="characters"
              className="w-full text-center text-3xl font-mono font-black tracking-[0.3em] uppercase rounded-lg border-2 border-border px-3 py-4 focus:outline-none focus:ring-2 focus:ring-blueAcc"
            />
          </div>

          {erro && <ErrorBanner message={erro} />}

          <Btn onClick={entrar} disabled={entrando} className="w-full text-lg py-4">
            {entrando ? 'Entrando…' : 'Entrar'}
          </Btn>
        </Card>
      </div>
    </div>
  )
}
