// Copyright (C) 2018, Flickering Inc. All rights reserved.
// Author: Wende Luo (wendeluo@flickering.ai)
//
// 对原生的ts类拓展一些函数
// 这个是实现文件，就是拓展函数的具体实现代码


/** 
 * 随机一个范围内的数字（整数），范围的左边是闭区间，右边是开区间
 */
function random(min: number, max: number) {
    let d = Math.floor(max) - Math.floor(min);
    return min + Math.floor(Math.random() * d);
}

function getValue(obj, lambda) {
    if (!lambda) {
        return obj;
    } else {
        return lambda(obj);
    }
}

function defineToObject(methodName, value) {
    Object.defineProperty(Object.prototype, methodName, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: value
    });
}

/**
 * 激活拓展方法
 */
export function initExtensions() {

    Array.prototype.pushRange = function (items) {
        if (!items || items.length == 0) {
            return;
        }
        for (var x of items) {
            this.push(x);
        }
    };

    Array.prototype.contains = function (item) {
        return this.indexOf(item) >= 0;
    };

    Array.prototype.first = function (lambda) {
        if (!lambda && this.length > 0) {
            return this[0];
        }
        for (var x of this) {
            if (lambda(x)) {
                return x;
            }
        }
        return null;
    };

    Array.prototype.last = function (lambda) {
        if (!lambda && this.length > 0) {
            return this[this.length - 1];
        }
        for (let i = this.length - 1; i >= 0; i--) {
            if (lambda(this[i])) {
                return this[i];
            }
        }
        return null;
    };

    Array.prototype.max = function (lambda) {
        let result = null;
        if (this.length == 0)
            return result;
        let max = getValue(this[0], lambda);
        result = this[0];
        for (let i = 1; i < this.length; i++) {
            let temp = getValue(this[i], lambda);
            if (temp > max) {
                max = temp;
                result = this[i];
            }
        }
        return result;
    };

    Array.prototype.min = function (lambda) {
        let result = null;
        if (this.length == 0)
            return result;
        let min = getValue(this[0], lambda);
        result = this[0];
        for (let i = 1; i < this.length; i++) {
            let temp = getValue(this[i], lambda);
            if (temp < min) {
                min = temp;
                result = this[i];
            }
        }
        return result;
    };

    Array.prototype.Contains = function (lambda) {
        return this.first(lambda) != null;
    };

    Array.prototype.remove = function (item) {
        const ndx = this.indexOf(item);
        if (ndx >= 0) {
            this.splice(ndx, 1);
        }
    };

    Array.prototype.Remove = function (lambda) {
        let delectCount = 0;
        for (let i = 0; i < this.length; i++) {
            if (lambda(this[i])) {
                this.splice(i, 1);
                delectCount++;
                i--;
            }
        }
        return delectCount;
    };


    Array.prototype.clear = function () {
        let cnt = this.length;
        for (let i = 0; i < cnt; i++) {
            this.pop();
        }
    };

    Array.prototype.select = function (lambda) {
        return this.map(lambda);
    };

    Array.prototype.where = function (lambda) {
        return this.filter(lambda);
    };

    Array.prototype.count = function (lambda) {
        if (!lambda) return this.length;
        return this.where(lambda).length;
    };

    Array.prototype.sum = function (lambda) {
        let sum = 0;
        let cnt = this.length;
        if (!lambda) {
            for (let i = 0; i < cnt; i++) {
                sum += this[i];
            }
        } else {
            for (let i = 0; i < cnt; i++) {
                sum += getValue(this[i], lambda)
            }
        }
        return sum;
    };

    Array.prototype.toDictionary = function (lambda) {
        let obj = {};
        for (var x of this) {
            obj[lambda(x)] = x;
        }
        return obj;
    };

    Array.prototype.clone = function () {
        return this.slice(0);
    };

    Array.prototype.Shuffle = function () {
        for (let i = 0; i < this.length; i++) {
            let randIdx = random(0, this.length);
            //当前元素与随机一个位置元素交换位置
            var temp = this[i];
            this[i] = this[randIdx];
            this[randIdx] = temp;
        }
    };

    Array.prototype.shuffle = function () {
        let newArr = this.clone();
        newArr.Shuffle();
        return newArr;
    };

    Array.prototype.SortAsc = function (lambda) {
        this.sort((a, b) => getValue(a, lambda) - getValue(b, lambda));
    };

    Array.prototype.SortDesc = function (lambda) {
        this.sort((a, b) => getValue(b, lambda) - getValue(a, lambda));
    };

    Array.prototype.sortAsc = function (lambda) {
        let newArr = this.clone();
        newArr.SortAsc(lambda);
        return newArr;
    };

    Array.prototype.sortDesc = function (lambda) {
        let newArr = this.clone();
        newArr.SortDesc(lambda);
        return newArr;
    };
}

(function () {
    initExtensions();
}());

export default undefined;