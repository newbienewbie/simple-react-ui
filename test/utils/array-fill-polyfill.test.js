const assert=require('assert');



describe("测试Array.prototype.fill()的polyfill",function(){

    it("当没有fill,但提供polyfill的情况下，可以达到同样效果",function(){
        const origin=Array.prototype.fill;
        Array.prototype.fill=null;
        require('../../lib/utils/array-fill-polyfill.js');
        const x=[1,2,3,4].fill(4);
        x.forEach((d,i)=>{
            assert.equal(d,4,`填充失败${d}:${i}`);
        });
        Array.prototype.fill=origin;
    });

});