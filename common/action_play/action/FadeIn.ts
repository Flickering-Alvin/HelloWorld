// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 渐显

import Action from "../base/Action";
import Delay from "./Delay";

export default class FadeIn extends Action {

    constructor(node: cc.Node, duration: number) {
        super(node);
        this.duration = duration;
    }

    public async play() {
        this.target.runAction(cc.fadeIn(this.duration));
        await new Delay(this.duration).play();
    }

    public async reverse(speed = 1) {
        let action = cc.fadeOut(this.duration);
        cc.speed(action, speed);
        this.target.runAction(action);
        await new Delay(this.duration / speed).play();
    }
}
