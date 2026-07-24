import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './features/Home'
import { ProfessorHome } from './features/sessao-professor/ProfessorHome'
import { NovaSessao } from './features/sessao-professor/NovaSessao'
import { ProfessorConduzir } from './features/sessao-professor/ProfessorConduzir'
import { Projecao } from './features/projecao/Projecao'
import { AlunoEntrar } from './features/sessao-aluno/AlunoEntrar'
import { AlunoSessao } from './features/sessao-aluno/AlunoSessao'
import { DEMO_MODE } from './lib/client'

export default function App() {
  return (
    <HashRouter>
      {DEMO_MODE && (
        <div className="bg-amber text-white text-center text-xs font-bold py-1 tracking-wide">
          MODO DEMO — dados em memória, sem Supabase. As 40 questões são reais (amostra UC1/4ª fase).
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/professor" element={<ProfessorHome />} />
        <Route path="/professor/nova" element={<NovaSessao />} />
        <Route path="/professor/:sessaoId" element={<ProfessorConduzir />} />
        <Route path="/projecao/:sessaoId" element={<Projecao />} />
        <Route path="/aluno" element={<AlunoEntrar />} />
        <Route path="/aluno/:sessaoId" element={<AlunoSessao />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
