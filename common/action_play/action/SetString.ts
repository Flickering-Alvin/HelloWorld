// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 更改Label组件的文本内容

import Action from "../base/Action";
import Delay from "./Delay";

export default class SetString extends Action {

    private _originTxt = '';
    private _targetTxt = '';
    private _targetLabel: cc.Label = undefined;

    public constructor(node: cc.Node, text: string, duration: number) {
        super(node);
        this._targetLabel = this.target.getComponent(cc.Label);
        this._targetTxt = text;
        this.duration = duration;
    }

    public async play() {
        if (this._targetLabel == null) return;
        this._originTxt = this._targetLabel.string;
        await new Delay(this.duration).play();
        this._targetLabel.string = this._targetTxt;
    }

    public async reverse(speed = 1) {
        if (this._targetLabel == null) return;
        await new Delay(this.duration / speed).play();
        this._targetLabel.string = this._originTxt;
    }
}
