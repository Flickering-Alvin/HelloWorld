// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Wende Luo (wendeluo@flickering.ai)
//
// 对原生的ts类拓展一些函数
// 这个是定义文件。只定义，不做实现

interface Array<T> {

    /**
     * 添加一个数组
     */
    pushRange(items: Array<T>): void;

    /**
     * 确定数组中是否存在某个具体元素
     */
    contains(item: T): boolean;

    /**
     * 确定数组中是否存在满足条件的元素
     */
    Contains(lambda: (item: T) => boolean): boolean;

    /**
     * 删除某一项
     */
    remove(item: T): void;

    /**
     * 删除满足条件的元素，返回删除的数量
     */
    Remove(lambda: (item: T) => boolean): number;

    /**
     * 清空数组
     */
    clear();

    /**
     * 寻找第一个符合条件的元素
     * 如果条件不传，则直接返回第0个元素
     */
    first(lambda?: (item: T) => boolean): T;

    /**
     * 寻找最后一个符合条件的元素
     * 如果条件不传，则直接返回最后一个元素
     */
    last(lambda?: (item: T) => boolean): T;

    /**
     * 将lambda作为转换函数作用于每个元素上，返回最大结果的那个元素
     * @param lambda 转换函数
     */
    max<R>(lambda?: (item: T) => R): T;

    /**
     * 将lambda作为转换函数作用于每个元素上，返回最小结果的那个元素
     * @param lambda 转换函数
     */
    min<R>(lambda?: (item: T) => R): T;

    /**
     * 将序列中的每个元素投影到新表中
     */
    select<R>(lambda: (item: T) => R): Array<R>;

    /**
     * 筛选出满足条件的元素
     */
    where(lambda: (item: T) => boolean): Array<T>;

    /**
     * 统计数组中满足条件的元素数量
     * 如果不传条件则直接返回数组的长度
     */
    count(lambda?: (item: T) => boolean): number;

     /**
     * 统计数组中满足条件的和
     * 如果不传条件则直接返回数组元素的总和
     */
    sum<R>(lambda?: (item: T) => R): number;


    /**
     * 将数组转化为Object
     * 将lambda作为转换函数作用于每个元素上，构建Dictionary的key
     * @param lambda key的转换函数
     */
    toDictionary(lambda: (item: T) => string | number): { [key: string]: T };

    /**
     * 克隆一个数组
     */
    clone(): Array<T>;

    /**
     * 将数组【本身】随机打乱
     */
    Shuffle(): void;

    /**
     * 【返回】随机打乱后的数组
     */
    shuffle(): Array<T>;

    /**
     * 小 ---> 大 排列【返回】排序好的数组
     * @param lambda 用哪个字段进行排序
     */
    sortAsc<R>(lambda?: (item: T) => R): Array<T>;

    /**
     * 大 ---> 小 排列 【返回】排序好的数组
     * @param lambda 用哪个字段进行排序
     */

    sortDesc<R>(lambda?: (item: T) => R): Array<T>;

    /**
     * 小 ---> 大 排列 直接把【本身】数组排好序
     * @param lambda 用哪个字段进行排序
     */
    SortAsc<R>(lambda?: (item: T) => R): void;

    /**
     * 小 ---> 大 排列 直接把【本身】数组排好序，如果有多个参考字段，可以传多个参数
     * @param lambdas 用哪个字段进行排序（可以无限传）
     */
    SortAsc<R>(...lambdas: Array<(item: T) => R>): void;

    /**
     * 大 ---> 小 排列 直接把【本身】数组排好序
     * @param lambda 用哪个字段进行排序
     */
    SortDesc<R>(lambda?: (item: T) => R): void;

    /**
     * 大 ---> 小 排列 直接把【本身】数组排好序，如果有多个参考字段，可以传多个参数
     * @param lambda 用哪个字段进行排序（可以无限传）
     */
    SortDesc<R>(...lambdas: Array<(item: T) => R>): void;
}