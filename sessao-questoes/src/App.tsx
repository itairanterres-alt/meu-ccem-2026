import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './features/Home'
import { ProfessorHome } from './features/sessao-professor/ProfessorHome'
import { NovaSessao } from './features/sessao-professor/NovaSessao'
import { ProfessorConduzir } from './features/sessao-professor/ProfessorConduzir'
import { Projecao } from './features/projecao/Projecao'
import { AlunoEntrar } from './features/sessao-aluno/AlunoEntrar'
import { AlunoSessao } from './features/sessao-aluno/AlunoSessao'
import { Importacao } from './features/importacao/Importacao'
import { PortaA } from './features/importacao/PortaA'
import { PortaB } from './features/importacao/PortaB'
import { DEMO_MODE } from './lib/client'
import { AuthProvider } from './features/auth/AuthContext'
import { RequireAuth, RequireStaff } from './features/auth/guards'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        {DEMO_MODE && (
          <div className="bg-amber text-white text-center text-xs font-bold py-1 tracking-wide">
            MODO DEMO — dados em memória, sem Supabase. As 839 questões são reais (4ª, 5ª e 6ª fases).
          </div>
        )}
        <Routes>
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/professor" element={<RequireStaff><ProfessorHome /></RequireStaff>} />
          <Route path="/professor/nova" element={<RequireStaff><NovaSessao /></RequireStaff>} />
          <Route path="/importacao" element={<RequireStaff><Importacao /></RequireStaff>} />
          <Route path="/importacao/porta-a" element={<RequireStaff><PortaA /></RequireStaff>} />
          <Route path="/importacao/porta-b" element={<RequireStaff><PortaB /></RequireStaff>} />
          <Route path="/professor/:sessaoId" element={<RequireStaff><ProfessorConduzir /></RequireStaff>} />
          {/* Projeção fica sem guarda: é a tela de sala (TV/projetor), sem
              login próprio — só lê agregados por sessaoId. */}
          <Route path="/projecao/:sessaoId" element={<Projecao />} />
          <Route path="/aluno" element={<RequireAuth><AlunoEntrar /></RequireAuth>} />
          <Route path="/aluno/:sessaoId" element={<RequireAuth><AlunoSessao /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
