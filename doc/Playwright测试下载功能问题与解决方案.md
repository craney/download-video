# Playwright测试下载功能时遇到的问题与解决方案

## 概述

在使用Playwright测试我们项目的视频下载功能时，我们遇到了多个问题。这些问题导致测试无法正常完成，下载功能在Playwright环境中无法正常工作。本文档详细记录了遇到的所有问题及其解决方案。

## 遇到的问题

### 1. 页面加载卡住问题

**问题描述**：
在测试过程中，`page.goto()` 方法经常卡住，特别是在使用默认的 `waitUntil: 'load'` 等待策略时。

**原因分析**：
Playwright默认等待页面所有资源加载完成，包括图片、样式表、脚本等。我们的页面可能包含一些加载较慢的资源，导致测试长时间等待。

**解决方案**：
修改等待策略为更宽松的选项：
```javascript
await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded', timeout: 10000 });
```

可选的 `waitUntil` 参数值：
- `load`：等待页面完全加载（默认）
- `domcontentloaded`：等待DOM树构建完成
- `networkidle`：等待网络空闲
- `commit`：浏览器提交请求后立即继续

### 2. 下载路径问题

**问题描述**：
Playwright启动的浏览器实例可能使用与系统默认不同的下载路径，导致我们无法在预期位置找到下载的文件。

**原因分析**：
Playwright创建的是独立的浏览器环境，默认下载路径可能与用户系统设置不同。

**解决方案**：
1. 使用CDP（Chrome DevTools Protocol）设置下载路径：
```javascript
const client = await page.context().newCDPSession(page);
await client.send('Page.setDownloadBehavior', {
  behavior: 'allow',
  downloadPath: '/Users/zhaohe/Downloads'
});
```

2. 或者使用Playwright的下载事件监听和文件保存功能：
```javascript
const [download] = await Promise.all([
  page.waitForEvent('download'),
  downloadButton.click()
]);

await download.saveAs('/path/to/save/file.mp4');
```

### 3. 下载事件监听失败

**问题描述**：
使用 `page.waitForEvent('download')` 监听下载事件时超时，无法捕获下载事件。

**原因分析**：
我们的下载实现使用JavaScript创建Blob对象并通过`<a>`标签触发下载，这种方式可能不会触发Playwright的下载事件。

**解决方案**：
虽然这个问题最终通过其他方式解决，但需要注意的是，对于自定义下载实现，可能需要使用文件系统监控方式来验证下载是否成功。

### 4. 浏览器安全限制

**问题描述**：
在浏览器控制台中发现以下错误信息：
```
Refused to set unsafe header "Referer"
Refused to set unsafe header "Origin"
Refused to set unsafe header "User-Agent"
```

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**原因分析**：
现代浏览器出于安全考虑，不允许JavaScript设置某些请求头。同时，跨域资源共享（CORS）策略阻止了从不同源获取资源的请求。

**解决方案**：
在Playwright配置中禁用Web安全策略：
```javascript
// 在 playwright.config.js 中配置
use: {
  launchOptions: {
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins',
      '--disable-site-isolation-trials',
      '--ignore-certificate-errors'
    ]
  }
}
```

### 5. 控制台输出获取问题

**问题描述**：
初期无法获取Playwright浏览器的控制台输出，难以调试问题。

**解决方案**：
使用Playwright提供的事件监听器获取控制台消息：
```javascript
// 监听控制台输出
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
```

## 最终解决方案

通过综合应用以上解决方案，特别是通过修改Playwright配置文件禁用浏览器安全限制，我们成功实现了下载功能的自动化测试。

最终的配置如下：

```javascript
// playwright.config.js
use: {
  launchOptions: {
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins',
      '--disable-site-isolation-trials',
      '--ignore-certificate-errors'
    ]
  }
}
```

配合正确的下载事件监听和文件保存方法：

```javascript
const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
await downloadButton.click();
const download = await downloadPromise;
await download.saveAs('/Users/zhaohe/Downloads/filename.mp4');
```

## 总结

在使用Playwright测试涉及复杂网络请求和文件下载的Web应用时，可能会遇到浏览器安全策略、跨域限制等问题。通过合理配置Playwright的启动参数和使用正确的API，可以有效解决这些问题，实现完整的自动化测试。

需要注意的是，禁用安全策略虽然解决了测试问题，但在生产环境中应谨慎使用，因为它会降低浏览器的安全性。