import React from 'react';
import './utils/array-fill-polyfill.js';
import calculatePaginationInfo from './utils/calculate-pagination-info.js';


const Pagination=(props)=>{
    let _info = calculatePaginationInfo(props.count,props.size,props.current,props.semiBandWidth);
    let array = Array(_info.lastDigit - _info.firstDigit + 1).fill()
        .map((d, k) => {
            return k + _info.firstDigit;
        });
    /**
     * 生成onClick事件处理函数的高阶函数
     */
    const _genOnClick = (e, i) => {
        e.preventDefault();
        const onChange = props.onChange;
        return (e) => {
            onChange(i);
            return false;
        };
    };
    return (<nav>
        <ul className="pagination">
            <li>
                <a href="#" onClick={(e) => _genOnClick(e, _info.firstDigit)() } >
                    <span >&laquo; </span>
                </a>
            </li>
            { array.map(i => {
                return <li key={i} onClick={(e) => _genOnClick(e, i)() } ><a href={i}>{i}</a></li>;
            }) }
            <li>
                <a href="#" onClick={ (e) => _genOnClick(e, _info.lastDigit)() } >
                    <span >&raquo; </span>
                </a>
            </li>
        </ul>
    </nav>);
};

Pagination.defaultProps={
    /**
     * 总的记录数目
     */
    count: 50,
    /**
     * 每页显示的记录数目
     */
    size: 10,

    /**
     * 每页显示的记录数目
     */
    current: 10,

    /**
     * 指的是从当前页码到显示的最大页码或最小页面的距离
     * 比如，当前页码是3，如果semiBandWidth=5,则lastDigit=8
     */
    semiBandWidth: 5,
    /**
     * 当页码改变时触发
     */
    onChange: (page) => { },
};



export default Pagination;