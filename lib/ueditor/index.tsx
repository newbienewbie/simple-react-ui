import * as React from  'react';

declare var UE: any;

export interface UEditorProps{
    id: string;
    name: string;
    height: number;   
    width: number;    
    initialContent:string;
    uconfigSrc: string;
    ueditorSrc: string;
}



/**
 * 百度UEditor的React封装
 */
export class UEditor extends React.Component<UEditorProps,any>{

    static defaultProps:UEditorProps={
        id:'ueditorcontainer',
        name:'uecontent',
        height:600,    // 注意这里只能是数字，不可有单位
        width:600,     // 注意这里只能是数字，不可有单位
        initialContent:'',
        uconfigSrc:"/static/ueditor/ueditor.config.js",
        ueditorSrc:"/static/ueditor/ueditor.all.min.js",
    };

    componentWillMount(){
        if(typeof UE !='undefined'){
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
        function waitUntil(props){
            try{
                let ue = UE.getEditor(props.id, {
                    initialFrameWidth: props.width,
                    initialFrameHeight: props.height,
                });
            }catch(err){
                console.log('暂时无UE对象可用，等待500ms',err);
                setTimeout( ()=>{waitUntil(props)}, 500);
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
        let initialContent=Object.assign(this.props.initialContent);
        return (<script 
            id={this.props.id} name={this.props.name} 
            dangerouslySetInnerHTML={{__html:initialContent}}
            type="text/plain"></script>);
    }

}




export default UEditor; 