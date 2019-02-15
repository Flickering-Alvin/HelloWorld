// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 并行动作序列

import Action from "../base/Action";
import Delay from "../action/Delay";
import SerialSequence from "./SerialSequence";

export default class ParallelSequence extends Action {

    constructor(actions: Array<Action>) {
        super(actions);
        this.align();
    }

    private align() {
        for (let i = 0; i < this.target.length; i++) {
            let action = this.target[i];
            if (action.duration < this.duration) {
                const delay = new Delay(this.duration - action.duration);
                const seq = new SerialSequence([action, delay]);
                this.target[i] = seq;
            }
        }
    }

    public async play() {
        this.target.forEach((action) => {
            action.play();
        });
        await new Delay(this.duration).play();
    }

    public async reverse(speed = 1) {
        this.target.forEach((action) => {
            action.reverse(speed);
        });
        await new Delay(this.duration / speed).play();
    }

    public get duration(): number {
        return (this.target as Array<Action>).max(action => action.duration).duration || 0;
    }
}
