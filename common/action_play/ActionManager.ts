// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Linbo Zhong (linbozhong@flickering.ai)
//
// 定义了常用的动作和动作序列

import Action from "../action_play/base/Action";
import ColorTo from "../action_play/action/ColorTo";
import FadeIn from "../action_play/action/FadeIn";
import FadeOut from "../action_play/action/FadeOut";
import MoveBy from "../action_play/action/MoveBy";
import MoveTo from "../action_play/action/MoveTo";
import ParallelSequence from "../action_play/sequence/ParallelSequence";
import ScaleBy from "../action_play/action/ScaleBy";
import ScaleTo from "../action_play/action/ScaleTo";
import SerialSequence from "../action_play/sequence/SerialSequence";
import Delay from "./action/Delay";
import AddToStage from "./action/AddToStage";
import RemoveFromStage from "./action/RemoveFromStage";
import DrawDottedLine from "./action/DrawDottedLine";
import SetString from "./action/SetString";
import PlayAudio from "./action/PlayAudio";
import SetVariable from "./action/SetVariable";

/**
 * 动作：移动到目标位置
 * @param node 操作目标节点
 * @param pos 移动目标位置
 * @param duration 移动时间
*/
function moveTo(node: cc.Node, pos: cc.Vec2, duration: number): Action {
    return new MoveTo(node, pos, duration);
}

/**
 * 动作：移动一段距离
 * @param node 操作节点
 * @param delta 移动变化值
 * @param duration 执行时间
 */
function moveBy(node: cc.Node, delta: cc.Vec2, duration: number): Action {
    return new MoveBy(node, delta, duration);
}

/**
 * 动作:缩放到目标值
 * @param node 操作节点
 * @param scale 缩放值
 * @param duration 执行时间
 */
function scaleTo(node: cc.Node, scale: cc.Vec2, duration: number): Action {
    return new ScaleTo(node, scale, duration);
}

/**
 * 动作:缩放到目标值
 * @param node 操作节点
 * @param delta 缩放变化值
 * @param duration 执行时间
 */
function scaleBy(node: cc.Node, delta: cc.Vec2, duration: number): Action {
    return new ScaleBy(node, delta, duration);
}

/**
 * 动作:缩放到目标值
 * @param node 操作节点
 * @param duration 执行时间
 */
function fadeIn(node: cc.Node, duration: number): Action {
    return new FadeIn(node, duration);
}

/**
 * 动作:缩放到目标值
 * @param node 操作节点
 * @param duration 执行时间
 */
function fadeOut(node: cc.Node, duration: number): Action {
    return new FadeOut(node, duration);
}

/**
 * 动作:缩放到目标值
 * @param node 操作节点
 * @param targetColor 目标颜色
 * @param duration 执行时间
 */
function colorTo(node: cc.Node, targetColor: cc.Color, duration: number): Action {
    return new ColorTo(node, targetColor, duration);
}

/**
 * 动作:延迟
 * @param duration 执行时间
 */
function delay(duration: number): Action {
    return new Delay(duration);
}


/**
 * 动作:播放音效
 * @param clip 音频剪辑
 */
function playAudio(clip: cc.AudioClip): Action {
    return new PlayAudio(clip);
}


/**
 * 动作：添加到舞台
 * @param node 子节点
 * @param parent 父节点
 */
function addToStage(node: cc.Node, parent: cc.Node) {
    return new AddToStage(node, parent);
}

/**
 * 动作：从舞台删除
 * @param node 子节点
 */
function removeFromStage(node: cc.Node) {
    return new RemoveFromStage(node);
}

function drawDottedLine(node: cc.Node, points: Array<cc.Vec2>, headArr: Array<cc.Node>, duration: number) {
    return new DrawDottedLine(node, points, headArr, duration);
}

/**
 * 动作：重置文本内容
 * @param node 操作节点
 * @param text 目标文本
 * @param duration 执行时间
 */
function setString(node: cc.Node, text: string, duration: number): Action {
    return new SetString(node, text, duration);
}

/**
 * 动作：设置变量
 * @param variable 操作变量
 * @param targetValue 目标值
 */
function setVariable(variable: any, property: string, targetValue: any): Action {
    return new SetVariable(variable, property, targetValue);
}


/**
 * 串行动作序列
 * @param actions 动作列表
 */
function serialSequence(actions: Array<Action>): Action {
    return new SerialSequence(actions);
}

/**
 * 并行动作序列
 * @param actions 动作列表
 */
function parallelSequence(actions: Array<Action>): Action {
    return new ParallelSequence(actions);
}

export default {
    moveTo,
    moveBy,
    scaleTo,
    scaleBy,
    fadeIn,
    fadeOut,
    colorTo,
    playAudio,
    delay,
    addToStage,
    drawDottedLine,
    setString,
    removeFromStage,
    setVariable,
    serialSequence,
    parallelSequence
}