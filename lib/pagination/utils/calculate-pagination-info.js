
/**
 * 用于计算页码信息的帮助函数
 */
function calculatePaginationInfo(totalRecords=10,pageSize=10,currentPage=1,semiBandWidth=5){

    let totalPages=Math.ceil(totalRecords/pageSize);
    let firstPage=1;
    let lastPage=totalPages;

    currentPage= currentPage<firstPage ? firstPage : currentPage;
    currentPage= currentPage>lastPage  ? lastPage  : currentPage;

    let previousPage=currentPage-1;
    let nextPage=currentPage+1;
    previousPage=previousPage>0?previousPage:1;
    nextPage=nextPage>totalPages?totalPages:nextPage;

    let firstDigit=currentPage-semiBandWidth;
    firstDigit=firstDigit>0?firstDigit:1;
    let lastDigit=currentPage+semiBandWidth; 
    lastDigit=lastDigit>lastPage?lastPage:lastDigit;

    return {
        totalPages:totalPages,
        current:currentPage,
        pageSize:pageSize,
        semiBandWidth:semiBandWidth,
        firstPage:1,
        lastPage:lastPage,
        previous:previousPage,
        next:nextPage,
        firstDigit:firstDigit,
        lastDigit:lastDigit,
    };
};


export default calculatePaginationInfo;