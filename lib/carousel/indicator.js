import React from 'react';



/**
 * Carousel 的分项的指示器 Indicator
 */
const Indicator=(props)=>{
    return (
        <li className={props.active?'active':''} onClick={props.onClick}/>
    );
};

Indicator.defaultProps={
    active:false,
    onClick:()=>{},
};


export default Indicator;