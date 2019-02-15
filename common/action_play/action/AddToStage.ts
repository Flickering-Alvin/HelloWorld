// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 添加到舞台

import Action from "../base/Action";

export default class AddToStage extends Action {

    private _parent: cc.Node = undefined;
    public constructor(node: cc.Node, parent: cc.Node) {
        super(node);
        this._parent = parent;
    }

    public async play() {
        this.target.parent = this._parent;
    }

    public async reverse() {
        this.target.parent = undefined;
        this.target = undefined;
    }
}
