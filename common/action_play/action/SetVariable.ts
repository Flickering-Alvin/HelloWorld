// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 设置变量

import Action from "../base/Action";

export default class SetVariable extends Action {

    private _originValue: any = undefined;

    private _targetValue: any = undefined;

    private _property: string = '';

    public constructor(ob: object, property: string, targetValue: any) {
        super(ob);
        this._property = property;
        this._targetValue = targetValue;
    }

    public async play() {
        this._originValue = this.target[this._property];
        this.target[this._property] = this._targetValue;
    }

    public async reverse() {
        this.target[this._property] = this._originValue;
    }
}
