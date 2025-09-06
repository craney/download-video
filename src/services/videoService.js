/**
 * 视频解析服务
 */

/**
 * 调用去水印API解析视频链接
 * @param {string} url - 视频分享链接
 * @returns {Promise<Object>} 解析结果
 */
export async function parseVideoUrl(url) {
    if (!url) {
        throw new Error('链接不能为空');
    }
    
    // 构造API请求URL
    const apiUrl = `https://api.guijianpan.com/waterRemoveDetail/xxmQsyByAk?ak=7c683460fa194354864f8a8a378ae8aa&link=${encodeURIComponent(url)}`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // 检查API返回是否成功
        if (data.code !== '10000' || !data.content) {
            throw new Error(data.msg || '解析失败');
        }
        
        // 返回需要的数据
        return {
            cover: data.content.cover,
            url: data.content.url,
            title: data.content.title
        };
    } catch (error) {
        throw new Error(`解析失败: ${error.message}`);
    }
}