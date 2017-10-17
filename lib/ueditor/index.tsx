import * as React from  'react';

declare var UE: any;

export interface UEditorProps{
    /**
     * 唯一标识符
     */
    id: string;
    /**
     * 编辑器高度
     */
    height: number;   
    /**
     * 编辑器宽度
     */
    width: number;    
    /**
     * 脚本 uconfig.js 的src
     */
    uconfigSrc: string;
    /**
     * 脚本 ueditor.js 的src
     */
    ueditorSrc: string;
    /**
     * 表示在非受控模式下，为编辑器设置初始值。
     * 不能和 value 同时起用！
     */
    initialContent?:string;
    /**
     * 表示在受控模式下，用来接收父组件设置的值
     */
    value?:string;
    /**
     * 类似于原生React的ref回调
     */
    afterInit?:(ue:any)=>void;
    /**
     * 当编辑器内容变化候自动触发
     */
    onChange?:(content)=>void;
}



function fixControlledValue(value){
    if (typeof value === 'undefined' || value === null) {
        return '';
    }
    return value;
}
  

/**
 * 百度UEditor的React封装
 */
export class UEditor extends React.Component<UEditorProps,any>{

    constructor(props:UEditorProps){
        super(props);
    }

    static defaultProps:UEditorProps={
        id:'ueditorcontainer',
        height:600,    // 注意这里只能是数字，不可有单位
        width:600,     // 注意这里只能是数字，不可有单位
        uconfigSrc:"/static/ueditor/ueditor.config.js",
        ueditorSrc:"/static/ueditor/ueditor.all.min.js",
        afterInit:(ue:any)=>{},
        onChange:content=>{},
    };


    /**
     * 
     * @param nextProps 
     */
    componentWillReceiveProps(nextProps:UEditorProps){
        if(UE && UE.getEditor){
            // 只有在受控模式下，才会试图同步编辑器的值
            if( 'value' in nextProps){
                const nextValue=fixControlledValue(nextProps.value);
                const thisValue=fixControlledValue(this.props.value);
                // 如果下一个value值和现在的value值相同，则不再同步。
                if(nextValue == thisValue){
                    return;
                }
                let ue = UE.getEditor(this.props.id, {
                    initialFrameWidth: this.props.width,
                    initialFrameHeight: this.props.height,
                });
                ue.setContent(nextValue);
            }
        }else{
            console.log(`error happpens: 试图设置value属性，但是UE.getEditor不可用`);
        }
    }

    componentWillMount(){
        if(typeof UE !='undefined' && !!UE.getEditor && !!UE.delEditor){
            // 如果UE已经是全局变量了，则说明已经加载了UEditor相应的<script>
            return;
        }else{
            let scriptConfig:any=document.querySelector(`script[src='${this.props.uconfigSrc}']`);
            if(!scriptConfig){
                scriptConfig = document.createElement("script");
                scriptConfig.src = this.props.uconfigSrc;
                document.body.appendChild(scriptConfig);
            }
            let scriptEditor:any=document.querySelector(`script[src='${this.props.ueditorSrc}']`);
            if(!scriptEditor){
                scriptEditor= document.createElement("script");
                scriptEditor.src = this.props.ueditorSrc;
                document.body.appendChild(scriptEditor);
            }
        }
    }

    componentDidMount(){
        let {id,width,height,initialContent,value,afterInit,onChange}=this.props;
        if('value' in this.props){
            value=fixControlledValue(value);
            initialContent=value;    
        }else{
            initialContent=fixControlledValue(initialContent);
        }
        function timeoutPromise(timeout){
            return new Promise(function(resolve,reject){
                setTimeout(function() {
                    resolve();
                }, timeout);
            });
        }
        function waitUntil(){
            return new Promise(function(resolve,reject){
                let ue = UE.getEditor(id, {
                    initialFrameWidth: width,
                    initialFrameHeight:height,
                });
                ue.setDisabled();
                ue.ready(function(){
                    ue.setContent(initialContent);
                    ue.setEnabled();
                    // 触发 afterInit() 回调
                    afterInit(ue);
                    // 监听UE的 contentChange 事件
                    ue.addListener( 'contentChange', function( type ) {
                        const content=ue.getContent();
                        // 触发 onChange()  回调
                        onChange(content);
                    });
                    resolve(ue);
                });
            }).catch(err=>{
                console.log("the UE has not been ready yet. waitting 30ms ...",err);
                return timeoutPromise(30).then(()=>{
                    return waitUntil();
                });
            });
        }
        return waitUntil();
    }

    componentWillUnmount(){
        UE.delEditor(this.props.id);
        // 不再卸载<script> :
        //     <script type="text/javascript" src="/static/ueditor/ueditor.config.js"></script>
        //     <script type="text/javascript" src="/static/ueditor/ueditor.all.min.js"></script>
    }
    
    render(){
        return (<script id={this.props.id} type="text/plain"></script>);
    }

}




export default UEditor; 