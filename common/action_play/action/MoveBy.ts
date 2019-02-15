// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 移动一段距离

import Action from "../base/Action";
import Delay from "./Delay";

export default class MoveBy extends Action {

    private _delta: cc.Vec2 = undefined;

    public constructor(node: cc.Node, delta: cc.Vec2, duration: number) {
        super(node);
        this._delta = delta;
        this.duration = duration;
    }

    public async play() {
        let action = cc.moveBy(this.duration, this._delta.x, this._delta.y);
        if (this.easeType) {
            action.easing(this.easeType)
        }
        this.target.runAction(action);
        await new Delay(this.duration).play();
    }

    public async reverse(speed = 1) {
        let action = cc.moveBy(this.duration, -this._delta.x, -this._delta.y);
        if (this.easeType) {
            action.easing(this.easeType);
        }
        cc.speed(action, speed);
        this.target.runAction(action);
        await new Delay(this.duration / speed).play();
    }
}

