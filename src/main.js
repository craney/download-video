/**
 * 主应用脚本
 */

// 导入工具函数
import { extractUrls, extractFirstUrl } from './utils/urlExtractor.js';
import { parseVideoUrl } from './services/videoService.js';
import { copyToClipboard } from './utils/clipboard.js';
import { downloadVideo } from './utils/downloader.js';

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            username: '',
            password: '',
            isLoggedIn: false,
            videoText: '',
            videoData: null,
            isLoading: false,
            error: ''
        };
    },
    methods: {
        /**
         * 用户登录
         */
        login() {
            // 简单的用户名密码验证
            if (this.username === 'tsyouyou' && this.password === 'bomits') {
                this.isLoggedIn = true;
                // 保存登录状态到本地存储
                localStorage.setItem('isLoggedIn', 'true');
            } else {
                alert('用户名或密码错误');
            }
        },
        
        /**
         * 解析视频
         */
        async parseVideo() {
            // 重置状态
            this.videoData = null;
            this.error = '';
            
            if (!this.videoText.trim()) {
                this.error = '请输入包含链接的文本';
                return;
            }
            
            // 提取链接
            const url = extractFirstUrl(this.videoText);
            if (!url) {
                this.error = '未找到有效的链接';
                return;
            }
            
            // 显示加载状态
            this.isLoading = true;
            
            try {
                // 调用解析服务
                this.videoData = await parseVideoUrl(url);
            } catch (err) {
                this.error = err.message;
            } finally {
                this.isLoading = false;
            }
        },
        
        /**
         * 复制文本到剪贴板
         * @param {string} text - 要复制的文本
         */
        async copyText(text) {
            const success = await copyToClipboard(text);
            if (success) {
                alert('复制成功');
            } else {
                alert('复制失败');
            }
        },
        
        /**
         * 下载视频
         */
        async downloadVideo() {
            if (!this.videoData || !this.videoData.url) {
                alert('没有可下载的视频');
                return;
            }
            
            try {
                await downloadVideo(this.videoData.url, this.videoData.title);
                // 显示下载成功信息
                alert('视频下载已尝试启动。如果未自动下载，请检查浏览器的下载管理器或尝试复制地址手动下载。');
            } catch (error) {
                // 显示详细的错误信息
                alert(`下载失败: ${error.message}`);
            }
        },
        
        /**
         * 检查本地存储的登录状态
         */
        checkLoginStatus() {
            const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (loggedIn) {
                this.isLoggedIn = true;
            }
        }
    },
    
    mounted() {
        // 页面加载时检查登录状态
        this.checkLoginStatus();
    }
}).mount('#app');

// 为测试目的将app实例挂载到window对象上
window.app = app;