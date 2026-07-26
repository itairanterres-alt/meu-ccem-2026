import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Btn, Card, ErrorBanner, PageHeader, Spinner } from '../../ui/kit'
import { client } from '../../lib/client'
import { useAuth } from '../auth/AuthContext'
import type { Questao } from '../../lib/types'
import { registrarSessaoDemo } from './ProfessorHome'

const TURMAS = ['T13', 'T14', 'T15']
const NIVEL_LABEL: Record<string, string> = { facil: 'Fácil', medio: 'Média', dificil: 'Difícil' }

export function NovaSessao() {
  const navigate = useNavigate()
  const { identidade } = useAuth()
  const [fase, setFase] = useState(4)
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [selecionadas, setSelecionadas] = useState<string[]>([])
  const [titulo, setTitulo] = useState('')
  const [turma, setTurma] = useState(TURMAS[0])
  const [erro, setErro] = useState<string | null>(null)
  const [criando, setCriando] = useState(false)

  useEffect(() => {
    setCarregando(true)
    setSelecionadas([])
    client.listarBancoQuestoes({ fase }).then((qs) => {
      setQuestoes(qs)
      setCarregando(false)
    })
  }, [fase])

  const ucSlug = questoes[0]?.uc_slug ?? ''

  const spTitulos = useMemo(() => {
    // No modo demo, a proveniência (SP de origem) não é campo do schema —
    // aqui só agrupamos visualmente pela ordem de import; em produção o
    // agrupamento real usa sp_referencia.
    return questoes
  }, [questoes])

  function toggle(id: string) {
    setSelecionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function criar() {
    if (!titulo.trim()) return setErro('Dê um título à sessão.')
    if (selecionadas.length === 0) return setErro('Selecione ao menos uma questão.')
    if (!identidade) return setErro('Sessão de login expirada — entre novamente.')
    setErro(null)
    setCriando(true)
    try {
      const sessao = await client.criarSessao({
        professorId: identidade.id,
        titulo: titulo.trim(),
        fase,
        ucSlug,
        spReferencia: null,
        turma,
        questaoIds: selecionadas,
      })
      const aberta = await client.abrirSessao(sessao.id)
      registrarSessaoDemo({
        id: aberta.id,
        titulo: aberta.titulo,
        codigo: aberta.codigo,
        turma: aberta.turma,
        criadaEm: Date.now(),
      })
      navigate(`/professor/${aberta.id}`)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao criar sessão')
      setCriando(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 pb-28">
      <PageHeader title="Nova sessão" subtitle="Selecione as questões do banco institucional" />

      <Card className="p-5 mb-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-textSec mb-1">Título da sessão</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="ex.: Sessão semanal — UC1 Proliferação Celular"
            className="w-full rounded border border-border px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blueAcc"
          />
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-semibold text-textSec mb-1">Turma</label>
            <select
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              className="rounded border border-border px-3 py-3 text-base"
            >
              {TURMAS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-textSec mb-1">Fase</label>
            <select
              value={fase}
              onChange={(e) => setFase(Number(e.target.value))}
              className="rounded border border-border px-3 py-3 text-base"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((f) => (
                <option key={f} value={f}>
                  {f}ª fase
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {carregando ? (
        <Spinner />
      ) : questoes.length === 0 ? (
        <Card className="p-8 text-center text-textSec">
          Nenhuma questão no banco para a {fase}ª fase ainda.{' '}
          <button className="text-blue underline" onClick={() => navigate('/importacao')}>
            Importar questões
          </button>
          .
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-text">
              Banco de questões — {selecionadas.length} selecionada(s) de {questoes.length}
            </h2>
            <div className="flex gap-2">
              <Btn variant="ghost" onClick={() => setSelecionadas(questoes.map((q) => q.id))}>
                Selecionar todas
              </Btn>
              <Btn variant="ghost" onClick={() => setSelecionadas([])}>
                Limpar
              </Btn>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {spTitulos.map((q, idx) => {
              const marcada = selecionadas.includes(q.id)
              return (
                <Card
                  key={q.id}
                  onClick={() => toggle(q.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    marcada ? 'border-blue ring-1 ring-blue' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked={marcada} readOnly className="mt-1 h-5 w-5 accent-blue" />
                    <div className="flex-1">
                      <div className="text-xs text-textMuted mb-1">
                        Questão {idx + 1}
                        {q.dificuldade_editorial && ` · ${NIVEL_LABEL[q.dificuldade_editorial]}`}
                      </div>
                      <div className="text-sm text-text">{q.enunciado}</div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {erro && (
        <div className="mt-4">
          <ErrorBanner message={erro} />
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 flex justify-end">
        <Btn variant="primary" onClick={criar} disabled={criando}>
          {criando ? 'Criando…' : 'Criar e abrir sessão'}
        </Btn>
      </div>
    </div>
  )
}
