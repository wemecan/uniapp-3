import Vue from 'vue'
import Router from './hhyang-uni-simple-router/index.js'
Vue.use(Router)

// 该路由表必须严格按照pages内容
const router = new Router({
  routes: [
    {
      path: '/pages/login/index',
      aliasPath: '/',
      name: 'login',
      meta: {
        title: '登录',
      },
    },
    {
      path: '/pages/work/index',
      name: 'work',
      meta: {
        title: '工作台',
      },
    },
    {
      path: '/pages/mine/index',
      name: 'mine',
      meta: {
        title: '我',
      },
    },
    {
      path: '/pages/report/index',
      name: 'report',
      meta: {
        title: '报表',
      },
    },
    {
      path: '/pages/news/index',
      name: 'news',
      meta: {
        title: '消息',
      },
    },
    {
      path: '/pages/handle/index',
      name: 'handle',
      meta: {
        title: '待办',
      },
    },
    {
      path: '/pages/complete/index',
      name: 'complete',
      meta: {
        title: '已办',
      },
    },
    {
      path: '/pages/approval/index',
      name: 'approval',
      meta: {
        title: '审批',
      },
    },
    {
      path: '/pages/pdf-view/index',
      name: 'pdf-view',
      meta: {
        title: '文件预览',
      },
    },
    {
      path: '/pages/news-details/news-details',
      name: 'news-details',
      meta: {
        title: '消息明细',
      },
    },
    {
      path: '/pages/personal-info/personal-info',
      name: 'personal-info',
      meta: {
        title: '个人信息',
      },
    },
    {
      path: '/pages/pwd-edit/pwd-edit',
      name: 'pwd-edit',
      meta: {
        title: '修改密码',
      },
    },
    {
      path: '/pages/report-iframe/report-iframe',
      name: 'report-iframe',
      meta: {
        title: '报表查看',
      },
    },
    {
      path: '/pages/price-confirm/price-confirm',
      name: 'price-confirm',
      meta: {
        title: '定价确认',
      },
    },
    {
      path: '/pages/document/document',
      name: 'document',
      meta: {
        title: '我的单据',
      },
    },
    {
      path: '/pages/invoice-registration/invoice-registration',
      name: 'invoice-registration',
      meta: {
        title: '收票登记（内）',
      },
    },
    {
      path: '/pages/supplier/supplier',
      name: 'supplier',
      meta: {
        title: '供应商',
      },
    },
    {
      path: '/pages/price-registration/price-registration',
      name: 'price-registration',
      meta: {
        title: '定价登记',
      },
    },
    {
      path: '/pages/price-registration/price-batch/price-batch',
      name: 'price-batch',
      meta: {
        title: '定价批次选择',
      },
    },
    {
      path: '/pages/storage-notice/storage-notice',
      name: 'storage-notice',
      meta: {
        title: '新建入库单',
      },
    },
    {
      path: '/pages/storage-notice/supplier-select/supplier-select',
      name: 'supplier-select',
      meta: {
        title: '供应商选择',
      },
    },
    {
      path: '/pages/storage-notice/storage-select/storage-select',
      name: 'storage-select',
      meta: {
        title: '仓库选择',
      },
    },
    {
      path: '/pages/storage-notice/purchase-batch-select/purchase-batch-select',
      name: 'purchase-batch-select',
      meta: {
        title: '采购批次选择',
      },
    },
    {
      path: '/pages/storage-notice/add-cost/add-cost',
      name: 'add-cost',
      meta: {
        title: '添加费用',
      },
    },
    {
      path: '/pages/fund-apply/fund-apply',
      name: 'fund-apply',
      meta: {
        title: '付款申请',
      },
    },
    {
      path: '/pages/fund-apply/fund-apply-detail/fund-apply-detail',
      name: 'fund-apply-detail',
      meta: {
        title: '付款申请详细信息',
      },
    },
    {
      path: '/pages/fund-apply/choose-contract-info/choose-contract-info',
      name: 'choose-contract-info',
      meta: {
        title: '定价批次选择',
      },
    },
    {
      path: '/pages/fund-apply/cust-credit-list/cust-credit-list',
      name: 'cust-credit-list',
      meta: {
        title: '临时授信',
      },
    },

    {
      path: '/pages/fund-apply/choose-claim-info/choose-claim-info',
      name: 'choose-claim-info',
      meta: {
        title: '预收款认领列表',
      },
    },
    {
      path: '/pages/fund-confirm/fund-confirm',
      name: 'fund-confirm',
      meta: {
        title: '付款确认',
      },
    },
    {
      path: '/pages/fund-confirm/choose-fund-apply/choose-fund-apply',
      name: 'choose-fund-apply',
      meta: {
        title: '选择付款申请',
      },
    },
    {
      path: '/pages/fund-confirm/acceptanceInfo/acceptanceInfo',
      name: 'fund-acceptanceInfo',
      meta: {
        title: '承兑汇票列表',
      },
    },
    {
      path: '/pages/fund-confirm/lcConfirmDialog/lcConfirmDialog',
      name: 'fund-lcConfirmDialog',
      meta: {
        title: '开证确认列表',
      },
    },
    {
      path: '/pages/ladingBill/ladingBill',
      name: 'ladingBill',
      meta: {
        title: '提单登记',
      },
    },
    //
  ],
})

export default router
