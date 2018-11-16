import Vue from 'vue'
import Qs from 'qs';
import fetch from '@/api/fetch'

//功能权限
 Vue.directive('permissionSetting', {
                bind: (el, binding, vnode)=> {
                    //获取值
                    let obj={};
                    obj.permissionName=binding.value;
                    if(obj.permissionName!=="show"){
                        fetch({
                            //判断权限是否存在
                            url:'api/services/app/userMenu/GetPermissionShow?'+Qs.stringify(obj),
                            method: 'post'
                            }).then(data=>{
                            if(data.success){
                                if(!data.result){
                                    //删除本身
                                    el.remove();
                                }
                            }
                            else{
                                    el.remove();
                            }
                        })
                    }
          
            }
    });

  //clickoutside  
    Vue.directive('clickoutside', {
        // 初始化指令
    bind(el, binding, vnode) {
        function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
        }
            // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
             el.__vueClickOutside__ = documentHandler;
             document.addEventListener('click', documentHandler);
        },
        update() {},
        unbind(el, binding) {
            // 解除事件监听
            document.removeEventListener('click', el.__vueClickOutside__);
            delete el.__vueClickOutside__;  
        },
    });

