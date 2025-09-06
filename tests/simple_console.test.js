// @ts-check
const { test, expect } = require('@playwright/test');

test('简化版控制台输出测试', async ({ page }) => {
  console.log('开始测试...');
  
  // 监听浏览器控制台消息
  page.on('console', msg => {
    console.log(`[浏览器] ${msg.type()}: ${msg.text()}`);
  });
  
  // 监听页面错误
  page.on('pageerror', error => {
    console.log(`[页面错误] ${error.message}`);
  });
  
  // 访问网站首页
  console.log('访问网站...');
  await page.goto('http://localhost:4173');
  console.log('网站加载完成');
  
  // 等待一小段时间以捕获控制台输出
  await page.waitForTimeout(3000);
  
  console.log('测试完成');
});