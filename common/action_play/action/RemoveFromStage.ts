// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 从舞台删除

import Action from "../base/Action";

export default class RemoveFromStage extends Action {

    private _parent: cc.Node = undefined;

    private _pos: cc.Vec2 = undefined;

    public constructor(node: cc.Node) {
        super(node);
    }

    public async play() {
        this._parent = this.target.parent;
        this._pos = this.target.position;
        this.target.parent = undefined;
    }

    public async reverse() {
        this.target.parent = this._parent;
        this.target.position = this._pos;
    }
}
