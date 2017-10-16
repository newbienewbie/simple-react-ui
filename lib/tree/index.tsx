import * as React from 'react';

export interface TreeProps{
    tree: Array<any>;
    onClick: (string)=>any;
}

export interface TreeState{
    currentActiveId:Number;
}


export class Tree extends React.Component<TreeProps,TreeState>{

    constructor(props:TreeProps){
        super(props);
        this.state={
            /** 当前选择的节点 */
            currentActiveId:null, 
        };
    }
    
    static defaultProps:TreeProps;


    _toDOM(tree){
        return(<ul className="tree">
            {tree.map(i=>{
                return (<li key={i.value.id} data-x={i.value.id}> 
                    <a className={this.state.currentActiveId==i.value.id?"active":""}
                        onClick={(e)=>{
                            e.preventDefault();
                            e.stopPropagation();
                            this.setState({currentActiveId:i.value.id},()=>{
                                this.props.onClick(i.value.id);
                            });
                            return false;
                        }}
                    >
                        {i.value.name}
                    </a>
                    {this._toDOM(i.children)}
                </li>);
            })}
        </ul>);
    }

    render() {
        return this._toDOM(this.props.tree);
    }
}

Tree.defaultProps={
    tree:[],
    onClick:(string)=>{},
}

export default Tree;