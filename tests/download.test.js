// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('测试视频下载功能', async ({ page }) => {
  // 访问网站首页
  await page.goto('http://localhost:4173');
  
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
  const testText = '4.35 03/25 t@E.Ul tEh:/ 比亚迪车主的福音来了，从此不在为油耗担心 # 比亚迪第五代DM技术再进化  https://v.douyin.com/ys9FzK6zoRI/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  
  // 点击解析按钮
  await page.locator('button:has-text("开始解析")').click();
  
  // 等待解析完成
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 15000 });
  
  // 验证解析结果
  await expect(page.locator('input[readonly]').first()).toBeVisible();
  
  // 验证下载按钮存在
  const downloadButton = await page.locator('button:has-text("下载")');
  await expect(downloadButton).toBeVisible();
  
  // 获取下载前的文件列表
  const filesBefore = fs.readdirSync(downloadPath);
  console.log('下载前文件列表:', filesBefore);
  
  // 点击下载按钮
  await downloadButton.click();
  
  // 等待下载完成（最长等待30秒）
  let downloaded = false;
  let elapsedTime = 0;
  const maxWaitTime = 30000;
  const checkInterval = 1000;
  
  while (!downloaded && elapsedTime < maxWaitTime) {
    await page.waitForTimeout(checkInterval);
    elapsedTime += checkInterval;
    
    // 检查是否有新文件
    const filesAfter = fs.readdirSync(downloadPath);
    const newFiles = filesAfter.filter(file => !filesBefore.includes(file));
    
    if (newFiles.length > 0) {
      console.log('检测到新文件:', newFiles);
      downloaded = true;
      
      // 验证新文件
      const downloadedFile = path.join(downloadPath, newFiles[0]);
      const stats = fs.statSync(downloadedFile);
      console.log('下载文件路径:', downloadedFile);
      console.log('文件大小:', stats.size, 'bytes');
      
      if (stats.size > 1024) {
        console.log('✅ 文件成功下载到本地');
        // 验证是否为MP4文件
        if (downloadedFile.endsWith('.mp4')) {
          console.log('✅ 文件为MP4格式');
        }
      } else {
        console.log('⚠️ 文件太小，可能下载不完整');
      }
    }
  }
  
  if (!downloaded) {
    console.log('❌ 在30秒内未检测到文件下载');
    
    // 最后检查一次目录
    const filesAfter = fs.readdirSync(downloadPath);
    const newFiles = filesAfter.filter(file => !filesBefore.includes(file));
    console.log('最终目录文件:', filesAfter);
    
    if (newFiles.length > 0) {
      console.log('但最终检测到新文件:', newFiles);
    }
  }
  
  // 验证下载成功
  expect(downloaded).toBe(true);
});

test('测试复制功能', async ({ page }) => {
  // 访问网站首页
  await page.goto('http://localhost:4173');
  
  // 登录
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  await page.locator('button:has-text("登录")').click();
  
  // 输入测试链接文本
  const testText = '4.35 03/25 t@E.Ul tEh:/ 比亚迪车主的福音来了，从此不在为油耗担心 # 比亚迪第五代DM技术再进化  https://v.douyin.com/ys9FzK6zoRI/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  
  // 点击解析按钮
  await page.locator('button:has-text("开始解析")').click();
  
  // 等待解析完成
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 15000 });
  
  // 点击复制标题按钮
  let alertText = '';
  page.on('dialog', async dialog => {
    alertText = dialog.message();
    await dialog.accept();
  });
  
  await page.locator('button:has-text("复制")').first().click();
  
  // 验证复制成功
  expect(alertText).toContain('复制成功');
});