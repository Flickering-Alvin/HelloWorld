import ActionManager from "../action_play/ActionManager";

// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 动态绘制虚线组件

const { ccclass, property } = cc._decorator;

@ccclass
export default class DottedLine extends cc.Component {

    @property({ type: cc.Prefab, visible: true, displayName: '虚线圆点预制体' })
    private _prefabDot: cc.Prefab = undefined;

    @property({ type: cc.Integer, visible: true, displayName: '虚线间距' })
    private _gap: number = 6;

    @property({ type: cc.Integer, visible: true, displayName: '虚线绘制速度-pix/ms' })
    private _speed: number = 1;

    @property({ type: cc.Float, visible: true, displayName: '淡入淡出时间-s' })
    private _fadeTime: number = 0.3;

    /** 绘制虚线的起点，拐点，终点组成的数组 */
    private _positions: Array<cc.Vec2> = undefined;

    /** 相邻点（起点，拐点，终点）之间连成的所有线的长度 */
    private _lineLens: Array<number> = new Array<number>();

    /** 组成虚线的所有圆点 */
    protected _dots: Array<cc.Node> = new Array<cc.Node>();

    /** 当前绘制到的位置 */
    private _currentPosition: cc.Vec2 = undefined;

    /** 是否正在绘制虚线 */
    private _isDrawing = false;

    /** 是否正在绘制虚线 */
    private _isErasing = false;

    /** 是否要绘制虚线点 */
    private _hasDot = true;

    /** 虚线的头部（当画虚线时需要物体跟随头部移动时可以使用） */
    private _heads: Array<cc.Node> = new Array<cc.Node>();

    private _dotPool:cc.NodePool = undefined;

    onLoad(){
        this._dotPool = new cc.NodePool();
        for(let i = 0; i < 100; i++){
            this._dotPool.put(cc.instantiate(this._prefabDot));
        }
    }

    private getDot():cc.Node{
        if(this._dotPool.size() > 0){
            return this._dotPool.get();
        }else{
            return cc.instantiate(this._prefabDot);
        }
    }

    /**
     * 绘制虚线
     * @param positions 虚线的起点，拐点，终点组成的数组
     * @param animationType 绘制动画类型
     * @param heads 跟随虚线头部运动的物体
     */
    public async draw(positions: Array<cc.Vec2>,
        animationType: DottedLineDrawAnimationType = DottedLineDrawAnimationType.StartToEnd,
        heads: Array<cc.Node> = undefined) {

        this._positions = positions.clone();

        if (animationType == DottedLineDrawAnimationType.StartToEnd) {
            this._heads = heads;

            // 初始化当前绘制位置
            this._currentPosition = this._positions[0].clone();

            // 开始绘制
            this._isDrawing = true;

            // 求出运动轨迹长度
            this._lineLens = new Array<number>();
            for (let index = 0; index < this._positions.length - 1; index++) {
                let start = this._positions[index].clone();
                let end = this._positions[index + 1].clone();
                let line = end.sub(start);
                let lineLength = line.mag();
                this._lineLens.push(lineLength);
            }

            // 计算总共花费时间
            let duration = 0;
            this._lineLens.forEach((len) => {
                duration += len * this._speed;
            });

            // 如果不含有头部，则生成头部
            if (this._heads == undefined) {
                this._heads = new Array<cc.Node>();
                let node = new cc.Node();
                this.node.parent.addChild(node);
                node.position = this._positions[0].clone();
                this._heads.push(node);
            }

            // 生成头部运动轨迹动作序列
            this._heads.forEach((node) => {
                let actionArr = new Array<cc.ActionInterval>();
                for (let i = 0; i < this._lineLens.length; i++) {
                    let currentDuration = this._lineLens[i] * this._speed;
                    let action = cc.moveTo(currentDuration / 1000, this._positions[i + 1].clone());
                    actionArr.push(action);
                }
                if (actionArr.length > 1) {
                    let seq = cc.sequence(actionArr).easing(cc.easeQuadraticActionInOut());
                    node.runAction(seq);
                } else {
                    node.runAction(actionArr[0].easing(cc.easeQuadraticActionInOut()));
                }


            });

            await ActionManager.delay(duration/ 1000).play();
        } else {

            let currentPosition = this._positions[0];
            let hasDot = false;

            for (let index = 0; index < this._positions.length - 1; index++) {
                let start = this._positions[index];
                currentPosition = start.clone();
                let end = this._positions[index + 1];
                let line = end.sub(start);
                let lineLength = line.mag();
                let increment = line.normalize().mul(this._gap);
                for (let i = 0; i < lineLength; i += this._gap) {
                    if (this.isCorner(currentPosition)) hasDot = false;
                    if (hasDot) {
                        //let node = cc.instantiate(this._prefabDot);
                        let node = this.getDot();
                        this.node.addChild(node);
                        node.position = currentPosition;
                        ActionManager.fadeIn(node,this._fadeTime).play();
                        this._dots.push(node);
                    }
                    currentPosition.addSelf(increment);
                    hasDot = !hasDot;
                }
            }
            return;
        }
    }

    /**
     * 擦除虚线
     * @param animationType 擦除动画类型
     */
    public async erase(animationType: DottedLineEraseAnimationType = DottedLineEraseAnimationType.Fadeout, speed = 1) {
        switch (animationType) {
            case DottedLineEraseAnimationType.Fadeout:
                let actions = [];
                this._dots.forEach((dot) => {
                    actions.push(ActionManager.fadeOut(dot, this._fadeTime / speed));
                });
                await ActionManager.parallelSequence(actions).play();
                this._dots.forEach((dot) => {
                    this._dotPool.put(dot);
                    dot.parent = undefined;
                });
                this._dots.clear();
                break;
            case DottedLineEraseAnimationType.EndToStart:
                this._currentPosition = this._positions.last().clone();

                // 开始擦除虚线
                this._isErasing = true;

                // 总共花费时间
                let duration = 0;

                // 生成头部运动轨迹动作序列
                this._heads.forEach((node) => {
                    let actionArr = new Array<cc.ActionInterval>();
                    for (let i = this._lineLens.length - 1; i >= 0; i--) {
                        let currentDuration = this._lineLens[i] * this._speed;
                        duration += currentDuration;
                        let action = cc.moveTo(currentDuration / 1000, this._positions[i].clone());
                        actionArr.push(action);
                    }
                    if (actionArr.length > 1) {
                        let seq = cc.sequence(actionArr).easing(cc.easeQuadraticActionInOut());
                        node.runAction(seq);
                    } else {
                        node.runAction(actionArr[0].easing(cc.easeQuadraticActionInOut()));
                    }

                });
                await ActionManager.delay(duration / 1000).play();
                break;
        }
    }


    update() {

        // 正在绘制
        if (this._isDrawing) {
            if (this._currentPosition.sub(this._positions.last()).mag() < this._gap) {
                this._isDrawing = false;
                return;
            }
            // 在头部与上一个绘制点之间绘制虚线
            let end: cc.Node = this._heads[0];
            let line = end.position.sub(this._currentPosition);
            let lineLength = line.mag();

            // 头部与上一个绘制点的距离小于间隔
            if (lineLength < this._gap) return;

            let increment = line.normalize().mul(this._gap);
            for (let i = 0; i < lineLength - this._gap; i += this._gap) {
                if (this.isCorner(this._currentPosition)) this._hasDot = false;
                if (this._hasDot) {
                    //let node = cc.instantiate(this._prefabDot);
                    let node = this.getDot();
                    this.node.addChild(node);
                    node.position = this._currentPosition;
                    this._dots.push(node);
                }
                this._currentPosition.addSelf(increment);
                this._hasDot = !this._hasDot;
            }
        }

        // 正在擦除
        if (this._isErasing) {

            let end: cc.Node = this._heads[0];

            // 是否已经到起始位置
            if (end.position.sub(this._positions[0]).mag() < this._gap) {
                this._dots.forEach((dot) => {
                    this._dotPool.put(dot);
                    dot.parent = undefined;
                });
                this._isErasing = false;
                return;
            }

            // 擦除头部与上一个擦除点之间的虚线
            let num = Math.floor(end.position.sub(this._currentPosition).mag() / (this._gap * 2));
            for (let i = 0; i < num; i++) {
                let lastDot = this._dots.last();
                this._currentPosition = lastDot.position;
                this._dots.remove(lastDot);
                lastDot.parent = undefined;
                this._dotPool.put(lastDot);
            }
        }
    }

    /**
     * 判断是否为拐角点
     */
    private isCorner(pos: cc.Vec2): boolean {
        if (this._positions.length <= 2) return false;
        for (let i = 1; i < this._positions.length - 2; i++) {
            if (this._positions[i].sub(pos).mag() < this._gap) return true;
        }
        return false;
    }
}

export enum DottedLineEraseAnimationType {

    /** 淡出擦除 */
    Fadeout,

    /** 从结束位置擦除 */
    EndToStart,
}

export enum DottedLineDrawAnimationType {

    /** 淡入绘制 */
    FadeIn,

    /** 从开始位置绘制 */
    StartToEnd,
}