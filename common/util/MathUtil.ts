/**
 * 判断多个数之间 公有0的最小个数
 * @param params 传入的多个数 
 */
function endZeroCount(...params): number {
    let count = Number.MAX_VALUE;
    for (let i = 0; i < params.length; i++) {
        let arr = params[i].toString().split('').reverse();
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            if (Number(arr[i]) == 0) {
                sum++
            } else {
                break;
            }
        }
        count = Math.min(count, sum);
    }
    return count;
}

/**
 * 公共 0 之前的 整数
 * @param count 传进来的整数
 * @param publicCount 公有零 的 个数
 */
function zeroPreviousNumber(count: number, publicCount: number): number {
    let res = 0;
    res = count / Math.pow(10, publicCount);
    return res;
}


/**
 * 返回算式中优先级最高的的运算符的索引
 * @param params eg priorityOperatorIndex('12','+','3','*','6');
 */
function priorityOperatorIndex(params: string[]): number {
    let arr = params.clone();
    getBraceContent(arr, '(', ')');
    console.log(arr)
    getBraceContent(arr, '[', ']');
    if (arr.indexOf('*') > -1 || arr.indexOf('/') > -1) {
        return arr.findIndex((item) => {
            return item == '*' || item == '/';
        });
    }

    if (arr.indexOf('+') > -1 || arr.indexOf('-') > -1) {
        return arr.findIndex((item) => {
            return item == '+' || item == '-';
        });
    }
}

/**
 * 式子字符串转换成数组
 * @param formulaStr 式子字符串
 */
function formulaStringToArray(formulaStr:string):Array<string>{
    let formulaArr = formulaStr.split('');
    let reg = /\d+/;
    let arr:string[] = [];
    let isPreNumbric = false;
    for(let i = 0 ; i < formulaArr.length; i ++){
        let item = formulaArr[i];
        if (reg.test(item)) {
            if(!isPreNumbric){
                arr.push(item);
                isPreNumbric = true;
            }else{
                let str = arr.pop();
                str += item;
                arr.push(str);
            }
        }else{
            arr.push(item);
            isPreNumbric = false;
        }
    }
    return arr;
}

/** 取出括号里边的内容 */
function getBraceContent(arr: Array<string>, start: string, end: string) {
    let idx = arr.indexOf(start);
    if (idx > -1) {
        arr = arr.slice(idx + 1, arr.indexOf(end));
    }
}

export default {
    endZeroCount,
    zeroPreviousNumber,
    priorityOperatorIndex,
    formulaStringToArray
}