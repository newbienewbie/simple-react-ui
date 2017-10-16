import * as React from  'react';

declare var UE: any;

export interface UEditorProps{
    id: string;
    height: number;   
    width: number;    
    initialValue:string;
    uconfigSrc: string;
    ueditorSrc: string;
    /**
     * 用来接收父组件设置的值
     */
    value?:string;
    afterInit?:(ue:any)=>void;
    onChange?:(content)=>void;
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
        initialValue:'',
        uconfigSrc:"/static/ueditor/ueditor.config.js",
        ueditorSrc:"/static/ueditor/ueditor.all.min.js",
        afterInit:(ue:any)=>{},
        onChange:content=>{},
    };


    componentWillReceiveProps(nextProps:UEditorProps){
        if(UE && UE.getEditor){
            if(nextProps.value!=this.props.value){
                let ue = UE.getEditor(this.props.id, {
                    initialFrameWidth: this.props.width,
                    initialFrameHeight: this.props.height,
                });
                ue.setContent(nextProps.value);
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
        const {id,width,height,initialValue,afterInit,onChange}=this.props;
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
                    ue.setContent(initialValue);
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
                console.log("there's no UE object yet. Waitting 30ms ...",err);
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
        return (<script id={this.props.id} type="text/plain">
        </script>);
    }

}




export default UEditor; 