import { test, expect } from '@playwright/test';

test.describe('Fluxo Principal do Marketplace', () => {
  
  test('Deve navegar da Home até a confirmação do pedido', async ({ page }) => {
    // 1. Acessa a Home
    await page.goto('/');
    
    // 2. Clica no primeiro NFT
    await page.getByText('Emerald Ape #042').first().click();

    // 3. Adiciona ao carrinho
    await page.getByRole('button', { name: /Adicionar ao Carrinho/i }).click();

    // 4. Vai para o carrinho
    await page.getByRole('link', { name: /Carrinho/i }).first().click();

    // 5. Clica em Checkout (vai redirecionar para o Login)
    await page.getByRole('link', { name: /Ir para o Checkout/i }).click();

    // 6. Espera a URL mudar para /login e faz o login
    await page.waitForURL('**/login');
    await page.locator('#login-email').fill('teste@teste.com');
    await page.locator('#login-password').fill('123456');
    await page.getByRole('button', { name: 'Entrar' }).click();

    // 7. Após o login, a aplicação redireciona para a Home
    await page.waitForURL('**/');

    // 8. Vai para o carrinho novamente (os itens devem ter sido mantidos)
    await page.getByRole('link', { name: /Carrinho/i }).first().click();

    // 9. Clica em Checkout novamente (agora o usuário está logado e a página vai abrir)
    await page.getByRole('link', { name: /Ir para o Checkout/i }).click();

    // 10. Aguarda a página de checkout carregar (buscando o texto exato)
    await expect(page.getByText('Pagamento', { exact: true })).toBeVisible();

    // 11. Preenche os dados do comprador
    await page.locator('#checkout-name').fill('Comprador Teste');
    await page.locator('#checkout-email').fill('comprador@teste.com'); 
    
    // 12. Finaliza o pedido
    await page.getByRole('button', { name: /Confirmar Pedido/i }).click();

    // 13. Valida a tela de sucesso
    await expect(page.getByText('Seus NFTs já estão na carteira')).toBeVisible();
    await expect(page.getByText('CONFIRMED')).toBeVisible();
  });
});