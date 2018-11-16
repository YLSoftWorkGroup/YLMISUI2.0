<template>
<div>
  <div ref="jsoneditor" class="jsoneditor"></div>
 </div>
</template>

<script>
 import JSONEditor from 'jsoneditor';
 import 'jsoneditor/dist/jsoneditor.css';
    export default {
      name: 'jsoneditor',
      data() {
        return {
            editor:{}
        }
      },
      props: ['value'],
      watch: {
        value(value) {
          const editor_value = this.editor.get();
          if (value !== editor_value) {
             this.editor.setText(this.value);
          }
        }
      },
      mounted() {
        const options = {
           //配置信息
           mode: 'code',
           modes: [ 'code', 'tree', 'form', 'view'], // allowed modes
           onError: function (err) {
               	this.$message.warning(err.toString());
           },
           onChange:function(){
           }
        };
        let json={};
        this.editor= new JSONEditor(this.$refs.jsoneditor, options,json); 
      },
      methods: {
          getValue() {
            return this.editor.getText();
        }
      },
       
    }
</script>

<style scope>
    .jsoneditor {
      width: 100%;
      height: 100%;
    }
</style>
