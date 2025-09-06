// @ts-check
const { test, expect } = require('@playwright/test');

test('逐步执行测试，确定卡在哪一步', async ({ page }) => {
  console.log('=== 测试开始 ===');
  
  // 步骤1: 访问网站首页
  console.log('步骤1: 正在访问网站...');
  try {
    await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded', timeout: 10000 });
    console.log('步骤1: 网站访问成功');
  } catch (error) {
    console.log('步骤1: 网站访问失败 -', error.message);
    return;
  }
  
  // 步骤2: 检查登录表单
  console.log('步骤2: 检查登录表单...');
  try {
    await expect(page.locator('#username')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#password')).toBeVisible({ timeout: 5000 });
    console.log('步骤2: 登录表单检查成功');
  } catch (error) {
    console.log('步骤2: 登录表单检查失败 -', error.message);
    return;
  }
  
  // 步骤3: 填写登录信息
  console.log('步骤3: 填写登录信息...');
  try {
    await page.locator('#username').fill('tsyouyou', { timeout: 5000 });
    await page.locator('#password').fill('bomits', { timeout: 5000 });
    console.log('步骤3: 登录信息填写成功');
  } catch (error) {
    console.log('步骤3: 登录信息填写失败 -', error.message);
    return;
  }
  
  // 步骤4: 点击登录按钮
  console.log('步骤4: 点击登录按钮...');
  try {
    await page.locator('button:has-text("登录")').click({ timeout: 5000 });
    console.log('步骤4: 登录按钮点击成功');
  } catch (error) {
    console.log('步骤4: 登录按钮点击失败 -', error.message);
    return;
  }
  
  // 步骤5: 等待登录完成
  console.log('步骤5: 等待登录完成...');
  try {
    await page.waitForSelector('.card-header:has-text("视频解析")', { timeout: 10000 });
    console.log('步骤5: 登录完成');
  } catch (error) {
    console.log('步骤5: 登录完成等待失败 -', error.message);
    return;
  }
  
  // 步骤6: 填写视频链接
  console.log('步骤6: 填写视频链接...');
  try {
    const testText = '4.35 03/25 t@E.Ul tEh:/ 比亚迪车主的福音来了，从此不在为油耗担心 # 比亚迪第五代DM技术再进化  https://v.douyin.com/ys9FzK6zoRI/ 复制此链接，打开Dou音搜索，直接观看视频！';
    await page.locator('#video-url').fill(testText, { timeout: 5000 });
    console.log('步骤6: 视频链接填写成功');
  } catch (error) {
    console.log('步骤6: 视频链接填写失败 -', error.message);
    return;
  }
  
  // 步骤7: 点击解析按钮
  console.log('步骤7: 点击解析按钮...');
  try {
    await page.locator('button:has-text("开始解析")').click({ timeout: 5000 });
    console.log('步骤7: 解析按钮点击成功');
  } catch (error) {
    console.log('步骤7: 解析按钮点击失败 -', error.message);
    return;
  }
  
  // 步骤8: 等待解析完成
  console.log('步骤8: 等待解析完成...');
  try {
    await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 15000 });
    console.log('步骤8: 解析完成');
  } catch (error) {
    console.log('步骤8: 解析完成等待失败 -', error.message);
    return;
  }
  
  // 步骤9: 检查下载按钮
  console.log('步骤9: 检查下载按钮...');
  try {
    const downloadButton = await page.locator('button:has-text("下载")');
    await expect(downloadButton).toBeVisible({ timeout: 5000 });
    console.log('步骤9: 下载按钮检查成功');
  } catch (error) {
    console.log('步骤9: 下载按钮检查失败 -', error.message);
    return;
  }
  
  // 步骤10: 点击下载按钮
  console.log('步骤10: 点击下载按钮...');
  try {
    const downloadButton = await page.locator('button:has-text("下载")');
    await downloadButton.click({ timeout: 5000 });
    console.log('步骤10: 下载按钮点击成功');
  } catch (error) {
    console.log('步骤10: 下载按钮点击失败 -', error.message);
    return;
  }
  
  console.log('=== 所有步骤执行完成 ===');
});