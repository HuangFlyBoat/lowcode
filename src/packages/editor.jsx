import { computed, defineComponent, inject } from "vue";
import './editor.scss'
import EditorBlock from './editor-block'

export default defineComponent({
    props: {
        modelValue: { type : Object } 
    },
    setup(props){
        //计算属性，将其转换为自己的属性，无需通过props.的方式获取
        const data = computed({
            get(){
                return props.modelValue;
            }
        });

        //加括号的函数体返回对象字面量表达式
        const containerStyles = computed(()=>({
            width: data.value.container.width + 'px',
            height: data.value.container.height + 'px'
        }))
        
        const config = inject('config')
    //    根据注册列表，渲染对应的内容
        return ()=> <div class="editor">
            <div class="editor-left">
                {config.componentList.map(component=>(
                    <div class="editor-left-item">
                        <span>{component.label}</span>
                        <div>{component.preview()}</div>
                    </div>
                ))}
                
            </div>
            <div class="editor-top">菜单栏</div>
            <div class="editor-right">属性区</div>
            <div class="editor-container">
                {/* 负责产生滚动条 */}
                <div class="editor-container-canvas">
                    {/* 产生内容区域 */}
                    <div class="editor-container-canvas_content" style={containerStyles.value} >
                        {
                            (data.value.blocks.map(block=>(
                                <EditorBlock block={block}> </EditorBlock>
                            )))
                        }
                    </div>
                </div>
            </div>
        </div>
    }
})