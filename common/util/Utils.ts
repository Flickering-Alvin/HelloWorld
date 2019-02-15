// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Wende Luo (wendeluo@flickering.ai)
// Author: Linbo Zhong (linbozhong@flickering.ai)

// 封装一些常用函数

function parseQuery(queryString: string): { [key: string]: string } {
    const dic = {};

    if (!queryString) {
        return dic;
    }

    if (queryString[0] == '?') {
        queryString = queryString.slice(1);
    }

    const queryArgs = queryString.split('&');
    for (let i = 0; i < queryArgs.length; i++) {
        const args = queryArgs[i].split('=');
        dic[args[0]] = decodeURIComponent(args[1]);
    }
    
    return dic;
}

/**
 * 获取网址上传过来的参数
 */
function getParamFromUrl() {
    return parseQuery(location.search);
}

export default {
    getParamFromUrl,
}

