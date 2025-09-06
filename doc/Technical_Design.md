# 去水印下载网站技术设计文档

## 1. 概述

本文档详细描述了去水印下载网站的技术架构、实现方案、代码组织结构和测试策略。

## 2. 技术栈

### 2.1 前端技术栈
- HTML5/CSS3/JavaScript (ES6+)
- Vue.js 3 (轻量级框架，易于维护)
- Bootstrap 5 (UI框架，快速构建响应式界面)
- Axios (HTTP客户端)
- Webpack/Vite (构建工具)

### 2.2 后端技术栈（可选）
- Node.js + Express.js (轻量级后端服务)
- 或纯前端实现（推荐，简化部署）

### 2.3 开发工具
- VS Code
- Git 版本控制
- npm/yarn 包管理
- Jest 单元测试框架

## 3. 系统架构

### 3.1 整体架构
```
┌─────────────────┐    API调用    ┌──────────────────────┐
│                 │ ────────────→ │                      │
│   用户浏览器     │               │ 第三方去水印API服务  │
│                 │ ←──────────── │                      │
└─────────────────┘    数据返回    └──────────────────────┘
```

### 3.2 前端架构
```
/src
  ├── index.html              # 主页面
  ├── login.html              # 登录页面
  ├── /assets                 # 静态资源
  │   ├── /images             # 图片资源
  │   ├── /styles             # CSS样式文件
  │   └── /fonts              # 字体文件
  ├── /components             # 可复用组件
  │   ├── Header.vue          # 头部组件
  │   ├── Footer.vue          # 底部组件
  │   └── CopyButton.vue      # 复制按钮组件
  ├── /views                  # 页面视图
  │   ├── Login.vue           # 登录页面
  │   └── Main.vue            # 主功能页面
  ├── /utils                  # 工具函数
  │   ├── urlExtractor.js     # 链接提取工具
  │   ├── clipboard.js        # 剪贴板操作工具
  │   ├── downloader.js       # 视频下载工具
  │   └── validator.js        # 输入验证工具
  ├── /services               # API服务
  │   └── videoService.js     # 视频解析API调用
  ├── /styles                 # 全局样式
  │   ├── main.css            # 主样式文件
  │   └── responsive.css      # 响应式样式
  └── /router                 # 路由配置
      └── index.js            # 路由定义
```

## 4. 核心模块设计

### 4.1 用户认证模块

#### 功能描述
- 简单的用户名密码验证
- 用户名: tsyouyou
- 密码: bomits

#### 实现方案
- 前端静态验证（后续可升级为后端验证）
- 使用浏览器本地存储保存登录状态

### 4.2 链接解析模块

#### 功能描述
- 从用户输入文本中提取有效的HTTP/HTTPS链接
- 使用正则表达式匹配链接

#### 技术实现
```javascript
const urlRegex = /https?:\/\/[^\s]+/g;
const extractUrls = (text) => {
  const matches = text.match(urlRegex);
  return matches || [];
};
```

### 4.3 API调用模块

#### 功能描述
- 调用第三方去水印API获取视频信息
- 处理API响应数据

#### API接口
```
URL: https://api.guijianpan.com/waterRemoveDetail/xxmQsyByAk
参数: 
  - ak: 7c683460fa194354864f8a8a378ae8aa (固定值)
  - link: 提取的有效链接
方法: GET
```

### 4.4 结果展示模块

#### 功能描述
- 展示视频封面图
- 展示视频标题
- 展示无水印视频地址

#### 数据结构
```json
{
  "cover": "封面图地址",
  "url": "无水印视频地址",
  "title": "视频标题"
}
```

### 4.5 复制功能模块

#### 功能描述
- 将指定文本复制到剪贴板
- 提供用户反馈

#### 技术实现
使用Clipboard API:
```javascript
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // 提供用户反馈
  } catch (err) {
    // 处理错误
  }
};
```

### 4.6 下载功能模块

#### 功能描述
- 直接下载视频文件
- 使用视频标题作为文件名

#### 技术实现
使用HTML5的下载属性或JavaScript创建下载:
```javascript
const downloadVideo = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'video.mp4';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
```

## 5. 数据流设计

### 5.1 用户操作流程
1. 用户访问网站，进入登录页面
2. 输入用户名(tsyouyou)和密码(bomits)进行登录
3. 登录成功后跳转到主功能页面
4. 在文本框中粘贴包含分享链接的文本
5. 点击"开始解析"按钮
6. 系统提取有效链接并调用API
7. 展示解析结果(封面、标题、无水印地址)
8. 用户可点击复制按钮将信息复制到剪贴板
9. 用户可点击下载按钮直接下载视频

### 5.2 数据处理流程
```
用户输入文本
      ↓
正则表达式提取链接
      ↓
构造API请求URL
      ↓
发送HTTP请求到第三方API
      ↓
接收并解析响应数据
      ↓
展示视频信息到页面
      ↓
用户交互(复制、下载等操作)
```

## 6. 安全设计

### 6.1 前端安全
- 输入验证和清理
- 防止XSS攻击
- 使用HTTPS通信

### 6.2 认证安全
- 用户名密码验证
- 登录状态管理

## 7. 性能优化

### 7.1 加载优化
- 静态资源压缩
- 图片懒加载
- 代码分割

### 7.2 缓存策略
- 浏览器缓存静态资源
- API结果缓存(可选)

## 8. 响应式设计

### 8.1 移动端适配
- 使用Bootstrap响应式网格系统
- 媒体查询适配不同屏幕尺寸
- 触摸友好的交互设计

### 8.2 桌面端优化
- 更大的展示区域
- 多列布局

## 9. 错误处理

### 9.1 网络错误
- API调用失败处理
- 网络超时处理

### 9.2 用户输入错误
- 无效链接处理
- 空输入处理

### 9.3 系统错误
- 异常捕获和处理
- 用户友好的错误提示

## 10. 部署方案

### 10.1 静态部署(推荐)
- 部署到GitHub Pages/Netlify/Vercel
- 无需服务器，纯前端实现
- CDN加速

### 10.2 服务器部署(可选)
- Node.js服务器部署
- Nginx反向代理

## 11. 测试策略

### 11.1 单元测试
- 链接提取功能测试
- 认证功能测试
- API调用测试
- 复制功能测试
- 下载功能测试

### 11.2 集成测试
- 完整流程测试
- 用户交互测试

### 11.3 端到端测试
- 浏览器兼容性测试
- 用户场景测试

## 12. 项目依赖

### 12.1 前端依赖
```json
{
  "dependencies": {
    "vue": "^3.2.0",
    "axios": "^1.0.0",
    "bootstrap": "^5.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.0.0",
    "vite": "^4.0.0",
    "jest": "^29.0.0"
  }
}
```

## 13. 构建和部署

### 13.1 构建命令
```bash
npm run build
```

### 13.2 开发命令
```bash
npm run dev
```

### 13.3 测试命令
```bash
npm test
```

## 14. 维护和扩展

### 14.1 可维护性
- 模块化设计
- 清晰的代码结构
- 详细的注释

### 14.2 可扩展性
- 组件化设计
- 易于添加新功能
- 易于集成其他平台