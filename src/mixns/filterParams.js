export default {
    data(){
        return {
            currentModuleCode:this.$route.params.tableName,
            currentPageCode:this.$route.params.pageName,
            currentPageType:sessionStorage.getItem('currentPageType'),
            modelCache:{},

        }
    },
    computed:{
        isCache:{
            get(){
                if(this.currentPageType=='commonPage'){
                  return  this.filterConf.isParamsCache?true:false
                }else if(this.currentPageType=='dynamicPage'){
                    return  this.filterConf.isParamsCache?true:false
                }else if(this.currentPageType=='assemblePage'){
                    return  this.filterConf.isParamsCache?true:false
                }
            }
        }
    },
    methods:{
        countName(name){
            let nameArr=sessionStorage.getItem('nameArr');
            if(nameArr){
                if(nameArr.indexOf(this.currentPageCode)==-1){
                    nameArr=nameArr+'|'+this.currentPageCode;
                }
            }else{
                nameArr=this.currentPageCode;
            }
            sessionStorage.setItem('nameArr',nameArr);
        },
        setRowParams(selectRowParams={}){
            let paramsObj=JSON.parse(sessionStorage.getItem(this.currentModuleCode+'|'+this.currentPageCode));
            if(paramsObj){
                let params=this.getFilterParams();
                params.rowParams=selectRowParams;
                if(this.currentPageType=='dynamicPage'){
                    //动态页面
                    if(paramsObj.paramsList.filter){
                        paramsObj.paramsList.filter=params;
                    }else{
                        paramsObj.paramsList[this.baseInfoConf.name]=params;
                    }
                }else if(this.currentPageType=='commonPage'){
                    //通用页面
                    paramsObj.paramsList.index=params;

                }else if(this.currentPageType=='assemblePage'){
                    //选项卡页面
                     paramsObj.paramsList[this.$parent.$parent.name]=params;
                }
                sessionStorage.setItem(this.currentModuleCode+'|'+this.currentPageCode,JSON.stringify(paramsObj));
            }
        },
        setFilterParams(params,pname=''){
                //是否开启
               if(this.isCache){
                        //清除上次缓存
                        this.clearFilterParams();
                        //模块标记
                        sessionStorage.setItem('moduleCode',this.currentModuleCode);
                        //模块计数
                        this.countName();

                        //格式化参数
                        params=this.formatParams(params);
                        //写入参数缓存
                        if(this.currentPageType=='dynamicPage'){
                            //动态页面
                            let paramsObj=JSON.parse(sessionStorage.getItem(this.currentModuleCode+'|'+this.currentPageCode));
                            if(paramsObj){
                                //已存在
                                if(pname!=''){
                                    paramsObj.paramsList[pname]=params;
                                }else{
                                    paramsObj.paramsList[this.option.elmentConfig.baseInfoConf.name]=params;
                                }
                                sessionStorage.setItem(this.currentModuleCode+'|'+this.currentPageCode,JSON.stringify(paramsObj));
                            }else{
                                //初次载入
                                paramsObj=this._getParamsFormat();
                                if(pname!=''){
                                    paramsObj.paramsList[pname]=params;
                                }else{
                                    paramsObj.paramsList[this.baseInfoConf.name]=params;
                                }
                                let name=this.currentModuleCode+'|'+this.currentPageCode;
                                sessionStorage.setItem(name,JSON.stringify(paramsObj));
                            }
                        }else if(this.currentPageType=='commonPage'){
                            //通用页面
                            let paramsObj=this._getParamsFormat();
                            paramsObj.paramsList.index=params;
                            let name=this.currentModuleCode+'|'+this.currentPageCode;
                            sessionStorage.setItem(name,JSON.stringify(paramsObj));

                        }else if(this.currentPageType=='assemblePage'){
                            //选项卡页面
                            let paramsObj=JSON.parse(sessionStorage.getItem(this.currentModuleCode+'|'+this.currentPageCode));
                            if(paramsObj){
                                //已存在
                                paramsObj.paramsList[this.$parent.$parent.name]=params;
                                sessionStorage.setItem(this.currentModuleCode+'|'+this.currentPageCode,JSON.stringify(paramsObj));
                            }else{
                                //初次载入
                                paramsObj=this._getParamsFormat();
                                paramsObj.paramsList[this.$parent.$parent.name]=params;
                                let name=this.currentModuleCode+'|'+this.currentPageCode;
                                sessionStorage.setItem(name,JSON.stringify(paramsObj));
                            }
                            
                        }
                }
        },
        getFilterParams(){
            if(this.isCache){
                //读取参数缓存
                let paramsObj=JSON.parse(sessionStorage.getItem(this.currentModuleCode+'|'+this.currentPageCode));
                    if(paramsObj){
                        //已存在
                        if(this.currentPageType=='commonPage'){
                                //
                                return paramsObj.paramsList.index;

                        }else if(this.currentPageType=='assemblePage'){
                            return paramsObj.paramsList[this.$parent.$parent.name];

                        }else if(this.currentPageType=='dynamicPage'){
                            if(paramsObj.paramsList.filter){
                                return paramsObj.paramsList.filter;
                            }else{
                                return  paramsObj.paramsList[this.baseInfoConf.name];
                            }
                        }
                    }
            }
        },
        formatParams(_params){
            //格式化参数
            let params=Object.assign({},_params);
            let paramsModel={};
            if(params.firstKeys){
                    let keyArr= params.firstKeys.split(',');
                    let valueArr= params.firstValues.split(',');
                    keyArr.map((i,index)=>{
                        paramsModel[i]=valueArr[index].substring(1,valueArr[index].length-1);
                    })
            }else if(params.queryConditionItem){
                params.queryConditionItem.map(i=>{
                    paramsModel[i.dataField]=i.dataValue;
                });
            }
            params.model=paramsModel;
            return params;
        },
        clearFilterParams(){
            //清除参数缓存
            if(this.currentModuleCode!==sessionStorage.getItem('moduleCode')){
                let str=sessionStorage.getItem('nameArr');
                if(str){
                    let nameArr=str.split('|');
                    for (let index = 0; index < nameArr.length; index++) {
                        sessionStorage.removeItem(sessionStorage.getItem('moduleCode')+'|'+nameArr[index]);
                    }
                    sessionStorage.removeItem('nameArr')
                }
            }
        },
        _getParamsFormat(){
            return {
                ModuleCode:this.currentModuleCode,
                PageCode:this.currentPageCode,
                PageType:this.currentPageType,
                paramsList:{}
            }
        }
    },
    mounted(){

    },
    beforeMount(){
        if(this.isCache){
            let cacheObject=this.getFilterParams();
            if(cacheObject){
                this.modelCache=cacheObject.model;
            }
        }
        
    }


}