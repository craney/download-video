// @ts-check
const { test, expect } = require('@playwright/test');

test('打开浏览器并访问网站', async ({ page }) => {
  console.log('正在打开浏览器并访问网站...');
  
  // 设置较短的超时时间
  page.setDefaultTimeout(10000);
  
  // 访问网站首页
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
  console.log('网站已加载');
  
  // 等待并检查页面元素
  await expect(page.locator('h2:has-text("用户登录")')).toBeVisible();
  console.log('登录标题可见');
  
  // 检查登录表单
  await expect(page.locator('#username')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  console.log('登录表单可见');
  
  console.log('测试完成，浏览器将保持打开状态以便观察');
  
  // 保持浏览器打开一段时间以便观察
  await page.waitForTimeout(30000);
});