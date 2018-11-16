 import util from '@/common/js/util.js';
 export default {
    name: 'yl-tableR',
    data () {
        return {
            defaultAttr: {
                table: {  // table的默认属性
                    height:'100%',
                    border: true,
                    stripe:true,
                    highlightCurrent:true,   //默认配置为单选
                    style:{width:'100%',height:'100%'},
                },
                column: { // column的默认属性
                    showOverflowTooltip: true,
                    headerAlign: 'left',
                    resizable: true,
                    sortable:true
                },
            },
           input:{
               maxResultCount:2,
               draw:1,
               skipCount:0,
           },
           pageData:[]
        }
    },
    props: {
        // table的配置,具体见README.md
          configs: {
                type: Object,
                required: true,
              },
          tableloading:{
                    type: Boolean,
                    default:false
                },
          pagination:{
                    type: Object,
                    default:function(){
                        return  {};
                    }
                },  
          tableData:{
                    required: false,
                    type: Array,
                    default: function () {
                        return []
                    }
                  },
          
    },
    computed:{
        paginationAttr:{
            get(){
                let pagination=util.getLocalStorage('SysGlobConf').pagination;
                if(this.pagination.layout!==undefined){
                    return Object.assign(pagination,this.pagination )
                }else{
                    return pagination;
                } 
            }
        },
    },
    methods: {
        /**
        * 提供element table 的clearSelection方法
        * @param selection
        */
        clearSelection (selection) {
            this.$refs.table.clearSelection(selection)
        },
        /**
        * 提供element table 的toggleRowSelection方法
        * @param row
        * @param selected
        */
        toggleRowSelection (row, selected) {
            this.$refs.table.toggleRowSelection(row, selected)
        },
        /**
        * 转发element table的事件
        * @param action
        * @returns {Function}
        */
        handleEvent (action) {
            const _self = this
            return function () {
                _self.$emit(action, ...arguments)
            }
        },
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
                    array=this.tableData,
                    pageSize=this.input.maxResultCount,
                    offset=this.input.skipCount;  
                this.pageData=(offset + pageSize >= array.length) ? array.slice(offset,array.length) : array.slice(offset, offset + pageSize);
               },
        createCol(columns,columnDefaultAttr){
              return   columns.map((column) => {
                            const columnAttr = Object.assign({}, columnDefaultAttr, column.attr)
                                return <el-table-column
                                type={columnAttr.type}
                                column-key={columnAttr.columnKey}
                                label={columnAttr.label}
                                prop={columnAttr.prop}
                                width={columnAttr.width}
                                min-width={columnAttr.minWidth}
                                fixed={columnAttr.fixed}
                                render-header={columnAttr.renderHeader}
                                sortable={columnAttr.sortable}
                                sort-method={columnAttr.sortMethod}
                                resizable={columnAttr.resizable}
                                formatter={columnAttr.formatter}
                                show-overflow-tooltip={columnAttr.showOverflowTooltip}
                                align={columnAttr.align}
                                header-align={columnAttr.headerAlign}
                                class-name={columnAttr.className}
                                label-class-name={columnAttr.labelClassName}
                                selectable={columnAttr.selectable}
                                reserve-selection={columnAttr.reserveSelection}
                                filters={columnAttr.filters}
                                filter-multiple={columnAttr.filterMultiple}
                                filter-method={columnAttr.filterMethod}
                                filtered-value={columnAttr.filterValue}
                            >
                                {
                                    columnAttr.scopedSlot ? this.$scopedSlots[columnAttr.scopedSlot] : ''
                                }
                            </el-table-column>
               })
        }  
    },
    mounted(){
    },
    watch:{
        tableData:function(n,o){
            if(n.length>0){
                this.getpagination();
            }else{
                this.pageData=[];
            }
        },
    },
    render() {
        const tableAttr = Object.assign({}, this.configs.table.default || this.defaultAttr.table, this.configs.table.attr || {}) // 表格属性
        const columns = this.configs.columns  // 列配置
        const columnDefaultAttr = this.configs.columnDefault || this.defaultAttr.column // 列默认配置
        return  <yl-layout>
                    <div slot="fristbox" class="flexbox" style="margin-right:2px">
                        <el-table ref="table" 
                                v-loading={this.tableloading}
                                element-loading-text="加载中..."
                                style={tableAttr.style}
                                data={this.pageData}
                                height={tableAttr.height}
                                max-height={tableAttr.maxHeight}
                                stripe={tableAttr.stripe}
                                border={tableAttr.border}
                                fit={tableAttr.fit}
                                show-header={tableAttr.showHeader}
                                highlight-current-row={tableAttr.highlightCurrent}
                                current-row-key={tableAttr.currentRowKey}
                                row-class-name={tableAttr.rowClassName}
                                row-style={tableAttr.rowStyle}
                                row-key={tableAttr.rowKey}
                                empty-text={tableAttr.emptyText}
                                default-expand-all={tableAttr.defaultExpandAll}
                                expand-row-keys={tableAttr.expandRowKeys}
                                default-sort={tableAttr.defaultSort}
                                tooltip-effect={tableAttr.tooltipEffect}
                                on-select={this.handleEvent('select')}
                                on-select-all={this.handleEvent('select-all')}
                                on-selection-change={this.handleEvent('selection-change')}
                                on-cell-mouse-enter={this.handleEvent('cell-mouse-enter')}
                                on-cell-mouse-leave={this.handleEvent('cell-mouse-leave')}
                                on-cell-click={this.handleEvent('cell-click')}
                                on-cell-dblclick={this.handleEvent('cell-dblclick')}
                                on-row-click={this.handleEvent('row-click')}
                                on-row-contextmenu={this.handleEvent('row-contextmenu')}
                                on-row-dblclick={this.handleEvent('row-dblclick')}
                                on-header-click={this.handleEvent('header-click')}
                                on-sort-change={this.handleEvent('sort-change')}
                                on-filter-change={this.handleEvent('filter-change')}
                                on-current-change={this.handleEvent('current-change')}
                                on-header-dragend={this.handleEvent('header-dragend')}
                                on-expand={this.handleEvent('expand')}
                                >
                                    {
                                        this.createCol(columns,columnDefaultAttr)
                                    }
                        </el-table>
                    </div>
                    <div slot="secondbox" >
                        <yl-toolbar>
                                <el-pagination   
                                    on-size-change={this.handleSizeChange}
                                    on-current-change={this.handleCurrentChange}
                                    current-page={this.input.draw}
                                    page-sizes={this.paginationAttr.pageSizes}
                                    page-size={this.input.maxResultCount}
                                    total={this.tableData.length}
                                    layout={this.paginationAttr.layout}>
                                </el-pagination>
                        </yl-toolbar>
                    </div>
              </yl-layout>
    }
}

