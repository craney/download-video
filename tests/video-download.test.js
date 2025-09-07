// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('用户可以登录并解析视频链接', async ({ page }) => {
  // 访问网站首页
  await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded', timeout: 10000 });
  
  // 验证页面标题
  await expect(page).toHaveTitle(/去水印视频下载/);
  
  // 输入用户名和密码
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  
  // 点击登录按钮
  await page.locator('button:has-text("登录")').click();
  
  // 验证是否登录成功
  await expect(page.locator('#video-parser')).toBeVisible();
  
  // 输入测试链接文本
  const testText = '0.58 J@v.fB 02/01 pDu:/ 诸位，请拔剑而战，从彦的角度看她的故事 天使誓言，至死不渝# 雄兵连 # 天使彦 # 独白 # 国漫推荐 # 抖音漫剪团  https://v.douyin.com/1WMnPhVAyPY/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  
  // 点击解析按钮
  await page.locator('button:has-text("开始解析")').click();
  
  // 等待解析完成
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 10000 });
  
  // 验证解析结果
  await expect(page.locator('input[readonly]').first()).toBeVisible();
});

test('用户可以复制视频标题', async ({ page }) => {
  // 访问网站首页
  await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded', timeout: 10000 });
  
  // 登录
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  await page.locator('button:has-text("登录")').click();
  
  // 输入测试链接文本
  const testText = '0.58 J@v.fB 02/01 pDu:/ 诸位，请拔剑而战，从彦的角度看她的故事 天使誓言，至死不渝# 雄兵连 # 天使彦 # 独白 # 国漫推荐 # 抖音漫剪团  https://v.douyin.com/1WMnPhVAyPY/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  
  // 点击解析按钮
  await page.locator('button:has-text("开始解析")').click();
  
  // 等待解析完成
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 10000 });
  
  // 点击复制标题按钮
  await page.locator('button:has-text("复制")').first().click();
  
  // 验证是否有复制成功的提示（通过alert）
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('复制成功');
    await dialog.accept();
  });
});

test('下载按钮存在且功能正常', async ({ page }) => {
  // 访问网站首页
  await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded', timeout: 10000 });
  
  // 登录
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  await page.locator('button:has-text("登录")').click();
  
  // 输入测试链接文本
  const testText = '0.58 J@v.fB 02/01 pDu:/ 诸位，请拔剑而战，从彦的角度看她的故事 天使誓言，至死不渝# 雄兵连 # 天使彦 # 独白 # 国漫推荐 # 抖音漫剪团  https://v.douyin.com/1WMnPhVAyPY/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  
  // 点击解析按钮
  await page.locator('button:has-text("开始解析")').click();
  
  // 等待解析完成
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 10000 });
  
  // 验证下载按钮存在
  await expect(page.locator('button:has-text("下载")')).toBeVisible();
  
  // 创建下载目录
  const downloadsDir = path.join(__dirname, 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }
  
  // 监听下载事件
  const downloadPromise = page.waitForEvent('download');
  
  // 点击下载按钮
  await page.locator('button:has-text("下载")').click();
  
  // 等待下载完成
  const download = await downloadPromise;
  
  // 获取下载文件路径
  const filePath = path.join(downloadsDir, download.suggestedFilename());
  
  // 保存文件
  await download.saveAs(filePath);
  
  // 验证下载文件信息
  expect(download.suggestedFilename()).toContain('.mp4');
  
  // 验证文件已保存
  const fileExists = fs.existsSync(filePath);
  expect(fileExists).toBeTruthy();
  
  // 输出文件信息
  if (fileExists) {
    const stats = fs.statSync(filePath);
    console.log('✅ 文件已成功下载到:', filePath);
    console.log('📁 文件大小:', stats.size, 'bytes');
  }
  
  console.log('下载已发起，文件名：', download.suggestedFilename());
});