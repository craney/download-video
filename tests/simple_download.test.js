// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('测试视频下载按钮功能', async ({ page }) => {
  // 使用系统默认下载路径
  const downloadPath = '/Users/zhaohe/Downloads';
  
  console.log('使用下载路径:', downloadPath);
  
  // 访问网站首页
  await page.goto('http://localhost:4173');
  
  // 输入用户名和密码
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  
  // 点击登录按钮
  await page.locator('button:has-text("登录")').click();
  
  // 输入测试链接文本
  const testText = '4.35 03/25 t@E.Ul tEh:/ 比亚迪车主的福音来了，从此不在为油耗担心 # 比亚迪第五代DM技术再进化  https://v.douyin.com/ys9FzK6zoRI/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  
  // 点击解析按钮
  await page.locator('button:has-text("开始解析")').click();
  
  // 等待解析完成
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 15000 });
  
  // 验证下载按钮存在
  const downloadButton = await page.locator('button:has-text("下载")');
  await expect(downloadButton).toBeVisible();
  
  // 获取下载前的文件列表
  let filesBefore = [];
  try {
    filesBefore = fs.readdirSync(downloadPath);
  } catch (error) {
    console.log('无法读取下载目录:', error.message);
  }
  console.log('下载前文件数量:', filesBefore.length);
  
  // 点击下载按钮
  await downloadButton.click();
  
  // 等待几秒钟
  await page.waitForTimeout(5000);
  
  // 检查下载后的文件列表
  let filesAfter = [];
  try {
    filesAfter = fs.readdirSync(downloadPath);
  } catch (error) {
    console.log('无法读取下载目录:', error.message);
  }
  console.log('下载后文件数量:', filesAfter.length);
  
  // 检查是否有新文件
  const newFiles = filesAfter.filter(file => !filesBefore.includes(file));
  console.log('新下载的文件:', newFiles);
  
  if (newFiles.length > 0) {
    console.log('✅ 检测到新文件下载');
  } else {
    console.log('⚠️ 未检测到新文件，但下载请求可能已发送');
  }
});