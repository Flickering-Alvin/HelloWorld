// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 变色动作

import Action from "../base/Action";
import Delay from "./Delay";

export default class ColorTo extends Action {

    private _originColor: cc.Color = undefined;

    private _tagetColor: cc.Color = undefined;

    public constructor(node: cc.Node, targetColor: cc.Color, duration: number) {
        super(node);
        this._originColor = node.color.clone();
        this._tagetColor = targetColor;
        this.duration = duration;
    }

    public async play() {
        const r = this._tagetColor.getR();
        const g = this._tagetColor.getG();
        const b = this._tagetColor.getB();
        const action = cc.tintTo(this.duration, r, g, b);
        this.target.runAction(action);
        await new Delay(this.duration).play();
    }

    public async reverse(speed = 1) {
        const r = this._originColor.getR();
        const g = this._originColor.getG();
        const b = this._originColor.getB();
        const action = cc.tintTo(this.duration, r, g, b);
        cc.speed(action, speed)
        this.target.runAction(action);
        await new Delay(this.duration / speed).play();
    }
}
