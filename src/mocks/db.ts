// src/mocks/db.ts

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
  version: number; // <-- NOVO
}

export const mockNfts: Nft[] = [
  {
    id: "emerald-ape-042",
    title: "Emerald Ape #042",
    price: 1.19,
    creator: "Kurio Studio",
    collection: "Arte digital",
    network: "Ethereum",
    image: "/macaco-1.png",
    description: "Um macaco elegante com óculos de sol e jaqueta verde.",
    editions: 12,
    createdAt: 1767225600000,
    version: 1,
  },
  {
    id: "sage-nomad-089",
    title: "Sage Nomad #089",
    price: 1.69,
    creator: "Lia Ferreira",
    collection: "Arte digital",
    network: "Ethereum",
    image: "/macaco-3.png",
    description: "Um nômade de chapéu sálvia que percorre paisagens digitais.",
    editions: 5,
    createdAt: 1767139200000,
    version: 1,
  },
  {
    id: "neon-vessel-552",
    title: "Neon Vessel #552",
    price: 1.9,
    creator: "Rafa Monteiro",
    collection: "Fotografia",
    network: "Polygon",
    image: "/macaco-2.png",
    description: "Uma composição fotográfica com iluminação neon.",
    editions: 3,
    rare: true,
    createdAt: 1767052800000,
    version: 1,
  },
  {
    id: "cosmic-bloom-118",
    title: "Cosmic Bloom #118",
    price: 1.29,
    creator: "Kurio Studio",
    collection: "Generativo",
    network: "Solana",
    image: "/macaco-4.png",
    description: "Flor cósmica gerada por algoritmo.",
    editions: 20,
    createdAt: 1766966400000,
    version: 1,
  },
];

export const COUPONS = [
  { code: "KURIO10", percent: 10 },
  { code: "BEMVINDO", percent: 5 },
];

export interface Order {
  id: string;
  items: { id: string; quantity: number }[];
  total: string;
  status: "pending" | "confirmed" | "declined";
  createdAt: number;
  idempotencyKey: string;
}

export const mockOrders: Order[] = [];

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
}

export const mockUsers: User[] = [
  { id: "user-1", name: "Colecionador Kurio", username: "kurio", email: "teste@teste.com", password: "123456" },
];

export interface Wallet {
  id: string;
  name: string;
  address: string;
  network: Network;
  isPrimary: boolean;
  userId: string;
}

export const mockWallets: Wallet[] = [
  {
    id: "w-1",
    name: "Minha MetaMask Principal",
    address: "0x7A3f...C91e",
    network: "Ethereum",
    isPrimary: true,
    userId: "user-1",
  }
];