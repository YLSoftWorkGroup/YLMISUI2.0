<template>
    <div class="form">
        <yl-columnlay :border="true"  size="large" style="height:570px;">
            <div slot="left">
                <yl-menuItemTree :expandOnClickNode="true" @getCurrentNode="_getCurrentNode"></yl-menuItemTree>
            </div>
           <div slot="right">
                        <yl-layout>
                             <div slot="fristbox">
                                <yl-toolbar>
                                    <el-form :inline="true">
                                        <el-form-item class="form-content-vertical">
                                            <el-tag type="success" size="medium">{{titleName}}</el-tag>
                                            <el-input placeholder="表名称" size="small" style="width:200px" v-model="searchItem.serviceName"></el-input>
                                            <el-input placeholder="ApiUrl" size="small" style="width:300px" v-model="searchItem.apiUrl"></el-input>
                                        </el-form-item>
                                        <el-form-item class="form-content-vertical">
                                            <el-button type="primary" icon="search" size="small" @click="_reSearch">查 询</el-button>
                                        </el-form-item>
                                    </el-form>
                                </yl-toolbar>
                                <yl-toolbar>
                                    <el-button-group>
                                            <el-button type="primary" v-permissionSetting="'Pages.System.Config.SecurityApiOrders.Create'" icon="plus" size="small"  @click="_addItem" >添加</el-button>
                                            <el-button type="danger" v-permissionSetting="'Pages.System.Config.SecurityApiOrders.Delete'" icon="delete" size="small"  :disabled="selectRows.length===0" @click="_delItem" >删除</el-button>
                                    </el-button-group>
                                </yl-toolbar>
                            </div>
                            <div slot="secondbox" class="flexbox">
                                <!--表显示区域-->
                                <yl-table ref="mainTable" @reload="_reloadItems" @row-click="toggleRowSelection"  @selection-change="_selectionChange" :configs="tableInfoConf" :input="itemInput.inputModel" :tableloading="itemTableLoading">
                                </yl-table>
                            </div>
                        </yl-layout>
            </div>
        </yl-columnlay>
            <!-- 选择api框 -->
        <el-dialog ref="selectDialog2" :title="apiTitleName" v-model="addFormVisible" size="large" top="3%" :modal="false" :lock-scroll="true" :close-on-press-escape="false" :modal-append-to-body="false" :close-on-click-modal="false">
            <yl-selectFromComMat :selecTableName="searchItem" @reload="_reloadItems" @close="_close" v-if="addFormVisible"></yl-selectFromComMat>
        </el-dialog>
    </div>
</template>

<script type="text/babel">
import selectFromComMat from "./SelectApiConf";
import { inputModel } from "@/api/inputmodel";
import MenuItemTree from "@/ocomponents/menuitem/menuItemTreeWithPanel";
import {
  requestGetItemPageListView,
  requestCreateMainList,
  requestDeleteItemObject
} from "@/api/securityApiOrder";

export default {
  components: {
    "yl-selectFromComMat": selectFromComMat,
    "yl-menuItemTree": MenuItemTree
  },
  data() {
    return {
      apiTitleName: "",
      titleName: "",
      addFormVisible: false,
      selectRows: [],
      formModel: {},
      itemTableLoading: false,
      searchItem: {
        isChild:false,
        titleName: "",
        funcCode: "",
        serviceName: "",
        orderId: "",
        apiUrl: ""
      },
      itemInput: new inputModel()
    };
  },
  props: {
    selectRow: {}
  },
  methods: {
    toggleRowSelection(row) {
      if (row) {
        this.$refs.mainTable.toggleRowSelection(row);
      }
    },
    _selectionChange(val) {
      //多选时的方法
      if (val != null) {
        this.selectRows = [];
        this.selectRows = this.selectRows.concat(val);
      }
    },
    _addItem() {
      this.apiTitleName = this.searchItem.titleName + "API选择框";
      this.addFormVisible = true;
    },
    _reSearch() {
      var _this = this;
      this.itemTableLoading = true; //开启加载
      var inputArr = [
        { key: "ServiceName", op: "LIKE", value: _this.searchItem.serviceName },
        { key: "ApiUrl", op: "LIKE", value: _this.searchItem.apiUrl },
        { key: "OrderId", op: "EQ", value: _this.selectRow.id }
      ];
      _this.itemInput.addqueryConditionItem(inputArr);
      requestGetItemPageListView(_this.itemInput.inputModel)
        .then(data => {
          if (data.success) {
            _this.formModel = data.result;
          } else {
            _this.$message.error("失败！" + data.error.message);
          }
          _this.itemTableLoading = false;
        })
        .catch(function(error) {
          _this.itemTableLoading = false;
        });
    },
    _reloadItems() {
      var _this = this;
      this.itemTableLoading = true; //开启加载
      _this.searchItem.serviceName = "";
      _this.searchItem.apiUrl = "";
      var inputArr = [{ key: "OrderId", op: "EQ", value: this.selectRow.id }];
      let obj = {
        key: "TableName",
        op: "EQ",
        value: this.searchItem.funcCode
      };
      if (obj.value && obj.value!=="") {
        inputArr.push(obj);
      }
      _this.itemInput.addqueryConditionItem(inputArr);
      requestGetItemPageListView(_this.itemInput.inputModel)
        .then(data => {
          if (data.success) {
            _this.formModel = data.result;
          } else {
            _this.$message.error("失败！" + data.error.message);
          }
          _this.itemTableLoading = false;
        })
        .catch(function(error) {
          _this.itemTableLoading = false;
        });
    },
    _getCurrentNode(selectNode) {
      this.searchItem.funcCode = selectNode.funcCode;
      if (selectNode.children.length == 0) {
        this.searchItem.isChild=true;
        this.searchItem.titleName = selectNode.text;
      }else{
        this.searchItem.isChild=false;
        this.searchItem.titleName = "全部";
      }
        this._reloadItems();
    },
    _close() {
      //关闭选择框
      this.addFormVisible = false;
    },
    _delItem() {
      let _this = this;
      let row = _this.selectRows;
      _this
        .$confirm("确认要删除所选项吗?", "提示", {
          type: "warning",
          modal: false
        })
        .then(() => {
          _this.itemTableLoading = true;
          row.map(item => {
            let obj = {};
            obj.id = item.id;
            requestDeleteItemObject(obj).then(data => {
              if (data.success) {
                this._reloadItems();
              } else {
                _this.itemTableLoading = false;
                this.$notify.error({
                  title: "错误",
                  message: "删除数据失败！" + data.error.message
                });
              }
            });
          });
          _this.$notify({
            title: "成功",
            message: "删除数据成功！",
            type: "success",
            duration: 2000
          });
          _this.itemTableLoading = false;
        })
        .catch(() => {});
    }
  },
  computed: {
    //表格配置
    tableInfoConf: {
      get() {
        return {
          table: {
            attr: {
              data: this.formModel,
              highlightCurrent: true,
              style: { width: "100%", height: "460px" }
            }
          },
          columns: [
            { attr: { type: "selection", width: 55 } },
            { attr: { prop: "tableName", label: "数据表名称", width: 120 } },
            { attr: { prop: "serviceName", label: "服务名称", width: 120 } },
            { attr: { prop: "apiUrl", label: "ApiUrl", width: 300 } },
            { attr: { prop: "sortCode", label: "序号", width: 120 } },
            { attr: { prop: "itemRemark", label: "备注" } }
          ]
        };
      }
    }
  },
  mounted() {
    if (this.selectRow.id != undefined) {
      this.titleName = this.selectRow.clientName;
      this.searchItem.orderId = this.selectRow.id;
      this._reloadItems();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
