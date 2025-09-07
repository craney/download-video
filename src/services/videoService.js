/**
 * 视频解析服务
 */

/**
 * 调用去水印API解析视频链接（方案A）
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

/**
 * 调用去水印API解析视频链接（方案B）
 * @param {string} url - 视频分享链接
 * @returns {Promise<Object>} 解析结果
 */
export async function parseVideoUrlNew(url) {
    if (!url) {
        throw new Error('链接不能为空');
    }
    
    try {
        // 第一步：获取 aweme_id
        const awemeIdUrl = `http://143.110.155.36/api/douyin/web/get_aweme_id?url=${encodeURIComponent(url)}`;
        const awemeIdResponse = await fetch(awemeIdUrl);
        
        if (!awemeIdResponse.ok) {
            throw new Error(`获取 aweme_id 失败: ${awemeIdResponse.status} ${awemeIdResponse.statusText}`);
        }
        
        const awemeIdData = await awemeIdResponse.json();
        
        if (awemeIdData.code !== 200) {
            throw new Error(awemeIdData.msg || '获取 aweme_id 失败');
        }
        
        const awemeId = awemeIdData.data;
        
        // 第二步：获取视频详细信息
        const videoDetailUrl = `http://143.110.155.36/api/douyin/web/fetch_one_video?aweme_id=${awemeId}`;
        const videoDetailResponse = await fetch(videoDetailUrl);
        
        if (!videoDetailResponse.ok) {
            throw new Error(`获取视频详情失败: ${videoDetailResponse.status} ${videoDetailResponse.statusText}`);
        }
        
        const videoDetailData = await videoDetailResponse.json();
        
        if (videoDetailData.code !== 200) {
            throw new Error(videoDetailData.msg || '获取视频详情失败');
        }
        
        // 提取需要的数据
        const awemeDetail = videoDetailData.data.aweme_detail;
        const title = awemeDetail.caption;
        const cover = awemeDetail.video.origin_cover.url_list[0];
        const videoUrl = awemeDetail.video.play_addr.url_list[0];
        
        return {
            cover: cover,
            url: videoUrl,
            title: title
        };
    } catch (error) {
        throw new Error(`解析失败: ${error.message}`);
    }
}