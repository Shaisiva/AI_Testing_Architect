import { test as setup } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/login.page';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const login = new LoginPage(page);
  await login.login();
  await page.context().storageState({ path: authFile });
});
