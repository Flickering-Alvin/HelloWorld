// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 串行动作序列

import Action from "../base/Action";

export default class SerialSequence extends Action {

    public constructor(actions: Array<Action>) {
        super(actions);
    }

    public async play() {
        let actions = this.target.clone() as Array<Action>;
        while (true) {
            if (actions.length <= 0) break;
            const action = actions.shift();
            await action.play();
        }
    }

    public async reverse(speed = 1) {
        let actions = this.target.clone() as Array<Action>;
        while (true) {
            if (actions.length <= 0) break;
            const action = actions.pop();
            await action.reverse(speed);
        }
    }

    public get duration(): number {
        return (this.target as Array<Action>).sum(action => action.duration);
    }
}
