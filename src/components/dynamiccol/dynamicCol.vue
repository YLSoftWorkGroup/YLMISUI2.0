
<template>
    <div class="yl-dynamicCol">
        <el-checkbox-group v-model="checkList">
            <el-checkbox :label="i.text" v-for="(i,index) in options.list" :key="index" @change="_change"></el-checkbox>
        </el-checkbox-group>
  </div>
</template>

<script type="text/babel">
export default {
    data(){
        return {
            checkList:[]
        }
    },
    props:{
        options:{
            type:Object,
            default:function(){
                return {
                    list:[]
                }
            }
        },
        value:[String],
    },
    methods:{
        _change(e){
           let result='';
           //返回选中对应name
             this.options.list.map(i=>{
                  this.checkList.map(data=>{
                    if(i.text===data){
                        result=result+'|'+i.name;
                    }
               })
           })
           result=result.substring(1,result.length)
           this.$emit('input',result);
           this.$emit('change',result);
        },
        getcheckList(){
            this.value.split('|').map(data=>{
                 this.options.list.map(i=>{
                    if(i.name===data){
                       this.checkList.push(i.text);
                    }
               })
            })
        }
    },
    mounted(){
        this.getcheckList();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.yl-dynamicCol
    box-sizing border-box
    border 1px solid #ddd
    padding 2px
    .title
        display inline-block
</style>