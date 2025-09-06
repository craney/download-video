// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('测试Blob下载方式和完整策略', async ({ page }) => {
  // 创建下载目录
  const downloadPath = path.join(__dirname, '../test_downloads_blob');
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
  }

  console.log('下载目录:', downloadPath);
  
  // 设置页面下载行为
  const client = await page.context().newCDPSession(page);
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath
  });
  
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
  
  // 等待2秒确保下载目录状态稳定
  await page.waitForTimeout(2000);
  
  // 点击下载按钮前，记录当前下载目录中的文件
  const filesBefore = fs.readdirSync(downloadPath);
  console.log('下载前目录中的文件:', filesBefore);
  
  // 点击下载按钮
  await downloadButton.click();
  
  // 等待下载完成（最长等待30秒）
  let downloaded = false;
  let elapsedTime = 0;
  const maxWaitTime = 30000; // 30秒
  const checkInterval = 1000; // 每秒检查一次
  
  while (!downloaded && elapsedTime < maxWaitTime) {
    await page.waitForTimeout(checkInterval);
    elapsedTime += checkInterval;
    
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
  
  // 检查页面元素的referrer policy
  const elementReferrerPolicy = await page.evaluate(() => {
    const link = document.querySelector('a[download]');
    return link ? link.referrerPolicy : null;
  });
  console.log('下载链接的referrer policy:', elementReferrerPolicy);
});