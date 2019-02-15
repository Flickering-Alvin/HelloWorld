// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 资源加载管理类

export default class LoaderManager {

    private static _instance: LoaderManager = undefined;

    public static getInstance() {
        if (!this._instance) {
            this._instance = new LoaderManager();
        }
        return this._instance;
    }

    /** 从远程url下载资源列表 */
    public loadExternalAssets(urls: string[]) {
        return new Promise((complete) => {
            let loadedAssets = {};
            let unLoadedUrls = [];
            urls.forEach(url => {
                let res = cc.loader.getRes(url);
                if (res) {
                    loadedAssets[url] = res;
                }
                else {
                    unLoadedUrls.push(url);
                }
            });
            if (unLoadedUrls.length == 0) {
                complete();
            }
            cc.loader.load(unLoadedUrls, (errs, res) => {
                if (errs) {
                    cc.warn('load assets error', errs);
                    complete();
                }
                unLoadedUrls.forEach(url => {
                    loadedAssets[url] = res.getContent(url);
                });
                complete();
            });
        });
    }

    /** 从远程url下载资源 */
    public async loadExternalAsset(url: string) {
        new Promise((complete) => {
            let res = cc.loader.getRes(url);
            if (res) {
                complete();
            }
            cc.loader.load(url, (err, res) => {
                if (err) {
                    cc.warn('load asset error', err);
                    complete();
                }
                complete();
            });
        });
    }
}

