# Arquitetura do Projeto

Este documento descreve as principais decisões arquiteturais do marketplace Kurio.

## 1. Gerenciamento de Estado e Cache (TanStack Query)

- **Estado Remoto:** Toda comunicação com a API simulada é feita via TanStack Query, garantindo cache previsível, tratamento de loading e retry automático.
- **Isolamento de Dados:** As queries são segregadas por chaves (`["nfts"]`, `["quote", items, couponCode]`, `["auth", "me"]`). O logout limpa explicitamente o cache privado (`queryClient.removeQueries`).
- **Política de Cache:** O `staleTime` padrão é de 5 minutos para dados de catálogo, mas dados sensíveis (como a cotação do carrinho e a sessão do usuário) são revalidados agressivamente ou invalidados via mutations.

## 2. Roteamento e Proteção (TanStack Router)

- Utilizamos o **TanStack Router** com estrutura file-based na pasta `src/routes`.
- **Proteção de Rotas:** Rotas privadas (`/checkout`, `/profile`, `/wallets`) utilizam a propriedade `beforeLoad`. Se não houver um token JWT fictício no `localStorage`, o roteador redireciona o usuário para `/login` antes mesmo do componente renderizar.

## 3. Contratos REST e MSW

A API simulada é construída com **MSW (Mock Service Worker)**, interceptando requisições do **Axios** no nível de rede.
- **Contratos:** As rotas (`/api/nfts`, `/api/quote`, `/api/orders`, etc.) estão tipadas em `src/mocks/db.ts` e mapeadas em `src/mocks/handlers.ts`.
- **Idempotência:** A rota `POST /api/orders` exige o header `Idempotency-Key`. O backend em memória verifica se a chave já existe; se sim, retorna o pedido original (status 200) em vez de criar um novo (status 201).

## 4. Tempo Real (Socket.IO) e Reconciliação

- O **Socket.IO Client** é instanciado em `src/lib/socket.ts`.
- **Prevenção de Eventos Obsoletos:** Cada NFT possui uma propriedade `version`. O hook `useRealtime` escuta o evento `nft.updated` e só atualiza o cache do TanStack Query se a `version` recebida for maior que a atual.
- **Reconexão:** Ao reconectar (evento `connect`), o cliente invalida as queries de catálogo e cotação para sincronizar qualquer alteração perdida durante a queda de conexão.
