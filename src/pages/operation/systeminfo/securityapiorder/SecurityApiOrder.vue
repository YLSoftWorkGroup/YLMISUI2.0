<template>
    <yl-panelpage :titleName="'API授权管理'">
        <div slot-scope="content">
            <yl-columnlay>
                <div slot-scope="right">
                    <yl-layout>
                        <div slot-scope="fristbox">
                            <yl-toolbar>
                                <el-form :inline="true">
                                    <el-form-item class="form-content-vertical">
                                        <el-input placeholder="客户端名称" size="small" style="width:200px" v-model="searchModel.clientName"></el-input>
                                    </el-form-item>
                                    <el-form-item class="form-content-vertical">
                                        <el-button type="primary" icon="search" size="small" @click="_reload">查 询</el-button>
                                    </el-form-item>
                                </el-form>
                            </yl-toolbar>
                            <yl-toolbar>
                                <el-button-group>
                                    <el-button type="primary" v-permissionSetting="'Pages.System.Config.SecurityApiOrders.Create'" icon="plus" size="small" @click="_add">添加</el-button>
                                    <el-button type="primary" v-permissionSetting="'Pages.System.Config.SecurityApiOrders.Edit'" icon="edit" size="small" :disabled="selectRows.length===0" @click="_edit">编辑</el-button>
                                    <el-button type="danger" v-permissionSetting="'Pages.System.Config.SecurityApiOrders.Delete'" icon="delete" size="small" :disabled="selectRows.length===0" @click="_delete">删除</el-button>
                                    <el-button type="primary"  icon="plus" size="small"  :disabled="selectRows.length===0"  @click="_addItem" >添加明细</el-button>
                                </el-button-group>
                            </yl-toolbar>
                        </div>
                        <div slot-scope="secondbox" class="flexbox">
                            <yl-table ref="table" @reload="_reload" @current-change="_currentChange" :configs="tableConfig" :input="mainInput.inputModel" :tableloading="mainTableLoading">
                                <template slot-scope="isEnable" scope="scope">
                                    <el-tag type="primary" v-if="scope.row.isEnable">是</el-tag>
                                    <el-tag type="danger" v-else>否</el-tag>
                                </template>
                            </yl-table>
                        </div>
                    </yl-layout>
                </div>
            </yl-columnlay>
            <!--编辑界面-->
            <el-dialog ref="mainDialog" title="编辑" v-model="addFormVisible" size="small" top="10%" :modal-append-to-body="false" :close-on-click-modal="false">
                <Edit :selectRow="currentRows" @close="_closeItem" v-if="addFormVisible"></Edit>
            </el-dialog>
            <!-- 添加明细界面 -->
            <el-dialog 
                    ref="mainDialog" 
                    :title="titleName" 
                    v-model="addItemFormVisible" 
                    size="large" 
                    top="3%" 
                    :lock-scroll="true" 
                    :modal-append-to-body="false" 
                    :close-on-click-modal="false"
                    >
                    <yl-apiItem :selectRow="currentRows" v-if="addItemFormVisible"></yl-apiItem>
            </el-dialog>
        </div>
    </yl-panelpage>
</template>

<script type="text/babel">
import Edit from "./SecurityApiOrderEdit";
import ApiItemEdit from "./SecurityApiItem";
import { inputModel } from "@/api/inputmodel";
import {
  requestGetItemPageListView,
  requestGetMainPageList,
  requestDeleteMainObject
} from "@/api/securityApiOrder";

export default {
  data() {
    return {
      titleName: "",
      tableData: {},
      addItemFormVisible: false,
      mainTableLoading: false,
      selectRows: [],
      currentRows: {},
      searchModel: {
        clientName: ""
      },
      addFormVisible: false,
      mainInput: new inputModel()
    };
  },
  computed: {
    tableConfig: {
      // 主表配置
      get() {
        return {
          table: {
            attr: {
              data: this.tableData,
              highlightCurrent: true
            }
          },
          columns: [
            {
              attr: { type: "index", label: "序号", width:55,align: 'center',headerAlign:'center' }
            },
            { attr: { prop: "clientName", label: "客户端名称", width: 130 } },
            { attr: { prop: "clientId", label: "客户端id", width: 260 } },
            { attr: { prop: "clientSecret", label: "客户端密码", width: 260 } },
            {attr: { prop: "isEnable",label: "是否启用", width: 70,scopedSlot: "isEnable",align: "center"} },
             { attr: { prop: "sortCode", label: "排序", width: 60 } },
            { attr: { prop: "remark", label: "备注"} },
           
          ]
        };
      }
    }
  },
  methods: {
    _getSecurityPageList() {
      var _this = this;
      this.selectRows = [];
      this.mainTableLoading = true; //开启加载
      var inputArr = [
        { key: "ClientName", op: "LIKE", value: this.searchModel.clientName }
      ];
      this.mainInput.addqueryConditionItem(inputArr);
      this.mainInput.inputModel.sorting = "SortCode desc";
      requestGetMainPageList(this.mainInput.inputModel)
        .then(data => {
          if (data.success) {
            this.tableData = data.result;
          } else {
            this.$message.error("失败！" + data.error.message);
          }
          this.mainTableLoading = false;
        })
        .catch(function(error) {
          _this.mainTableLoading = false;
        });
    },
    _currentChange(val) {
      //单选时的方法
      if (val != null) {
        this.selectRows = [];
        this.selectRows.push(val);
      }
    },
    _reload() {
      this._getSecurityPageList();
    },
    _add() {
      this.addFormVisible = true;
      this.currentRows = {};
    },
    _addItem() {
      this.addItemFormVisible = true;
      this.currentRows = this.selectRows[0];
      this.titleName = "添加" + this.currentRows.clientName + "明细";
    },
    _closeItem(bool){ 
            if(bool){
                this.addFormVisible=false;
            }
            this._reload();
        },
    _edit() {
      this.addFormVisible = true;
      this.currentRows = this.selectRows[0];
    },
    _delete() {
      this.$confirm("确认要删除所选项目吗?", "提示", {
        type: "warning"
      }).then(() => {
        var obj = {};
        obj.id = this.selectRows[0].id;
        requestDeleteMainObject(obj).then(data => {
          if (data.success) {
            this._reload();
            this.$notify({
              title: "成功",
              message: "删除数据成功！",
              type: "success",
              duration: 2000
            });
          } else {
            this.$notify.error({
              title: "错误",
              message: "删除数据失败！" + data.error.message
            });
          }
        });
      });
    }
  },
  components: {
    Edit,
    "yl-apiItem": ApiItemEdit
  },
  mounted() {
    this._reload();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

