<template>
    <view class="fundApplyPages">
        <qm-navbar :event="goBack" title="付款申请"></qm-navbar>
        <view class="fund-content">
            <view class="fund-list">
                <!-- 单据号 -->
                <view class="fund-item disabled">
                    <view class="item-left">
                        单据号
                    </view>
                    <view class="item-right">
                        <input type="number" disabled placeholder="请输入价格" v-model="formData.applyNo" />
                    </view>
                </view>
                <!-- 申请日期 * -->
                <view class="fund-item">
                    <view class="item-left danger">
                        申请日期 *
                    </view>
                    <view class="item-right">
                        <picker mode="date" class="item-input" v-model="formData.applyDate" @change="bindStartDateChange">
                            <view class="uni-input">
                                {{ formData.applyDate | dateFormate()}}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </picker>
                    </view>
                </view>
                <!-- 客户 -->
                <view class="fund-item">
                    <view class="item-left danger">
                        客户 *
                    </view>
                    <view class="item-right">
                        <picker :value="customerIndex" :range="customerList" :range-key="'name'" @change="customerNoChange">
                            <view class="uni-input">
                                {{formData.customerNo}}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </picker>
                    </view>
                </view>
                <view class="fund-item">
                    <view class="item-left danger">
                        申请类型 *
                    </view>
                    <view class="item-right">
                        <picker :value="fundApplyTypeIndex" :range="fundApplyTypeList" :range-key="'label'" @change="applyTypeChange">
                            <view class="uni-input">
                                {{formData.applyType | dataDictFormat('fundApplyType') }}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </picker>
                    </view>
                </view>
                <!-- 采购合同 -->
                <view class="fund-item" v-if="formData.applyType ==='A'" @click="contractNoSelect()">
                    <view class="item-left ">
                        采购合同
                    </view>
                    <view class="item-right">
                        {{formData.contractNo}}
                        <uni-icons type="arrowright" color="#999"></uni-icons>
                    </view>
                </view>
                <!-- 预收款单号 -->
                <view class="fund-item" @click="claimNoSelect()">
                    <view class="item-left ">
                        预收款单号
                    </view>
                    <view class="item-right">
                        {{formData.claimNo}}
                        <uni-icons type="arrowright" color="#999"></uni-icons>
                    </view>
                </view>
                <!-- 业务类别<strong></strong> -->
                <view class="fund-item" v-if="formData.applyType ==='LOT'">
                    <view class="item-left danger">
                        业务类别 *
                    </view>
                    <view class="item-right">
                        <picker :value="businessTypeIndex" :range="businessTypeList" :range-key="'label'" @change="businessTypeChange">
                            <view class="uni-input">
                                {{formData.businessType | dataDictFormat('fundApplyBusinessType') }}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </picker>
                    </view>
                </view>
                <!-- 单据号 -->
                <view class="fund-item disabled">
                    <view class="item-left danger">
                        申请金额 *
                    </view>
                    <view class="item-right">
                        <input type="number" disabled v-if="formData.applyType ==='LOT'" placeholder="请输入价格" v-model="formData.applyAmount" />
                        <input type="number" v-else placeholder="请输入价格" v-model="formData.applyAmount" @input="onApplyAmountChange(formData.applyAmount)" />
                    </view>
                </view>
                <view class="fund-item" :class="formData.applyType ==='RA'? 'disabled': ''">
                    <view class="item-left danger">
                        币种 *
                    </view>
                    <view class="item-right">
                        <view v-if="formData.applyType ==='RA'">
                            {{formData.currency | dataDictFormat('currency') }}
                        </view>
                        <view v-else>
                            <picker :value="currencyIndex" :range="curreryList" :range-key="'label'" @change="currenyChange">
                                <view class="uni-input">
                                    {{formData.currency | dataDictFormat('currency') }}
                                    <uni-icons type="arrowright" color="#999"></uni-icons>
                                </view>
                            </picker>
                        </view>
                    </view>
                </view>
                <view class="fund-item">
                    <view class="item-left danger">
                        付款方式 *
                    </view>
                    <view class="item-right" @click="paymentClick()">
                        {{formData.paymentTypeNames }}
                        <uni-icons type="arrowright" color="#999"></uni-icons>
                    </view>
                </view>
                <!-- 申请日期 * -->
                <view class="fund-item">
                    <view class="item-left">
                        最迟付款日期
                    </view>
                    <view class="item-right">
                        <picker mode="date" class="item-input" v-model="formData.latestPaymentDate" @change="bindStartDateChange2">
                            <view class="uni-input">
                                {{ formData.latestPaymentDate | dateFormate()}}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </picker>
                    </view>
                </view>
                <view class="fund-item">
                    <view class="item-left">
                        临时授信
                    </view>
                    <view class="item-right" @click="custCreditNSelect()">
                        {{formData.custCreditNo}}
                        <uni-icons type="arrowright" color="#999"></uni-icons>
                    </view>
                </view>
                <!-- 商品信息 -->
                <view class="fund-item item-header" v-if="formData.applyType==='LOT'">
                    <view class="item-left " @click="showFlag = !showFlag">
                        付款申请详细信息
                    </view>
                    <view class="item-right">
                        <button type="primary" size='mini' class="mini-btn" @click="addList()">
                            选择批次
                        </button>
                    </view>
                </view>
                <view class="detailWrap" v-if="fundApplyDetailDtoList.length !== 0 && showFlag">
                    <view class="productWrap" v-for="(item,i) in fundApplyDetailDtoList " :key='i'>
                        <view class="fund-item">
                            <view class="item-right">
                                <uni-icons type="clear" color="#999" @click="remove(i)"></uni-icons>
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                合同号
                            </view>
                            <view class="item-right">
                                {{item.contractNo }}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                批次号
                            </view>
                            <view class="item-right">
                                {{item.lotNo}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                批次类型
                            </view>
                            <view class="item-right">
                                {{item.lotType | dataDictFormat( 'bizCode') }}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                资金用途
                            </view>
                            <view class="item-right">
                                <picker :value="fundUseTypeIndex" :range="fundUseTypeList" :range-key="'label'" @change="fundUseTypeChange">
                                    <view class="uni-input">
                                        {{item.fundUseType }}
                                        <uni-icons type="arrowright" color="#999"></uni-icons>
                                    </view>
                                </picker>
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                商品
                            </view>
                            <view class="item-right">
                                {{item.productName}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                品牌
                            </view>
                            <view class="item-right">
                                <input type="text" placeholder="请输入品牌名称" v-model="item.brand" />
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                产地
                            </view>
                            <view class="item-right">
                                <input type="text" placeholder="请输入产地信息" v-model="item.spec" />
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                规格
                            </view>
                            <view class="item-right">
                                <input type="text" placeholder="请输入规格信息" v-model="item.origin" />
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                材质
                            </view>
                            <view class="item-right">
                                <input type="text" placeholder="请输入材质信息" v-model="item.productKeyAttr01" />
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                物资主属性2
                            </view>
                            <view class="item-right">
                                <input type="text" placeholder="请输入信息" v-model="item.productKeyAttr02" />
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                批次计量数量
                            </view>
                            <view class="item-right">
                                {{item.lotMeasurementQuantity}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                批次价格
                            </view>
                            <view class="item-right">
                                {{item.lotPrice}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                原币金额
                            </view>
                            <view class="item-right">
                                {{item.originalAmount}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                货值
                            </view>
                            <view class="item-right">
                                {{item.goodsAmount}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                申请中金额
                            </view>
                            <view class="item-right">
                                {{item.applyingAmount}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                已收已付金额
                            </view>
                            <view class="item-right">
                                {{item.hasPaymentAmount}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                申请金额
                            </view>
                            <view class="item-right">
                                {{item.applyAmoun}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                备注
                            </view>
                            <view class="item-right">
                                <input type="text" placeholder="请输入信息" v-model="item.remark" />
                            </view>
                        </view>
                    </view>
                </view>
                <view class="fund-item item-header" @click="showFlag2=!showFlag2">
                    <view class="item-left ">
                        付款方式信息
                    </view>
                    <view class="item-right">
                        {{showFlag2 ? "收起" : "展开" }}
                    </view>
                </view>
                <view class="detailWrap" v-if="fundApplyPaymentDtoList.length!==0 && showFlag2">
                    <view class="productWrap" v-for="(item,i) in fundApplyPaymentDtoList " :key='i'>
                        <view class="fund-item">
                            <view class="item-left danger">
                                付款方式*
                            </view>
                            <view class="item-right">
                                {{item.paymentType }}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left danger">
                                付款比例*
                            </view>
                            <view class="item-right">
                                <input type="number" placeholder="请输入付款比例" class="input" v-model="item.paymentRate" />
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left danger">
                                申请金额*
                            </view>
                            <view class="item-right">
                                {{item.applyAmount}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                备注
                            </view>
                            <view class="item-right">
                                <input type="text" placeholder="请输入信息" v-model="item.remark" />
                            </view>
                        </view>
                    </view>
                </view>
                <view class="fund-item item-header" @click="showFlag3=!showFlag3">
                    <view class="item-left ">
                        有关预付款申请信息
                    </view>
                    <view class="item-right">
                        {{showFlag3 ? "展开" : "收起" }}
                    </view>
                </view>
                <view class="detailWrap" v-if="fundAdvApplyDtoList.length!==0 && showFlag3">
                    <view class="productWrap" v-for="(item,i) in fundAdvApplyDtoList " :key="i">
                        <view class="fund-item">
                            <view class="item-left ">
                                单据号
                            </view>
                            <view class="item-right">
                                {{item.applyNo}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left danger">
                                申请日期
                            </view>
                            <view class="item-right">
                                {{ formData.applyDate | dateFormate()}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left">
                                申请金额
                            </view>
                            <view class="item-right">
                                {{item.applyAmount}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left">
                                币种
                            </view>
                            <view class="item-right">
                                {{item.currency | dataDictFormat( 'currency') }}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left">
                                确认状态
                            </view>
                            <view class="item-right">
                                {{item.confirmStatus | dataDictFormat( 'confirmStatus') }}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left">
                                确认金额
                            </view>
                            <view class="item-right">
                                {{item.confirmAmount}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left">
                                使用状态
                            </view>
                            <view class="item-right">
                                {{item.useStatus | dataDictFormat( 'useStatus') }}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left">
                                使用金额
                            </view>
                            <view class="item-right">
                                {{item.usedAmount}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left">
                                业务机构
                            </view>
                            <view class="item-right">
                                {{item.bizOrganName}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left">
                                业务部门
                            </view>
                            <view class="item-right">
                                {{item.bizDeptName}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left">
                                业务员
                            </view>
                            <view class="item-right">
                                {{item.bizEmployeeName}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left">
                                制单人
                            </view>
                            <view class="item-right">
                                {{item.optEmployeeName}}
                            </view>
                        </view>
                        <view class="fund-item">
                            <view class="item-left ">
                                备注
                            </view>
                            <view class="item-right">
                                <input type="text" placeholder="请输入信息" v-model="item.remark" />
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 业务机构-->
                <view class="fund-item">
                    <view class="item-left danger">
                        业务机构*
                    </view>
                    <view class="item-right">
                        <picker mode="selector" :value="bizOrganIndex" :range="bizOrganList" :range-key="'name'" @change="bizOrganChange">
                            <view class="uni-input">
                                {{formData.bizOrganCode }}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </picker>
                    </view>
                </view>
                <!-- 业务部门-->
                <view class="fund-item">
                    <view class="item-left danger">
                        业务部门*
                    </view>
                    <view class="item-right">
                        <picker mode="selector" :value="bizDeptIndex" :range="bizDeptList" :range-key="'name'" @change="bizDeptChange">
                            <view class="uni-input">
                                {{formData.bizDeptCode}}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </picker>
                    </view>
                </view>
                <!-- 业务员-->
                <view class="fund-item">
                    <view class="item-left danger">
                        申请人*
                    </view>
                    <view class="item-right">
                        <picker mode="selector" :value="formData.bizEmployeeCode" :range="bizEmployeeList" :range-key="'name'" @change="bizEmployeeChange">
                            <view class="uni-input">
                                {{formData.bizEmployeeCode}}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </picker>
                    </view>
                </view>
                <!-- 业务员-->
                <view class="fund-item">
                    <view class="item-left danger">
                        制单人*
                    </view>
                    <view class="item-right">
                        <picker mode="selector" :value="formData.optEmployeeCode" :range="bizEmployeeList" :range-key="'name'" @change="optEmployeeChange">
                            <view class="uni-input">
                                {{formData.optEmployeeCode}}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </picker>
                    </view>
                </view>
                <!-- 备注 -->
                <view class="remark">
                    <view class="item-left">
                        备注
                    </view>
                    <view class="item-right">
                        <textarea placeholder="请输入备注信息" v-model="formData.remark" />
                        </view>
				</view>
			</view>
		</view>
	<view class="bottom-btn" >
		<button class="cancel" @click="doCancle">取消</button>
		<button class="save" @click="doSave">保存</button>
	</view>
	<!-- 付款方式多选 -->
	<view class="dialog" v-if="payTypeVisible">
		<view class="dialog-mask"></view>
		<view class="dialog-content">
			<view class="title">
				付款方式
				<uni-icons class="close" type="closeempty" color="#333" size="16" @click.native="payTypeVisible = false"></uni-icons>
			</view>
			<view class="dialog-main main">
				<checkbox-group name="" @change="paymentTypeChange">
					<label class="uni-list-cell " v-for="item in paymentTypeList" :key="item.value">
						<view>
							{{item.label}}
							<checkbox :value="item.value" :checked="item.checked" class="checkbox" />
						</view>
					</label>
				</checkbox-group>
			</view>
			<view class="btn">
				<view  class="cancel" @click="payTypeVisible = false" >取消</view>
				<view  class="confirm" @click="paymentTypeConfirm" >确定</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
import request from '@/utils/request.js'
export default {
    data() {
        return {
            init: false,
            showFlag: true,
            showFlag2: true,
            showFlag3: true,
            payTypeVisible: false,
            optype: 'add',
            paymentClickList: [],
            productList: [],
            bizOrganList: [],
            bizDeptList: [],
            bizEmployeeList: [],
            fundApplyTypeList: [],
            curreryList: [],
            productList: [],
            customerList: [],
            fundAdvApplyDtoList: [],
            paymentTypeList: [],
            fundApplyPaymentDtoList: [],
            fundApplyDetailDtoList: [],
            fundUseTypeList: [],
            businessTypeList: [],
            customerIndex: 0,
            currencyIndex: 0,
            bizOrganIndex: 0,
            bizDeptIndex: 0,
            fundUseTypeIndex: 0,
            bizEmployeeIndex: 0,
            fundApplyTypeIndex: 0,
            businessTypeIndex: 0,
            paymentTypeIndex: 0,
            formData: {
                applyNo: '',
                applyDate: '',
                customerNo: '',
                applyType: 'LOT',
                contractNo: '',
                claimNo: '',
                businessType: 'B',
                applyAmount: '',
                currency: 'CNY',
                paymentTypeList: '',
                paymentTypeNames: '',
                latestPaymentDate: '',
                custCreditNo: '',
                bizOrganCode: '',
                bizOrganName: '',
                bizDeptCode: '',
                bizDeptName: '',
                bizEmployeeCode: '',
                bizEmployeeName: '',
                optEmployeeCode: '',
                optEmployeeName: '',
                remark: '',
            },
        }
    },
    watch: {
        // 选择批次回调
        init(val) {
            // const { fundApplyDetailDtoList } = this.$member.globalData
            const { fundApplyDetailDtoList } = this.$Route.params
            if (fundApplyDetailDtoList.length !== 0) {
                fundApplyDetailDtoList.forEach((row, index) => {
                    row.lotDetailNo = row.productDetailNo
                    row.lotType = row.billType
                    row.fundUseType = 'GOODS'
                    row.lotMeasurementQuantity = row.measurementQuantity
                    row.lotPrice = row.estimatedPrice
                    row.originalAmount = Number(row.originalAmount).toFixed(2)
                    row.goodsAmount = Number(row.goodsAmount).toFixed(2)
                    row.applyingAmount = Number(row.applyAmount).toFixed(2)
                    row.hasPaymentAmount = Number(row.hasPaymentAmount).toFixed(2)
                    row.applyAmount = Number(row.noneApplyAmount).toFixed(2)
                    row.remark = ''
                    this.fundApplyDetailDtoList.push(row)
                })
                // 后过滤
                let newData = []
                this.fundApplyDetailDtoList.forEach((row) => {
                    if (
                        !newData
                            .map((v) => {
                                return v.lotNo + v.lotDetailNo
                            })
                            .includes(row.lotNo + row.lotDetailNo)
                    ) {
                        newData.push(row)
                    }
                })
                this.fundApplyDetailDtoList = newData
                this.onApplyAmountChange()
            }
        },
        // 预收款回收列表回调
    },
    async onShow() {
        // const { priceList, contractList, claimList } = this.$member.globalData
        const { priceList, contractList, claimList } = this.$Route.query
        this.formData.applyDate = new Date().toISOString()
        // 获取默认信息
        request
            .post('/vrm/api/user', {
                data: '0',
                funcModule: '登录',
                funcOperation: '查询',
            })
            .then((res) => {
                this.formData.bizOrganCode = res.data.userOrganCode
                this.formData.bizDeptCode = res.data.userDeptCode
                this.formData.bizEmployeeCode = res.data.userEmployeeCode
                this.formData.optEmployeeCode = res.data.userEmployeeCode
            })

        // 客户customerNo
        const customerList = await this.getconList({
            type: 'CUST_INFO',
            queryParams: { usingFlag: '1', auditStatus: '3', typeCode: '2' },
        })
        // 获取部门信息
        const bizOrganList = await this.getconList({
            type: 'FUNC_ORG',
        })
        // 获取业务机构信息（x下拉）
        const bizDeptList = await this.getconList({
            type: 'FUNC_DEPT',
        })
        // 业务员
        const bizEmployeeList = await this.getconList({
            type: 'FUNC_EMPLOYEE',
        })
        this.customerList = customerList.data
        this.bizOrganList = bizOrganList.data
        this.bizDeptList = bizDeptList.data
        this.bizEmployeeList = bizEmployeeList.data

        this.fundApplyTypeList = this.$store.state.dictData.fundApplyType
        this.fundUseTypeList = this.$store.state.dictData.fundUseType
        this.businessTypeList = this.$store.state.dictData.fundApplyBusinessType
        this.curreryList = this.$store.state.dictData.currency
        this.paymentTypeList = this.$store.state.dictData.settlementTypePay
        if (contractList.length !== 0) {
            this.formData.contractNo = contractList[0].contractNo
        }
        if (claimList.length !== 0) {
            this.formData.claimNo = claimList[0].claimNo
            this.formData.customerNo = claimList[0].customerNo
            this.formData.applyAmount = (
                Number(claimList[0].claimAmount) - Number(claimList[0].usedAmount)
            ).toFixed(2)
            this.formData.currency = claimList[0].currency
        }

        if (Object.keys(priceList).length === 0) {
            this.showFlag3 = false
        } else {
            this.showFlag3 = true
        }
        this.formData = Object.assign(this.formData, priceList)
    },
    methods: {
        getconList(parmas) {
            return request.post('/vrm/api/dd/selectData/list', {
                data: parmas,
                funcModule: '入库通知新增',
                funcOperation: '查询',
            })
        },
        bindStartDateChange(e) {
            this.formData.applyDate = e.target.value
        },
        bindStartDateChange2(e) {
            this.formData.latestPaymentDate = e.target.value
        },
        async customerNoChange(e) {
            this.customerIndex = e.target.value
            this.formData.customerNo = this.customerList[this.customerIndex].code
            this.clearContractInfo(null)
            this.clearClaimInfo(null)
            this.clearApplyDetailInfo(true)
            const res = await request.post(
                '/vrm/api/fund/apply/listAdvApplyByCustomerNo',
                {
                    funcModule: '付款申请新增',
                    funcOperation: '查询',
                    data: this.formData.customerNo,
                }
            )
            if (res) {
                this.fundAdvApplyDtoList = res.data
            } else {
                this.fundAdvApplyDtoList = []
            }
        },
        // 清空采购合同信息
        clearContractInfo(isInit) {
            this.formData.contractNo = ''
            if (isInit) {
                this.formData.applyAmount = ''
            }
        },
        // 清空预收款认领信息
        clearClaimInfo(isInit) {
            this.formData.claimNo = ''
            if (isInit) {
                this.formData.applyAmount = ''
            }
        },
        // 清空申请详细信息
        clearApplyDetailInfo(isInit) {
            if (this.fundApplyDetailDtoList[0] && isInit) {
                this.fundApplyDetailDtoList = []
                this.formData.applyAmount = ''
            }
        },
        currenyChange(e) {
            this.currencyIndex = e.target.value
            this.formData.currency = this.curreryList[this.currencyIndex].value
        },
        // 申请类型change事件
        applyTypeChange(e) {
            this.fundApplyTypeIndex = e.target.value
            this.formData.applyType = this.fundApplyTypeList[
                this.fundApplyTypeIndex
            ].value
            if (this.formData.applyType === 'A') {
                // 预付款
                this.formData.applyAmount = ''
                this.formData.contractNo = ''
                this.fundApplyDetailDtoList = []
            }
            if (this.formData.applyType === 'RA') {
                // 退预收款
                this.formData.applyAmount = ''
                this.formData.claimNo = ''
                this.fundApplyDetailDtoList = []
            }
            if (this.formData.applyType === 'LOT') {
                this.formData.contractNo = ''
                this.formData.claimNo = ''
                this.formData.applyAmount = ''
                this.fundApplyDetailDtoList = []
            }
        },
        // 付款方式change事件
        paymentTypeChange(vals) {
            const list = []
            vals.detail.value.forEach((val) => {
                this.paymentTypeList.forEach((va) => {
                    if (va.value === val) {
                        list.push(va.label)
                    }
                })
                this.formData.paymentTypeNames = list.toString()
            })
            this.formData.paymentTypeList = vals.detail.value
        },
        paymentTypeConfirm(e) {
            this.payTypeVisible = false
            this.fundApplyPaymentDtoList = []
            if (this.formData.paymentTypeList.length > 0) {
                var paymentRate = ''
                paymentRate = (
                    Number(100) / Number(this.formData.paymentTypeList.length)
                ).toFixed(2)
                this.formData.paymentTypeList.forEach((val, index) => {
                    var fundApplyPaymentDto = {}
                    fundApplyPaymentDto.paymentType = val
                    if (index === this.formData.paymentTypeList.length - 1) {
                        const number2 = (Number(paymentRate) * index).toFixed(2)
                        paymentRate = (Number(100) - number2).toFixed(2)
                    }
                    fundApplyPaymentDto.paymentRate = paymentRate
                    fundApplyPaymentDto.applyAmount = (
                        (Number(this.formData.applyAmount) * Number(paymentRate)) /
                        100
                    ).toFixed(2)
                    fundApplyPaymentDto.remark = ''
                    this.fundApplyPaymentDtoList.push(fundApplyPaymentDto)
                })
            }
        },
        // 业务类别change事件
        businessTypeChange(e) {
            this.businessTypeIndex = e.target.value
            this.formData.businessType = this.businessTypeList[
                this.businessTypeIndex
            ].value
            this.clearApplyDetailInfo(true)
        },
        bizDeptChange(e) {
            this.bizDeptIndex = e.target.value
            this.formData.bizDeptCode = this.bizDeptList[this.bizDeptIndex].code
        },
        bizOrganChange(e) {
            this.bizOrganIndex = e.target.value
            this.formData.bizOrganCode = this.bizOrganList[this.bizOrganIndex].code
        },
        bizEmployeeChange(e) {
            this.bizEmployeeIndex = e.target.value
            this.formData.bizEmployeeCode = this.bizEmployeeList[
                this.bizEmployeeIndex
            ].code
            this.formData.bizEmployeeName = this.bizEmployeeList[
                this.bizEmployeeIndex
            ].name
        },
        paymentClick() {
            this.payTypeVisible = !this.payTypeVisible
        },
        // 添加
        addList() {
            if (!this.formData.customerNo) {
                uni.showToast({
                    title: '客户选择不能为空',
                    icon: 'none',
                })
                return
            }
            if (!this.formData.businessType) {
                uni.showToast({
                    title: '业务类别不能为空',
                    icon: 'none',
                })
                return
            }
            if (!this.formData.bizOrganCode) {
                uni.showToast({
                    title: '业务机构不能为空',
                    icon: 'none',
                })
                return
            }
            this.$Router.push({
                path: '/pages/fund-apply/fund-apply-detail/fund-apply-detail',
                params: {
                    customerNo: this.formData.customerNo,
                    businessType: this.formData.businessType,
                    bizOrganCode: this.formData.bizOrganCode,
                },
            })
        },

        // 临时授信
        async custCreditNSelect() {
            if (this.formData.customerNo === '') {
                uni.showToast({
                    title: '请输入客户信息',
                    icon: 'none',
                })

                return
            }
            this.$Router.push({
                path: '/pages/fund-apply/cust-credit-list/cust-credit-list',
                params: {
                    customerNo: this.formData.customerNo,
                },
            })
            // uni.navigateTo({
            //   url: `/pages/fund-apply/cust-credit-list/cust-credit-list?customerNo=${
            //     this.formData.customerNo
            //   }`,
            // })
        },
        // 采购合同
        async contractNoSelect() {
            // 输入验证
            if (this.formData.customerNo === '') {
                uni.showToast({
                    title: '请输入客户信息',
                    icon: 'none',
                })
                return
            }
            if (this.formData.bizOrganCode === '') {
                uni.showToast({
                    title: '请输入客户信息',
                    icon: 'none',
                })
                return
            }
            this.$Router.push({
                path: '/pages/fund-apply/choose-contract-info/choose-contract-info',
                params: {
                    customerNo: this.formData.customerNo,
                    bizOrganCode: this.formData.bizOrganCode,
                },
            })
        },
        // 预收款单号
        async claimNoSelect() {
            // 输入验证
            if (this.formData.customerNo === '') {
                uni.showToast({
                    title: '请输入客户信息',
                    icon: 'none',
                })
                return
            }
            if (this.formData.bizOrganCode === '') {
                uni.showToast({
                    title: '请输入客户信息',
                    icon: 'none',
                })
                return
            }
            this.$Router.push({
                path: '/pages/fund-apply/choose-claim-info/choose-claim-info',
                params: {
                    customerNo: this.formData.customerNo,
                    bizOrganCode: this.formData.bizOrganCode
                }
            })
        },
        // 申请金额change事件
        onApplyAmountChange() {
            var applyAmount = 0
            this.fundApplyDetailDtoList.forEach((row) => {
                applyAmount = (Number(applyAmount) + Number(row.applyAmount)).toFixed(2)
            })
            this.formData.applyAmount = applyAmount + ''
            this.applyAmountChange(applyAmount)
        },
        // 申请金额change事件
        applyAmountChange(val) {
            var fundApplyPaymentDtoList = this.fundApplyPaymentDtoList
            fundApplyPaymentDtoList.forEach((fundApplyPaymentDto, index) => {
                fundApplyPaymentDto.applyAmount = (
                    (Number(val) * Number(fundApplyPaymentDto.paymentRate)) /
                    100
                ).toFixed(2)
            })
            this.fundApplyPaymentDtoList = fundApplyPaymentDtoList
        },
        // 展开/收起
        toggleShow() {
            this.showFlag = !this.showFlag
        },

        async doSave() {
            const parms = this.formData
            parms.fundApplyDetailDtoList = this.fundApplyDetailDtoList
            parms.fundApplyPaymentDtoList = this.fundApplyPaymentDtoList
            parms.fundAdvApplyDtoList = this.fundAdvApplyDtoList
            if (
                !this.formData.applyDate ||
                !this.formData.customerNo ||
                !this.formData.applyType ||
                !this.formData.applyAmount ||
                !this.formData.currency ||
                !this.formData.bizDeptCode ||
                !this.formData.bizOrganCode ||
                !this.formData.bizEmployeeCode ||
                !this.formData.optEmployeeCode
            ) {
                uni.showToast({
                    icon: 'none',
                    title: '必填项不得为空',
                })
                return
            } else if (
                this.formData.applyType === 'LOT' &&
                !this.formData.businessType
            ) {
                uni.showToast({
                    icon: 'none',
                    title: '业务类别选择不能为空',
                })
                return
            }
            if (this.formData.applyType === 'RA' && !this.formData.claimNo) {
                uni.showToast({
                    icon: 'none',
                    title: '预收款单号不能为空',
                })
                return
            }
            parms.applyDate = this.dateFormate(parms.applyDate)
            parms.latestPaymentDate = this.dateFormate(parms.latestPaymentDate)
            uni.showModal({
                title: '提示',
                content: '请确认当前数据已经准确无误，是否确定保存？',
                success: async (res) => {
                    if (res.confirm) {
                        let params = this.formData
                        const res = await request.post('/vrm/api/fund/apply/save', {
                            funcModule: '付款申请新增',
                            funcOperation: '保存',
                            data: parms,
                        })
                        if (res.status) {
                            uni.showToast({
                                title: '保存成功',
                            })
                        } else {
                            uni.showToast({
                                title: res.msgText,
                                icon: 'none',
                            })
                        }
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                },
            })
        },

        // 清空采购合同信息
        clearContractInfo(isInit) {
            this.formData.contractNo = ''
            if (isInit) {
                this.formData.applyAmount = ''
            }
        },
        // 清空预收款认领信息
        clearClaimInfo(isInit) {
            this.formData.claimNo = ''
            if (isInit) {
                this.formData.applyAmount = ''
            }
        },
        // 清空申请详细信息
        clearApplyDetailInfo(isInit) {
            if (this.fundApplyDetailDtoList[0] && isInit) {
                this.fundApplyDetailDtoList = []
                this.formData.applyAmount = ''
            }
        },
        doCancle() {
            this.$Router.push({
                path: '/pages/work/index',
            })
        },
        remove(e) {
            uni.showModal({
                title: '提示',
                content: '确认是否删除？',
                success: (res) => {
                    if (res.confirm) {
                        this.fundApplyDetailDtoList.splice(e, 1)
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                },
            })
        },
        dateFormate(date) {
            if (date) {
                const year = new Date(date).getFullYear() + ''
                const month =
                    new Date(date).getMonth() + 1 > 9
                        ? new Date(date).getMonth() + 1
                        : '0' + (new Date(date).getMonth() + 1)
                const day =
                    new Date(date).getDate() > 9
                        ? new Date(date).getDate()
                        : '0' + new Date(date).getDate()
                return year + month + day
            }
        },
        goBack() {
            this.$Router.push('/pages/work/index')
        }
    }
}
</script>

<style scoped lang="scss">
.danger {
  color: red;
}
.fundApplyPages {
  .fund-content {
    height: calc(100vh - 88upx);
    background-color: #f5f5f5;
    overflow: scroll;

    .fund-list {
      font-size: 28upx;
      .fund-item {
        padding-left: 20upx;
        padding-right: 20upx;
        background-color: #fff;
        display: flex;
        line-height: 86upx;
        border-bottom: 1px solid #f5f5f5;

        .item-left {
          width: 40%;
        }
        .item-right {
          flex: 1;
          text-align: right;
          font-size: 24upx;
          input {
            height: 86upx;
            font-size: 20upx;
            color: #999;
          }
          .arrowright {
            color: #999;
            text-align: right;
            width: 20upx;
          }

          button {
            margin: 5upx;
            display: inline-flex;
          }
        }
      }

      .disabled {
        opacity: 0.5;
      }
      .item-header {
        background-color: #eff6ff;
      }
      .detailWrap {
        border-radius: 10upx;
        overflow: hidden;
        margin: 20upx;
        .productWrap {
          background-color: #fff;
          margin-bottom: 20upx;
          .uni-input-input {
            font-size: 24upx;
          }
        }

        .fund-item {
          line-height: 80upx;
          border: 0;
          font-size: 24upx;
          .item-left {
            width: 50%;
          }
          .item-right {
            color: #666;
            .input {
              .uni-input-input {
                font-size: 24upx;
              }
            }
          }
        }

        .noProduct {
          text-align: center;
          font-size: rem(26);
          color: #aaa;
        }

        .invioceTitle {
          font-size: 26upx;
          padding: 0upx 30upx;
          margin-top: 20upx;
          text-align: right;
          line-height: 40upx;
        }
      }
      .remark {
        margin-bottom: 100upx;
        padding: 20upx;
        background-color: #fff;
        .item-left {
          font-size: 26upx;
          line-height: 64upx;
        }
        .item-right textarea {
          width: 100%;
          border: 1px solid #f1f1f1;
          font-size: 24upx;
          padding-left: 5upx;
          height: 130upx !important;
        }
      }
    }
  }
}
.bottom-btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 106upx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #f5f5f5;
  uni-button {
    width: 200upx;
    height: 70upx;
    line-height: 70upx;
    color: #ffffff;
    font-size: 32upx;
  }

  .cancel {
    background-color: rgb(152, 154, 162);
  }

  .save {
    background-color: rgb(240, 65, 65);
  }

  .agree {
    background-color: rgb(56, 128, 255);
  }

  &.bottom-btn-3 {
    uni-button {
      width: 228upx;
    }
  }
}
.dialog {
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  box-sizing: border-box;

  .dialog-mask {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.6);
  }

  .dialog-content {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 80%;
    max-height: 80vh;
    overflow-y: auto;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border-radius: 20upx;
    overflow: hidden;
    z-index: 999;

    & > .title {
      width: 100%;
      height: 88upx;
      line-height: 88upx;
      color: #333;
      text-align: center;
      font-size: 32upx;

      .close {
        position: absolute;
        right: 20upx;
      }
    }

    .main {
      width: 100%;
      height: calc(80vh - 88upx);
      overflow-y: auto;
      padding: 20upx 40upx;
      box-sizing: border-box;
      font-size: 28upx;
      line-height: 80upx;
      .checkbox {
        transform: scale(0.7);
        position: absolute;
        right: 20upx;
      }
    }
    .btn {
      display: flex;
      font-size: 32upx;
      margin-top: 20upx;
      height: 80upx;
      border-top: 1px solid #f1f1f1;
      view {
        border: 0;
        flex: 1;
        width: 50%;
        text-align: center;
        line-height: 80upx;
      }
      .cancel {
        border-right: 1px solid #f1f1f1;
      }
    }
    .dialog-main {
      height: auto;
    }
  }
}
</style>
