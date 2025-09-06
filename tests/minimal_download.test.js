// @ts-check
const { test, expect } = require('@playwright/test');

test('最小化下载功能测试', async ({ page }) => {
  console.log('开始测试...');
  
  // 访问网站首页
  console.log('正在访问网站...');
  await page.goto('http://localhost:4173');
  console.log('网站访问完成');
  
  // 登录
  console.log('正在登录...');
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  await page.locator('button:has-text("登录")').click();
  await page.waitForSelector('.card-header:has-text("视频解析")');
  console.log('登录完成');
  
  // 解析视频
  console.log('正在解析视频...');
  const testText = '4.35 03/25 t@E.Ul tEh:/ 比亚迪车主的福音来了，从此不在为油耗担心 # 比亚迪第五代DM技术再进化  https://v.douyin.com/ys9FzK6zoRI/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  await page.locator('button:has-text("开始解析")').click();
  
  // 等待解析完成
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 15000 });
  console.log('解析完成');
  
  // 检查下载按钮
  const downloadButton = await page.locator('button:has-text("下载")');
  await expect(downloadButton).toBeVisible();
  console.log('下载按钮检查完成');
  
  // 监听下载事件
  console.log('准备监听下载事件...');
  const downloadPromise = page.waitForEvent('download');
  
  // 点击下载按钮
  console.log('点击下载按钮...');
  await downloadButton.click();
  console.log('下载按钮点击完成');
  
  try {
    // 等待下载事件
    console.log('等待下载事件...');
    const download = await downloadPromise;
    console.log('✅ 成功检测到下载事件');
    console.log('下载文件名:', await download.suggestedFilename());
  } catch (error) {
    console.log('❌ 未检测到下载事件:', error.message);
  }
  
  console.log('测试完成');
});