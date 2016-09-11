import assert from 'assert';
import fill from '../../lib/utils/array-fill-polyfill.js';



describe("测试Array.prototype.fill()的polyfill",function(){

    it("当没有fill,但提供polyfill的情况下，可以达到同样效果",function(){

        // 保存原来原型中的fill，然后置为null
        const origin=Array.prototype.fill;
        Array.prototype.fill=null;

        // 模拟polyfill
        Array.prototype.fill=fill;
        const x=[1,2,3,4].fill(4);
        x.forEach((d,i)=>{
            assert.equal(d,4,`填充失败${d}:${i}`);
        });

        // 恢复原来原型中的fill
        Array.prototype.fill=origin;
    });

});