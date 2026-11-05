export type Network = "Ethereum" | "Polygon" | "Solana";

export interface Nft {
  id: string;
  title: string;
  price: number;
  creator: string;
  collection: string;
  network: Network;
  image: string;
  description: string;
  editions: number;
  rare?: boolean;
  createdAt: number;
}

export interface Wallet {
  id: string;
  name: string;
  type: string;
  address: string;
}

export interface Coupon {
  code: string;
  percent: number;
}

export const NETWORK_FEE_ETH = 0.016;

export const NFTS: Nft[] = [
  {
    id: "emerald-ape-042",
    title: "Emerald Ape #042",
    price: 1.19,
    creator: "Kurio Studio",
    collection: "Arte digital",
    network: "Ethereum",
    image: "/macaco-1.png", // Jaqueta verde e esmeralda
    description:
      "Um macaco elegante com óculos de sol e jaqueta verde. Arte digital gerada em alta resolução com certificado de autenticidade na blockchain.",
    editions: 12,
    createdAt: 1767225600000,
  },
  {
    id: "sage-nomad-089",
    title: "Sage Nomad #089",
    price: 1.69,
    creator: "Lia Ferreira",
    collection: "Arte digital",
    network: "Ethereum",
    image: "/macaco-3.png", // Chapéu sálvia e moletom
    description:
      "Um nômade de chapéu sálvia que percorre paisagens digitais. Edição limitada pensada para colecionadores.",
    editions: 5,
    createdAt: 1767139200000,
  },
  {
    id: "neon-vessel-552",
    title: "Neon Vessel #552",
    price: 1.9,
    creator: "Rafa Monteiro",
    collection: "Fotografia",
    network: "Polygon",
    image: "/macaco-2.png", // Fones de ouvido
    description: "Uma composição fotográfica com iluminação neon e textura vintage.",
    editions: 3,
    rare: true,
    createdAt: 1767052800000,
  },
  {
    id: "cosmic-bloom-118",
    title: "Cosmic Bloom #118",
    price: 1.29,
    creator: "Kurio Studio",
    collection: "Generativo",
    network: "Solana",
    image: "/macaco-4.png", // Blazer
    description: "Flor cósmica gerada por algoritmo, com cores que mudam conforme a luz.",
    editions: 20,
    createdAt: 1766966400000,
  },
  {
    id: "violet-nomad-314",
    title: "Violet Nomad #314",
    price: 1.39,
    creator: "Lia Ferreira",
    collection: "Arte digital",
    network: "Ethereum",
    image: "/macaco-3.png", // Moletom roxo e fones (conceito)
    description: "Versão violeta do nômade, com detalhes de fones de ouvido dourados.",
    editions: 8,
    createdAt: 1766880000000,
  },
  {
    id: "ivory-baron-088",
    title: "Ivory Baron #088",
    price: 1.79,
    creator: "Bruno Alves",
    collection: "Colecionáveis",
    network: "Ethereum",
    image: "/macaco-4.png", // Traje formal bege
    description: "Um barão de marfim em traje formal, peça de colecionador da série Baron.",
    editions: 4,
    createdAt: 1766793600000,
  },
  {
    id: "golden-beat-207",
    title: "Golden Beat #207",
    price: 0.99,
    creator: "Sons Digitais",
    collection: "Música",
    network: "Polygon",
    image: "/macaco-2.png", // Fones de ouvido (Música)
    description: "Faixa visual sincronizada com batidas, pensada para ser exibida em loop.",
    editions: 30,
    createdAt: 1766707200000,
  },
  {
    id: "golden-frequency-071",
    title: "Golden Frequency #071",
    price: 0.59,
    creator: "Sons Digitais",
    collection: "Música",
    network: "Solana",
    image: "/macaco-2.png",
    description: "Ondas douradas que representam frequências sonoras em forma de arte.",
    editions: 25,
    createdAt: 1766620800000,
  },
  {
    id: "golden-signal-160",
    title: "Golden Signal #160",
    price: 0.39,
    creator: "Bruno Alves",
    collection: "Jogos",
    network: "Solana",
    image: "/macaco-1.png",
    description: "Sinal dourado de um universo de jogos, item colecionável com utilidade no jogo.",
    editions: 50,
    createdAt: 1766534400000,
  },
  {
    id: "pixel-harbor-412",
    title: "Pixel Harbor #412",
    price: 2.45,
    creator: "Rafa Monteiro",
    collection: "Arte 3D",
    network: "Ethereum",
    image: "/macaco-4.png",
    description: "Um porto construído em pixels com iluminação 3D e profundidade real.",
    editions: 2,
    rare: true,
    createdAt: 1766448000000,
  },
  {
    id: "lunar-drift-233",
    title: "Lunar Drift #233",
    price: 0.75,
    creator: "Lia Ferreira",
    collection: "Generativo",
    network: "Polygon",
    image: "/macaco-3.png",
    description: "Trajetória lunar gerada por algoritmo, sem duas peças iguais.",
    editions: 15,
    createdAt: 1766361600000,
  },
  {
    id: "urban-echo-690",
    title: "Urban Echo #690",
    price: 0.52,
    creator: "Kurio Studio",
    collection: "Assinaturas",
    network: "Solana",
    image: "/macaco-1.png",
    description: "Ecos urbanos de uma cidade imaginária, acesso vitalício à comunidade Kurio.",
    editions: 40,
    createdAt: 1766275200000,
  },
];

export const COLLECTIONS = [
  "Arte digital",
  "Fotografia",
  "Música",
  "Arte 3D",
  "Colecionáveis",
  "Generativo",
  "Jogos",
  "Assinaturas",
  "Utilidade",
] as const;

export const WALLETS: Wallet[] = [
  {
    id: "metamask",
    name: "MetaMask",
    type: "Carteira de navegador",
    address: "0x7A3f...C91e",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    type: "Carteira móvel",
    address: "0x2bD8...4F07",
  },
  {
    id: "phantom",
    name: "Phantom",
    type: "Carteira Solana",
    address: "7Hq3...pX2m",
  },
];

export const COUPONS: Coupon[] = [
  { code: "KURIO10", percent: 10 },
  { code: "BEMVINDO", percent: 5 },
];

export const MOCK_USER = {
  name: "Colecionador Kurio",
  username: "colecionador",
  email: "colecionador@kurio.io",
};

export function findNft(id: string | undefined) {
  return NFTS.find((nft) => nft.id === id);
}