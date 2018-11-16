<template>
  <div class="content">
             <table class="yltable" style="width:100%">
                    <thead height="25px" style="background-color:#58B7FF">
                        <tr>
                            <th width="100px">
                             审批阶段
                            </th>
                            <th width="85px">
                               操作人
                            </th> 
                            <th width="85px">
                               操作时间
                            </th>
                            <th  width="60px">
                               状态
                            </th>
                            <th >
                               审批意见
                            </th>
                        </tr>
                    </thead>
                    <tbody v-if="stateList.length>0">
                            <tr   v-for="(item,index) in stateList"  :key="index">
                                <td> <span>{{item.stateDesc}}</span>  </td>
                                <td><span>{{item.dealUserName}}</span>  </td>
                                <td><span>{{item.dealTime}}</span>  </td>
                                <td><span>{{item.stateText}}</span>  </td>
                                <td style="white-space:normal;word-break:break-all;"><span>{{item.dealOptions}}</span>  </td>
                            </tr> 
                     </tbody>
                     <tbody v-else>       
                            <tr>
                                    <td colspan="5"><span>暂无审批意见</span>  </td>
                            </tr>
                    </tbody>
             </table>     
      </div>
</div>
</template>

<script type="text/babel">
import fetch from  '@/api/fetch';
export default {
    data(){
        return{
            stateList:[]
        }      
    },
    props:{
        orderId:{
            type:String,
            default:'',
        }
    },
    methods:{
         _getApproveInfo(){  
             let Params={},inputArr=[];
             Params.sorting="DealTime asc";
             inputArr.push({
                 dataField:'OrderId',
                 op:'EQ',
                 dataValue:this.orderId,
             });
             Params.queryConditionItem=inputArr;
            fetch({ 
                url: '/api/services/app/approveFlow/GetApproveFlows',
                method: 'post',
                data:Params
            }).then((data)=>{
                if(data.success){
                   this.stateList=data.result;
                }
            })
        },
    },
    components:{
    },
     mounted(){
         this._getApproveInfo();
    },
     watch:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.content
    width 100%

</style>
