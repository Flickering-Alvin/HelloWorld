// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 渐隐

import Action from "../base/Action";
import Delay from "./Delay";

export default class FadeOut extends Action {

    public constructor(node: cc.Node, duration: number) {
        super(node);
        this.target = node;
        this.duration = duration;
    }

    public async play() {
        this.target.runAction(cc.fadeOut(this.duration));
        await new Delay(this.duration).play();
    }

    public async reverse(speed) {
        let action = cc.fadeIn(this.duration);
        cc.speed(action, speed);
        this.target.runAction(action);
        await new Delay(this.duration / speed).play();
    }
}
