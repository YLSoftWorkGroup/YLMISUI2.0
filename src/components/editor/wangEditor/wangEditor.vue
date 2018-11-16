<template>
    <div style="text-align:left;background-color:#fff">
        <div id="editorElem" ></div>
        <div class="w-e-text" v-html="editorContent" v-if="isPreView"></div>
    </div>
</template>

<script>
    import {options} from './config.js'
    import wangeEditor from 'wangeditor'
    export default {
      name: 'editor',
      data () {
        return {
          editorContent:''
        }
      },
      props:{
          editorOptions:{
              type:Object,
              default:function(){
                  return {}
              }
          },
          isPreView:{
              type:Boolean,
              default:false
          },
          content:{
              type:String,
              default:''
          },
      },
      methods: {
          setText(content){
              this.editor.txt.html(content)
          }
      },
      computed:{
          editor:{
              get(){
                  return new wangeEditor('#editorElem');
              }
          }
      },
      mounted() {
            const eOptions=Object.assign({},options,this.editorOptions);
            this.editor.customConfig=eOptions;
            this.editor.customConfig.onchange = (html) => {
                this.editorContent = html;
                this.$emit('onchange',this.editorContent);
            };
            this.editor.create()
            this.editor.txt.html(this.content)
        }
    }
</script>

<style scope>
</style>