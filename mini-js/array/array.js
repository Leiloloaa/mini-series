/*
 * @Author: Stone
 * @Date: 2022-04-14 17:30:21
 * @LastEditors: Stone
 * @LastEditTime: 2022-04-15 17:18:16
 */
require('./my-array.js');

// 原生数组的遍历方法
// for、forEach、map、filter、every、some、reduce、reduceRight、for..of、find(返回通过测试的数组中第一个元素的值)、findIndex(返回通过测试的数组中第一个元素的索引)

// 返回一个新数组：
// filter(过滤，通过测试创建一个满足测试条件的数组，然后返回这个数组)
// map(映射集合，数组中的每一个元素都要执行这个函数，然后把结果放在一个新的数组中，不会改变原数组)

// 返回 boolean 值：
// every(检测每一项是否都满足条件，都满足返回 true)
// some(检测数组，只有有一项满足就返回true)

let arr = [{ name: 'zs', age: 18 }, { name: 'ls', age: 23 }]
let obj = {
    name: 'stone',
    age: 25
}

// forEach
// arr.forEach(function(item, index, arry) {
//     console.log(this.name);
//     console.log(item);
// }, obj)

// arr.myForEach(function(item, index, arry) {
//     console.log(this.name);
//     console.log(item);
// }, obj)

// map
// var newArr = arr.map(function(item, index, arr) {
//     item.age += 10
//     return item
// })

// var newArr1 = arr.myMap(function(item, index, arr) {
//     item.age += 10
//     return item
// }, obj)

// reduce、reduceRight 累加器
var initialValue = []

var i = 0

// reduce 是累加器
// var newArr = arr.reduce(function(prev, item, index, arr) {
//     console.log(prev);
//     prev.push(item)
//     return prev
// }, initialValue)


// reduceRight 倒序累加
var newArr1 = arr.reduceRight(function(prev, item, index, arr) {
    prev.push(item)
    return prev
}, initialValue)

console.log(newArr1);