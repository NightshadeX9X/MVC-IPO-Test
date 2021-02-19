import { random } from "./functions.js";
export var ArrayUtil;
(function (ArrayUtil) {
    function randomElement(arr) {
        return arr[random(0, arr.length)];
    }
    ArrayUtil.randomElement = randomElement;
    function limit(array, limit) {
        let copy = [...array];
        /*
            let arr = [1, 2, 3, 4, 5, 6, 7];
            limitArray(arr, 2) --> [1, 2]
        
        */
        for (let i = limit; i < copy.length; i++) {
            copy.splice(i, 1);
        }
        return copy;
    }
    ArrayUtil.limit = limit;
    function last(array) {
        return array[array.length - 1];
    }
    ArrayUtil.last = last;
    function invert(array) {
        const output = [];
        array.forEach((item, index) => {
            output[array.length - index - 1] = item;
        });
        return output;
    }
    ArrayUtil.invert = invert;
})(ArrayUtil || (ArrayUtil = {}));
