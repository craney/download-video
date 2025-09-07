// @ts-check
const { test, expect } = require('@playwright/test');

// 由于实际的下载功能涉及浏览器安全限制和跨域问题，我们主要测试下载功能的触发逻辑

test.beforeAll(async ({ browserType, playwright }) => {
  const launchOptions = {
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins',
      '--disable-site-isolation-trials',
      '--ignore-certificate-errors'
    ]
  };
  // 重新启动浏览器实例以应用新的启动参数
  const newBrowser = await playwright[browserType].launch(launchOptions);
  // 将配置后的浏览器实例传递给测试用例
  // 注意：实际使用中需要更复杂的配置管理
});

test('下载功能核心逻辑测试', async ({ page }) => {
  // 模拟页面环境
  await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded', timeout: 10000 });
  
  // 设置登录状态
  await page.evaluate(() => {
    // 模拟Vue应用的登录状态
    localStorage.setItem('isLoggedIn', 'true');
    location.reload();
  });
  
  // 等待页面加载
  await page.waitForLoadState('domcontentloaded');
  
  // 模拟视频数据
  await page.evaluate(() => {
    // 模拟Vue实例数据
    if (window.app) {
      window.app.videoData = {
        cover: 'https://p3-sign.douyinpic.com/tos-cn-i-dy/cover.jpg',
        url: 'https://v11-default.365yg.com/video.mp4',
        title: '测试视频标题'
      };
    }
  });
  
  // 验证下载按钮存在
  const downloadButton = await page.locator('button:has-text("下载")');
  await expect(downloadButton).toBeVisible();
  
  // 监听点击事件
  let downloadClicked = false;
  await page.exposeFunction('downloadCallback', () => {
    downloadClicked = true;
  });
  
  // 修改下载函数以进行测试
  await page.evaluate(() => {
    if (window.app) {
      const originalDownload = window.app.downloadVideo;
      window.app.downloadVideo = function() {
        // 调用回调函数表示下载已被触发
        window.downloadCallback();
        // 不实际执行下载以避免浏览器安全限制
        return Promise.resolve();
      };
    }
  });
  
  // 点击下载按钮
  await downloadButton.click();
  
  // 验证下载功能已被触发（通过我们暴露的回调函数）
  // 注意：由于Playwright的限制，我们无法完全模拟实际下载过程
  // 但可以验证点击事件是否正确触发了下载函数
  console.log('下载功能测试完成');
  
  // 增加显式的等待时间以确保所有异步操作完成
  await page.waitForTimeout(2000);
  
  // 验证下载标志被设置
  expect(downloadClicked).toBe(true);
});