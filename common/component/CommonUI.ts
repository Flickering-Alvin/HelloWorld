// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 通用的UI交互

import ComponentManager from "./ComponentManager";
import ActionManager from "../action_play/ActionManager";
import Action from "../action_play/base/Action";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CommonUI extends cc.Component {

    @property({ type: cc.Button, visible: true, displayName: '下一步按钮' })
    private _btnNext: cc.Button = undefined;

    @property({ type: cc.Button, visible: true, displayName: '上一步按钮' })
    private _btnPrevious: cc.Button = undefined;

    @property({ type: cc.Node, visible: true, displayName: '开始按钮' })
    private _beginBtn: cc.Node = undefined;

    @property({ type: cc.Node, visible: true, displayName: '手势' })
    private _gesture: cc.Node = undefined;

    @property({ type: cc.Node, visible: true, displayName: '参数文本的父节点' })
    private _paramsParent: cc.Node = undefined;

    @property({ type: cc.Animation, visible: true, displayName: '开场动画' })
    private _startAni: cc.Animation = undefined;

    @property({ type: cc.Float, visible: true, displayName: '式子移动时间' })
    private _aniTime: number = 0.4;

    @property({ type: cc.Float, visible: true, displayName: '用户未操作时间' })
    private _tipDelay: number = 5;

    @property({ type: cc.Node, visible: true, displayName: '式子移动的目标节点' })
    private _target: cc.Node = undefined;

    @property({ type: cc.Button, visible: true, displayName: '重新播放按钮' })
    private _btnReplay: cc.Button = undefined;

    @property({ type: cc.Node, visible: true, displayName: '重新播放面板' })
    public panelRelay: cc.Node = undefined;

    @property({ type: cc.Node, visible: true, displayName: '放在中间的下一步按钮' })
    private _btnNextCenter: cc.Node = undefined;

    @property(cc.AudioSource)
    public btnAudio: cc.AudioSource = undefined;

    private _enable: boolean = false;

    public onNext = undefined;

    public onPrevious = undefined;

    public onReplay = undefined;

    public onStart = undefined;

    onLoad() {
        this.node.active = false;
        this.node.on(cc.game.EVENT_HIDE,()=>{
            cc.director.pause();
        });
        this.node.on(cc.game.EVENT_SHOW,()=>{
            cc.director.resume();
        });
    }

    public async init(...params) {

        // 设置参数
        let labels = this._paramsParent.getComponentsInChildren(cc.Label).filter(label => {
            return label.node.parent.name != 'circle';
        });

        for (let i = 0; i < labels.length; i++) {
            labels[i].string = params[0].toString();
        }

        this.enable = false;
        this.node.active = true;
        this.panelRelay.active = false;
        this._btnNext.node.active = false;
        this._btnPrevious.node.active = false;

        // 播放开场动画
        let aniState = this._startAni.play();
        await ActionManager.delay(aniState.duration).play();
        this._beginBtn.on(cc.Node.EventType.TOUCH_START, () => {
            this.begin();
        });
    }

    public begin() {
        this.btnAudio.play();
        this.node.getChildByName('tip').active = false;
        this._beginBtn.active = false;
        this._btnNext.node.active = true;
        if (this.onStart) {
            this.onStart();
        }
    }

    public async startUp() {
        ActionManager.moveTo(this._paramsParent.parent, this._target.position, this._aniTime).play();
        this.getComponent(cc.Animation).play();
        await ActionManager.delay(this._aniTime).play();
        this.addEventListener();
    }

    public set enable(value: boolean) {
        this._enable = value;
        this._btnNext.node.active = value;
    }

    public get enable(): boolean {
        return this._enable;
    }

    public showReplayButton(): Action {
        this._btnNext.node.off(cc.Node.EventType.TOUCH_START);
        this._btnNext.node.parent = undefined;
        return ActionManager.setVariable(this.panelRelay, 'active', true);
    }

    public setNextButton(value: boolean): Action {
        return ActionManager.setVariable(this._btnNext.node, 'active', value);
    }

    public setPreviousButton(value: boolean): Action {
        return ActionManager.setVariable(this._btnPrevious.node, 'active', value);
    }

    public getQstPosition(): cc.Vec2 {
        let qstNode = this._paramsParent.getChildByName('circle').children[0] as cc.Node;
        return qstNode.parent.convertToWorldSpaceAR(qstNode.position);
    }

    public setAnswer(answer: string): Action {
        // let circle = this._paramsParent.getChildByName('circle');
        // circle.getComponent(cc.Sprite).enabled = false;
        // let qstNode = this._paramsParent.getChildByName('circle').children[0];
        // qstNode.anchorX = 0;
        // ActionManager.colorTo(qstNode, cc.Color.WHITE, this._aniTime);
        // qstNode.getComponent(cc.Label).string = answer;
        return undefined;
    }

    public async showGesture() {
        this._btnNextCenter.active = true;
        let ani = this._btnNextCenter.getComponent(cc.Animation);
        ani.play('show');
        await ActionManager.delay(0.6).play();
        ani.play('idle');
    }

    private addEventListener() {
        this._btnNext.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (!this._enable) return;
            let img = this._btnNext.node.getChildByName('img');
            ComponentManager.scaleHighLight(img).play();
            this.next();
        });

        this._btnNextCenter.on(cc.Node.EventType.TOUCH_START, () => {
            if (!this._enable) return;
            this.next();
        });

        this._btnReplay.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (!this._enable) return;
            this.btnAudio.play();
            if (this.onReplay) {
                this.panelRelay.active = false;
                this.onReplay();
            }
        });
    }

    private async next() {
        this.unscheduleAllCallbacks();
        if (this.onNext)
            this.onNext();
        this._btnNextCenter.getComponent(cc.Animation).play('boom');
        this.btnAudio.play();
        await ActionManager.delay(0.33).play();
        this._btnNextCenter.active = false;
    }

    private previous() {
        this.unscheduleAllCallbacks();
        if (this.onPrevious)
            this.onPrevious();
    }
}
