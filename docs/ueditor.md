
### 前置步骤：

* 把UEditor相应的文件包放置在浏览器端可以访问的URL路径下，比如，`/static`
* 引入 simple-react-ui 的 UEditor 组件

这样仅仅是配置好前端；后端仍然需要编写代码，可以使用[express-ueditor](https://www.npmjs.com/package/express-ueditor)充当后端

## 如何使用

`UEditor`提供两种模式供用户使用：

### 非受控模式

在非受控模式下，用户主要通过
* `initialContent` 属性来提供初始值
* `afterInit(ue)` 回调函数来与 `UEditor` 互动，其中`ue`参数是`UE.getEditor('id')`返回的编辑器实例。

`afterInit(ue)`在某种程度上类似于原生`React`组件的`ref`回调，我们可以把`ue`实例传递给父组件保存起来，从而可以在父组件中来做任何原生`UEditor`可以做的事儿。比如当某个按钮被点击，调用`this.ue.getContent()`获取当前值。

注意，用户不得指定`value`属性，否则会自动转换为 *受控模式*

### 受控模式

受控模式是更符合`React`理念使用方式。注意， *受控模式* 和 *非受控模式* 不能共存，二者只巨其一。

在受控模式下，用户可以通过
* `value`属性：父组件可以通过`props.value`属性来动态设置编辑器的内容
* `onChange(content)` 可选的事件处理函数，当编辑器的内容发生变化之后可以选择以`onChange(content)`的方式通知父组件。
    * 受控模式下：当父组件改变本组件的`props.value`，或者因为人手工输入内容，导致编辑器内容区发生变化(调用`ue#setContent(content)`)完成之后所触发的事件。
    * 在非受控模式下：其实没必要使用该钩子，因为设定编辑器内容的`ue.setContent()`都是手工调用的。

注意在受控模式下不要指定`props.initialContent`属性——它会在组件加装完成后被`props.value`属性覆盖掉，也就是说，编辑器中实际的初始化内容是`props.value`。

## 示例一：以非受控模式使用

```js
<form id="postAddOrEditForm">
    <input name='title' type='text' placeholder='标题' 
        value={this.state.title||''} 
        onChange={(v)=>{ this.setState({title:v.target.value}); }}
    />

    <textarea required placeholder='摘要' 
        value={this.state.excerpt||''} 
        onChange={(v)=>{ this.setState({excerpt:v.target.value});}} 
    />

    <UEditor id="ueditorContainer" name="content" 
        initialContent={this.props.initialContent} 
        width={800} height={500} 
        afterInit={(ue)=>{
            const id=this.props.id;
            if(!!id){    // 编辑已有文章的表单
                // 获取最新的数据
                fetch(`/post/detail?id=${id}`,{/**/})
                .then(resp=>resp.json())
                .then(info=>{
                    const state=Object.assign({},info);
                    this.setState(state,()=>{
                        ue.setContent(info.content);
                    });
                });
            }else{ 
                // 这是一个用于新增文章的表单
            }
        }} 
    /> 
    <Button onClick={e=>{
        e.preventDefault();
        const ue=this.ue;
        let content=ue.getContent();
        // ... ajax post to server
        return fetch('',{/**/})
            .then(resp=>resp.json())
            .then((info)=>{
                message.info(`创建文章成功！`);
                ue.setContent('');
            });
    }}>提交
    </Button>
</form>
```

## 示例二：以受控模式使用

示例一：
```javascript
class AddOrEditForm extends React.Component{

    render(){
        // 某个编辑或者
        <UEditor id="ueditorContainer" name="content" 
            width={800} height={200}
            afterInit={(ue)=>{
                const id=this.props.id;
                if(!!id){    // 当前是在编辑模式
                    // 获取最新的数据
                    return model.methods.detail(id)
                    .then(info=>{
                        const state=Object.assign({},info);
                        this.setState(state,()=>{
                            ue.setContent(info.description);
                        });
                    });
                }else{ /*当前是新增模式*/ }
            }} 
            value={this.state.description}
            onChange={content=>{
                this.setState({
                    description: content,
                });
            }}
        /> 
    }
}

```

作为受控模式的示例，这里配合 `ant-design`的`Form.create()()` 使用：
```javascript
export class PlainAddOrEditForm extends React.Component{

    constructor(props){
        super(props);
        this.state= {
            title:'',
            categoryId:'',
            featureImageUrl:'#',
            keywords:[
                {id:null,postId:null,tag:''},
            ],
            commentable:true,
        };
    }

    render() {

        const FormItem=Form.Item;
        const {getFieldDecorator,getFieldsError, getFieldError, isFieldTouched,validateFields}=this.props.form;
        const hasFieldError=(fieldname)=>isFieldTouched(fieldname) && getFieldError(fieldname);
        const hasErrors=(fieldsError)=>Object.keys(fieldsError).some(field => fieldsError[field]);

        return (
            <Form onSubmit={e=>{
                e.preventDefault();
                validateFields((err, values) => {
                    if (!err) {
                        console.log(values);
                    }
                });
            }}>
                <FormItem label='标题' validateStatus={hasFieldError('title')} help={hasFieldError('title')||''} >
                {
                    getFieldDecorator('title',{
                        rules:[{required:true,message:'title required'}],
                    })(
                        <Input name='title' type='text' placeholder='标题'/>
                    )
                }
                </FormItem>
            
                <FormItem label='content' validateStatus={hasFieldError('content')} help={hasFieldError('content')||''} >
                {
                    getFieldDecorator('content',{
                        rules:[{required:true,message:'content required'}],
                        initialValue:'<p>测试</p><b>测试</b>'
                    })(
                        <UEditor id="ueditorContainer" 
                            width={800} height={500} 
                            uconfigSrc={"/url/to/uconfig.js"} ueditorSrc={"/url/to/ueditor.js"}
                            afterInit={(ue)=>{ this.ue=ue;}} 
                            onChange={content=>{ console.log(content); }}
                    /> 
                    )
                }
                </FormItem>
  
                <FormItem>
                    <Button htmlType='submit' type="primary" size="large" disabled={hasErrors(getFieldsError())}>Submit</Button>
                </FormItem>
            </Form>
        );
    }
}


export default Form.create()(PlainAddOrEditForm);
```
