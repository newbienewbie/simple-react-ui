import * as React from 'react';


export interface IndicatorProps{
    active:boolean;
    onClick:()=>void;
}


/**
 * Carousel 的分项的指示器 Indicator
 */
export class Indicator extends React.Component<IndicatorProps,any>{

    static defaultProps={
        active:false,
        onClick:()=>{}
    };

    render(){
        return (
            <li className={this.props.active?'active':''} onClick={this.props.onClick}/>
        );
    }

}



export default Indicator;