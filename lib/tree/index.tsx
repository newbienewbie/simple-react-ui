import * as React from 'react';

export const Tree=React.createClass({
    
    getDefaultProps:function(){
        return {
            tree:[],
            onClick:(id)=>{}
        };
    },

    getInitialState:function(){
        return {
            /** 当前选择的节点 */
            currentActiveId:null, 
        };
    },

    _toDOM:function(tree){
        return(<ul className="tree">
            {tree.map(i=>{
                return (<li key={i.value.id} data={i.value.id}> 
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
    },

    render:function () {
        return this._toDOM(this.props.tree);
    }
});



export default Tree;