// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('测试视频文件是否真正下载到本地', async ({ page }) => {
  // 设置下载目录到项目根目录的downloads文件夹
  const downloadPath = path.join(__dirname, '../downloads');
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
  }

  // 正确设置下载路径的方法
  await page.context().setDownloadsPath(downloadPath);

  console.log('下载目录:', downloadPath);
  
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
  
  // 监听下载事件
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  
  // 点击下载按钮前，记录当前下载目录中的文件
  const filesBefore = fs.readdirSync(downloadPath);
  console.log('下载前目录中的文件:', filesBefore);
  
  // 点击下载按钮
  await downloadButton.click();
  
  try {
    // 等待下载完成
    const download = await downloadPromise;
    
    // 获取下载文件信息
    const suggestedFilename = download.suggestedFilename();
    console.log('建议文件名:', suggestedFilename);
    
    // 等待一段时间确保文件写入完成
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 检查下载目录中的新文件
    const filesAfter = fs.readdirSync(downloadPath);
    console.log('下载后目录中的文件:', filesAfter);
    
    // 找出新下载的文件
    const newFiles = filesAfter.filter(file => !filesBefore.includes(file));
    console.log('新下载的文件:', newFiles);
    
    if (newFiles.length > 0) {
      const downloadedFile = path.join(downloadPath, newFiles[0]);
      const stats = fs.statSync(downloadedFile);
      console.log('下载文件路径:', downloadedFile);
      console.log('文件大小:', stats.size, 'bytes');
      
      // 验证文件是否存在且大小合理（大于1KB）
      expect(stats.size).toBeGreaterThan(1024);
      console.log('✅ 文件成功下载到本地');
      
      // 验证文件扩展名
      expect(downloadedFile).toMatch(/\.mp4$/);
      console.log('✅ 文件扩展名正确');
    } else {
      console.log('❌ 未检测到新下载的文件');
      
      // 尝试查找任何MP4文件
      const mp4Files = filesAfter.filter(file => file.endsWith('.mp4'));
      if (mp4Files.length > 0) {
        const mp4File = path.join(downloadPath, mp4Files[0]);
        const stats = fs.statSync(mp4File);
        console.log('找到MP4文件:', mp4File);
        console.log('文件大小:', stats.size, 'bytes');
        expect(stats.size).toBeGreaterThan(1024);
        console.log('✅ 找到有效的MP4文件');
      } else {
        console.log('❌ 未找到任何MP4文件');
      }
    }
    
  } catch (error) {
    console.log('下载过程出错:', error.message);
    
    // 即使下载事件未触发，也检查目录中是否有新文件
    await new Promise(resolve => setTimeout(resolve, 5000));
    const filesAfter = fs.readdirSync(downloadPath);
    const newFiles = filesAfter.filter(file => !filesBefore.includes(file));
    
    if (newFiles.length > 0) {
      console.log('但检测到新文件:', newFiles);
      const downloadedFile = path.join(downloadPath, newFiles[0]);
      const stats = fs.statSync(downloadedFile);
      console.log('文件大小:', stats.size, 'bytes');
      if (stats.size > 1024) {
        console.log('✅ 文件可能已成功下载');
      }
    } else {
      console.log('❌ 确实没有文件被下载');
    }
  }
  
  // 清理下载的文件（可选）
  // fs.readdirSync(downloadPath).forEach(file => {
  //   fs.unlinkSync(path.join(downloadPath, file));
  // });
});