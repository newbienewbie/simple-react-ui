import * as React from 'react';


export interface DislikeProps{
    fill:any;
    stroke:any;
}


/**
 * Like Icon
 */
export class Dislike extends React.Component<DislikeProps,any>{

    render(){
        return (<svg viewBox="0 0 20 18" width="13" height="16">
            <g>
                <path fill={this.props.fill} stroke={this.props.stroke} d="M.718 7.024c-.718 0-.718.63-.718.63l.996 9.693c0 .703.718.65.718.65h1.45c.916 0 .847-.65.847-.65V7.793c-.09-.88-.853-.79-.846-.79l-2.446.02zm11.727-.05S13.2 5.396 13.6 2.89C13.765.03 11.55-.6 10.565.53c-1.014 1.232 0 2.056-4.45 5.83C5.336 6.965 5 8.01 5 8.997v6.998c-.016 1.104.49 2 1.99 2h7.586c2.097 0 2.86-1.416 2.86-1.416s2.178-5.402 2.346-5.91c1.047-3.516-1.95-3.704-1.95-3.704l-5.387.007z" 
                    transform="scale(1,-1) translate(0,-22)"
                >
                </path>
            </g>
        </svg>);
    }

}


export default Dislike;