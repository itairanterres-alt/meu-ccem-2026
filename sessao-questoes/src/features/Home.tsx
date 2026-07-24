import { useNavigate } from 'react-router-dom'
import { Btn, Card, PageHeader } from '../ui/kit'
import { DEMO_MODE } from '../lib/client'

export function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <PageHeader
          title="Sessão de Questões"
          subtitle="Curso de Medicina · UNIDAVI Rio do Sul"
        />
        <Card className="p-6 flex flex-col gap-4">
          <p className="text-sm text-textSec">
            Escolha como entrar {DEMO_MODE ? '(modo demo)' : ''}:
          </p>
          <Btn variant="primary" onClick={() => navigate('/professor')} className="w-full">
            Sou professor(a) — conduzir sessão
          </Btn>
          <Btn variant="secondary" onClick={() => navigate('/aluno')} className="w-full">
            Sou aluno(a) — entrar com código
          </Btn>
        </Card>
        <p className="text-xs text-textMuted mt-4 text-center">
          Atividade formativa. Não compõe nota.
        </p>
      </div>
    </div>
  )
}
