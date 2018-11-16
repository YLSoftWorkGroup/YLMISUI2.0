
<template>
 <el-alert
    :title="title"
    :description="description"
    :type="type"
    :showIcon="showIcon"
    :closable="closable"
    :closeText="closeText">
 </el-alert>
</template>

<script type="text/babel">
export default {
    props:{
        title:"",
        description:"",
        type:"",
        showIcon:false,
        closable:false,
        closeText:''
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


