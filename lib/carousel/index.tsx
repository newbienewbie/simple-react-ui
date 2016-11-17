import * as React from "react";
import Item from './item';
import Indicator from './indicator';


export const Carousel=React.createClass({

    getDefaultProps:function(){
        return {
            items: [],
            autoplayInterval:2500,
            style:{},
        };
    },


    getInitialState:function(){
        return {
            items:this.props.items,
            indicators:[],
            activeIndex:0,
            intervalId:undefined,
        };
    },

    calculatePreviousActiveIndex:function(currentActiveIndex){
        let itemsCount=this.props.items.length;

        let previousActiveIndex=currentActiveIndex-1;
        previousActiveIndex=previousActiveIndex<0? 
            itemsCount + previousActiveIndex: 
            previousActiveIndex;
        let index:any=previousActiveIndex % itemsCount;
        // 转换为整数返回
        return parseInt(index);
    },

    calculateNextActiveIndex:function(currentActiveIndex){
        let nextActiveIndex:number=currentActiveIndex+1;
        let itemsCount:number=this.props.items.length;
        let index:any=nextActiveIndex % itemsCount;
        return parseInt(index);
    },

    componentDidMount:function(){
        let activeIndex=this.state.activeIndex;
        let itemsCount=this.state.items.length;
        let intervalId=setInterval(
            ()=>{
                activeIndex= this.calculateNextActiveIndex(activeIndex);
                this.setState( { activeIndex}, );
            },
            this.props.autoplayInterval
        );
        this.setState({intervalId});
    },

    render:function(){
        let state=this.state;
        return ( 
        <div className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
                {this.state.items.map((i,k)=>{
                    return <Indicator key={k} active={state.activeIndex==k} onClick={()=>{
                        this.setState({activeIndex:k});
                    }} />;
                })}
            </ol>

            <div className="carousel-inner" style={this.props.style} >
                {this.state.items.map((i,k)=>{
                    return <Item key={k} 
                        caption={i.caption} 
                        imgAlt={i.imgAlt} 
                        imgSrc={i.imgSrc} 
                        href={i.href}
                        active={state.activeIndex==k}
                    />;
                })}
            </div>

            <a className="left carousel-control" data-slide="prev" onClick={(e)=>{
                e.preventDefault();
                let activeIndex=this.calculatePreviousActiveIndex(this.state.activeIndex);
                this.setState({ activeIndex });
                return false;
            }}>
                <span className="icon-prev" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>
            <a className="right carousel-control" data-slide="next" onClick={(e)=>{
                e.preventDefault();
                let activeIndex=this.calculateNextActiveIndex(this.state.activeIndex);
                this.setState({ activeIndex });
                return false;
            }}>
                <span className="icon-next" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>);
    },
});



export default Carousel;