
// js原型连添加方法
Number.prototype.getToFixed = function (fractionDigits) { 
    let result=parseFloat(new Decimal(this).toFixed(fractionDigits))
    return parseFloat(result);
    
 } 
 