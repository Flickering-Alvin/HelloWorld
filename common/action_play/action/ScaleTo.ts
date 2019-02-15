// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 缩放到目标值

import Action from "../base/Action";
import Delay from "./Delay";

export default class ScaleTo extends Action {

    private _originScale: cc.Vec2 = undefined;

    private _tagetScale: cc.Vec2 = undefined;

    public constructor(node: cc.Node, scale: cc.Vec2, duration: number) {
        super(node);
        this._tagetScale = scale;
        this.duration = duration;
    }

    public async play() {
        this._originScale = new cc.Vec2(this.target.scaleX, this.target.scaleY);
        const action = cc.scaleTo(this.duration, this._tagetScale.x, this._tagetScale.y);
        this.target.runAction(this.easeType ? action.easing(this.easeType) : action);
        await new Delay(this.duration).play();
    }

    public async reverse(speed = 1) {
        const action = cc.scaleTo(this.duration, this._originScale.x, this._originScale.y);
        cc.speed(action, speed);
        this.target.runAction(action);
        await new Delay(this.duration / speed).play();
    }
}
