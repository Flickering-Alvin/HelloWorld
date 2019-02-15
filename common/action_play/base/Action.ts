// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 动作基类

export default abstract class Action {

    /** 动作执行时间 */
    private _duration: number = 0;

    /** 动作执行者 */
    protected target: any = undefined;

    /** 缓动类型 */
    protected easeType: any = undefined;

    /** 创建一个动作 */
    constructor(target: any) {
        this.target = target;
    }

    /** 正向播放动作 */
    public abstract async play();

    /** 反向播放动作 */
    public abstract async reverse(speed: number);

    /** 设置缓动类型 */
    public easing(type: any): Action {
        this.easeType = type;
        return this;
    }

    public set duration(dt: number) {
        this._duration = dt;
    }

    public get duration(): number {
        return this._duration;
    }
}

