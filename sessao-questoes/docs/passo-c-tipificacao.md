# Passo C.1 — Tipificação do Supabase

Instruções para gerar os tipos automaticamente do banco Supabase e eliminar os `any` em `supabaseClient.ts`.

## Pré-requisitos

- Supabase provisionado (Passo A concluído)
- Migrations aplicadas (`supabase db push`)
- Seed executado (`supabase/seed.sql`)

## Passos

### 1. Gerar os tipos do banco

A partir de `sessao-questoes/`, roda este comando (com a URL do projeto):

```bash
supabase gen types typescript --project-id <ref-do-projeto> > src/lib/database.types.ts
```

Isso gera um arquivo com todas as tabelas, funções e tipos — mais de 1000 linhas. **Não editar esse arquivo** — é gerado e regenerado.

### 2. Tipificar as funções de mapeamento

Em `src/lib/supabaseClient.ts`, as funções com `// eslint-disable-next-line @typescript-eslint/no-explicit-any` e parâmetro `row: any` precisam receber o tipo correto.

#### Exemplo: `rowParaSessao`

**Antes:**
```typescript
function rowParaSessao(row: any): Sessao {
  return {
    id: row.id,
    professor_id: row.professor_id,
    // ...
  }
}
```

**Depois:**
```typescript
import type { Database } from './database.types'

type SessaoRow = Database['public']['Tables']['sessoes']['Row']

function rowParaSessao(row: SessaoRow): Sessao {
  return {
    id: row.id,
    professor_id: row.professor_id,
    // ...
  }
}
```

#### Exemplo: `rowParaQuestao` (com related data)

`rowParaQuestao` recebe uma row com `questao_alternativas` (relação). Precisa buscar o tipo da tabela `questoes` mais a relação:

```typescript
type QuestaoRow = Database['public']['Tables']['questoes']['Row'] & {
  questao_alternativas: Database['public']['Tables']['questao_alternativas']['Row'][]
}

function rowParaQuestao(row: QuestaoRow): Questao {
  return {
    id: row.id,
    // ...
    alternativas: (row.questao_alternativas ?? []).map((a) => ({
      letra: a.letra,
      texto: a.texto,
      correta: a.correta,
      justificativa: a.justificativa,
    })),
  }
}
```

#### Exemplo: `payloadCanonico`

A função retorna um documento canônico — seu tipo deve refletir o shape esperado, ou manter `Record<string, any>` até que o schema de `payload` em `questoes` tenha um tipo JSON Schema no Supabase (feature futura).

**Opção 1: manter Record<string, any> por enquanto** (prática)
```typescript
function payloadCanonico(r: QuestaoRascunho, autorId: string): Record<string, any> {
  // … conteúdo sem mudança
}
```

**Opção 2: criar um tipo customizado para o payload**
```typescript
interface QuestaoPayloadCanonica {
  tipo: 'questao'
  fase_alvo: number
  uc_slug: string
  sp_referencia: string | null
  tema: string | null
  subtema: string | null
  // ... (copiar dos defaults do schema)
  alternativas: Array<{ letra: Letra; texto: string; correta: boolean; justificativa: string }>
}

function payloadCanonico(r: QuestaoRascunho, autorId: string): QuestaoPayloadCanonica {
  // ...
}
```

### 3. Tipificar os retornos de RPC

As RPCs (`rpc_contagem_respostas`, `rpc_distribuicao`, etc.) são strongly-typed no `database.types.ts`. Use-as:

```typescript
import type { Database } from './database.types'

type ContagemRespostasResult = Database['public']['Functions']['rpc_contagem_respostas']['Returns']

async contagemRespostas(sessaoQuestaoId: string): Promise<ContagemRespostas> {
  const client = mustClient(sb)
  const { data, error } = await client.rpc('rpc_contagem_respostas', {
    p_sessao_questao_id: sessaoQuestaoId,
  })
  if (error) throw error
  return data as ContagemRespostas
}
```

Ou, melhor ainda, deixar o supabase-js tipar o `data` automaticamente:

```typescript
async contagemRespostas(sessaoQuestaoId: string): Promise<ContagemRespostas> {
  const client = mustClient(sb)
  const { data, error } = await client.rpc<ContagemRespostasResult>(
    'rpc_contagem_respostas',
    { p_sessao_questao_id: sessaoQuestaoId },
  )
  if (error) throw error
  return data as ContagemRespostas  // cast é mínimo, `data` já é tipado
}
```

## Checklist

- [ ] Rodou `supabase gen types typescript` e gerou `src/lib/database.types.ts`
- [ ] Tipificou `rowParaSessao`, `rowParaItem`, `rowParaQuestao`
- [ ] Tipificou `payloadCanonico` (ou manteve `Record<string, any>` se preferir)
- [ ] Tipificou as RPCs em `contagemRespostas`, `contagemParticipantes`, `entrarSessao`, `responder`, `verItem`, `distribuicao`
- [ ] `npm run build` passa sem warnings de `any`

## Notas

- O `database.types.ts` é autogenerado — não versionar em git, ou versionar mas deixar claro que é gerado. Adicione a `.gitignore` se preferir:
  ```
  src/lib/database.types.ts
  ```
- Se o schema mudar (nova tabela, RPC, etc.), roda o comando de novo para regenerar.
- Ao fazer commit, atualizar a seção no handoff: `Passo C.1 — tipificação concluída`.
