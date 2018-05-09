import * as React from  'react';
import {throttle} from "../utils/throttle";

declare var UE: any;
declare var window: any;

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
     * 如果提供该属性，则表示是在受控模式下使用，由父组件设置
     */
    value?:string;

    /**
     * ContentChange的 节流时间间隔
     */
    contentChangeThrottleTime : number;
    /**
     * 类似于原生React的ref回调
     */
    afterInit?:(ue:any)=>void;
    /**
     * 当编辑器内容变化之后会自动触发的钩子函数。
     * 可选。
     * 如果是在受控模式下使用，且当本组件的props.value是由父组件的状态渲染，要避免去改变父组件状态形成事件循环风暴
     */
    onContentChangeCompleted?:(content)=>void;
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
        this.state={
            ueditorEventRegistered:false,
        };
        this._getUEditorAsync=this._getUEditorAsync.bind(this);
        this._getUEditorSync=this._getUEditorSync.bind(this);
        this._initUEditor=this._initUEditor.bind(this);
        this._waitUntilUEditorloaded=this._waitUntilUEditorloaded.bind(this);
    }

    static defaultProps:UEditorProps={
        id:'ueditorcontainer',
        height:600,    // 注意这里只能是数字，不可有单位
        width:600,     // 注意这里只能是数字，不可有单位
        uconfigSrc:"/static/ueditor/ueditor.config.js",
        ueditorSrc:"/static/ueditor/ueditor.all.min.js",
        contentChangeThrottleTime: 100,
        afterInit:(ue:any)=>{},
        onContentChangeCompleted:content=>{},
    };

    _getUEditorAsync(){
        this._createScript();
        if(UE){}
        let {id,width,height}=this.props;
        return new Promise((resolve,reject)=>{
            const ue=UE.getEditor(id, {
                initialFrameWidth: width,
                initialFrameHeight:height,
            });
            resolve(ue);
        }).catch(e=>{
            console.log(`ue not yet ready...`,e);
            return this._timeoutPromise(300)
                .then(this._getUEditorAsync()) ;
        });
    }

    _getUEditorSync(){
        let {id,width,height}=this.props;
        const ue=UE.getEditor(id, {
            initialFrameWidth: width,
            initialFrameHeight:height,
        });
        return ue;
    }

    _onContentChange(type) {
        const ue=this._getUEditorSync();
        const content = ue.getContent();
        // 触发 onContentChangeCompleted()  回调
        this.props.onContentChangeCompleted(content);
        // 重置光标焦点——修复UEditor#setContent()光标乱飞问题
        const activeElement = document.activeElement;
        if (activeElement
            && activeElement.tagName.trim().toLowerCase() == "iframe"
            && activeElement.id.trim().toLocaleLowerCase() == 'ueditor_0'
        ) {
            ue.focus();
        } else {
            const element = window.SIMEPLE_REACT_UI_UEDITOR_FOCUS_ELEMENT;
            if (element && element.focus) {
                element.focus();
            }
        }
    }

    _initUEditor(){
        const ue=this._getUEditorSync();
        if(this.state.ueditorEventRegistered){
            return Promise.resolve(ue);
        }else{
            const onChange=this.props.onContentChangeCompleted;
            return new Promise((resolve,reject)=>{
                ue.addListener('beforeSetContent',function(){
                    window.SIMEPLE_REACT_UI_UEDITOR_FOCUS_ELEMENT=document.activeElement;
                    console.log('before',window.SIMEPLE_REACT_UI_UEDITOR_FOCUS_ELEMENT);
                }) ;

                // 100ms内最多调用一次contentChange
                let _onContentChange=throttle(this._onContentChange.bind(this),this.props.contentChangeThrottleTime,this);
                ue.addListener( 'contentChange', _onContentChange);

                ue.addListener('afterSetContent',function(){
                    const element=window.SIMEPLE_REACT_UI_UEDITOR_FOCUS_ELEMENT;
                    if(element && element.focus){ element.focus()}
                });
                this.setState({ueditorEventRegistered:true},()=>{
                    resolve(ue);
                });
            });
        }

    }

    _timeoutPromise(timeout){
        return new Promise(function(resolve,reject){
            setTimeout(resolve, timeout);
        });
    }

    _waitUntilUEditorloaded(){
        const _initUEditor=this._initUEditor;
        let {id,width,height,onContentChangeCompleted}=this.props;
        const timeoutPromise=this._timeoutPromise;
        function waitUntil(){
            return new Promise((resolve,reject)=>{
                let ue = UE.getEditor(id, {
                    initialFrameWidth: width,
                    initialFrameHeight:height,
                });
                ue.setDisabled();
                ue.ready(()=>{ 
                    ue.setEnabled(); 
                    ue.blur();
                    _initUEditor().then(ue=>resolve(ue));
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

    _createScript(){
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

    /**
     * 
     * @param nextProps 
     */
    componentWillReceiveProps(nextProps:UEditorProps){
        return this._getUEditorAsync()
            .then(ue=>{
                // 只有在受控模式下，才会试图同步编辑器的值
                if( 'value' in nextProps){
                    const nextValue=fixControlledValue(nextProps.value);
                    // const thisValue=fixControlledValue(this.props.value);
                    // todo : 不知道为啥 nextValue ==== this.props.value 恒成立，所以改成ue.getContent()
                    const thisValue=fixControlledValue(ue.getContent());
                    // 如果下一个value值和现在的value值相同，则不再同步。
                    if(nextValue !== thisValue){
                        ue.setContent(nextValue,false,true); // 不追加，不触发选区变化
                        return;
                    }
                }
            });
    }

    componentWillMount(){
        return this._createScript();
    }

    componentDidMount(){
        let {id,width,height,initialContent,value,afterInit,onContentChangeCompleted}=this.props;
        if('value' in this.props){
            value=fixControlledValue(value);
            initialContent=value;    
        }else{
            initialContent=fixControlledValue(initialContent);
        }

        return this._waitUntilUEditorloaded()
            .then(ue=>{
                const element:any=document.activeElement;
                ue.setContent(initialContent);
                element.focus();
                // 触发 afterInit() 回调
                afterInit(ue);
            });
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