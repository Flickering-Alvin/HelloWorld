// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 移动到目标位置

import Action from "../base/Action";
import DottedLine, { DottedLineDrawAnimationType, DottedLineEraseAnimationType } from "../../component/DottedLine";


export default class DrawDottedLine extends Action {

    private _points: Array<cc.Vec2> = undefined;

    private _headArr: Array<cc.Node> = undefined;

    public constructor(node: cc.Node, points: cc.Vec2[], headArr: cc.Node[], duration: number) {
        super(node);
        this._points = points;
        this._headArr = headArr;
        this.duration = duration;
    }

    public async play() {
        let line = this.target.getComponent(DottedLine) as DottedLine;
        await line.draw(this._points, DottedLineDrawAnimationType.StartToEnd, this._headArr);
    }

    public async reverse(speed = 1) {
        let line = this.target.getComponent(DottedLine) as DottedLine;
        await line.erase(DottedLineEraseAnimationType.Fadeout, speed);
    }
}

