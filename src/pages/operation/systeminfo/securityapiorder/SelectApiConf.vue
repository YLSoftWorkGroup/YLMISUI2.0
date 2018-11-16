<template>
    <yl-columnlay :border="true" style="height:570px;" size="large">
        <div slot="right">
            <yl-layout>
                <div slot="fristbox">
                    <yl-toolbar>
                        <el-form :inline="true">
                            <el-form-item class="form-content-vertical">
                                <el-input placeholder="数据表名称" size="small" style="width:200px" v-model="searchModel.serviceName"></el-input>
                                <el-input placeholder="apiUrl" size="small" style="width:300px" v-model="searchModel.apiUrl"></el-input>
                            </el-form-item>
                            <el-form-item class="form-content-vertical">
                                <el-button type="primary" icon="search" size="small" @click="_reload">查 询</el-button>
                            </el-form-item>
                            <el-form-item class="form-content-vertical">
                                <el-button type="primary" icon="search" size="small" @click="_updateApi">更 新</el-button>
                            </el-form-item>
                        </el-form>
                    </yl-toolbar>
                    <yl-toolbar>
                        <el-button-group ref="funtoolbar">
                            <el-button type="primary" v-permissionSetting="'Pages.System.Config.SecurityApiOrders.Create'" name="add" icon="plus" size="small" @click="_onSubmit" :disabled="selectRows.length===0" :loading="loading">确 定</el-button>
                        </el-button-group>
                    </yl-toolbar>
                </div>
                <div slot="secondbox" class="flexbox">
                    <!--表显示区域-->
                    <yl-table ref="mainTable" :pagination="pagination" @reload="_reload" @selection-change="_selectionChange" @row-click="toggleRowSelection" :configs="tableInfoConf" :input="mainInput.inputModel" :tableloading="mainTableLoading">
                    </yl-table>
                </div>
            </yl-layout>
        </div>
    </yl-columnlay>
</template>

<script type="text/babel">
import { inputModel } from "@/api/inputmodel";
import {
  requestGetItemPageList,
  requestUpdateAllSecurityApi,
  requestCreateMainList
} from "@/api/securityApiOrder";

export default {
  components: {},
  data() {
    return {
      itemsModel: {},
      loading: false,
      reLoading: false,
      pagination: {
        //分页默认配置
        pageSizes: [10, 200, 500, 2000, 5000, 10000],
        layout: "total, sizes, prev, pager, next, jumper",
        pageSize: 10
      },
      searchModel: {
        tableName: "",
        serviceName: "",
        apiUrl: ""
      },
      selectRows: [],
      mainInput: new inputModel(),
      mainTableLoading: false,
      selectNode: {}
    };
  },
  props: {
    selecTableName: {}
  },
  computed: {
    //表格配置
    tableInfoConf: {
      get() {
        return {
          table: {
            attr: {
              data: {},
              highlightCurrent: false,
              style: { width: "100%", height: "450px" }
            }
          },
          columns: [
            { attr: { type: "selection", width: 55 } },
            { attr: { prop: "tableName", label: "数据表名称", width: 120 } },
            { attr: { prop: "serviceName", label: "服务名称", width: 120 } },
            { attr: { prop: "apiUrl", label: "ApiUrl", width: 300 } },
            { attr: { prop: "isEnable", label: "是否启用", width: 120 } },
            { attr: { prop: "sortCode", label: "序号", width: 120 } },
            { attr: { prop: "remark", label: "备注" } }
          ]
        };
      }
    }
  },
  methods: {
    _updateApi() {
      //更新Api
      this.reLoading = true;
      requestUpdateAllSecurityApi()
        .then(data => {
          if (data.success) {
            this._reload();
            this.$notify({
              title: "更新成功",
              message: "更新数据成功！",
              type: "success",
              duration: 2000
            });
          } else {
            this.$message.error("失败！" + data.error.message);
          }
          this.reLoading = false;
        })
        .catch(function(error) {
          this.reLoading = false;
        });
    },
    _selectionChange(val) {
      //多选时的方法
      if (val != null) {
        this.selectRows = [];
        this.selectRows = this.selectRows.concat(val);
      }
    },
    toggleRowSelection(row) {
      if (row) {
        this.$refs.mainTable.toggleRowSelection(row);
      }
    },
    _reload() {
      var _this = this;
      _this.selectRows = [];
      _this.mainTableLoading = true;
      var inputArr = [
        {
          key: "ServiceName",
          op: "LIKE",
          value: _this.searchModel.serviceName
        },
        { key: "ApiUrl", op: "LIKE", value: _this.searchModel.apiUrl }
      ];
      let obj = {
        key: "TableName",
        op: "EQ",
        value: _this.selecTableName.funcCode
      };
      if (_this.selecTableName.isChild) {
        inputArr.push(obj);
      }
      _this.mainInput.addqueryConditionItem(inputArr);
      requestGetItemPageList(_this.mainInput.inputModel)
        .then(data => {
          if (data.success) {
            _this.tableInfoConf.table.attr.data = data.result;
          } else {
            _this.$message.error("失败！" + data.error.message);
          }
          _this.mainTableLoading = false;
        })
        .catch(function(error) {
          _this.mainTableLoading = false;
        });
    },
    _onSubmit() {
      var _this = this;
      _this.loading = true;
      let params = {};
      for (let index = 0; index < _this.selectRows.length; index++) {
        _this.selectRows[index].orderId = _this.selecTableName.orderId;
        _this.selectRows[index].apiId = _this.selectRows[index].id;
        _this.selectRows[index].itemRemark = _this.selectRows[index].remark;
        //_this.selectRows[index].id='';
        params.items = _this.selectRows;
      }
      
      requestCreateMainList(params)
        .then(data => {
          if (data.success) {
            this.$emit("close");
            this.$notify({
              title: "成功",
              message: "保存数据成功！",
              type: "success",
              duration: 2000
            });
            this.$emit("reload");
          } else {
            _this.$message.error("失败！" + data.error.message);
          }
          _this.loading = false;
        })
        .catch(function(error) {
          _this.loading = false;
        });
    }
  },
  mounted() {
    this._reload();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
