// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 定义了复杂的动作组件

import Action from "../action_play/base/Action";
import Caption from "./action_complex/Caption";
import ActionManager from "../action_play/ActionManager";


/**
 * 动作:字幕
 * @param node 操作节点
 * @param duration 执行时间
 */
function caption(node: cc.Node, text: string, distance: number = 40, duration: number = 0.4): Action {
    return new Caption(node, text, distance, duration);
}

function scaleHighLight(node: cc.Node, duration = 0.3): Action {
    return ActionManager.serialSequence([
        ActionManager.scaleTo(node, new cc.Vec2(1.2, 1.2), duration / 2),
        ActionManager.delay(0.5),
        ActionManager.scaleTo(node, cc.Vec2.ONE, duration / 2)
    ]);
}


export default {
    caption,
    scaleHighLight
}