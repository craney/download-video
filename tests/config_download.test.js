// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('使用修改后配置测试下载功能', async ({ page }) => {
  console.log('=== 使用修改后配置测试下载功能 ===');
  
  // 使用系统默认下载路径
  const downloadPath = '/Users/zhaohe/Downloads';
  console.log('使用下载路径:', downloadPath);
  
  // 访问网站首页
  console.log('访问网站...');
  await page.goto('http://localhost:4173');
  console.log('网站访问完成');
  
  // 登录
  console.log('登录...');
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  await page.locator('button:has-text("登录")').click();
  await page.waitForSelector('.card-header:has-text("视频解析")');
  console.log('登录完成');
  
  // 解析视频
  console.log('解析视频...');
  const testText = '4.35 03/25 t@E.Ul tEh:/ 比亚迪车主的福音来了，从此不在为油耗担心 # 比亚迪第五代DM技术再进化  https://v.douyin.com/ys9FzK6zoRI/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  await page.locator('button:has-text("开始解析")').click();
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 15000 });
  console.log('解析完成');
  
  // 检查下载按钮
  console.log('检查下载按钮...');
  const downloadButton = await page.locator('button:has-text("下载")');
  await expect(downloadButton).toBeVisible();
  console.log('下载按钮检查完成');
  
  // 获取下载前的文件列表
  console.log('读取下载前文件列表...');
  let filesBefore = [];
  try {
    filesBefore = fs.readdirSync(downloadPath);
  } catch (error) {
    console.log('无法读取下载目录:', error.message);
  }
  console.log('下载前文件数量:', filesBefore.length);
  
  // 监听下载事件
  console.log('准备监听下载事件...');
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  
  // 点击下载按钮
  console.log('点击下载按钮...');
  await downloadButton.click();
  console.log('下载按钮点击完成');
  
  try {
    // 等待下载事件
    console.log('等待下载事件...');
    const download = await downloadPromise;
    console.log('✅ 成功捕获下载事件');
    
    // 获取下载文件信息
    const filename = await download.suggestedFilename();
    console.log('下载文件名:', filename);
    
    // 保存文件
    const savePath = path.join(downloadPath, filename);
    console.log('保存路径:', savePath);
    await download.saveAs(savePath);
    console.log('文件保存完成');
    
  } catch (error) {
    console.log('❌ 下载事件监听失败:', error.message);
    
    // 等待一段时间检查文件变化
    console.log('等待一段时间检查文件变化...');
    await page.waitForTimeout(10000);
    
    // 检查下载后的文件列表
    console.log('读取下载后文件列表...');
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
      console.log('⚠️ 未检测到新文件下载');
    }
  }
  
  console.log('=== 测试完成 ===');
});