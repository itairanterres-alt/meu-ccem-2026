import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Btn, Card, PageHeader } from '../../ui/kit'
import { useAuth } from '../auth/AuthContext'

interface SessaoResumo {
  id: string
  titulo: string
  codigo: string
  turma: string
  criadaEm: number
}

const CHAVE = 'sessao-questoes:sessoes-professor-demo'

function lerSessoes(): SessaoResumo[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) ?? '[]')
  } catch {
    return []
  }
}

export function ProfessorHome() {
  const navigate = useNavigate()
  const { identidade } = useAuth()
  const [sessoes, setSessoes] = useState<SessaoResumo[]>([])

  useEffect(() => {
    setSessoes(lerSessoes().sort((a, b) => b.criadaEm - a.criadaEm))
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <PageHeader
        title="Minhas sessões"
        subtitle={identidade?.nome ?? ''}
        action={
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => navigate('/importacao')}>
              Importar questões
            </Btn>
            <Btn variant="primary" onClick={() => navigate('/professor/nova')}>
              + Nova sessão
            </Btn>
          </div>
        }
      />
      {sessoes.length === 0 ? (
        <Card className="p-8 text-center text-textSec">
          Nenhuma sessão ainda. Crie a primeira para começar.
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {sessoes.map((s) => (
            <Card
              key={s.id}
              className="p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/professor/${s.id}`)}
            >
              <div>
                <div className="font-semibold text-text">{s.titulo}</div>
                <div className="text-sm text-textSec">Turma {s.turma}</div>
              </div>
              <div className="text-lg font-mono font-bold text-blue tracking-widest">{s.codigo}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export function registrarSessaoDemo(s: SessaoResumo) {
  const atuais = lerSessoes()
  localStorage.setItem(CHAVE, JSON.stringify([...atuais, s]))
}
