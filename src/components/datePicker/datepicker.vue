<template>
    <el-date-picker
            v-model="currentValue" 
            :size="size"
            :readonly="readonly"
            :disabled="disabled"
            :editable="editable"
            :clearable="clearable"
            :type="type"
            :placeholder="placeholder"
            :format="format"
            :align="align"
            @change="_change">
    </el-date-picker>
</template>

<script type="text/babel">
export default {
    data(){
		return {
            currentValue:this.value,
		}
    },
    props:{
        value:[String],
        size:{
                    type: String,
                    default: "", 
        },
        readonly:{
                    type: Boolean,
                    default: false 
         }, 
        disabled:{
                    type: Boolean,
                    default: false 
         }, 
        editable:{
                type: Boolean,
                default: true 
        }, 
        clearable:{
                type: Boolean,
                default: true 
        }, 
        type:{
                type: String,
                default: 'date'
        }, 
        format:{
                type: String,
                default: '' 
        }, 
        align:{
                type: String,
                default: 'left' 
        }, 
       placeholder:{
                    type: String,
                    default: "" ,
        }
    },
    methods:{
        _change(val){
            this.$emit('input',val);
            this.$emit('change',val);
        },
         _setCurrentValue(value) {
            if (value === this.currentValue) return;
                this.currentValue = value;
            if (this.validateEvent) {
                this.dispatch('ElFormItem', 'el.form.change', [value]);
            }
        }
    },
    mounted(){
    },
    watch:{
        value:function(n){
             this._setCurrentValue(n);
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
