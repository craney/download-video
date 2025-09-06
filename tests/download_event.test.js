// @ts-check
const { test, expect } = require('@playwright/test');

test('测试下载事件监听', async ({ page }) => {
  console.log('=== 下载事件监听测试开始 ===');
  
  // 步骤1: 访问网站并完成登录和解析
  console.log('步骤1: 访问网站并完成登录和解析...');
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
  
  // 登录
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  await page.locator('button:has-text("登录")').click();
  await page.waitForSelector('.card-header:has-text("视频解析")');
  
  // 解析视频
  const testText = '4.35 03/25 t@E.Ul tEh:/ 比亚迪车主的福音来了，从此不在为油耗担心 # 比亚迪第五代DM技术再进化  https://v.douyin.com/ys9FzK6zoRI/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  await page.locator('button:has-text("开始解析")').click();
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 15000 });
  
  console.log('步骤1: 登录和解析完成');
  
  // 步骤2: 监听下载事件并点击下载按钮
  console.log('步骤2: 准备监听下载事件...');
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  
  const downloadButton = await page.locator('button:has-text("下载")');
  await expect(downloadButton).toBeVisible();
  
  console.log('步骤2: 点击下载按钮...');
  await downloadButton.click();
  
  // 步骤3: 等待下载事件
  console.log('步骤3: 等待下载事件...');
  try {
    const download = await downloadPromise;
    console.log('✅ 成功捕获下载事件');
    console.log('下载文件名:', await download.suggestedFilename());
    console.log('下载文件URL:', await download.url());
    
    // 保存文件到临时位置
    const path = await download.path();
    console.log('临时文件路径:', path);
  } catch (error) {
    console.log('❌ 下载事件监听失败:', error.message);
  }
  
  console.log('=== 下载事件监听测试结束 ===');
});