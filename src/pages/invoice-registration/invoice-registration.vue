<template>
    <view class="registrationPages">
        <qm-navbar title="收票登记(内贸)"></qm-navbar>
        <view class="registration-content">
            <view class="registration-list">
                <!-- 票据号 -->
                <view class="registration-item" v-if="optype ==='view'">
                    <view class="item-left">
                        {{formData.receiveNo}}
                    </view>
                    <view class="item-right">
                        <view class="tag">
                            {{formData.auditStatus}}
                        </view>
                    </view>
                </view>
                <!--发票号  -->
                <view class="registration-item">
                    <view class="item-left danger">
                        发票号*
                    </view>
                    <view class="item-right">
                        <input type="text" placeholder="请输入发票号" v-model="formData.invoiceNo" :disabled="optype==='view'" />
                    </view>
                </view>
                <!-- 供应商 -->
                <view class="registration-item" v-if="optype !=='view'">
                    <view class="item-left danger">
                        供应商*
                    </view>
                    <view class="item-right" @click="supplierSelect()">
                        {{formData.customerName}}
                        <uni-icons type="arrowright" color="#999"></uni-icons>
                    </view>
                </view>
                <view class="registration-item" v-if="optype ==='view'">
                    <view class="item-left danger">
                        供应商*
                    </view>
                    <view class="item-right">
                        {{formData.customerName}}
                    </view>
                </view>
                <!-- 含税金额 -->
                <view class="registration-item" v-if="optype !=='view'">
                    <view class="item-left danger">
                        含税金额*
                    </view>
                    <view class="item-right">
                        <input type="text" placeholder="请输入发票号" v-model="formData.includeTaxAmount" />
                    </view>
                </view>
                <!-- 币种 -->
                <view class="registration-item" v-if="optype !=='view'">
                    <view class="item-left danger">
                        币种*
                    </view>
                    <view class="item-right">
                        <picker :value="currencyIndex" :range="curreryList" :range-key="'label'" @change="currenyChange">
                            <view class="uni-input">{{formData.currency | dataDictFormat('currency') }}</view>
                        </picker>
                    </view>
                </view>
                <!-- 商品信息 -->
                <view class="registration-item" v-if="optype !=='view'">
                    <view class="item-left ">
                        商品信息
                    </view>
                    <view class="item-right" @click="showFlag=!showFlag">
                        <button type="primary" size='mini' class="mini-btn">扫码</button>
                        <button type="primary" size='mini' class="mini-btn" @click="addList()">
                            添加</button>
                    </view>
                </view>
                <!-- 收票明细 -->
                <view class="registration-item" v-if="optype ==='view'" @click="toggleShow()">
                    <view class="item-left ">
                        收票明细
                    </view>
                    <view class="item-right">
                        <uni-icons type="arrowup" v-if="showFlag"></uni-icons>
                        <uni-icons type="arrowdown" v-if="!showFlag"></uni-icons>
                    </view>
                </view>
                <view class="detailWrap" v-if="showFlag">
                    <view class="noProduct" v-if="productList.length===0">
                        暂无商品信息
                    </view>
                    <view class="invioceTitle danger" v-if="optype ==='view'">
                        金额合计:￥ {{formData.includeTaxAmount}}
                    </view>
                    <view class="productWrap" v-for="(item,i) in productList" :key='i'>

                        <view class="registration-item" v-if="optype !=='view'">
                            <view class="item-right">
                                <uni-icons type="clear" @click="remove(item)"></uni-icons>
                            </view>
                        </view>
                        <view class="registration-item">
                            <view class="item-left ">
                                商品
                            </view>
                            <view class="item-right">
                                <picker mode="selector" :value="item.productCode" :range="productNames" :range-key="'name'" @change="productCodeChange($event,item)">
                                    <view class="uni-input">
                                        {{item.productName===''? '请选择商品信息': item.productName}}
                                    </view>
                                </picker>
                            </view>
                        </view>
                        <!--发票名称  -->
                        <view class="registration-item">
                            <view class="item-left ">
                                发票名称
                            </view>
                            <view class="item-right">
                                <input type="text" placeholder="请输入发票名称" v-model="item.invoiceName" />
                            </view>
                        </view>
                        <!--发票数量  -->
                        <view class="registration-item">
                            <view class="item-left ">
                                发票数量
                            </view>
                            <view class="item-right">
                                <input type="number" @input='invoiceQuantityChange(item)' placeholder="请输入发票数量" v-model="item.invoiceQuantity" />
                            </view>
                        </view>
                        <!--发票价格（不含税）  -->
                        <view class="registration-item">
                            <view class="item-left ">
                                发票价格（不含税）
                            </view>
                            <view class="item-right">
                                <input type="number" placeholder="请输入价格信息" v-model="item.excludeTaxPrice" />
                            </view>
                        </view>
                        <!--  发票金额（不含税） -->
                        <view class="registration-item">
                            <view class="item-left ">
                                发票金额（不含税）
                            </view>
                            <view class="item-right">
                                <input type="number" placeholder="请输入金额信息" v-model="item.excludeTaxAmount" @input='excludeTaxAmountChange(item)' />
                            </view>
                        </view>
                        <!--   税率(%)） -->
                        <view class="registration-item">
                            <view class="item-left ">
                                税率(%)
                            </view>
                            <view class="item-right">
                                <input type="number" placeholder="请输入税率" v-model="item.taxRate" @input='taxRateChange(item)' />
                            </view>
                        </view>
                        <!--   税额 -->
                        <view class="registration-item">
                            <view class="item-left ">
                                税额
                            </view>
                            <view class="item-right">
                                <input type="number" placeholder="请输入税额" v-model="item.taxAmount" />
                            </view>
                        </view>
                        <!--   发票价格（含税）-->
                        <view class="registration-item">
                            <view class="item-left ">
                                发票价格（含税）
                            </view>
                            <view class="item-right">
                                <input type="number" placeholder="请输入价格信息" v-model="item.includeTaxPrice" />
                            </view>
                        </view>
                        <!--   发票金额（含税）-->
                        <view class="registration-item">
                            <view class="item-left ">
                                发票金额（含税）
                            </view>
                            <view class="item-right">
                                <input type="number" placeholder="请输入金额信息" v-model="item.includeTaxAmount" @input='includeTaxAmountChange(item)' />
                            </view>
                        </view>
                        <!--  备注-->
                        <view class="registration-item">
                            <view class="item-left ">
                                备注
                            </view>
                            <view class="item-right">
                                <input type="text" placeholder="请输入备注信息" v-model="item.remark" />
                            </view>
                        </view>
                    </view>
                </view>
                <view class="registration-item">
                    <view class="item-left">
                        发票日期
                    </view>
                    <view class="item-right">
                        <picker mode="date" v-model="formData.invoiceDate" @change="bindStartDateChange">
                            <view class="uni-input">{{formData.invoiceDate | dateFormate() }}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </picker>
                    </view>
                </view>
                <!-- 业务机构-->
                <view class="registration-item">
                    <view class="item-left">
                        业务机构
                    </view>
                    <view class="item-right">
                        <picker mode="selector" :value="bizOrganIndex" :range="bizOrganList" :range-key="'name'" @change="bizOrganChange">
                            <view class="uni-input">
                                {{formData.bizOrganCode }}
                                <!-- {{bizOrganList[bizOrganIndex].name }} -->
                            </view>
                        </picker>
                    </view>
                </view>
                <!-- 业务部门-->
                <view class="registration-item">
                    <view class="item-left">
                        业务部门
                    </view>
                    <view class="item-right">
                        <picker mode="selector" :value="bizDeptIndex" :range="bizDeptList" :range-key="'name'" @change="bizDeptChange">
                            <view class="uni-input">
                                {{formData.bizDeptCode }}
                                <!-- {{bizDeptList[bizDeptIndex].name }} -->
                            </view>
                        </picker>
                    </view>
                </view>
                <!-- 业务员-->
                <view class="registration-item">
                    <view class="item-left">
                        业务员
                    </view>
                    <view class="item-right">
                        <picker mode="selector" :value="formData.bizEmployeeCode" :range="bizEmployeeList" :range-key="'name'" @change="bizEmployeeChange">
                            <view class="uni-input">
                                {{formData.bizEmployeeCode }}
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
		<view class="bottom-btn" v-if="optype !== 'view'">
			<button class="cancel" @click="doCancle">取消 </button>
			<button class="save" @click="doSave">保存</button>
			<button class="agree" @click="doAgree">提交</button>
		</view>
	</view>
</template>
<script>
import request from '@/utils/request.js'
export default {
    data() {
        return {
            showFlag: false,
            optype: 'add',
            productNames: [],
            curreryList: [],
            supplierList: [],
            bizOrganList: [],
            bizDeptList: [],
            bizEmployeeList: [],
            productList: [],
            formData: {
                invoiceNo: '',
                customerNo: '',
                customerName: '',
                includeTaxAmount: '',
                currency: 'CNY',
                invoiceDate: '',
                bizOrganCode: '',
                bizDeptCode: '',
                bizEmployeeName: '',
                bizEmployeeCode: '',
                remark: '',
            },
            bizOrganIndex: 0,
            bizDeptIndex: 0,
            bizEmployeeIndex: 0,
            currencyIndex: 0,
            productIndex: 0,
        }
    },
    onLoad() {
		const option = this.$Route.query
        if (option) {
            this.formData = Object.assign(this.formData, option)
            if (!option.optype) return
            this.optype = option.optype
            if (option.optype === 'edit') {
                request
                    .post('/vrm/api/invoice/domesticReceive/get', {
                        data: option.receiveNo,
                        funcModule: '收票登记（内贸）修改',
                        funcOperation: '查看',
                    })
                    .then((res) => {
                        if (res.status) {
                            this.formData = Object.assign(this.formData, res.data)
                            this.supplierList.forEach((item) => {
                                if (this.formData.customerNo === item.code) {
                                    this.formData.customerName = item.name
                                }
                            })
                        }
                    })
                //
                request
                    .post('/vrm/api/invoice/domReceDetail/listByReceiveNo', {
                        data: option.receiveNo,
                        funcModule: '收票登记（内贸）修改',
                        funcOperation: '查看',
                    })
                    .then((res) => {
                        if (res.status) {
                            this.productList = res.data
                        }
                    })
            }
            if (option.optype === 'view') {
                request
                    .post('/vrm/api/invoice/domesticReceive/get', {
                        data: option.receiveNo,
                        funcModule: '收票登记（内贸）查看',
                        funcOperation: '查看',
                    })
                    .then((res) => {
                        this.formData = Object.assign(this.formData, res.data)
                        this.$store.state.dictData.auditStatus.forEach((item) => {
                            if (res.data.auditStatus === item.value) {
                                this.formData.auditStatus = item.label
                            }
                        })
                        this.supplierList.forEach((item) => {
                            if (this.formData.customerNo === item.code) {
                                this.formData.customerName = item.name
                            }
                        })
                    })
                // 发票信息
                request
                    .post('/vrm/api/invoice/domReceDetail/listByReceiveNo', {
                        data: option.receiveNo,
                        funcModule: '收票登记（内贸）查看',
                        funcOperation: '查询',
                    })
                    .then((res) => {
                        if (res.status) {
                            this.productList = res.data
                        }
                    })
            }
        }
    },
    async onShow() {
        this.curreryList = this.$store.state.dictData.currency
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
        // 获取商品信息
        const productNames = await this.getconList({
            type: 'DD_PRODUCT',
        })
        // 获取供应商列表
        const supplierList = await this.getconList({
            type: 'CUST_INFO',
            queryParams: {
                auditStatus: '3',
                typeCode: '2',
                usingFlag: '1',
            },
        })
        this.bizOrganList = bizOrganList.data
        this.bizDeptList = bizDeptList.data
        this.bizEmployeeList = bizEmployeeList.data
        this.productNames = productNames.data
        this.supplierList = supplierList.data
        // 获取默认信息
        this.getUser()
    },
    methods: {
        // 发票数量change事件
        invoiceQuantityChange(param) {
            // // 数量修改影响不含税单价、含税单价
            if (Number(param.invoiceQuantity) !== 0) {
                param.excludeTaxPrice = (
                    Number(param.excludeTaxAmount) / Number(param.invoiceQuantity)
                ).toFixed(6)
                param.includeTaxPrice = (
                    Number(param.includeTaxAmount) / Number(param.invoiceQuantity)
                ).toFixed(2)
            } else {
                param.excludeTaxPrice = '0'
                param.includeTaxPrice = '0'
            }
        },
        // 含税金额change事件
        includeTaxAmountChange(row) {
            // 含税金额修改，影响含税单价、税额、不含税金额、不含税单价
            row.excludeTaxAmount = (
                Number(row.includeTaxAmount) /
                (1 + Number(row.taxRate) / 100)
            ).toFixed(2)
            row.taxAmount = (
                Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)
            ).toFixed(2)
            if (Number(row.invoiceQuantity) !== 0) {
                row.excludeTaxPrice = (
                    Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)
                ).toFixed(6)
                row.includeTaxPrice = (
                    Number(row.includeTaxAmount) / Number(row.invoiceQuantity)
                ).toFixed(2)
            } else {
                row.excludeTaxPrice = '0'
                row.includeTaxPrice = '0'
            }
            this.sumDetail()
        },
        // 不含税金额change事件
        excludeTaxAmountChange(row) {
            // 不含税金额修改，影响不含税单价、税额、含税金额、含税单价
            row.taxAmount = (
                (Number(row.excludeTaxAmount) * Number(row.taxRate)) /
                100
            ).toFixed(2)
            row.includeTaxAmount = (
                Number(row.excludeTaxAmount) + Number(row.taxAmount)
            ).toFixed(2)
            if (Number(row.invoiceQuantity) !== 0) {
                row.excludeTaxPrice = (
                    Number(row.excludeTaxAmount) / Number(row.invoiceQuantity)
                ).toFixed(6)
                row.includeTaxPrice = (
                    Number(row.includeTaxAmount) / Number(row.invoiceQuantity)
                ).toFixed(2)
            } else {
                row.excludeTaxPrice = '0'
                row.includeTaxPrice = '0'
            }
            this.sumDetail()
        },
        // 税率change事件
        taxRateChange(row) {
            // 税率修改，影响税额、含税金额、含税单价
            row.taxAmount = (
                (Number(row.excludeTaxAmount) * Number(row.taxRate)) /
                100
            ).toFixed(2)
            row.includeTaxAmount = (
                Number(row.excludeTaxAmount) + Number(row.taxAmount)
            ).toFixed(2)
            if (Number(row.invoiceQuantity) !== 0) {
                row.includeTaxPrice = (
                    Number(row.includeTaxAmount) / Number(row.invoiceQuantity)
                ).toFixed(2)
            } else {
                row.includeTaxPrice = '0'
            }
            this.sumDetail()
        },
        // 计算合计信息
        sumDetail() {
            var excludeTaxAmount = 0
            var taxAmount = 0
            var includeTaxAmount = 0
            this.productList.forEach((row) => {
                excludeTaxAmount = (
                    Number(excludeTaxAmount) + Number(row.excludeTaxAmount)
                ).toFixed(2)
                taxAmount = (Number(taxAmount) + Number(row.taxAmount)).toFixed(2)
                includeTaxAmount = (
                    Number(includeTaxAmount) + Number(row.includeTaxAmount)
                ).toFixed(2)
            })
            this.formData.excludeTaxAmount = excludeTaxAmount + ''
            this.formData.taxAmount = taxAmount + ''
            this.formData.includeTaxAmount = includeTaxAmount + ''
        },
        getconList(parmas) {
            return request.post('/vrm/api/dd/selectData/list', {
                data: parmas,
                funcModule: '收票登记（内贸）新增',
                funcOperation: '查询',
            })
        },
        supplierSelect() {
            this.$Router.push('/pages/supplier/supplier')
        },
        // 添加
        addList() {
            uni.showActionSheet({
                itemList: ['添加明细', '入库单'],
                success: (res) => {
                    if (res.tapIndex === 0) {
                        this.productList.push({
                            productCode: '',
                            productName: '',
                            invoiceName: '',
                            invoiceQuantity: '',
                            excludeTaxPrice: '',
                            excludeTaxAmount: '',
                            taxRate: '',
                            taxAmount: '',
                            includeTaxPrice: '',
                            includeTaxAmount: '',
                            remark: '',
                        })
                    }
                },
                fail: function (res) {
                    console.log(res.errMsg)
                },
            })
        },
        // 删除
        remove(e) {
            uni.showModal({
                title: '提示',
                content: '确认是否删除？',
                success: (res) => {
                    if (res.confirm) {
                        this.productList.splice(this.productList.indexOf(e), 1)
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                },
            })
        },
        // 展开/收起
        toggleShow() {
            this.showFlag = !this.showFlag
        },
        async getUser() {
            const res = await request.post('/vrm/api/user', {
                data: '0',
                funcModule: '登录',
                funcOperation: '查询',
            })
            this.formData.invoiceDate = res.data.timeNow
            this.formData.bizOrganCode = res.data.userOrganCode
            this.formData.bizDeptCode = res.data.userDeptCode
            this.formData.bizEmployeeCode = res.data.userEmployeeCode
        },
        currenyChange(e) {
            this.currencyIndex = e.target.value
            this.formData.currency = this.curreryList[this.currencyIndex].value
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
        // 商品信息
        productCodeChange(e, item) {
            this.productIndex = e.target.value
            item.productCode = this.productNames[this.productIndex].code
            item.productName = this.productNames[this.productIndex].name
            if (item.productCode) {
                request
                    .post('/vrm/api/dd/product/get', {
                        data: item.productCode,
                        funcModule: '收票登记（内贸）查看',
                        funcOperation: '查看',
                    })
                    .then((res) => {
                        item.invoiceName = res.data.productName
                    })
            } else {
                item.invoiceName = ''
            }
        },

        async doSave() {
            let toastFlag = true
            if (this.formData.invoiceNo.length <= 0) {
                uni.showToast({
                    icon: 'none',
                    title: '发票号不能为空',
                })
                toastFlag = false
                return
            } else if (this.formData.customerNo.length <= 0) {
                uni.showToast({
                    icon: 'none',
                    title: '供应商不能为空',
                })
                toastFlag = false
                return
            } else if (this.formData.includeTaxAmount.length <= 0) {
                uni.showToast({
                    icon: 'none',
                    title: '含税金额不能为空',
                })
                toastFlag = false
                return
            } else if (this.formData.currency.length <= 0) {
                uni.showToast({
                    icon: 'none',
                    title: '币种不能为空',
                })
                toastFlag = false
                return
            } else if (this.productList.length <= 0) {
                uni.showToast({
                    icon: 'none',
                    title: '商品信息不能为空',
                })
                toastFlag = false
                return
            }
            this.productList.forEach((item, index) => {
                for (let key in item) {
                    if (
                        key !== 'remark' &&
                        key !== 'productCode' &&
                        key !== 'invoiceName'
                    ) {
                        Number(item[key])
                    }
                    if (key === 'remark') {
                        toastFlag = true
                    } else {
                        if (key === 'productCode' && item[key] === '') {
                            uni.showToast({
                                icon: 'none',
                                title: '商品信息必填',
                            })
                            toastFlag = false
                            return
                        }
                        if (key === 'invoiceName' && item[key] === '') {
                            uni.showToast({
                                icon: 'none',
                                title: '发票名称必填',
                            })
                            toastFlag = false
                            return
                        }
                        if (
                            key !== 'productCode' &&
                            key !== 'invoiceName' &&
                            item[key] === ''
                        ) {
                            uni.showToast({
                                icon: 'none',
                                title: key + '必填',
                            })
                            toastFlag = false
                            return
                        }
                    }
                }
            })
            if (toastFlag) {
                uni.showModal({
                    title: '提示',
                    content: '请确认当前数据已经准确无误，是否确定保存？',
                    success: async (res) => {
                        if (res.confirm) {
                            if (this.optype === 'add') {
                                this.formData.invoiceDate = this.dateFormate(
                                    this.formData.invoiceDate
                                )
                                let params = this.formData
                                params.invoiceDomReceDetailDtoList = this.productList
                                const res = await request.post(
                                    '/vrm/api/invoice/domesticReceive/save',
                                    {
                                        data: params,
                                        funcModule: '收票登记（内贸）新增',
                                        funcOperation: '保存',
                                    }
                                )
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
                            } else if (this.optype === 'edit') {
                                let params = this.formData
                                params.invoiceDomReceDetailDtoList = this.productList
                                const res = await request.post(
                                    '/vrm/api/invoice/domesticReceive/update',
                                    {
                                        data: params,
                                        funcModule: '收票登记（内贸）新增',
                                        funcOperation: '保存',
                                    }
                                )
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
                            }
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    },
                })
            }
        },
        doCancle() {
            this.$Router.replace('/pages/work/index')
        },
        bindStartDateChange(e) {
            this.formData.invoiceDate = e.target.value
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
    },
}
</script>

<style scoped lang="scss">
.danger {
    color: red;
}

.registrationPages {
    .registration-content {
        height: calc(100vh - 88upx);
        background-color: #f5f5f5;
        overflow: scroll;

        .registration-list {
            font-size: 28upx;

            .registration-item {
                padding-left: 20upx;
                padding-right: 20upx;
                background-color: #fff;
                display: flex;
                line-height: 86upx;
                border-bottom: 1px solid #f5f5f5;

                .item-left {
                    width: 30%;
                }

                .item-right {
                    flex: 1;
                    text-align: right;
                    line-height: 86upx;
                    font-size: 24upx;

                    .tag {
                        font-size: 20upx;
                        padding: 4upx 16upx;
                        border-radius: 50upx;
                        color: #fff;
                        display: inline-block;
                        line-height: 30upx;
                        color: rgb(0, 143, 255);
                        background: rgb(212, 233, 252);
                    }

                    input {
                        height: 86upx;
                        font-size: 20upx;
                        color: #999;
                    }

                    button {
                        margin: 5upx;
                        display: inline-flex;
                    }
                }
            }

            .detailWrap {
                border-radius: 10upx;
                overflow: hidden;
                margin: 20upx;
                background-color: #fff;
                .productWrap {
                    margin-bottom: 20upx;
                    .uni-input-input {
                        font-size: 24upx;
                    }
                }

                .registration-item {
                    line-height: 60upx;
                    border: 0;
                    font-size: 24upx;
                    .item-left {
                        width: 40%;
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
</style>
