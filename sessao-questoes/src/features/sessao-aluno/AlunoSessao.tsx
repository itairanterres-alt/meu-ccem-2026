import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Btn, Card, ErrorBanner, Spinner } from '../../ui/kit'
import { client } from '../../lib/client'
import { lerIdentidade } from '../../lib/identity'
import type { Letra, Sessao, ItemAluno } from '../../lib/types'

// Tela do aluno — polegar, uma mão, celular (§11). Alvos de toque
// generosos. Mensagem de "não compõe nota" é requisito de mecânica (§7),
// não enfeite: mantém o dado diagnóstico limpo.
export function AlunoSessao() {
  const { sessaoId } = useParams<{ sessaoId: string }>()
  const navigate = useNavigate()
  const identidade = lerIdentidade()

  const [sessao, setSessao] = useState<Sessao | null>(null)
  const [item, setItem] = useState<ItemAluno | null>(null)
  const [selecionada, setSelecionada] = useState<Letra | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!sessaoId || !identidade) return
    const s = await client.getSessao(sessaoId)
    setSessao(s)
    if (s.questao_atual) {
      const it = await client.verItem(s.questao_atual, identidade.id)
      setItem(it)
      setSelecionada(it.minha_resposta ?? null)
    } else {
      setItem(null)
    }
  }, [sessaoId, identidade])

  useEffect(() => {
    if (!identidade) navigate('/aluno')
  }, [identidade, navigate])

  useEffect(() => {
    carregar()
  }, [carregar])

  useEffect(() => {
    if (!sessaoId) return
    return client.subscribeSessao(sessaoId, carregar)
  }, [sessaoId, carregar])

  if (!identidade) return null
  if (!sessao) return <Spinner />

  async function confirmar() {
    if (!item || !selecionada || !identidade) return
    setEnviando(true)
    setErro(null)
    try {
      await client.responder(item.sessao_questao_id, identidade.id, selecionada)
      await carregar()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao responder')
    } finally {
      setEnviando(false)
    }
  }

  const jaEnviou = !!item?.minha_resposta
  const travada = item?.estado === 'travada' || item?.estado === 'discutida'

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-blue text-white px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-sm">{sessao.titulo}</span>
        <span className="text-xs opacity-80">{identidade.nome}</span>
      </div>

      <div className="bg-amberLight text-amber text-xs text-center py-2 px-4 font-medium">
        Atividade formativa — não compõe nota. Você só vê o seu próprio desempenho.
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {sessao.status !== 'em_andamento' || !item ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
            <Badge tone={sessao.status === 'encerrada' ? 'green' : 'amber'}>
              {sessao.status === 'encerrada' ? 'Sessão encerrada' : 'Aguardando o professor iniciar'}
            </Badge>
            <p className="text-textSec text-sm max-w-xs">
              {sessao.status === 'encerrada'
                ? 'Obrigado por participar! Em breve você poderá revisar seu desempenho.'
                : 'Fique de olho na projeção — a primeira questão vai aparecer aqui automaticamente.'}
            </p>
          </div>
        ) : (
          <>
            {item.texto_base && (
              <p className="text-text leading-relaxed">{item.texto_base}</p>
            )}
            <p className="font-semibold text-text text-lg leading-snug">{item.enunciado}</p>

            <div className="flex flex-col gap-3 mt-2">
              {item.alternativas.map((alt) => {
                const marcada = selecionada === alt.letra
                const eACorreta = travada && item.gabarito === alt.letra
                const eAMinhaErrada = travada && jaEnviou && item.minha_resposta === alt.letra && item.gabarito !== alt.letra

                let estilo = 'border-border'
                if (travada) {
                  if (eACorreta) estilo = 'border-green bg-greenLight'
                  else if (eAMinhaErrada) estilo = 'border-red bg-redLight'
                } else if (marcada) {
                  estilo = 'border-blue bg-blueLight'
                }

                return (
                  <button
                    key={alt.letra}
                    disabled={travada || jaEnviou}
                    onClick={() => setSelecionada(alt.letra)}
                    className={`text-left rounded-lg border-2 px-4 py-4 min-h-[44px] flex items-start gap-3 transition-colors ${estilo} disabled:cursor-default`}
                  >
                    <span className="h-8 w-8 rounded-full bg-white border border-border flex items-center justify-center font-bold text-sm shrink-0">
                      {alt.letra}
                    </span>
                    <span className="flex-1">
                      <span className="block text-text">{alt.texto}</span>
                      {travada && item.justificativas && (eACorreta || alt.letra === selecionada) && (
                        <span className="block text-xs text-textSec mt-2">
                          {item.justificativas[alt.letra]}
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            {erro && <ErrorBanner message={erro} />}

            {!travada && !jaEnviou && (
              <Btn onClick={confirmar} disabled={!selecionada || enviando} className="w-full text-lg py-4 mt-2">
                {enviando ? 'Enviando…' : 'Confirmar resposta'}
              </Btn>
            )}

            {!travada && jaEnviou && (
              <Card className="p-4 text-center text-textSec text-sm">
                Resposta enviada. Aguardando o professor travar a questão.
              </Card>
            )}

            {travada && (
              <Card className={`p-4 text-center font-semibold ${item.acertei ? 'text-green' : 'text-red'}`}>
                {item.acertei ? 'Você acertou!' : `Você errou — a correta era ${item.gabarito}.`}
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
