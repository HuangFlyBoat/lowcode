// 编辑区
import { computed, defineComponent, inject,ref } from "vue";
import './editor.scss'
import EditorBlock from './editor-block'
import { UPDATE_MODEL_EVENT } from "element-plus";

export default defineComponent({
    props: {
        modelValue: { type : Object } 
    },
    emits:[UPDATE_MODEL_EVENT]
    setup(props){
        //计算属性，将其转换为自己的属性，无需通过props.的方式获取
        const data = computed({
            get(){
                return props.modelValue;
            },
            set(newValue){

            }
        });

        //加括号的函数体返回对象字面量表达式
        const containerStyles = computed(()=>({
            width: data.value.container.width + 'px',
            height: data.value.container.height + 'px'
        }))
        
        const config = inject('config')

        const containerRef = ref(null);
        let currentComponent = null
        const dragenter = (e)=>{
            e.dataTransfer.dropEffect = 'move';
        }
        const dragover = (e)=>{
            e.preventDefault();
        }
        const dragleave = (e)=>{
            e.dataTransfer.dropEffect = 'none';
        }
        const drop = (e)=>{
            //获取位置
            // console.log(currentComponent);
            
            let blocks = data.value.blocks; //拿到内部已经渲染的组件
            data.value={...data.value,blocks:[
                ...blocks,
                {
                    top: e.offsetY,
                    left: e.offsetX,
                    zIndex:1,
                    key:currentComponent.key
                }
            ]}
            currentComponent = null;
        }
        const dragStart = (e,component)=>{
            // dragenter 进入元素 添加一个移动的标识
            // dragover 在目标元素中 必须阻止默认行为 否则不能触发drop
            // dragleave 在离开元素的时候 需要增加一个禁用标识
            // drop 松手时，根据拖拽的组件添加
            // console.log(containerRef.value)
            
            containerRef.value.addEventListener('dragenter',dragenter)
            containerRef.value.addEventListener('dragover',dragover)
            containerRef.value.addEventListener('dragleave',dragleave)
            containerRef.value.addEventListener('drop',drop)
            currentComponent = component
        }

    //    根据注册列表，渲染对应的内容 实现拖拽
        return ()=> <div class="editor">
            <div class="editor-left">
                {config.componentList.map(component=>(
                    <div  
                        class="editor-left-item"
                        draggable = "true"
                        onDragstart={e=>dragStart( e , component )}    
                    >
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
                    <div class="editor-container-canvas_content" style={containerStyles.value} ref={containerRef} >
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