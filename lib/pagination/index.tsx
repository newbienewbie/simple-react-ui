import * as React from 'react';
import calculatePaginationInfo from './utils/calculate-pagination-info';


interface PaginationProps{
    count:number;
    size:number;
    current:number;
    semiBandWidth:number;
}


export class Pagination extends React.Component<any,any> {

    static defaultProps={
        /**
         * 总的记录数目
         */
        count: 50,
        /**
         * 每页显示的记录数目
         */
        size: 10,

        /**
         * 当前第几页
         */
        current: 1,

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
        let _info = calculatePaginationInfo(this.props.count,this.props.size,this.props.current,this.props.semiBandWidth);
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
                        <span >&laquo; </span>
                    </a>
                </li>
                { array.map(i => {
                    return <li key={i} onClick={(e) => this._genOnClick(e, i)(e) } ><a href={""+{i}}>{i}</a></li>;
                }) }
                <li>
                    <a href="#" onClick={ (e) => this._genOnClick(e, _info.lastDigit)(e) } >
                        <span >&raquo; </span>
                    </a>
                </li>
            </ul>
        </nav>);

    }
};




export default Pagination;