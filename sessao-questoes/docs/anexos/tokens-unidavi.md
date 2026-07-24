# Tokens visuais UNIDAVI (3º anexo da §10)

Fonte: design system do ecossistema MED-UNIDAVI 2027 (`DS` em Shared Components). Registrado aqui como fonte de verdade para a UI (passo 2).

## Cores institucionais (confirmam a §11)

| Token | Hex | Uso |
|---|---|---|
| `blue` | `#023E88` | Pantone 7687C — azul primário UNIDAVI (§11 "primária") |
| `blueAcc` | `#00ADEF` | Pantone 2995C — azul secundário/destaque (§11 "destaque") |
| `blueDark` | `#012D65` | hover de primário |
| `blueLight` | `#E6EDF8` | fundos suaves |
| `terra` | `#C4622D` | terracota institucional |
| `red` | `#BE3B3B` | risco/alerta (distinto do terracota) |
| `green` | `#2A8A5C` | sucesso/acerto |
| `amber` | `#B07A18` | atenção |
| `bg` | `#F5F7FC` | fundo de app |
| `surface` | `#FFFFFF` | cartões |
| `border` | `#DDE3F0` | bordas |
| `text` | `#1A2438` | texto primário |
| `textSec` | `#5A6480` | texto secundário |
| `textMuted` | `#6E7891` | 4.6:1 sobre branco (WCAG AA) |

Raios: `radiusSm 6px`, `radius/radiusMd 10px`, `radiusLg 14px`. Sombras: `shadow`, `shadowMd`, `shadowLg` (ver o objeto `DS` original).

## Tipografia — DECIDIDO: IBM Plex Sans

A §11 do brief pedia DM Sans; o design system do ecossistema usa IBM Plex Sans. O coordenador **decidiu por IBM Plex Sans** (alinhar ao ecossistema MED-UNIDAVI 2027, ao qual este app será absorvido). É a fonte a usar na UI (passo 2).

## O que do design system NÃO se aplica a este app

O `DS` traz um sistema completo (Sidebar com perfis, personas Capivara/Dr. Capi, notificações, nav de 15+ itens). **Quase nada disso entra nesta fatia** — este app é só a sessão de questões:

- **Persona Capivara/Dr. Capi:** §9 proíbe mascote nas telas de professor e admin ("interface funcional pura"). A tela do aluno é minimalista (polegar, uma mão). **Não uso a persona** nesta fatia.
- **Sidebar de perfis / nav do ecossistema:** fora de escopo — o app tem 3 telas (projeção, professor, aluno), não a navegação do ecossistema.
- **Aproveito:** paleta, raios, sombras, `Icon` (Lucide inline, zero CDN), e os componentes-base neutros (`Btn`, `Card`, `Badge`, `ProgressBar`) como referência de estilo.

## Critérios dominantes (§11), lembrete para o passo 2

- **Projeção:** legibilidade da última fileira — tipografia grande, alto contraste, pouco cromo, um item por tela.
- **Aluno:** alvos de toque generosos, uma mão.
