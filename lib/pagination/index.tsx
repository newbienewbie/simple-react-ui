import * as React from 'react';
import calculatePaginationInfo from './utils/calculate-pagination-info';


export interface PaginationProps{
    
    /**
     * 总的记录数目
     */
    total:number;

    /**
     * 每页显示的记录数目
     */
    size:number;

    /**
     * 当前第几页
     */
    current:number;

    /**
     * 指的是从当前页码到显示的最大页码或最小页面的距离
     * 比如，当前页码是3，如果semiBandWidth=5,则lastDigit=8
     */
    semiBandWidth:number;

    /**
     * 当页码改变时触发
     */
    onChange: (page)=>any,
}

/**
 * 分页组件
 */
export class Pagination extends React.Component<PaginationProps,any> {

    static defaultProps:PaginationProps={
        total: 50,
        size: 10,
        current: 1,
        semiBandWidth: 5,
        onChange: (page) =>{ },
    };


    /**
     * 生成onClick事件处理函数的高阶函数
     */
    _genOnClick(e, i){
        e.preventDefault();
        const onChange = this.props.onChange;
        return (e) => {
            onChange(i);
            return false;
        };
    };

    render(){
        let _info = calculatePaginationInfo(this.props.total,this.props.size,this.props.current,this.props.semiBandWidth);
        // 生成一个数组，范围是[firstDigit~lastDigit]
        let array = Array.from(Array(_info.lastDigit - _info.firstDigit + 1), (d, k) => {
            return k + _info.firstDigit;
        });

        return (<nav>
            <ul className="pagination">
                <li>
                    <a href="#" onClick={(e) => {
                        this._genOnClick(e, _info.firstDigit)(e);
                    }} >
                        &laquo;
                    </a>
                </li>
                { array.map(i => {
                    return <li key={i} onClick={(e) => this._genOnClick(e, i)(e) } ><a href={i+''}>{i}</a></li>;
                }) }
                <li>
                    <a href="#" onClick={ (e) => this._genOnClick(e, _info.lastDigit)(e) } >
                        &raquo;
                    </a>
                </li>
            </ul>
        </nav>);

    }
};




export default Pagination;