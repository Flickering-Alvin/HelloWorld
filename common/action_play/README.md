
## 描述
```
    在实现滑动讲解的项目中有个播放上一步的功能，为了降低实现的时间成本，写了这个工具。
思路是每个动作管理自己的状态，在动作播放之前记录动作目标原始的状态，这样在倒着播
放动作的时候就不需要再写逻辑了。
```
## 目录结构
```
action_play 动作播放框架           
├─base (动作基类)          
├─action (常用的动作类))      
└─sequence (动作播放序列)    
```

## 用法
- 单个动作:
    ```typescript
    // 创建动作
    let action = new MoveTo(node, new cc.Vec2(0, -300), 1);

    // 播放动作
    action.play();

    // 倒着播放
    action.playReverse();

- 串行动作:
    ```typescript
    let move = new MoveBy(this.labelLeft, new cc.Vec2(0, -300), 1);

    let scale = new ScaleToAction(this.labelLeft, new cc.Vec2(1.2, 1.2), 0.5);

    // 创建动作序列
    let seq = new SerialSequence([move, scale]);

    // 播放动作序列
    seq.play();

    // 倒着播放动作序列
    seq.playReverse();

- 并行动作:
   ```typescript
    // 讲解第一步：nodeA,nodeB 移动
    let moveA = new MoveBy(nodeA, new cc.Vec2(0, -300), 1);

    let moveB = new MoveBy(nodeB, new cc.Vec2(0, -300), 1);

    // 创建并行动作序列
    let seq = new ParallelSequence([moveA, moveB]);

    // 播放动作序列
    seq.play();

    // 倒着播放动作序列
    seq.playReverse();

-  并行串行嵌套动作:

    ```typescript
    // 讲解第一步：nodeA,nodeB 移动
    const moveA = new MoveBy(this.labelLeft, new cc.Vec2(0, -300), 1);

    const moveB = new MoveBy(this.labelRight, new cc.Vec2(0, -300), 1);

    const step1 = new ParallelSequence([moveA, moveB]);

    // 讲解第二步：nodeA 放大,nodeC 移动
    const scaleA = new ScaleTo(this.labelLeft, new cc.Vec2(2, 2), 1);

    const moveC = new MoveTo(this.labelRight, new cc.Vec2(0, -300), 1);

    const step2 = new ParallelSequence([scaleA, moveC]);

    // 第一步第二步串行自动播放
    const serialSeq = new SerialSequence([step1, step2]);
    serialSeq.play();

    // 倒着播放动作序列
    serialSeq.playReverse();

