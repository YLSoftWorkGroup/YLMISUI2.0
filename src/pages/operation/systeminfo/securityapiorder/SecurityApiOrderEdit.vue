<template>
<div>
<el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px" >
<el-row>
         <el-form-item label="客户端名称" prop="clientName">
            <el-input v-model="formModel.clientName" placeholder="请输入客户端名称"></el-input>
        </el-form-item>  
        <el-form-item label="客户端Id" prop="clientId">
            <el-input v-model="formModel.clientId" placeholder="请输入客户端Id"></el-input>
        </el-form-item>
         <el-form-item label="客户端密码" prop="clientSecret">
            <el-input v-model="formModel.clientSecret" placeholder="请输入客户端密码"></el-input>
        </el-form-item>    
        <el-form-item label="是否启用" prop="isEnable">
            <el-switch v-model="formModel.isEnable" on-text="是" off-text="否">
            </el-switch>
        </el-form-item>   
        <el-form-item label="排序" prop="sortCode">
            <el-input-number v-model="formModel.sortCode" :min="1" style="width:100%;"></el-input-number>
        </el-form-item>
         <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" style="width:100%" v-model="formModel.remark"></el-input>
        </el-form-item>
</el-row>
    <el-form-item >
        <el-checkbox v-model="isClose">保存后关闭</el-checkbox>
        <div style="text-align:right;">   
            <el-button @click="_resetForm">重置</el-button>
            <el-button type="primary" @click="_onSubmit" :loading="loading">保存</el-button>
        </div>
    </el-form-item>
  
</el-form>
</div>
</template>

<script type="text/babel">
import { requestCreateOrUpdateMainObject } from "@/api/securityApiOrder";

export default {
  data() {
    return {
      formModel: {
        clientId: "",
        clientName: "",
        clientSecret: "",
        remark: "",
        isEnable: true,
        sortCode: 1
      },
      rules: {
        clientName: [
          { required: true, message: "客户端名称不能为空!", trigger: "blur" }
        ],
        clientId: [
          { required: true, message: "客户端id不能为空!", trigger: "blur" }
        ],
        clientSecret: [
          { required: true, message: "客户端密码不能为空!", trigger: "blur" }
        ]
      },
      loading: false,
      isClose: true
    };
  },
  props: {
    selectRow: {}
  },
  methods: {
    _onSubmit() {
      this.$refs.formModel.validate(valid => {
        if (valid) {
          var _this = this;
          this.loading = true;
          let params = {};
          params.order = _this.formModel;
          requestCreateOrUpdateMainObject(params)
            .then(data => {
              if (data.success) {
                this.$notify({
                  title: "成功",
                  message: "保存数据成功！",
                  type: "success",
                  duration: 1800
                });
                //关闭面板
                this._complete(this.isClose);
              } else {
                this.$message.error("失败！" + data.error.message);
              }
              this.loading = false;
            })
            .catch(function(error) {
              _this.loading = false;
            });
        } else {
          this.$message.warning("请按照条件填充表单！");
          return false;
        }
      });
    },
    _resetForm() {
      this.$refs.formModel.resetFields();
    },
    _complete(bool) {
      this.$emit("close", bool);
    }
  },
  mounted() {
    Object.assign(this.formModel, this.selectRow);
  },
  watch: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
