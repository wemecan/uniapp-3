import mainGoodCols from './mainGoodCols'
import reserveGoodCols from './reserveGoodCols'

export default {
  // 选择批次详情
  batchDetails: {
    title: '批次详情',
    mainInfo: {
      title: '主信息',
      formData: [
        {
          name: '单据类型',
          prop: 'billType',
          dict: 'billTypeLot',
        },
        {
          name: '合同号',
          prop: 'contractNo',
        },
        {
          name: '批次号',
          prop: 'lotNo',
        },
        {
          name: '贸易类型',
          prop: 'tradeType',
          dict: 'tradeType',
        },
        {
          name: '抬头',
          prop: 'headlineNames',
        },
        {
          name: '客户',
          prop: 'customerNames',
        },
        {
          name: '签订日期',
          prop: 'signDate',
          formate: 'date',
        },
        {
          name: '有效期(始)',
          prop: 'lotLifeStart',
          formate: 'date',
        },
        {
          name: '有效期(止)',
          prop: 'lotLifeEnd',
          formate: 'date',
        },
        {
          name: '商品名称',
          prop: 'productName',
        },
        ...mainGoodCols,
        {
          name: '定价方式',
          prop: 'pricingType',
          dict: 'pricingType',
        },
        {
          name: '价格',
          prop: 'estimatedPrice',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '商品数量',
          prop: 'productQuantity',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '商品单位',
          prop: 'productUnitCode',
          dict: 'goodsUnit',
        },
        {
          name: '计量数量',
          prop: 'measurementQuantity',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '计量单位',
          prop: 'measurementUnitCode',
          dict: 'measurementUnit',
        },
        {
          name: '币种',
          prop: 'currency',
          dict: 'currency',
        },
        {
          name: '原币金额',
          prop: 'goodsAmount',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '申请中金额',
          prop: 'applyAmount',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '已收已付金额',
          prop: 'noneApplyAmount',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '可认领金额',
          prop: 'noneClaimAmount',
          formate: 'thousands',
          precision: 2,
        },

        {
          name: '业务经理',
          prop: 'bizEmployeeName',
        },
        {
          name: '制单人',
          prop: 'optEmployeeName',
        },
        {
          name: '制单日期',
          prop: 'docMakeDt',
          formate: 'date',
        },
      ],
    },
  },
  //采购合同选择详情
  contractDetails: {
    title: '合同选择详情',
    mainInfo: {
      title: '主信息',
      formData: [
        {
          name: '合同号',
          prop: 'contractNo',
        },
        {
          name: '单据类型',
          prop: 'tradeType',
          dict: 'tradeType',
        },
        {
          name: '单据类型',
          prop: 'tradeType',
          dict: 'tradeType',
        },
        {
          name: '抬头',
          prop: 'headlineNames',
        },
        {
          name: '供应商',
          prop: 'supplierNames',
        },
        {
          name: '签订日期',
          prop: 'signDate',
          formate: 'date',
        },
        {
          name: '有效期(始)',
          prop: 'contractLifeStart',
          formate: 'date',
        },
        {
          name: '有效期(止)',
          prop: 'contractLifeEnd',
          formate: 'date',
        },
        {
          name: '收款方式',
          prop: 'receiveType',
          dict: 'settlementType',
        },
        {
          name: '交货市场',
          prop: 'deliveryMarketName',
        },
        {
          name: '币种',
          prop: 'currency',
          dict: 'currency',
        },

        {
          name: '合同金额',
          prop: 'originalAmount',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '已申请金额',
          prop: 'excAmt',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '商品名称',
          prop: 'productName',
        },
        ...mainGoodCols,
        {
          name: '商品数量',
          prop: 'productQuantity',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '商品单位',
          prop: 'productUnitCode',
          dict: 'goodsUnit',
        },
        {
          name: '计量数量',
          prop: 'measurementQuantity',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '计量单位',
          prop: 'measurementUnitCode',
          dict: 'measurementUnit',
        },
        {
          name: '业务经理',
          prop: 'bizEmployeeName',
        },
        {
          name: '制单人',
          prop: 'optEmployeeName',
        },
        {
          name: '制单日期',
          prop: 'docMakeDt',
          formate: 'date',
        },
      ],
    },
  },
  // 预收款认领详情
  claimDetaile: {
    title: '预收款认领详情',
    mainInfo: {
      title: '主信息',
      formData: [
        {
          name: '单据号',
          prop: 'claimNo',
        },
        {
          name: '认领日期',
          prop: 'claimDate',
          formate: 'date',
        },
        {
          name: '客户',
          prop: 'customerName',
        },
        {
          name: '认领类型',
          prop: 'claimType',
          dict: 'fundClaimType',
        },
        {
          name: '收款单号',
          prop: 'receiveNo',
        },
        {
          name: '收款方式',
          prop: 'receiveType',
          dict: 'settlementType',
        },
        {
          name: '认领金额',
          prop: 'claimAmount',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '币种',
          prop: 'currency',
          dict: 'currency',
        },

        {
          name: '已使用金额',
          prop: 'usedAmount',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '使用状态',
          prop: 'useStatus',
          dict: 'useStatus',
        },
        {
          name: '业务机构',
          prop: 'bizOrganName',
        },
        {
          name: '业务部门',
          prop: 'bizDeptName',
        },
        {
          name: '业务员',
          prop: 'bizEmployeeName',
        },
        {
          name: '制单人',
          prop: 'optEmployeeName',
        },
      ],
    },
  },
  // 付款申请列表
  viewFundApplyInfo: {
    title: '付款申请列表',
    mainInfo: {
      title: '主信息',
      formData: [
        {
          name: '单据号',
          prop: 'applyNo',
        },
        {
          name: '申请单据类型',
          prop: 'applyBillType',
          dict: 'fundApplyBillType',
        },
        {
          name: '申请日期',
          prop: 'applyDate',
          formate: 'date',
        },
        {
          name: '客户',
          prop: 'customerName',
        },
        {
          name: '申请金额',
          prop: 'applyAmount',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '币种',
          prop: 'currency',
          dict: 'currency',
        },
        {
          name: '最迟付款日期',
          prop: 'latestPaymentDate',
          formate: 'date',
        },

        {
          name: '确认状态',
          prop: 'confirmStatus',
          dict: 'confirmStatus',
        },

        {
          name: '确认金额',
          prop: 'confirmAmount',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '业务机构',
          prop: 'bizOrganName',
        },
        {
          name: '业务部门',
          prop: 'bizDeptName',
        },
        {
          name: '业务员',
          prop: 'bizEmployeeName',
        },
        {
          name: '制单人',
          prop: 'optEmployeeName',
        },
      ],
    },
  },
  //承兑汇票列表
  acceptanceInfo: {
    title: '承兑汇票列表',
    mainInfo: {
      title: '主信息',
      formData: [
        {
          name: '单据号',
          prop: 'infoNo',
        },
        {
          name: '汇票方向',
          prop: 'acceptanceDirection',
          dict: 'acceptanceDirection',
        },
        {
          name: '出票日期',
          prop: 'acceptanceDate',
          formate: 'date',
        },
        {
          name: '客户',
          prop: 'acceptanceNo',
        },
        {
          name: '票据号',
          prop: 'customerName',
        },
        {
          name: '票面金额',
          prop: 'acceptanceAmount',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '币种',
          prop: 'currency',
          dict: 'currency',
        },
        {
          name: '到期日',
          prop: 'dueDate',
          formate: 'date',
        },

        {
          name: '承兑银行',
          prop: 'acceptanceBank',
        },
        {
          name: '是否使用',
          prop: 'useFlag',
          dict: 'yesNo',
        },
        {
          name: '承兑汇票状态',
          prop: 'acceptanceStatus',
          dict: 'acceptanceStatus',
        },
        {
          name: '业务机构',
          prop: 'bizOrganName',
        },
        {
          name: '业务部门',
          prop: 'bizDeptName',
        },
        {
          name: '业务员',
          prop: 'bizEmployeeName',
        },
        {
          name: '制单人',
          prop: 'optEmployeeName',
        },
      ],
    },
  },
  // 开证确认列表
  lcConfirmDialog: {
    title: '开证确认列表',
    mainInfo: {
      title: '主信息',
      formData: [
        {
          name: '单据号',
          prop: 'confirmNo',
        },
        {
          name: '信用证号',
          prop: 'letterCreditNo',
        },
        {
          name: '信用证日期',
          prop: 'issueDate',
          formate: 'date',
        },
        {
          name: '客户',
          prop: 'customerName',
        },
        {
          name: '合同号',
          prop: 'contractNo',
        },
        {
          name: '信用证类型',
          prop: 'lcType',
          dict: 'letterCreditType',
        },
        {
          name: '信用证金额',
          prop: 'letterCreditAmount',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '已使用金额',
          prop: 'usedAmount',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '币种',
          prop: 'currency',
          dict: 'currency',
        },
        {
          name: '到期日',
          prop: 'dueDate',
          formate: 'date',
        },

        {
          name: '远期天数',
          prop: 'usanceDays',
        },
        {
          name: '是否使用',
          prop: 'useFlag',
          dict: 'yesNo',
        },

        {
          name: '业务机构',
          prop: 'bizOrganName',
        },
        {
          name: '业务部门',
          prop: 'bizDeptName',
        },
        {
          name: '业务员',
          prop: 'bizEmployeeName',
        },
        {
          name: '制单人',
          prop: 'optEmployeeName',
        },
      ],
    },
  },
  // 定价确认详情
  priceConfirmDetail: {
    title: '定价详情',
    mainInfo: {
      title: '主信息',
      formData: [
        {
          name: '合同号',
          prop: 'contractCode',
        },
        {
          name: '商品',
          prop: 'productCode',
        },
        {
          name: '定价登记号',
          prop: 'pricingCode',
        },
        {
          name: '购销类型',
          prop: 'purchaseOrSale',
          dict: 'purchaseOrSale',
        },
        {
          name: '币种',
          prop: 'currency',
          dict: 'currency',
        },
        {
          name: '商品名称',
          prop: 'productName',
        },
        {
          name: '定价方式',
          prop: 'pricingType',
          dict: 'pricingType',
        },
        {
          name: '定价基准',
          prop: 'pricingItemName',
        },
        {
          name: '定价日期',
          prop: 'pricingTime',
          formate: 'date',
        },
        {
          name: '定价数量',
          prop: 'pricingQuantity',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '确认数量',
          prop: 'confirmQuantity',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '计量单位',
          prop: 'valueUnit',
          dict: 'measurementUnit',
        },
        {
          name: '价格',
          prop: 'confirmPrice',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '确认说明',
          prop: 'bizDepconfirmNotetName',
        },
      ],
    },
  },
  // 定价登记选择
  priceBatchDetail: {
    title: '定价批次详情',
    mainInfo: {
      title: '主信息',
      formData: [
        {
          name: '定价批次号',
          prop: 'pricingLotCode',
        },
        {
          name: '合同号',
          prop: 'contractCode',
        },
        {
          name: '购销类型',
          prop: 'purchaseOrSale',
          dict: 'purchaseOrSale',
        },
        {
          name: '币种',
          prop: 'currency',
          dict: 'currency',
        },
        {
          name: '商品名称',
          prop: 'productName',
        },
        {
          name: '定价方式',
          prop: 'pricingType',
          dict: 'pricingType',
        },
        {
          name: '定价基准',
          prop: 'pricingItemName',
        },
        {
          name: '定价开始日',
          prop: 'pricingTimeStart',
          formate: 'date',
        },
        {
          name: '定价结束日',
          prop: 'pricingTimeEnd',
          formate: 'date',
        },
        {
          name: '定价数量',
          prop: 'pricingQuantity',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '未登记数量',
          prop: 'rmnMemQty',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '计量单位',
          prop: 'valueUnit',
          dict: 'measurementUnit',
        },
        {
          name: '升贴水',
          prop: 'premium',
          formate: 'thousands',
          precision: 2,
        },
        {
          name: '制单人',
          prop: 'docMaker',
        },
        {
          name: '制单日期',
          prop: 'docMakeDate',
          formate: 'date',
        },
        {
          name: '备注',
          prop: 'note',
        },
      ],
    },
  },
}
