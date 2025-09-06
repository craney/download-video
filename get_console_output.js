const { chromium } = require('playwright');

(async () => {
  console.log('启动浏览器...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // 监听控制台消息
  page.on('console', msg => {
    console.log(`[浏览器控制台] ${msg.type()}: ${msg.text()}`);
  });
  
  // 监听页面错误
  page.on('pageerror', error => {
    console.log(`[页面错误] ${error.message}`);
  });
  
  // 监听请求失败
  page.on('requestfailed', request => {
    console.log(`[请求失败] ${request.url()} ${request.failure().errorText}`);
  });
  
  // 访问页面
  console.log('访问网站...');
  await page.goto('http://localhost:4173');
  console.log('网站加载完成');
  
  // 等待用户操作
  console.log('等待30秒以观察控制台输出...');
  await page.waitForTimeout(30000);
  
  console.log('关闭浏览器...');
  await browser.close();
})();