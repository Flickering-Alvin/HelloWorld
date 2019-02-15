// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Lucca (shihaoli@flickering.ai)
//
// 字幕

import Action from "../../action_play/base/Action"
import ActionManager from "../../action_play/ActionManager";


export default class Caption extends Action {

    protected _targetOffset: cc.Vec2 = undefined;
    protected _totalOffset: cc.Vec2 = undefined;
    protected _originPos: cc.Vec2 = undefined;
    protected _targetTxt: string = '';
    protected _sequenceAction: Action = undefined;

    public constructor(node: cc.Node, text: string, distance: number, duration: number) {
        super(node);
        this.duration = duration;
        this._targetOffset = new cc.Vec2(0,distance);
        this._targetTxt = text;
        this._originPos = node.position;
        this._totalOffset = new cc.Vec2(0,-2 *distance);

        const targetMoveBy = ActionManager.moveBy(this.target,this._targetOffset,this.duration);
        const targetMoveTo = ActionManager.moveBy(this.target,this._totalOffset,0);
        const targetFadeOut = ActionManager.fadeOut(this.target,this.duration);
        const targetFadeIn = ActionManager.fadeIn(this.target,this.duration);
        const targetStrSet = ActionManager.setString(this.target,this._targetTxt,0);
        const seq1 = ActionManager.parallelSequence([targetMoveBy,targetFadeOut]);
        const seq2 = ActionManager.parallelSequence([targetMoveBy,targetFadeIn]);
        this._sequenceAction = ActionManager.serialSequence([seq1,targetMoveTo,targetStrSet,seq2]);
    }

    public async play() {
        this._sequenceAction.play();
    }

    public async reverse(speed:number = 2) {
        this._sequenceAction.reverse(speed);
    }
}
