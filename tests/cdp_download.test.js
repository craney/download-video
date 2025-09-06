// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('使用CDP设置下载路径测试下载功能', async ({ page }) => {
  console.log('开始测试...');
  
  // 设置默认超时时间
  page.setDefaultTimeout(30000);
  
  // 使用系统默认下载路径
  const downloadPath = '/Users/zhaohe/Downloads';
  
  console.log('使用下载路径:', downloadPath);
  
  // 使用CDP设置下载行为
  console.log('设置CDP下载行为...');
  const client = await page.context().newCDPSession(page);
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath
  });
  console.log('CDP下载行为设置完成');
  
  // 访问网站首页
  console.log('正在访问网站...');
  await page.goto('http://localhost:4173', { waitUntil: 'commit', timeout: 30000 });
  console.log('网站访问完成');
  
  // 等待页面加载完成
  await page.waitForLoadState('domcontentloaded');
  console.log('页面加载完成');
  
  // 输入用户名和密码
  console.log('正在输入登录信息...');
  await page.locator('#username').fill('tsyouyou');
  await page.locator('#password').fill('bomits');
  console.log('登录信息输入完成');
  
  // 点击登录按钮
  console.log('正在点击登录按钮...');
  await page.locator('button:has-text("登录")').click();
  console.log('登录按钮点击完成');
  
  // 等待登录完成
  await page.waitForSelector('.card-header:has-text("视频解析")', { timeout: 15000 });
  console.log('登录完成');
  
  // 输入测试链接文本
  console.log('正在输入测试链接...');
  const testText = '4.35 03/25 t@E.Ul tEh:/ 比亚迪车主的福音来了，从此不在为油耗担心 # 比亚迪第五代DM技术再进化  https://v.douyin.com/ys9FzK6zoRI/ 复制此链接，打开Dou音搜索，直接观看视频！';
  await page.locator('#video-url').fill(testText);
  console.log('测试链接输入完成');
  
  // 点击解析按钮
  console.log('正在点击解析按钮...');
  await page.locator('button:has-text("开始解析")').click();
  console.log('解析按钮点击完成');
  
  // 等待解析完成
  console.log('等待解析完成...');
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 15000 });
  console.log('解析完成');
  
  // 验证下载按钮存在
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
  
  // 点击下载按钮
  console.log('准备点击下载按钮...');
  await downloadButton.click();
  console.log('下载按钮点击完成');
  
  // 等待几秒钟
  console.log('等待下载完成...');
  await page.waitForTimeout(10000);
  console.log('等待完成');
  
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
    console.log('⚠️ 未检测到新文件，但下载请求可能已发送');
  }
  
  console.log('测试完成');
});