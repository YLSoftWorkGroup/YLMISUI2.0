
<template>
<div class="yl-border">
    
</div>
</template>

<script type="text/babel">
export default {
   data(){
       return {
           dataSet:{},
           orgName:''
       }
   },
   methods:{
       getData(){
           let params={   
                        firstKeys:"OrgId",
                        firstValues:"#"+getOutPageConf().reinforcedStore.orgId+"#",
                        procName:"Report_RebarReceiveAndDeliveryAndInventoryAnalyze",
                        procType:0,
                        secondKeys:"",
                        secondOperates:"",
                        secondValues:"",
                       }
            this.forceSqlExcute({
                baseUrl:getClientObj().sysConf.url,
                url:'/api/services/app/sqlExecute/ExecuteSqlAndProcCommand',
                method:'post',
                data:params
            }).then(data=>{
                   this.dataSet=JSON.parse(data).result;
            })
       }
   },
   mounted(){
       this.orgName=getOutPageConf().reinforcedStore.orgName;
       this.getData();
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.yl-border
    color #fff
    height 100%
    width 100%
    background-color #0e5094
    font-size 16px
    padding  40px
    box-sizing border-box
    .head
        padding-top 20px
        padding 0px 10px
        height 60px
        line-height 70px
        background-color rgba(255, 255, 255, 0.2)
        font-size 20px
    .yl-table
        height 100%
        width 100%
        font-size 16px
</style>

