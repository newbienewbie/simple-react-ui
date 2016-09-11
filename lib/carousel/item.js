import React from 'react';



/**
 * Carousel 的分项 Item
 */
const Item=(props)=>{
    return (
    <div className={`item ${props.active?"active":""} `} style={{
        width:'100%',height:'100%',
    }}>
        <a href={props.href}>
            <img src={props.imgSrc} alt={props.imgAlt} style={{
                width:'100%',height:'100%',
            }}/>
            <div className="carousel-caption">
                {props.caption}
            </div>
        </a>
    </div>);
};

Item.defaultProps={
    href:"#",
    imgSrc:'#',
    imgAlt:'#',
    caption:'',
    active:false,
};


export default Item;