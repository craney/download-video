/**
 * 链接提取工具
 */

/**
 * 从文本中提取所有HTTP/HTTPS链接
 * @param {string} text - 输入文本
 * @returns {string[]} 提取到的链接数组
 */
export function extractUrls(text) {
    if (!text || typeof text !== 'string') {
        return [];
    }
    
    // 匹配HTTP/HTTPS链接的正则表达式
    const urlRegex = /https?:\/\/[^\s]+/g;
    const matches = text.match(urlRegex);
    
    return matches || [];
}

/**
 * 从文本中提取第一个有效的链接
 * @param {string} text - 输入文本
 * @returns {string|null} 第一个有效链接或null
 */
export function extractFirstUrl(text) {
    const urls = extractUrls(text);
    return urls.length > 0 ? urls[0] : null;
}