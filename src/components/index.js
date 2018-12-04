import Vue from 'vue'
import VueAMap from 'vue-amap';
Vue.use(VueAMap);

//初始化地图组件
VueAMap.initAMapApiLoader({
    key: '6ee9a3644c56a3b842a2ac09d3b2b24d',
    plugin: ['AMap.Autocomplete',
              'AMap.PlaceSearch', 
              'AMap.Scale', 
              'AMap.OverView', 
              'AMap.ToolBar',
              'AMap.MapType',
              'AMap.PolyEditor',
              'AMap.CircleEditor',
              'AMap.Geocoder',
              'AMap.Geolocation'],
    // 默认高德 sdk 版本为 1.4.4
    v: '1.4.4'
  });

//通用工具组件
import lazyRender from './lazyrender/lazyRender'
import PanelPage  from   './panel/PanelPage';
import ToolBar  from   './toolbar/ToolBar';
import ColumnLay  from   './layout/ColumnLay';
import TreeSelect from './treeselect/TreeSelect';
import commonTree from './commontree/commonTree';
import commonAllTree from './commontree/commonAllTree';
import commontreeWithPanel from './commontreewithpanel/commontreeWithPanel';
import commonAlltreeWithPanel from './commontreewithpanel/commonAlltreeWithPanel';
import Layout from './layout/Layout';
import Table from './table/Table.js';
import TableR from './table/TableR.js';
import OnlyTable from './table/OnlyTable.js';
import tableEdit from './tableedit/tableEdit'
import jsonEditor from './editor/jsonEditor'
// import mdEditor from './editor/mdEditor'
import wangEditor from './editor/wangEditor/wangEditor.vue'
import CommonSelect from './commonselect/CommonSelect'
import sumBlock from './container/sumBlock'
import queryContainerR from './container/queryContainerR'
import statisticsBlock from './container/statisticsBlock'
import selectContainer from './container/selectContainer'
import selectContainerR from './container/selectContainerR'
import commemt from '@/ocomponents/commemt/commemt'
import htmlContainer from './container/htmlContainer'
import queryChart from './container/queryChart'
import queryListR from './container/queryListR'
import renderComs from './rendercoms/renderComs'
import renderSelComs from './rendercoms/renderSelComs'
import renderTableRowComs from './rendercoms/renderTableRowComs'
import tableSlotComs from './rendercoms/tableSlotComs'
import containerComs from './rendercoms/containerComs'
import dynamicForm from './dynamicmodule/dynamicForm'
import dynamicModule from './dynamicmodule/dynamicModule'
import reportAssemble from './reportAssemble/reportAssemble'
import commonPage from './commonPage/commonPage'
import dynamicPage from './dynamicPage/dynamicPage'
import singleUpload from './upload/singleUpload'
import multipleUpload from './upload/multipleUpload'
import formContainer from './container/formContainer' 
import filterContainer from './container/filterContainer'
import timeBar from './timeBar/timeBar' 
import dynamicCol from './dynamiccol/dynamicCol' 
import ECharts from '@/components/chart'
import listshowComs from './rendercoms/listshowComs'
import List from './list/list'
import Html from './list/card/html'
import card from './list/card/card'
import treecard from './list/treecard/treecard'
import radio from './radioGroup/radio'
import alert from './container/alert'
import keyboard from './keyboard/keyboard'
import linkblock from './linkBlock/linkblock'
import datepicker from './datePicker/datepicker'
import splitline from './splitline/splitLine'
import Map from './map/Map'
//注册全局组件
Vue.component('yl-lazyrender', lazyRender)
Vue.component('yl-panelpage', PanelPage)  
Vue.component('yl-toolbar', ToolBar) 
Vue.component('yl-columnlay', ColumnLay) 
Vue.component('yl-layout', Layout) 
Vue.component('yl-treeselect', TreeSelect)   
Vue.component('yl-commontree', commonTree)   
Vue.component('yl-commonalltree', commonAllTree) 
Vue.component('yl-commontreewithpanel', commontreeWithPanel)   
Vue.component('yl-commonalltreewithpanel', commonAlltreeWithPanel)   
Vue.component('yl-table', Table)
Vue.component('yl-tableR', TableR)
Vue.component('yl-list', List)
Vue.component('yl-onlytable', OnlyTable)
Vue.component('yl-tableedit', tableEdit)
Vue.component('yl-selectcontainer', selectContainer)
Vue.component('yl-selectcontainerR', selectContainerR)
Vue.component('yl-querycontainerR', queryContainerR)
Vue.component('yl-rendercoms', renderComs)
Vue.component('yl-rendertablerowcoms', renderTableRowComs)
Vue.component('yl-renderselcoms', renderSelComs)
Vue.component('yl-containercoms', containerComs)
Vue.component('yl-listshowComs', listshowComs)
Vue.component('yl-tableSlotComs', tableSlotComs)
Vue.component('yl-dynamicform', dynamicForm)
Vue.component('yl-dynamicmodule', dynamicModule)
Vue.component('yl-queryChart', queryChart)
Vue.component('yl-querylistR', queryListR)
Vue.component('yl-htmlContainer', htmlContainer)
Vue.component('yl-commemt', commemt)
Vue.component('yl-commonselect', CommonSelect)
Vue.component('yl-reportassemble', reportAssemble)
Vue.component('yl-commonPage', commonPage)
Vue.component('yl-dynamicPage', dynamicPage)
Vue.component('yl-singleupload', singleUpload)
Vue.component('yl-multipleupload', multipleUpload)
Vue.component('yl-editor', wangEditor)
// Vue.component('yl-mdeditor', mdEditor)
Vue.component('yl-jsoneditor', jsonEditor)
Vue.component('yl-statisticsBlock', statisticsBlock)
Vue.component('yl-formContainer', formContainer)
Vue.component('yl-filter', filterContainer)
Vue.component('yl-timebar', timeBar)
Vue.component('yl-dynamiccol', dynamicCol)
Vue.component('yl-echarts', ECharts)
Vue.component('yl-htmlRaw', Html)
Vue.component('yl-card', card)
Vue.component('yl-treecard', treecard)
Vue.component('yl-radio', radio)
Vue.component('yl-sumblock', sumBlock)
Vue.component('yl-alert', alert)
Vue.component('yl-keyboard', keyboard)
Vue.component('yl-linkblock', linkblock)
Vue.component('yl-datepicker', datepicker)
Vue.component('yl-splitline', splitline)
Vue.component('yl-map', Map)


