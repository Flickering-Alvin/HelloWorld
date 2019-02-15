// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)

// 可拖拽物体基类

const { ccclass } = cc._decorator;
type action = () => void;
@ccclass
export default class DragableObject extends cc.Component {

    public static sequence: number = 0;

    private dragable: boolean = false;
    private _boundaryOffset = 50;

    protected isDragging: boolean = false;

    public id: number = 0;
    public onDragEnd: action = undefined;
    public onDragBegin: action = undefined;

    public setDragable(value: boolean) {
        this.dragable = value;
    }

    protected start() {
        this.id = DragableObject.sequence++;
        this.addEventListener();
    }

    protected dragBegin() {
        this.isDragging = true;
        if (this.onDragBegin) {
            this.onDragBegin();
        }
    }

    protected dragEnd() {
        this.isDragging = false;
        if (this.onDragEnd) {
            this.onDragEnd();
        }
    }

    private addEventListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            if (this.dragable) {
                this.dragBegin();
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            if (this.isDragging) {
                let delta = event.touch.getDelta();
                this.node.x += delta.x;
                this.node.y += delta.y;
                if (this.isTransBoundary(event.getLocation())) {
                    this.dragEnd();
                }
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.isDragging) {
                this.dragEnd();
            }
        });
    }

    private isTransBoundary(pos: cc.Vec2): boolean {
        const localPos = this.node.parent.convertToNodeSpaceAR(pos);
        const width = cc.winSize.width;
        const height = cc.winSize.height;
        const isCrossX = localPos.x > width / 2 - this._boundaryOffset ||
            localPos.x < - width / 2 + this._boundaryOffset;
        const isCrossY = localPos.y > height / 2 - this._boundaryOffset ||
            localPos.y < - height / 2 + this._boundaryOffset;
        if (isCrossX || isCrossY) return true;
        return false;
    }
}
