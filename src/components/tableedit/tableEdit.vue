<template>
    <div>
            <yl-onlytable 
                @current-change="_currentChange"
                :configs="tableConfig" 
                :tableData="tableData" 
                :tableloading="mainTableLoading"
                >
                <template :slot="item.name" scope="scope" v-for="(item,index) in tableConfig.solSlotConf" > 
                        <yl-rendertablerowcoms  
                                    :key="index"
                                    :name="item.name"
                                    :option="item"
                                    :model="scope.row"
                                    @sumCount="_sumCount"
                                >
                        </yl-rendertablerowcoms>
                </template>
                <template slot="id" scope="scope"> 
                    <div class="yl-table-icon">  
                        <i class="icon-cancel3"  
                        @click="_delItem(scope.row)"></i>
                    </div>
                </template>
            </yl-onlytable>
            <div v-if="!sumRowConf.disable" class="sum-text">
                <span class="heji-title" ><i class="icon-sigma" ></i>{{sumRowConf.sumText}}</span>
                <span class="heji-title" style="padding-left:10px;" v-for="(item,index) in sumRowConf.items"  :key="index" v-if="item.capitalCol">大写金额：<span class="heji-text" v-text="getdataDX(item.sumval)"></span></span>
                <span style="padding-left:10px;" v-for="(item,index) in sumRowConf.items" :key="index" class="heji-title">{{item.text}}：<span class="heji-text">{{item.sumval}}</span></span>
            </div>
    </div>
</template>
<script type="text/babel">  
import { mapGetters } from 'vuex';
import util from '@/common/js/util'
export default {
    data(){
        return{
             mainTableLoading:false,
        }
    },
    props:{
        tableConfig:{
            type:Object,
            require:true
        },
        mapConfig:{
            type:Object,
            require:true
        },
        tableData:{
            required: false,
                type: Array,
            default: function () {
                return []
            }
        },
        sumRowConf:{
            type:Object,
            require:false
        },
        addRowCount:{
            type:Number,
            require:false,
            default:undefined
        },
        notRepeatFiled:{
            type:String,
            require:false,
            default:''
        }
        
    },
    computed:{
             ...mapGetters([ 'getSelectRows','getType' ]),
             ...mapGetters([ 'getGlobObject1']),
            globConf:{
                    get(){
                        return util.getLocalStorage('SysGlobConf');
                    }
                },
		},
    methods:{
            _sumCount(){
                this.$emit('sumCount')
            },
           _currentChange(val){
                //单选时的方法
                if(val!=null){
                }
            },
            _delItem(row){
                 this.$emit("delItem",row);
            },
            _getTableData(rows){
                if(rows.length>0){
                    rows.map((item,index)=>{
                        let row={},flag='mapconf'+this.getType;
                        this.mapConfig[flag].map((model,index)=>{
                            if(model.isplace){
                                if(model.eventConf===undefined){
                                     row[model.prop]=item[model.selprop];
                                }else{
                                       if(model.eventConf.isOn){
                                            if(model.eventConf.calculate!=undefined){
                                                  row[model.prop]=model.eventConf.calculate(item);
                                            }
                                        }  
                                }
                            }else{
                                row[model.prop]=model.defaultval;
                            }
                        });
                        //附加dataType
                        row.ItemDataType=this.getType;
                        let isSkip=false;
                        if(this.notRepeatFiled!==''){
                                //判断重复
                                this.tableData.map(iitem=>{
                                        if(iitem[this.notRepeatFiled]===row[this.notRepeatFiled]){
                                            isSkip=true;
                                        }
                                })
                        }
                        if(!isSkip){
                            let maxRow=this.addRowCount||this.globConf.tableConf.limitCount;
                            if(maxRow>this.tableData.length){
                                this.tableData.push(row);
                            }else{
                                this.$message({ message: `选材数目不能大于${this.globConf.tableConf.limitCount}条!`, type: 'warning'});
                            }
                        }
                    });
                    this._sumCount();
                }
            },
            getEditData(){
                    return this.tableData;
            },  
            getdataDX(data){
                   return util.turnDX(data);
            }

    },
    created(){
    },
    mounted(){
    },
    watch:{
        getSelectRows:function(val, oldVal){
          if(val.length>0){
            //处理
            this._getTableData(val);
          }
        }
    }  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.sum-text
    height:28px
    line-height:25px
    font-size:12px
    border:1px solid #ddd
    padding:2px
    padding-left:10px
    display:flex
    flex-direction:row
    flex-wrap:nowrap
    justify-content: flex-end
    align-items: center
    .heji-title
        color:#324057
        font-weight:600
        .heji-text
            color:#324057
            font-weight:600
</style>
