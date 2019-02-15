// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 播放声音

import Action from "../base/Action";
import Delay from "./Delay";

export default class PlayAudio extends Action {

    public constructor(clip: cc.AudioClip) {
        super(clip);
        let buff = clip['_audio'] as AudioBuffer;
        this.duration = buff.duration;
    }

    public async play() {
        cc.audioEngine.playEffect(this.target, false);
        await new Delay(this.duration).play();
    }

    public async reverse() {}
}
