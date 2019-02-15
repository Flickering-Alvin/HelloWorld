// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 输出台词文件

export default class DubTxtAnalyzer {
    private _dubTxt: string[] = [];

    constructor(dubTxt: string[]) {
        for (let i = 0; i < dubTxt.length; i++) {
            let txt = dubTxt[i];
            txt = txt.replace(/\，/g, '[p0]');
            txt = txt.replace(/\,/g, '[p0]');
            txt = txt.replace(/\:/g, '');
            let reg = /\[p\d+\]/;
            let arr = reg.exec(txt);
            if (arr) {
                let ret = txt.split(/\[p\d+\]/);
                for (let j = 0; j < ret.length; j++) {
                    let str = ret[j];
                    if (str.length > 0) {
                        this._dubTxt.push(ret[j]);
                    }
                }
            } else {
                if (txt.length > 0) {
                    this._dubTxt.push(txt);
                }
            }
        }
    }

    public get dubTxt(): string[] {
        return this._dubTxt;
    }
}