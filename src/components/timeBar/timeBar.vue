
<template>
     <yl-toolbar class="yl-timebar">
            <div class="btn">
                <el-button-group>
                    <el-button type="primary" size="small" v-if="btnItems.day" @click="_getDate('day')">本日</el-button>
                    <el-button type="primary" size="small" v-if="btnItems.week" @click="_getDate('week')">本周</el-button>
                    <el-button type="primary" size="small" v-if="btnItems.month" @click="_getDate('month')">本月</el-button>
                    <el-button type="primary" size="small" v-if="btnItems.quarter" @click="_getDate('quarter')">本季</el-button>
                    <el-button type="primary" size="small" v-if="btnItems.year" @click="_getDate('year')">本年</el-button>
                    <el-button type="primary" size="small" v-if="btnItems.all" @click="_getDate('all')">开累</el-button>
                </el-button-group>
            </div>
            <div class="timepick">
                <i class="icon-arrow-left3" @click="_back"></i>
                <el-date-picker style="width:180px"
                    class="date"
                    v-model="beginDate"
                    :type="dataPickOptions.type"
                    :format="dataPickOptions.format"
                    :readonly="dataPickOptions.readonly"
                    :size="dataPickOptions.size"
                    placeholder="开始日期"
                    @change="_beginChange">
                 </el-date-picker>
                 <el-date-picker style="width:180px"
                    class="date"
                    v-model="endDate"
                    :type="dataPickOptions.type"
                    :format="dataPickOptions.format"
                    :readonly="dataPickOptions.readonly"
                    :size="dataPickOptions.size"
                    placeholder="结束日期"
                    @change="_endChange"
                    >
                 </el-date-picker>
                  <i class="icon-arrow-right3" @click="_forward"></i>
            </div>
     </yl-toolbar>
</template>

<script type="text/babel">
import moment from 'moment';
export default {
     data(){
        return {
            beginDate:'',
            endDate:'',
            selectiton:''
        }
    },
    props:{
        btnItems:{
            type:Object,
            default:function(){
                return  {
                    day:false,
                    week:true,
                    month:true,
                    quarter:true,
                    year:true,
                    all:true
                }
            }
        },
        currentValue:{
            type:String,
            default:'month'
        },
        dataPickOptions:{
            type:Object,
            default:function(){
                return {
                    format:'yyyy-MM-dd',
                    size:'small',
                    readonly:false,
                    clearable:false,
                    type:'date',
                }
            }
        },
        format:{
            type:String,
            default:'YYYY-MM-DD'
        }
    },
    methods:{
        _beginChange(node){
            if(node>this.endDate){
                this.$message.warning('起始时间不能大于结束时间！');
                this.beginDate=this.endDate
            }
            // this.$emit('beginChange',{beginDate:this.beginDate,endDate:this.endDate})
        },
        _endChange(node){
             if(this.beginDate>node){
                this.$message.warning('结束时间不能小于开始时间！');
                this.endDate=this.beginDate
            }
            // this.$emit('endChange',{beginDate:this.beginDate,endDate:this.endDate})
        },
        _forward(){
            //前进
             if(this.selectiton==='day'){
                this.endDate=moment(this.beginDate).add(2, 'd').add(-1, 'day');
                this.beginDate=moment(this.beginDate).add(1, 'd');
            }else if(this.selectiton==='week'){
                this.endDate=moment(this.beginDate).add(2, 'w').add(-1, 'day');
                this.beginDate=moment(this.beginDate).add(1, 'w');
            }else if(this.selectiton==='month'){
                this.endDate=moment(this.beginDate).add(2, 'M').add(-1, 'day');
                this.beginDate=moment(this.beginDate).add(1, 'M');
            }else if(this.selectiton==='quarter'){
                this.endDate=moment(this.beginDate).add(2, 'Q').add(-1, 'day');
                this.beginDate=moment(this.beginDate).add(1, 'Q');
            }else if(this.selectiton==='year'){
                this.endDate=moment(this.beginDate).add(2, 'y').add(-1, 'day');
                this.beginDate=moment(this.beginDate).add(1, 'y');
            }
            this.endDate=moment(this.endDate).format(this.format);
            this.beginDate=moment(this.beginDate).format(this.format);
            // this.$emit('forward',{beginDate:this.beginDate,endDate:this.endDate})
        },
        _back(){
            //后退
            if(this.selectiton==='day'){
                this.beginDate=moment(this.beginDate).add(-1, 'd');
                this.endDate=moment(this.beginDate).add(1, 'd').add(-1, 'day');
            }
            else if(this.selectiton==='week'){
                this.beginDate=moment(this.beginDate).add(-1, 'w');
                this.endDate=moment(this.beginDate).add(1, 'w').add(-1, 'day');
            }else if(this.selectiton==='month'){
                this.beginDate=moment(this.beginDate).add(-1, 'M');
                this.endDate=moment(this.beginDate).add(1, 'M').add(-1, 'day');
            }else if(this.selectiton==='quarter'){
                this.beginDate=moment(this.beginDate).add(-1, 'Q');
                this.endDate=moment(this.beginDate).add(1, 'Q').add(-1, 'day');
            }else if(this.selectiton==='year'){
                this.beginDate=moment(this.beginDate).add(-1, 'y');
                this.endDate=moment(this.beginDate).add(1, 'y').add(-1, 'day');
            }
            this.endDate=moment(this.endDate).format(this.format);
            this.beginDate=moment(this.beginDate).format(this.format);
           // this.$emit('back',)
        },
        _getDate(type){
            this._initDate(type);
            this.$emit('click',{beginDate:this.beginDate,endDate:this.endDate})
        },
        _initDate(type){
            if(type==='day'){
                this.selectiton='day';
                this.beginDate = moment().format('YYYY-MM-DD');
            }else if(type==='week'){
                this.selectiton='week';
                let weekOfday = moment().format('E');
                this.beginDate= moment().subtract(weekOfday-1, 'days').format('YYYY-MM-DD');
            }else if(type==='month'){
                 this.selectiton='month';
                 this.beginDate= moment().format('YYYY-MM')+'-01';
            }else if(type==='quarter'){
                 this.selectiton='quarter';
                 if(moment().format('Q')==1){
                     this.beginDate= moment().format('YYYY')+'-01-01';
                 }else if(moment().format('Q')==2){
                     this.beginDate= moment().format('YYYY')+'-04-01';
                 }else if(moment().format('Q')==3){
                     this.beginDate= moment().format('YYYY')+'-07-01';
                 }else if(moment().format('Q')==4){
                     this.beginDate= moment().format('YYYY')+'-10-01';
                 }
            }else if(type==='year'){
                  this.selectiton='year';
                  this.beginDate= moment().format('YYYY')+'-01-01';
            }
            else if(type==='all'){
                 this.selectiton='all';
                  this.beginDate='1900-01-01';
            }
            this.beginDate=moment(this.beginDate).format(this.format);
            this.endDate=moment().format(this.format);
        },
        getDate(){
            this.beginDate=moment(this.beginDate).format(this.format);
            this.endDate=moment(this.endDate).format(this.format);
            return {beginDate:this.beginDate,endDate:this.endDate}
        },
        setDate(beginDate,endDate){
            this.beginDate=moment(beginDate).format(this.format);
            this.endDate=moment(endDate).format(this.format);
        },
    },
    mounted(){
        this.selectiton=this.currentValue;  
        this._initDate(this.selectiton);
        this.$emit('init',{beginDate:this.beginDate,endDate:this.endDate})
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.yl-timebar
    box-sizing border-box
    .timepick
        padding-left 150px
        i 
            color #707070
            padding 0px 5px
            &:hover
                cursor pointer
        .date
            width 160px
</style>


