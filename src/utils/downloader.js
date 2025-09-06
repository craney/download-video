/**
 * 视频下载工具
 */

/**
 * 下载视频文件
 * @param {string} url - 视频URL
 * @param {string} title - 视频标题
 * @returns {Promise<boolean>} 下载是否成功
 */
export async function downloadVideo(url, title) {
    if (!url) {
        throw new Error('视频URL不能为空');
    }

    // 使用Blob方式下载，设置完整的请求头和referrer-policy
    return await downloadVideoViaBlob(url, title);
}

/**
 * 通过Blob方式下载视频，设置完整的请求头和referrer-policy
 * @param {string} url - 视频URL
 * @param {string} title - 视频标题
 * @returns {Promise<boolean>} 下载是否成功
 */
async function downloadVideoViaBlob(url, title) {
    return new Promise((resolve, reject) => {
        try {
            // 创建XMLHttpRequest对象
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            
            // 设置请求头绕过防盗链
            xhr.setRequestHeader('Referer', 'https://www.iesdouyin.com');
            xhr.setRequestHeader('Origin', 'https://www.iesdouyin.com');
            xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
            xhr.setRequestHeader('Accept-Language', 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7');
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.setRequestHeader('Pragma', 'no-cache');
            
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        // 获取Blob数据
                        const blob = xhr.response;
                        
                        // 创建一个临时的<a>元素用于下载
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        
                        // 使用视频标题作为文件名，如果标题不存在则使用默认名称
                        let filename = 'video.mp4';
                        if (title) {
                            // 清理文件名中的非法字符
                            filename = title.replace(/[/\\?%*:|"<>]/g, '-') + '.mp4';
                        }
                        
                        link.download = filename;
                        link.style.display = 'none';
                        // 设置referrer-policy
                        link.referrerPolicy = 'no-referrer';
                        
                        // 添加到DOM，点击，然后移除
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        // 清理创建的对象URL
                        URL.revokeObjectURL(link.href);
                        
                        resolve(true);
                    } catch (error) {
                        reject(new Error('创建下载链接失败: ' + error.message));
                    }
                } else if (xhr.status === 403) {
                    reject(new Error('服务器拒绝访问（可能是防盗链保护）'));
                } else {
                    reject(new Error(`HTTP错误: ${xhr.status} ${xhr.statusText}`));
                }
            };
            
            xhr.onerror = function() {
                reject(new Error('网络错误，请检查连接'));
            };
            
            xhr.send();
        } catch (error) {
            reject(new Error('初始化下载请求失败: ' + error.message));
        }
    });
}