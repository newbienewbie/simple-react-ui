import * as React from  'react';

declare var UE: any;

export interface UEditorProps{
    id: string;
    height: number;   
    width: number;    
    initialValue:string;
    uconfigSrc: string;
    ueditorSrc: string;
    afterInit:(ue:any)=>void;
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
        afterInit:(ue:any)=>{},
        uconfigSrc:"/static/ueditor/ueditor.config.js",
        ueditorSrc:"/static/ueditor/ueditor.all.min.js",
    };

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
        function waitUntil(props:UEditorProps){
            try{
                let ue = UE.getEditor(props.id, {
                    initialFrameWidth: props.width,
                    initialFrameHeight: props.height,
                });
                ue.setDisabled();
                ue.ready(function(){
                    ue.setContent(props.initialValue);
                    ue.setEnabled();
                    props.afterInit(ue);
                });
            }catch(err){
                console.log('暂时无UE对象可用，等待50ms',err);
                setTimeout( ()=>{waitUntil(props)}, 50);
            }
        }
        waitUntil(this.props);
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