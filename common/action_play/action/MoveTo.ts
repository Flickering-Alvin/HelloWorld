// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 移动到目标位置

import Action from "../base/Action";
import Delay from "./Delay";

export default class MoveTo extends Action {

    private _originPos: cc.Vec2 = undefined;

    private _tagetPos: cc.Vec2 = undefined;

    public constructor(node: cc.Node, pos: cc.Vec2, duration: number) {
        super(node);
     
        this._tagetPos = pos.clone();
        this.duration = duration;
    }

    public async play() {
        this._originPos = this.target.position.clone();
        let action = cc.moveTo(this.duration, this._tagetPos);
        if (this.easeType) {
            action.easing(this.easeType);
        }
        this.target.runAction(action);
        await new Delay(this.duration).play();
    }

    public async reverse(speed = 1) {
        let action = cc.moveTo(this.duration, this._originPos);
        cc.speed(action, speed);
        this.target.runAction(action);
        await new Delay(this.duration / speed).play();
    }
}

