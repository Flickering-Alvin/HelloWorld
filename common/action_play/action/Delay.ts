// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 延迟指定的时间

import Action from "../base/Action";

export default class Delay extends Action {

    public constructor(duration: number) {
        super(undefined);
        this.duration = duration;
    }

    public async play() {
        return new Promise<void>((resolve, reject) => {
            setTimeout(resolve, this.duration * 1000);
        });
    }

    public async reverse(speed = 1) {
        return new Promise<void>((resolve, reject) => {
            setTimeout(resolve, this.duration * 1000 / speed);
        });
    }
}
