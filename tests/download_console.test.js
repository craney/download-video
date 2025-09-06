// @ts-check
const { test, expect } = require('@playwright/test');

test('监听下载过程中的控制台输出', async ({ page }) => {
  // 收集控制台消息
  const messages = [];
  page.on('console', msg => {
    const message = {
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    };
    messages.push(message);
    console.log(`[浏览器控制台 ${message.timestamp}] ${message.type}: ${message.text}`);
  });
  
  // 收集页面错误
  const errors = [];
  page.on('pageerror', error => {
    const errorObj = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    errors.push(errorObj);
    console.log(`[页面错误 ${errorObj.timestamp}] ${errorObj.message}`);
  });
  
  // 收集请求失败
  const failedRequests = [];
  page.on('requestfailed', request => {
    const failedReq = {
      url: request.url(),
      method: request.method(),
      error: request.failure().errorText,
      timestamp: new Date().toISOString()
    };
    failedRequests.push(failedReq);
    console.log(`[请求失败 ${failedReq.timestamp}] ${failedReq.method} ${failedReq.url} - ${failedReq.error}`);
  });
  
  console.log('=== 开始测试 ===');
  
  // 访问网站并完成完整流程
  console.log('1. 访问网站...');
  await page.goto('http://localhost:4173');
  
  console.log('2. 登录...');
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  await page.locator('button:has-text("登录")').click();
  await page.waitForSelector('.card-header:has-text("视频解析")');
  
  console.log('3. 解析视频...');
  const testText = '4.35 03/25 t@E.Ul tEh:/ 比亚迪车主的福音来了，从此不在为油耗担心 # 比亚迪第五代DM技术再进化  https://v.douyin.com/ys9FzK6zoRI/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  await page.locator('button:has-text("开始解析")').click();
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 15000 });
  
  console.log('4. 点击下载...');
  const downloadButton = await page.locator('button:has-text("下载")');
  await expect(downloadButton).toBeVisible();
  
  // 监听下载事件
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  await downloadButton.click();
  
  console.log('5. 等待下载事件...');
  try {
    const download = await downloadPromise;
    console.log('✅ 成功捕获下载事件');
    console.log('文件名:', await download.suggestedFilename());
  } catch (error) {
    console.log('❌ 下载事件监听超时:', error.message);
  }
  
  // 等待一段时间以收集可能的控制台输出
  console.log('6. 等待额外的控制台输出...');
  await page.waitForTimeout(10000);
  
  // 输出收集到的所有消息
  console.log('\n=== 测试期间收集到的所有控制台消息 ===');
  messages.forEach(msg => {
    console.log(`[${msg.timestamp}] ${msg.type}: ${msg.text}`);
  });
  
  console.log('\n=== 测试期间收集到的所有页面错误 ===');
  errors.forEach(error => {
    console.log(`[${error.timestamp}] ${error.message}`);
  });
  
  console.log('\n=== 测试期间收集到的所有失败请求 ===');
  failedRequests.forEach(req => {
    console.log(`[${req.timestamp}] ${req.method} ${req.url} - ${req.error}`);
  });
  
  console.log('\n=== 测试完成 ===');
});