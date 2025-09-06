/**
 * 剪贴板操作工具
 */

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 复制是否成功
 */
export async function copyToClipboard(text) {
    if (!text) {
        return false;
    }
    
    try {
        // 使用Clipboard API
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        // 如果Clipboard API不可用，使用备选方案
        return fallbackCopyTextToClipboard(text);
    }
}

/**
 * 备选的复制方法
 * @param {string} text - 要复制的文本
 * @returns {boolean} 复制是否成功
 */
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // 避免滚动到底部
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        document.body.removeChild(textArea);
        return false;
    }
}