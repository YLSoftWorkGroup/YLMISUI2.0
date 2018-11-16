
export default{
    data(){
        return {
        }
    },
    props: {
        dynamicFormConf:{
            type:Object
        },
        model:{ 
            type:Object
        },
        items:{
            type:Array,
            require:false
        },
        refList:{
            type:Object,
            require:false
        }
    },
    methods:{
            _change(node,_this){    
                this.$emit('change',node,_this);
            },
            _blur(node,_this){    
                this.$emit('blur',node,_this);
            },
            _method1(node,_this){
                this.$emit('method1',node,_this);
            },
            _method2(node,_this){
                this.$emit('method2',node,_this);
            },
            _initComs(_this){ 
                this.$emit('initComs',_this);
            },
            _delItem(row){ 
                this.$emit('delItem',row);
            },
            _sumCount(){
                this.$emit('sumCount');
            },
            //返回动态表单
            renderItem(tabConfigs,indexs){
                return tabConfigs.map((formData,index)=>{
                     if(formData.title){
                        return  <el-col span={formData.position.spanNum} >
                                <el-form-item
                                    label={formData.title}
                                    key={index}
                                    prop={formData.name}
                                    rules={formData.rules}
                                >
                                    <yl-rendercoms  
                                        ref="rendercoms"
                                        option={formData}
                                        model={this.model}
                                        items={this.items}
                                        refList={this.refList}
                                        on-change={this._change}
                                        on-delItem={this._delItem}
                                        on-blur={this._blur}
                                        on-method1={this._method1}
                                        on-method2={this._method2}
                                        on-init={this._initComs}
                                        on-sumCount={this._sumCount}
                                        ></yl-rendercoms>
                               </el-form-item>
                            </el-col>
                     }else {
                        return  <el-col span={formData.position.spanNum} >
                                        <yl-rendercoms  
                                            ref="rendercoms"
                                            option={formData}
                                            model={this.model}
                                            items={this.items}
                                            refList={this.refList}
                                            on-change={this._change}
                                            on-delItem={this._delItem}
                                            on-blur={this._blur}
                                            on-method1={this._method1}
                                            on-method2={this._method2}
                                            on-init={this._initComs}
                                            on-sumCount={this._sumCount}
                                            ></yl-rendercoms>
                                </el-col>
                     }
                      
            }) 
         },
    },
    components:{
    },
    mounted(){
       
    },
    render: function(h){
        if(this.dynamicFormConf.tabpanelconf!=undefined){
            let tabpanelconf=this.dynamicFormConf.tabpanelconf;
            if(!tabpanelconf.disabled){
                 let tabConfigs=this.dynamicFormConf.tabConfigs;
                //tabpanel形式
                    return  <el-tabs type={tabpanelconf.type} >
                            {
                                tabConfigs.map((item,indexs)=>{
                                return <el-tab-pane label={item.tabpanel.title} style={tabpanelconf.style} disabled={item.tabpanel.disabled}>
                                            { 
                                                //循环开始
                                                this.renderItem(item.formConfig,indexs)
                                            } 
                                        </el-tab-pane>
                            })} 
                        </el-tabs>
            }
            else{
                //经典的form表单形式
                 let formConfig=this.dynamicFormConf.formConfig;
                 return <div style={tabpanelconf.style}>
                        {
                           formConfig.map((formData,index)=>{
                            if(formData.title){
                                return    <el-col span={formData.position.spanNum}>
                                                <el-form-item
                                                    label={formData.title}
                                                    key={index}
                                                    prop={formData.name}
                                                    rules={formData.rules}>
                                                    <yl-rendercoms 
                                                        ref="rendercoms"
                                                        option={formData}
                                                        model={this.model}
                                                        items={this.items}
                                                        refList={this.refList}
                                                        on-delItem={this._delItem}
                                                        on-change={this._change}
                                                        on-blur={this._blur}
                                                        on-method1={this._method1}
                                                        on-method2={this._method2}
                                                        on-init={this._initComs}
                                                        on-sumCount={this._sumCount} >
                                                    </yl-rendercoms>
                                                </el-form-item>
                                        </el-col>
                            }else{
                                return    <el-col span={formData.position.spanNum}>
                                            <yl-rendercoms 
                                                    ref="rendercoms"
                                                    option={formData}
                                                    model={this.model}
                                                    items={this.items}
                                                    refList={this.refList}
                                                    on-delItem={this._delItem}
                                                    on-change={this._change}
                                                    on-blur={this._blur}
                                                    on-method1={this._method1}
                                                    on-method2={this._method2}
                                                    on-init={this._initComs}
                                                    on-sumCount={this._sumCount} >
                                                </yl-rendercoms>
                                        </el-col>
                                }
                            })
                        }
                     </div>
                 
            }
        }
      
    }
}