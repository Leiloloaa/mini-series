/*
 * @Author: Stone
 * @Date: 2022-04-14 18:05:49
 * @LastEditors: Stone
 * @LastEditTime: 2022-04-15 17:17:12
 */

// 深克隆
class DeepClone {
    cloneVal = null;
    constructor() {}
    clone(target, targetMap = new WeakMap()) {
        let type = this.getType(target); //当是引用类型的时候先拿到其确定的类型
        if (this.isObject(target)) {
            switch (type) {
                case 'date': //日期类型重新new一次传入之前的值，date实例化本身结果不变
                    return new Date(target);
                    break;
                case 'regexp': //正则类型直接new一个新的正则传入source和flags即可
                    console.log(target.source, target.flags);
                    return new RegExp(target.source, target.flags);
                    break;
                case 'function': //如果是函数类型就直接通过function包裹返回一个新的函数，并且改变this指向
                    return function() {
                        return target.call(this, ...arguments)
                    }
                    break;
                default:
                    this.cloneVal = Array.isArray(target) ? [] : {};
                    if (targetMap.has(target)) return targetMap.get(target)
                    targetMap.set(target, this.cloneVal)
                    for (let key in target) {
                        if (target.hasOwnProperty(key)) { //判断是不是自身的key
                            this.cloneVal[key] = new DeepClone().clone(target[key], targetMap);
                        }
                    }
                    return this.cloneVal;
            }
        } else {
            return target; //当是基本数据类型的时候直接返回
        }
    };
    /** 判断是否是引用类型 */
    isObject(value) {
        return (typeof value == 'object' || typeof value == 'function') && value != null
    };
    /** 获取类型 */
    getType(value) {
        var s = Object.prototype.toString.call(value);
        // return s.match(/\[object (.*?)\]/)[1].toLowerCase();
        return s.slice(8, -1).toLowerCase();
    };
}

let obj1 = {
    name: 1,
    age: 2
}

let obj2 = new DeepClone().clone(obj1)
    // console.log(obj2);

// cb 是 callback 的简写
// 内部的一些变量加一个 _ 标识
// 不要使用箭头函数，箭头函数没有 arguments

// 实现 forEach
Array.prototype.myForEach = function(cb) {
    var _arr = this // 保存 this 实例，一般是数组调用此方法，所以 this 指向数组
    var _len = _arr.length
    var _arg2 = arguments[1] || window // 第二个参数用户没传就指向 window

    // 循环调用 cb
    for (var i = 0; i < _len; i++) {
        cb.apply(_arg2, [_arr[i], i, _arr])
    }
}

// 实现 map
Array.prototype.myMap = function(cb) {
    var _arr = this
    var _len = _arr.length
    var _arg2 = arguments[1] || window

    // === map 返回一个新的数组 ===
    var _newArr = []
    var _item // 需要深克隆
    var _res // 每一项的返回值 push 到新的数组里面去

    for (var i = 0; i < _len; i++) {
        _item = new DeepClone().clone(_arr[i])
        _res = cb.apply(_arg2, [_item, i, _arr])

        // map 里面一定要写 return
        _res && _newArr.push(_res)
    }

    return _newArr
}

// 实现 reduce
Array.prototype.myReduce = function(cb) {

}

Array.prototype.myReduceRight = function(cb) {

}