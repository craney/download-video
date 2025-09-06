// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('用户可以登录并解析视频链接', async ({ page }) => {
  // 访问网站首页
  await page.goto('http://localhost:8000');
  
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
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 10000 });
  
  // 验证解析结果
  await expect(page.locator('input[readonly]').first()).toBeVisible();
});

test('用户可以复制视频标题', async ({ page }) => {
  // 访问网站首页
  await page.goto('http://localhost:8000');
  
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
  await page.goto('http://localhost:8000');
  
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
  await expect(page.locator('.card-header:has-text("解析结果")')).toBeVisible({ timeout: 10000 });
  
  // 验证下载按钮存在
  await expect(page.locator('button:has-text("下载")')).toBeVisible();
  
  // 监听下载事件
  const downloadPromise = page.waitForEvent('download');
  
  // 点击下载按钮
  await page.locator('button:has-text("下载")').click();
  
  // 等待下载完成
  const download = await downloadPromise;
  
  // 验证下载文件信息
  expect(download.suggestedFilename()).toContain('.mp4');
  
  // 注意：在实际测试中，由于跨域限制和安全策略，我们可能无法真正下载文件
  // 但我们可以验证下载请求已正确发起
  console.log('下载已发起，文件名：', download.suggestedFilename());
});