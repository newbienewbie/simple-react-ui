import assert from 'assert';
import Pagination from '../../lib/pagination/pagination.jsx';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import calculatePaginationInfo  from '../../lib/pagination/utils/calculate-pagination-info.js';

describe("测试分页组件",function(){
    

    describe('',function(){
        
         const info=calculatePaginationInfo(123,4,8,5);
         const renderer = TestUtils.createRenderer();
         renderer.render(<Pagination count={123} size={4} current={8} onChange={()=>{}} />);
         const output=renderer.getRenderOutput();

         assert.equal(output.type,"nav","第一个元素应该为<nav>");
         const ul=output.props.children;
         assert.equal(ul.type,"ul");

         const list=ul.props.children;

         it('上页',function(){
            const prevPage=list[0];
            assert.equal(prevPage.type,'li');
            const a=prevPage.props.children;
            assert.equal(a.type,'a');
            const content=a.props.children.props.children;
            assert.equal(content.toString(),"« ");
         });

         it('下页',function(){
            const nextPage=list[list.length-1];
            assert.equal(nextPage.type,'li');
            const a=nextPage.props.children;
            assert.equal(a.type,'a');
            assert.equal(a.props.children.props.children,"» ");
         });

         it('第1个显示页码直至最后1个显示页码 ',function(){
            const sublist=list[1];
            const array=[];
            sublist.forEach((d,i)=>{
                assert.equal(d.type,'li');
                const a=d.props.children;
                assert.equal(a.type,'a');
                array.push(parseInt(a.props.children.toString()));
            });
            assert.equal(info.firstDigit,array[0],"第一个页码应该相等");
            assert.equal(info.lastDigit,array[array.length-1],"最后1个页码应该相等");
         });

    });

});
