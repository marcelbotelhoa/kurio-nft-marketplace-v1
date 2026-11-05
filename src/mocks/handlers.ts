// src/mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw';
import { mockNfts, COUPONS, mockOrders, mockUsers, mockWallets, type Order, type User, type Wallet } from './db';

let currentSession: User | null = null;

export const handlers = [
  // --- ROTAS DE NFT ---
  http.get('/api/nfts', async () => {
    await delay(800);
    return HttpResponse.json(mockNfts);
  }),

  http.get('/api/nfts/:id', ({ params }) => {
    const nft = mockNfts.find((n) => n.id === params.id);
    if (!nft) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(nft);
  }),

  // --- ROTAS DE COTAÇÃO E PEDIDOS ---
  http.post('/api/quote', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as any;
    const { items, couponCode } = body;

    if (!items || items.length === 0) return HttpResponse.json({ message: "Carrinho vazio" }, { status: 400 });

    let subtotal = 0;
    for (const item of items) {
      const nft = mockNfts.find((n) => n.id === item.id);
      if (!nft) return HttpResponse.json({ message: "NFT não encontrado." }, { status: 404 });
      if (item.quantity > nft.editions) return HttpResponse.json({ message: "Estoque insuficiente." }, { status: 409 });
      subtotal += nft.price * item.quantity;
    }

    let discount = 0;
    let validCoupon = null;
    if (couponCode) {
      const coupon = COUPONS.find((c) => c.code.toUpperCase() === couponCode.toUpperCase());
      if (!coupon) return HttpResponse.json({ message: "Cupom inválido." }, { status: 400 });
      validCoupon = coupon;
      discount = subtotal * (coupon.percent / 100);
    }

    const fee = 0.016;
    const total = subtotal - discount + fee;

    return HttpResponse.json({
      subtotal: subtotal.toFixed(4),
      discount: discount.toFixed(4),
      fee: fee.toFixed(4),
      total: total.toFixed(4),
      coupon: validCoupon,
    });
  }),

  http.post('/api/orders', async ({ request }) => {
    await delay(1000);
    const idempotencyKey = request.headers.get('Idempotency-Key');
    if (!idempotencyKey) return HttpResponse.json({ message: "Idempotency-Key obrigatório" }, { status: 400 });

    const existingOrder = mockOrders.find((o) => o.idempotencyKey === idempotencyKey);
    if (existingOrder) return HttpResponse.json(existingOrder, { status: 200 });

    const body = (await request.json()) as any;
    const newOrder: Order = {
      id: `ord-${Math.random().toString(36).substring(2, 9)}`,
      items: body.items,
      total: body.total,
      status: "confirmed",
      createdAt: Date.now(),
      idempotencyKey,
    };

    mockOrders.push(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  // --- ROTAS DE AUTENTICAÇÃO ---
  http.post('/api/auth/login', async ({ request }) => {
    await delay(600);
    const { email, password } = (await request.json()) as any;
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) return HttpResponse.json({ message: "Credenciais inválidas." }, { status: 401 });

    currentSession = user;
    return HttpResponse.json({ token: 'mock-token-123', user });
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    await delay(800);
    const { name, username, email, password } = (await request.json()) as any;

    const userExists = mockUsers.some(u => u.email === email);
    if (userExists) return HttpResponse.json({ message: "Este e-mail já está em uso." }, { status: 409 });

    const newUser: User = { id: `user-${Date.now()}`, name, username, email, password };
    mockUsers.push(newUser);
    currentSession = newUser;

    return HttpResponse.json({ token: 'mock-token-123', user: newUser });
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(300);
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.includes('mock-token-123') || !currentSession) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(currentSession);
  }),

  http.post('/api/auth/logout', async () => {
    await delay(300);
    currentSession = null;
    return new HttpResponse(null, { status: 204 });
  }),

  // --- ROTAS DE PERFIL ---
  http.patch('/api/profile', async ({ request }) => {
    await delay(600);
    if (!currentSession) return new HttpResponse(null, { status: 401 });

    const body = (await request.json()) as any;
    currentSession = { ...currentSession, ...body };
    
    const userIndex = mockUsers.findIndex(u => u.id === currentSession!.id);
    if (userIndex >= 0) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
    }

    return HttpResponse.json(currentSession);
  }),

  http.patch('/api/profile/password', async ({ request }) => {
    await delay(600);
    if (!currentSession) return new HttpResponse(null, { status: 401 });

    const { currentPassword, newPassword } = (await request.json()) as any;

    if (currentSession.password !== currentPassword) {
      return HttpResponse.json({ message: "Senha atual incorreta." }, { status: 400 });
    }

    currentSession.password = newPassword;
    const userIndex = mockUsers.findIndex(u => u.id === currentSession!.id);
    if (userIndex >= 0) mockUsers[userIndex].password = newPassword;

    return new HttpResponse(null, { status: 204 });
  }),

  // --- ROTAS DE CARTEIRAS ---
  http.get('/api/wallets', async () => {
    await delay(400);
    if (!currentSession) return new HttpResponse(null, { status: 401 });
    
    const userWallets = mockWallets.filter(w => w.userId === currentSession!.id);
    return HttpResponse.json(userWallets);
  }),

  http.post('/api/wallets', async ({ request }) => {
    await delay(600);
    if (!currentSession) return new HttpResponse(null, { status: 401 });

    const body = (await request.json()) as any;
    
    const newWallet: Wallet = {
      id: `w-${Math.random().toString(36).substring(2, 9)}`,
      name: body.name,
      address: body.address,
      network: body.network,
      isPrimary: body.isPrimary || false,
      userId: currentSession.id,
    };

    if (newWallet.isPrimary) {
      mockWallets.forEach(w => {
        if (w.userId === currentSession!.id) w.isPrimary = false;
      });
    }

    mockWallets.push(newWallet);
    return HttpResponse.json(newWallet, { status: 201 });
  }),

  http.patch('/api/wallets/:id', async ({ request, params }) => {
    await delay(600);
    if (!currentSession) return new HttpResponse(null, { status: 401 });

    const body = (await request.json()) as any;
    const walletIndex = mockWallets.findIndex(w => w.id === params.id && w.userId === currentSession!.id);
    
    if (walletIndex === -1) return new HttpResponse(null, { status: 404 });

    if (body.isPrimary) {
      mockWallets.forEach(w => {
        if (w.userId === currentSession!.id) w.isPrimary = false;
      });
    }

    mockWallets[walletIndex] = { ...mockWallets[walletIndex], ...body };
    return HttpResponse.json(mockWallets[walletIndex]);
  }),
];