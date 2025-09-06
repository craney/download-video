// @ts-check
const { test, expect } = require('@playwright/test');

test('获取浏览器控制台输出', async ({ page }) => {
  console.log('=== 开始获取浏览器控制台输出 ===');
  
  // 监听浏览器控制台消息
  page.on('console', msg => {
    console.log(`浏览器控制台 [${msg.type()}]: ${msg.text()}`);
    
    // 如果有相关的参数，也打印出来
    for (let i = 0; i < msg.args().length; ++i) {
      console.log(`参数 ${i}: ${msg.args()[i]}`);
    }
  });
  
  // 监听页面错误
  page.on('pageerror', error => {
    console.log('页面错误:', error.message);
  });
  
  // 监听请求失败
  page.on('requestfailed', request => {
    console.log('请求失败:', request.url(), request.failure().errorText);
  });
  
  // 访问网站首页
  console.log('访问网站...');
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
  
  // 登录
  console.log('登录...');
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  await page.locator('button:has-text("登录")').click();
  await page.waitForSelector('.card-header:has-text("视频解析")');
  
  // 解析视频
  console.log('解析视频...');
  const testText = '4.35 03/25 t@E.Ul tEh:/ 比亚迪车主的福音来了，从此不在为油耗担心 # 比亚迪第五代DM技术再进化  https://v.douyin.com/ys9FzK6zoRI/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  await page.locator('button:has-text("开始解析")').click();
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 15000 });
  
  // 点击下载按钮
  console.log('点击下载按钮...');
  const downloadButton = await page.locator('button:has-text("下载")');
  await expect(downloadButton).toBeVisible();
  
  // 等待并监听下载事件
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  await downloadButton.click();
  
  console.log('等待下载事件...');
  try {
    const download = await downloadPromise;
    console.log('捕获到下载事件');
    console.log('文件名:', await download.suggestedFilename());
  } catch (error) {
    console.log('下载事件超时:', error.message);
  }
  
  // 等待一段时间以捕获可能的控制台输出
  console.log('等待额外的控制台输出...');
  await page.waitForTimeout(5000);
  
  console.log('=== 测试完成 ===');
});