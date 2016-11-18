import assert from'assert';
//const calculatePaginationInfo =require('../../../dist/pagination/utils/calculate-pagination-info');
import calculatePaginationInfo from'../../../dist/pagination/utils/calculate-pagination-info';


describe("测试 calculate-pagination-info.js" ,function(){



    describe("常规参数",function(){
        
        it("默认情况", function () {
            // 默认总记录10条，每页10条，当前页第1页，页码范围半宽为5
            const info = calculatePaginationInfo();
            assert.equal(info.current, 1, "默认当前页为1");
            assert.equal(info.firstDigit, 1, "默认显示的第一个页码是1");
            assert.equal(info.totalPages, 1, "总页数应该为1");
            assert.equal(info.previous, 1, "上一页应该还是1");
            assert.equal(info.next, 1, "下一页应该还是1");
        });

        it("当前页距离第一页和最后一页都大于半宽",function(){
            const info=calculatePaginationInfo(101,5,5,3);
            assert.equal(info.lastPage,info.totalPages,"最后一页和总页数目应该相等");
            assert.equal(info.current,5,"应该和第三个参数保持一致");
            assert.equal(info.next,5+1,"下一页应该是6");
            assert.equal(info.previous,5-1,"下一页应该是4");

            assert.equal(info.totalPages,21,"总页数应该为21");
            assert.equal(info.firstDigit,2,`示的第一个页码是应该是2`);
            assert.equal(info.lastDigit,8,"显示的最后一个页面应该是8");
        });

        it("当前页距离第一页的距离小于半宽",function(){
            const info=calculatePaginationInfo(101,5,3,3);
            assert.equal(info.lastPage,info.totalPages,"最后一页和总页数目应该相等");
            assert.equal(info.current,3,"应该和第三个参数保持一致");
            assert.equal(info.next,3+1,"下一页应该是4");
            assert.equal(info.previous,3-1,"上一页应该是1");

            assert.equal(info.totalPages,21,"总页数应该为21");
            assert.equal(info.firstDigit,1,`示的第一个页码是应该是1`);
            assert.equal(info.lastDigit,3+3,"显示的最后一个页码应该纠正为最后一页");
        });
        
        it("当前页距离最后一页小于半宽",function(){
            const info=calculatePaginationInfo(101,5,19,3);
            assert.equal(info.lastPage,info.totalPages,"最后一页和总页数目应该相等");
            assert.equal(info.current,19,"应该和第三个参数保持一致");
            assert.equal(info.next,19+1,"下一页应该是20");
            assert.equal(info.previous,19-1,"上一页应该是18");

            assert.equal(info.totalPages,21,"总页数应该为21");
            assert.equal(info.firstDigit,19-3,`示的第一个页码是应该是16`);
            assert.equal(info.lastDigit,info.lastPage,"显示的最后一个页码应该纠正为最后一页");
        });

    });


    describe("非常规参数",function(){

        it('当前页码超过最大页',function(){
            const info = calculatePaginationInfo(100,20,21,4);
            assert.equal(info.firstDigit, 5-4, "默认显示的第一个页码是1");
            assert.equal(info.totalPages, 5, "总页数应该为5");
            assert.equal(info.previous, 4, "上一页应该还是4");
            assert.equal(info.next, 5, "下一页应该还是5");
        });
    });
});