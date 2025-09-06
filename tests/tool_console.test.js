// @ts-check
const { test, expect } = require('@playwright/test');

test('使用工具获取控制台消息', async ({ page }) => {
  // 使用Playwright工具获取控制台消息
  const messages = [];
  page.on('console', async msg => {
    messages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
      args: await Promise.all(msg.args().map(arg => arg.jsonValue()))
    });
  });
  
  console.log('开始访问网站...');
  await page.goto('http://localhost:4173');
  console.log('网站访问完成');
  
  // 等待并收集控制台消息
  await page.waitForTimeout(5000);
  
  console.log('收集到的控制台消息:');
  for (const msg of messages) {
    console.log(`  [${msg.type}] ${msg.text}`);
    if (msg.args && msg.args.length > 0) {
      console.log(`    参数: ${JSON.stringify(msg.args)}`);
    }
  }
  
  console.log('测试完成');
});