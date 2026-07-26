import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Btn, Card, ErrorBanner, Spinner } from '../../ui/kit'
import { client } from '../../lib/client'
import { useAuth } from '../auth/AuthContext'
import type { ContagemRespostas, ItemAluno, LinhaDistribuicao, Sessao, SessaoQuestao } from '../../lib/types'

export function ProfessorConduzir() {
  const { sessaoId } = useParams<{ sessaoId: string }>()
  const navigate = useNavigate()
  const { identidade } = useAuth()
  const [sessao, setSessao] = useState<Sessao | null>(null)
  const [itens, setItens] = useState<SessaoQuestao[]>([])
  const [item, setItem] = useState<ItemAluno | null>(null)
  const [contagem, setContagem] = useState<ContagemRespostas | null>(null)
  const [distribuicao, setDistribuicao] = useState<LinhaDistribuicao[] | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [acao, setAcao] = useState(false)

  const carregar = useCallback(async () => {
    if (!sessaoId) return
    const s = await client.getSessao(sessaoId)
    setSessao(s)
    const its = await client.listarItens(sessaoId)
    setItens(its)
    if (s.questao_atual) {
      const it = await client.verItem(s.questao_atual, identidade?.id ?? '')
      setItem(it)
      if (it.estado === 'aberta') {
        setContagem(await client.contagemRespostas(s.questao_atual))
        setDistribuicao(null)
      } else if (it.estado === 'travada' || it.estado === 'discutida') {
        setDistribuicao(await client.distribuicao(s.questao_atual))
      }
    } else {
      setItem(null)
    }
  }, [sessaoId, identidade])

  useEffect(() => {
    carregar()
  }, [carregar])

  useEffect(() => {
    if (!sessaoId) return
    return client.subscribeSessao(sessaoId, carregar)
  }, [sessaoId, carregar])

  // Polling leve da contagem enquanto o item está aberto — decide quando travar.
  useEffect(() => {
    if (!sessao?.questao_atual || item?.estado !== 'aberta') return
    const id = setInterval(async () => {
      setContagem(await client.contagemRespostas(sessao.questao_atual!))
    }, 1500)
    return () => clearInterval(id)
  }, [sessao?.questao_atual, item?.estado])

  async function acaoComErro(fn: () => Promise<void>) {
    setErro(null)
    setAcao(true)
    try {
      await fn()
      await carregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro')
    } finally {
      setAcao(false)
    }
  }

  if (!sessao) return <Spinner />

  const totalItens = itens.length
  const respondidosOuMais = itens.filter((i) => i.estado !== 'aguardando').length
  const temProximo = itens.some((i) => i.estado === 'aguardando')

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text">{sessao.titulo}</h1>
          <p className="text-textSec text-sm">
            Turma {sessao.turma} · Item {respondidosOuMais}/{totalItens}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-black text-blue tracking-widest">{sessao.codigo}</div>
          <button
            className="text-xs text-blueAcc underline"
            onClick={() =>
              window.open(
                `${window.location.origin}${window.location.pathname}#/projecao/${sessao.id}`,
                '_blank'
              )
            }
          >
            abrir tela de projeção ↗
          </button>
        </div>
      </div>

      {erro && (
        <div className="mb-4">
          <ErrorBanner message={erro} />
        </div>
      )}

      {sessao.status === 'aberta' && (
        <Card className="p-8 text-center">
          <Badge tone="amber">Aguardando início</Badge>
          <p className="mt-4 text-textSec">
            Projete o código <strong className="text-text">{sessao.codigo}</strong> para a turma entrar.
          </p>
          <Btn
            className="mt-6"
            onClick={() => acaoComErro(async () => void (await client.avancar(sessao.id)))}
            disabled={acao}
          >
            Iniciar sessão — abrir questão 1
          </Btn>
        </Card>
      )}

      {sessao.status === 'em_andamento' && item && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge tone={item.estado === 'aberta' ? 'green' : 'blue'}>
              {item.estado === 'aberta' ? 'Recebendo respostas' : 'Travada'}
            </Badge>
            {item.estado === 'aberta' && contagem && (
              <span className="text-sm text-textSec font-medium">
                {contagem.respostas} de {contagem.conectados} responderam
              </span>
            )}
          </div>

          {item.texto_base && <p className="text-text mb-3 whitespace-pre-wrap">{item.texto_base}</p>}
          <p className="font-semibold text-text mb-4">{item.enunciado}</p>

          <div className="flex flex-col gap-2 mb-4">
            {item.alternativas.map((alt) => {
              const linhaDist = distribuicao?.find((d) => d.letra === alt.letra)
              return (
                <div
                  key={alt.letra}
                  className={`rounded border px-4 py-3 text-sm flex items-center justify-between ${
                    linhaDist?.correta ? 'border-green bg-greenLight' : 'border-border'
                  }`}
                >
                  <span>
                    <strong className="mr-2">{alt.letra}</strong>
                    {alt.texto}
                  </span>
                  {linhaDist && (
                    <span className="font-mono text-xs font-bold text-textSec ml-3 shrink-0">
                      {linhaDist.contagem}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {item.estado === 'aberta' ? (
            <Btn
              variant="terra"
              onClick={() =>
                acaoComErro(async () => {
                  if (!sessao.questao_atual) return
                  await client.travar(sessao.questao_atual)
                })
              }
              disabled={acao}
            >
              Travar questão
            </Btn>
          ) : temProximo ? (
            <Btn onClick={() => acaoComErro(async () => void (await client.avancar(sessao.id)))} disabled={acao}>
              Próxima questão
            </Btn>
          ) : (
            <Btn
              variant="success"
              onClick={() =>
                acaoComErro(async () => void (await client.encerrarSessao(sessao.id)))
              }
              disabled={acao}
            >
              Encerrar sessão
            </Btn>
          )}
        </Card>
      )}

      {sessao.status === 'encerrada' && (
        <Card className="p-8 text-center">
          <Badge tone="green">Sessão encerrada</Badge>
          <p className="mt-4 text-textSec">
            {totalItens} questões percorridas com a turma {sessao.turma}.
          </p>
          <Btn className="mt-6" variant="secondary" onClick={() => navigate('/professor')}>
            Voltar para minhas sessões
          </Btn>
        </Card>
      )}
    </div>
  )
}
