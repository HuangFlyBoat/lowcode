import { computed, defineComponent, inject } from "vue";

export default defineComponent({
    props:{
        block:{ type : Object }
    },
    setup(props){
        const blockStyles = computed(()=>({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`,
            zIndex: `${props.block.zIndex}`
        }));
        //在里面注入写的配置
        const config = inject('config');
        // console.log(config);
        return ()=>{
            //通过block的key获取对应的组件
            const component = config.componentMap[props.block.key];
            //获取render函数
            const RenderComponent = component.render();
            return <div class="editor-block" style={blockStyles.value}>
                {RenderComponent}
            </div>
        }
    }
})

