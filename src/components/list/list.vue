
<template>
         <yl-layout>
           <div slot="fristbox"  style="overflow:auto"
                class="flexbox"  
                v-loading=tableloading
                element-loading-text="加载中...">
                    <yl-listshowComs 
                        v-for="(item,index) in pageData" :key="index"
                        :option="listOptions.itemOption"
                        :item="item">
                    </yl-listshowComs> 
                    <div v-if="pageData.length==0" class="nodata">暂无数据</div> 
            </div>
            <div slot="secondbox"  v-if='pagination.isShow'>
                <yl-toolbar>
                        <el-pagination  
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="input.draw"
                            :page-sizes="paginationAttr.pageSizes"
                            :page-size="input.maxResultCount"
                            :total="dataList.length"
                            :layout="paginationAttr.layout"
                        >
                        </el-pagination>
                </yl-toolbar>
            </div>
          </yl-layout>
</template>

<script type="text/babel">
export default {
    data(){
        return  {
            defaultAttr: {
                listOptions: { 
                    itemOption:{
                    }
                },
                pagination:{ //分页默认配置
                    pageSizes:[10,20,50],
                    layout:"total, sizes, prev, pager, next, jumper",
                    pageSize:10,
                    isShow:true
                }
            },
           input:{
               maxResultCount:10,
               draw:1,
               skipCount:0,
           },
           pageData:[]
        }
    },
    props:{
        tableloading:{
                    type: Boolean,
                    default:false
                },
        listOptions:{
             type: Object,
                    default:function(){
                        return  {
                            itemOption:{}
                        };
                    }
         },
        pagination:{
                    type: Object,
                    default:function(){
                        return  {};
                    }
                },  
        dataList:{
                type: Array,
                default:function () {
                    return []
                }
            }, 
    },
    computed:{
        paginationAttr:{
            get(){
                if(this.pagination.layout!==undefined){
                    return Object.assign(this.defaultAttr.pagination,this.pagination )
                }else{
                    return this.defaultAttr.pagination;
                } 
            }
        }
    },
    methods:{
        handleSizeChange(val) {
            this.input.skipCount=val*(this.input.draw-1)
            this.getpagination(val)
        },
        handleCurrentChange(val) {
            this.input.draw=val
            this.input.skipCount=this.input.maxResultCount*(val-1)
            this.getpagination()
        },
        loading(){
            this.$emit('loading',this.tableloading)
        },
        getpagination(val) { 
            if(val===undefined){this.input.maxResultCount=this.paginationAttr.pageSize;}
            else{this.input.maxResultCount=this.paginationAttr.pageSize=val;}
            let draw=this.input.draw,
            array=this.dataList,
            pageSize=this.input.maxResultCount,
            offset=this.input.skipCount;  
            let ArrList=(offset + pageSize >= array.length) ? array.slice(offset,array.length) : array.slice(offset, offset + pageSize);
            this.pageData=[];
            this.pageData.push(...ArrList)
            
        },
    },
    created(){
    },
    mounted(){
    },
    watch:{
        dataList:{
            handler:function(n,o){
                if(n.length>0){
                    this.getpagination();
                }else{
                    this.pageData=[];
                }
            }
        }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.nodata
    height 200px
    text-align center 
    font-size 14px
    padding-top 80px
</style>