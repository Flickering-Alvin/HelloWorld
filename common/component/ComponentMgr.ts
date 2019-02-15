// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 定义了复杂的动作组件

import Action from "../action_play/base/Action";
import Caption from "./action_complex/Caption";


/**
 * 动作:字幕
 * @param node 操作节点
 * @param duration 执行时间
 */
function caption(node: cc.Node, text: string, distance: number = -30, duration: number = 0.3): Action {
    return new Caption(node, text, distance, duration);
}

export default {
    caption
}