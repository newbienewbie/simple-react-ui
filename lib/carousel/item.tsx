import * as React from 'react';


export interface ItemProps{
    href:string;
    imgSrc:string;
    imgAlt:string;
    caption:string;
    active:boolean;
}

/**
 * Carousel 的分项 Item
 */
export class Item extends React.Component<ItemProps,any>{

    static defaultProps={
        href:'#',
        imgSrc:"#",
        imgAlt:"#",
        caption:"#",
        active:false,
    };

    render(){
        return (
        <div className={`item ${this.props.active?"active":""} `} style={{
            width:'100%',height:'100%',
        }}>
            <a href={this.props.href}>
                <img src={this.props.imgSrc} alt={this.props.imgAlt} style={{
                    width:'100%',height:'100%',
                }}/>
                <div className="carousel-caption">
                    {this.props.caption}
                </div>
            </a>
        </div>);
    }
};



export default Item;