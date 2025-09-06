// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('检查Playwright浏览器实例的下载路径', async ({ page }) => {
  console.log('开始检查下载路径...');
  
  // 设置默认超时时间
  page.setDefaultTimeout(10000);
  
  // 访问网站首页 - 使用不同的等待策略
  console.log('正在访问网站...');
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded', timeout: 10000 });
  console.log('网站访问完成');
  
  // 登录
  console.log('正在登录...');
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  await page.locator('button:has-text("登录")').click();
  console.log('登录完成');
  
  // 输入测试链接并解析
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
  
  // 检查系统默认下载路径
  const systemDownloadPath = '/Users/zhaohe/Downloads';
  console.log('系统默认下载路径:', systemDownloadPath);
  
  // 检查Playwright可能使用的临时下载路径
  // Playwright通常会使用临时目录来存储下载的文件
  const possiblePaths = [
    systemDownloadPath,
    path.join(require('os').tmpdir(), 'playwright_downloads'),
    '/tmp/playwright_downloads',
    path.join(require('os').homedir(), 'playwright_downloads')
  ];
  
  console.log('检查可能的下载路径:');
  for (const downloadPath of possiblePaths) {
    try {
      if (fs.existsSync(downloadPath)) {
        const files = fs.readdirSync(downloadPath);
        console.log(`路径 ${downloadPath} 存在，文件数量: ${files.length}`);
      } else {
        console.log(`路径 ${downloadPath} 不存在`);
      }
    } catch (error) {
      console.log(`无法访问路径 ${downloadPath}:`, error.message);
    }
  }
  
  // 获取下载前所有路径的文件数量
  const beforeFiles = {};
  for (const downloadPath of possiblePaths) {
    try {
      if (fs.existsSync(downloadPath)) {
        beforeFiles[downloadPath] = fs.readdirSync(downloadPath).length;
      } else {
        beforeFiles[downloadPath] = 0;
      }
    } catch (error) {
      beforeFiles[downloadPath] = -1; // 无法访问
    }
  }
  
  console.log('下载前各路径文件数量:', beforeFiles);
  
  // 点击下载按钮
  console.log('点击下载按钮...');
  await downloadButton.click();
  console.log('下载按钮点击完成');
  
  // 等待一段时间让下载完成
  console.log('等待下载完成...');
  await page.waitForTimeout(10000);
  console.log('等待完成');
  
  // 检查下载后所有路径的文件数量
  const afterFiles = {};
  for (const downloadPath of possiblePaths) {
    try {
      if (fs.existsSync(downloadPath)) {
        afterFiles[downloadPath] = fs.readdirSync(downloadPath).length;
      } else {
        afterFiles[downloadPath] = 0;
      }
    } catch (error) {
      afterFiles[downloadPath] = -1; // 无法访问
    }
  }
  
  console.log('下载后各路径文件数量:', afterFiles);
  
  // 比较下载前后文件数量
  console.log('比较下载前后文件数量变化:');
  let downloaded = false;
  for (const downloadPath of possiblePaths) {
    if (beforeFiles[downloadPath] >= 0 && afterFiles[downloadPath] >= 0) {
      const diff = afterFiles[downloadPath] - beforeFiles[downloadPath];
      console.log(`路径 ${downloadPath}: ${beforeFiles[downloadPath]} -> ${afterFiles[downloadPath]} (变化: ${diff})`);
      if (diff > 0) {
        downloaded = true;
        console.log(`✅ 在路径 ${downloadPath} 检测到新文件下载`);
      }
    }
  }
  
  if (!downloaded) {
    console.log('⚠️ 未在任何路径检测到新文件下载');
  }
  
  console.log('检查完成');
});