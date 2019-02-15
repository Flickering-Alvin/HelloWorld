// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)

// 封装一些常用函数

import Constants from "../config/Constants";
import LoaderManager from "./LoaderManger";
import { Step } from "../../script/Step";
import ActionManager from "../action_play/ActionManager";
import Main from "../../script/Main";

const { ccclass } = cc._decorator;

@ccclass
export default class StepAudioManager {

    private static _instance: StepAudioManager = undefined;

    private _dicDubAudioId: { [key: string]: number } = {};

    private _dicDubAudio: { [key: string]: string } = {};

    private _originDubTxtArr: string[] = undefined;

    private _urls: string[] = [];

    public static getInstance() {
        if (!this._instance) {
            this._instance = new StepAudioManager();
        }
        return this._instance;
    }

    /**
     * 初始化语音
     * dubTxtArr 台词
     */
    public async init(dubTxtArr: string[]) {

        // 处理台词
        this._originDubTxtArr = this.replace(dubTxtArr);
        let handledDubTxtArr = this.split(dubTxtArr);
        console.log(handledDubTxtArr);
        // 从后台获取音频文件名
        const response = await fetch(Constants.URL_API, {
            method: 'POST',
            body: JSON.stringify({
                data: handledDubTxtArr
            })
        });

        const text = await response.text();
        console.log(text);
        const files: string[] = JSON.parse(text).data;

        // 从cdn下载音频文件
        for (let i = 0; i < files.length; i++) {
            let url = `${Constants.URL_CDN_SOUND}${files[i]}`;
            this._urls.push(url);
            this._dicDubAudio[handledDubTxtArr[i]] = url;
        }
        await LoaderManager.getInstance().loadExternalAssets(this._urls);
        this._urls.forEach((url) => {
            cc.loader.loadRes(url, cc.AudioClip);
        });
    }

    /**
     * 将台词中的逗号用[pn](表示停顿，例如[p500])替换
     * @param dubTxtArr 台词
     */
    public replace(dubTxtArr: string[]) {
        for (let i = 0; i < dubTxtArr.length; i++) {
            dubTxtArr[i] = dubTxtArr[i].replace(/\，/g, '[p0]').replace(/\,/g, '[p0]').replace(/:/g, '');
        }
        return dubTxtArr;
    }

    /**
     * 将含有[pn](表示停顿，例如[p500])的语句拆分为若干个句子
     * @param dubTxtArr 
     */
    private split(dubTxtArr: string[]): string[] {
        let handledDubTxtArr = [];
        for (let i = 0; i < dubTxtArr.length; i++) {
            let txt = dubTxtArr[i];
            let reg = /\[p\d+\]/g;
            if (reg.test(txt)) {
                let ret = txt.split(/\[p\d+\]/g);
                for (let j = 0; j < ret.length; j++) {
                    let str = ret[j];
                    const isExist = handledDubTxtArr.indexOf(str) != -1;
                    if (str.length > 0 && !isExist) {
                        handledDubTxtArr.push(ret[j]);
                    }
                }
            } else {
                const isExist = handledDubTxtArr.indexOf(txt) != -1;
                if (txt.length > 0 && !isExist) {
                    handledDubTxtArr.push(txt);
                }
            }
        }
        return handledDubTxtArr;
    }

    public async play(step: number): Promise<number> {

        cc.audioEngine.pauseAllEffects();

        // 全部台词
        let originDubTxt = this._originDubTxtArr[step];

        // 正则匹配[pn], n>=0,例如[p0],[p200],[p500]
        const regTest = /\[p\d+\]/g;

        // 中间是否有停顿
        const hasBreak = regTest.test(originDubTxt);

        if (hasBreak) {
            let duration = 0;
            let delayArr = [];
            let mathchStr = undefined;
            const reg = /\[p\d+\]/g;
            while (mathchStr = reg.exec(originDubTxt)) {
                let numReg = /\d+/;
                let numStr = numReg.exec(mathchStr);
                delayArr.push(Number(numStr));
            }
            let ret = originDubTxt.split(/\[p\d+\]/);
            duration += await this.playAudio(ret.shift());
            while (true) {
                if (ret.length == 0) break;
                if (delayArr.length > 0) {
                    let delay = delayArr.shift();
                    if (delay == 0) {
                        delay = 300;
                    }
                    delay = delay / 1000;
                    await ActionManager.delay(delay).play();
                    duration += delay;
                }
                const time = await this.playAudio(ret.shift());
                duration += time;
            }
            return duration;
        } else {
            return await this.playAudio(originDubTxt);
        }
    }

    private async playAudio(dubTxt: string): Promise<number> {
        let url = this._dicDubAudio[dubTxt];
        const clip = cc.loader.getRes(url);
        if (clip) {
            const id = cc.audioEngine.playEffect(clip, false);
            const duration = cc.audioEngine.getDuration(id);
            this._dicDubAudioId[dubTxt] = id;
            await ActionManager.delay(duration).play();
            return duration;
        }
        return 0
    }

    public pause(step: Step) {
        let audioId = this._dicDubAudioId[step];
        if (audioId) {
            cc.audioEngine.pauseEffect(audioId);
        }
    }
}
