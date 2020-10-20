<template>
    <view class="fundPages">
        <qm-navbar title="付款确认"></qm-navbar>
        <view class="fund-content">
            <view class="fund-list">
                <!-- 商品信息 -->
                <view class="fund-item">
                    <view class="item-right">
                        <button type="primary" size='mini' class="mini-btn" @click="selectFundApply()">
                            选择付款申请
                        </button>
                    </view>
                </view>
                <view class="fund-item item-header" @click="showFlag = !showFlag">
                    <view class="item-left ">
                        <strong>基本信息</strong>
                    </view>
                    <view class="item-right" style="color: #2484cf;">
                        {{showFlag?'收起':'展开'}}
                    </view>
                </view>
                <view v-if="showFlag">
                    <!-- 单据号 -->
                    <view class="fund-item disabled">
                        <view class="item-left">
                            单据号
                        </view>
                        <view class="item-right">
                            <input type="number" disabled placeholder="请输入价格" v-model="formData.confirmNo" />
                        </view>
                    </view>
                    <!-- 付款日期 * -->
                    <view class="fund-item">
                        <view class="item-left danger">
                            付款日期 *
                        </view>
                        <view class="item-right">
                            <picker mode="date" class="item-input" v-model="formData.paymentDate" @change="bindStartDateChange">
                                <view class="uni-input">
                                    {{ formData.paymentDate | dateFormate()}}
                                    <uni-icons type="arrowright" color="#999"></uni-icons>
                                </view>
                            </picker>
                        </view>
                    </view>
                    <!-- 客户 -->
                    <view class="fund-item disabled">
                        <view class="item-left danger">
                            客户 *
                        </view>
                        <view class="item-right">
                            {{formData.customerNo}}
                        </view>
                    </view>
                    <view class="fund-item disabled">
                        <view class="item-left danger">
                            申请单号 *
                        </view>
                        <view class="item-right">
                            {{formData.applyNo}}
                        </view>
                    </view>
                    <view class="fund-item disabled">
                        <view class="item-left danger">
                            申请单据类型 *
                        </view>
                        <view class="item-right">
                            {{formData.applyBillType | dataDictFormat( 'fundApplyBillType') }}
                        </view>
                    </view>
                    <view class="fund-item disabled">
                        <view class="item-left danger">
                            业务机构*
                        </view>
                        <view class="item-right">
                            {{formData.bizOrganCode}}
                        </view>
                    </view>
                    <!-- 业务部门-->
                    <view class="fund-item">
                        <view class="item-left danger">
                            业务部门*
                        </view>
                        <view class="item-right">
                            <picker mode="selector" :value="bizDeptIndex" :range="bizDeptList" :range-key="'name'"
                                @change="bizDeptChange">
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
                            <picker mode="selector" :value="formData.bizEmployeeCode" :range="bizEmployeeList"
                                :range-key="'name'" @change="bizEmployeeChange">
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
                            <picker mode="selector" :value="formData.optEmployeeCode" :range="bizEmployeeList"
                                :range-key="'name'" @change="optEmployeeChange">
                                <view class="uni-input">
                                    {{formData.optEmployeeCode}}
                                    <uni-icons type="arrowright" color="#999"></uni-icons>
                                </view>
                            </picker>
                        </view>
                    </view>
                    <!-- 商品信息 -->
                </view>
                <view class="fund-item item-header" @click="showFlag2 = !showFlag2">
                    <view class="item-left ">
                        <strong>付款信息</strong>
                    </view>
                    <view class="item-right" style="color: #2484cf;">
                        {{showFlag2?'收起':'展开'}}
                    </view>
                </view>
                <view class="productWrap" v-if="showFlag2">
                    <view class="fund-item ">
                        <view class="item-left danger">
                            付款方式 *
                        </view>
                        <view class="item-right">
                            <view>
                                <picker :value="paymentIndex" :range="paymentTypeList" :range-key="'label'" @change="paymentChange">
                                    <view class="uni-input">
                                        {{formData.paymentType | dataDictFormat('settlementTypePay') }}
                                        <uni-icons type="arrowright" color="#999"></uni-icons>
                                    </view>
                                </picker>
                            </view>
                        </view>
                    </view>
                    <view class="fund-item ">
                        <view class="item-left danger">
                            付款金额 *
                        </view>
                        <view class="item-right">
                            <view>
                                <input type="number" v-model="formData.paymentAmount" @input='onPaymentAmountChange' />
                            </view>
                        </view>
                    </view>
                    <view class="fund-item disabled">
                        <view class="item-left danger">
                            币种 *
                        </view>
                        <view class="item-right">
                            <view>
                                {{formData.currency | dataDictFormat('currency') }}
                            </view>
                        </view>
                    </view>
                    <view class="fund-item " v-if="formData.paymentType === 'EFT'">
                        <view class="item-left danger">
                            付款帐号 *
                        </view>
                        <view class="item-right">
                            <view>
                                <picker :value="bankAccountIndex" :range-key="'name'" :range="bankAccountList" @change="onBankAccountCodeChangeAll">
                                    <view class="uni-input">
                                        {{formData.bankAccountCode}}
                                        <uni-icons type="arrowright" color="#999"></uni-icons>
                                    </view>
                                </picker>
                            </view>
                        </view>
                    </view>
                    <view class="fund-item disabled" v-if="formData.paymentType === 'EFT'">
                        <view class="item-left danger">
                            付款银行 *
                        </view>
                        <view class="item-right">
                            <view>
                                <picker :value="bankIndex" disabled :range="bankList" :range-key="'label'" @change="bankChange">
                                    <view class="uni-input">
                                        {{formData.bankCode}}
                                        <uni-icons type="arrowright" color="#999"></uni-icons>
                                    </view>
                                </picker>
                            </view>
                        </view>
                    </view>
                    <view class="fund-item " v-if="formData.paymentType === 'ACCEPTANCE'" @click="SelectAcceptanceNo">
                        <view class="item-left danger">
                            承兑汇票 *
                        </view>
                        <view class="item-right">
                            <view>
                                {{formData.acceptanceNo }}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </view>
                    </view>
                    <view class="fund-item " v-if="formData.paymentType === 'LC'" @click="letterCreditNoValidateFunc">
                        <view class="item-left danger">
                            信用证 *
                        </view>
                        <view class="item-right">
                            <view>
                                {{formData.letterCreditNo }}
                                <uni-icons type="arrowright" color="#999"></uni-icons>
                            </view>
                        </view>
                    </view>

                </view>
                <!-- 商品信息 -->
                <view class="fund-item item-header" @click="showFlag3 = !showFlag3" v-if="formData.paymentType==='DRAFT'">
                    <view class="item-left ">
                        <strong>押汇信息</strong>
                    </view>
                    <view class="item-right" style="color: #2484cf;">
                        {{showFlag3?'收起':'展开'}}
                    </view>
                </view>
                <view class="productWrap" v-if="formData.paymentType==='DRAFT' && showFlag3">
                    <!-- 付款日期 * -->
                    <view class="fund-item">
                        <view class="item-left danger">
                            付款日期 *
                        </view>
                        <view class="item-right">
                            <picker mode="date" class="item-input" v-model="draftInfo.draftDate" @change="onDraftDateChange">
                                <view class="uni-input">
                                    {{ draftInfo.draftDate | dateFormate()}}
                                    <uni-icons type="arrowright" color="#999"></uni-icons>
                                </view>
                            </picker>
                        </view>
                    </view>

                    <view class="fund-item ">
                        <view class="item-left danger">
                            押汇天数 *
                        </view>
                        <view class="item-right">
                            <view>
                                <input type="number" v-model="draftInfo.draftDays" @input='onDraftDaysChange' />
                            </view>
                        </view>
                    </view>
                    <view class="fund-item disabled">
                        <view class="item-left danger">
                            到期日 *
                        </view>
                        <view class="item-right">
                            {{ draftInfo.draftDueDate | dateFormate()}}
                        </view>
                    </view>
                    <view class="fund-item ">
                        <view class="item-left danger">
                            押汇比例 *
                        </view>
                        <view class="item-right">
                            <view>
                                <input type="number" v-model="draftInfo.draftRate" @input='onDraftRateChange' />
                            </view>
                        </view>
                    </view>
                    <view class="fund-item disabled">
                        <view class="item-left danger">
                            押汇金额 *
                        </view>
                        <view class="item-right">
                            <view>
                                {{draftInfo.draftAmount}}
                            </view>
                        </view>
                    </view>
                    <view class="fund-item disabled">
                        <view class="item-left danger">
                            即期购汇 *
                        </view>
                        <view class="item-right">
                            <view>
                                {{draftInfo.sightDraftAmount}}
                            </view>
                        </view>
                    </view>
                    <view class="fund-item " :class="formData.currency==='CNY'? 'disabled' :''">
                        <view class="item-left danger">
                            汇率*
                        </view>
                        <view class="item-right">
                            <view>
                                <input type="number" v-model="draftInfo.exchangeRate" />
                            </view>
                        </view>
                    </view>

                    <view class="fund-item ">
                        <view class="item-left danger">
                            labor(%)*
                        </view>
                        <view class="item-right">
                            <view>
                                <input type="number" v-model="draftInfo.laborRate" @input='onLaborRateChange' />
                            </view>
                        </view>
                    </view>
                    <view class="fund-item ">
                        <view class="item-left danger">
                            上浮(%)*
                        </view>
                        <view class="item-right">
                            <view>
                                <input type="number" v-model="draftInfo.goUpRate" @input='onGoUpRateChange' />
                            </view>
                        </view>
                    </view>
                    <view class="fund-item disabled">
                        <view class="item-left danger">
                            利率 *
                        </view>
                        <view class="item-right">
                            <view>
                                {{draftInfo.interestRate}}%
                            </view>
                        </view>
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
	</view>
</template>

<script>
import request from '@/utils/request.js'
export default {
    data() {
        return {
            showFlag: false,
            showFlag2: false,
            showFlag3: true,
            bankIndex: 0,
            customerIndex: 0,
            bizOrganIndex: 0,
            paymentIndex: 0,
            bizDeptIndex: 0,
            bankAccountIndex: 0,
            acceptanceInfo: [],
            paymentTypeList: [],
            bankList: [],
            bankAccountList: [],
            formData: {
                confirmNo: '',
                paymentDate: '',
                customerNo: '',
                applyBillType: '',
                applyNo: '',
                bizOrganCode: '',
                bizOrganName: '',
                bizDeptCode: '',
                bizDeptName: '',
                bizEmployeeCode: '',
                bizEmployeeName: '',
                optEmployeeCode: '',
                optEmployeeName: '',
                remark: '',
                paymentType: 'EFT',
                paymentAmount: '',
                currency: '',
                bankAccountCode: '',
                bankCode: '',
                acceptanceNo: '',
                letterCreditNo: '',
            },
            draftInfo: {
                draftDate: '',
                draftDays: '',
                draftDueDate: '',
                draftRate: '',
                draftAmount: '',
                sightDraftAmount: '',
                exchangeRate: '',
                laborRate: '',
                goUpRate: '',
                interestRate: '',
            },
        }
    },
    async onShow() {
        this.formData.paymentDate = new Date().toISOString()
        this.draftInfo.draftDate = new Date().toISOString()
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
        // 获取部门信息
        const bankAccountList = await this.getconList({
            type: 'DD_ORGAN_BANK_ACCOUNT',
            queryParams: {
                organCode: this.formData.bizOrganCode,
            },
        })
        const bankList = await this.getconList({
            type: 'DD_BANK',
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
        this.bankList = bankList.data
        this.bankAccountList = bankAccountList.data
        this.bizOrganList = bizOrganList.data
        this.bizDeptList = bizDeptList.data
        this.bizEmployeeList = bizEmployeeList.data
        // 字典码表
        this.curreryList = this.$store.state.dictData.currency
        this.paymentTypeList = this.$store.state.dictData.settlementTypePay
    },
    watch: {
        'formData.bizOrganCode': function (val, oldval) {
            this.clearApplyInfo()
            this.clearFundInfo()
            this.changeBankAccountSelectInfo()
        },

        'formData.currency': function (val, oldval) {
            this.onCurrencyChange()
        },
    },
    methods: {
        // 押汇日期change事件
        onDraftDateChange(val) {
            this.draftInfo.draftDate = val.target.value
            this.calculateDraftDueDate()
        },
        // 押汇天数change事件
        onDraftDaysChange(val) {
            this.draftInfo.draftDays = val.detail.value
            this.calculateDraftDueDate()
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
        // 计算押汇到期日
        calculateDraftDueDate() {
            var draftDate = this.dateFormate(this.draftInfo.draftDate)
            var draftDays = this.draftInfo.draftDays
            var draftDueDate = new Date(
                draftDate.substring(0, 4) +
                '/' +
                draftDate.substring(4, 6) +
                '/' +
                draftDate.substring(6, 8)
            )
            draftDueDate = new Date(
                Date.parse(draftDueDate) + 1000 * 60 * 60 * 24 * Number(draftDays)
            )
            const y = draftDueDate.getFullYear()
            const m = draftDueDate.getMonth() + 1
            const d = draftDueDate.getDate()
            this.draftInfo.draftDueDate = (y * 10000 + m * 100 + d).toString()
        },
        // 押汇比例change事件
        onDraftRateChange(val) {
            this.draftInfo.draftRate = val.detail.value
            this.calculateDraftAmount()
        },
        // labor change事件
        onLaborRateChange(val) {
            this.draftInfo.laborRate = val.detail.value
            this.calculateInterestRate()
        },
        // 上浮change事件
        onGoUpRateChange(val) {
            this.draftInfo.goUpRate = val.detail.value
            this.calculateInterestRate()
        },
        // 计算利率
        calculateInterestRate() {
            var laborRate = this.draftInfo.laborRate
            var goUpRate = this.draftInfo.goUpRate
            this.draftInfo.interestRate = Number(laborRate) + Number(goUpRate)
        },
        // 计算押汇金额、即期购汇金额
        calculateDraftAmount() {
            var paymentAmount = this.formData.paymentAmount
            var draftRate = this.draftInfo.draftRate
            var draftAmount = (
                (Number(paymentAmount) * Number(draftRate)) /
                100
            ).toFixed(2)
            var sightDraftAmount = (
                Number(paymentAmount) - Number(draftAmount)
            ).toFixed(2)
            this.draftInfo.draftAmount = draftAmount
            this.draftInfo.sightDraftAmount = sightDraftAmount
        },
        getconList(parmas) {
            return request.post('/vrm/api/dd/selectData/list', {
                data: parmas,
                funcModule: '付款确认新增',
                funcOperation: '查询',
            })
        },

        bindStartDateChange(e) {
            this.formData.paymentDate = e.target.value
        },
        paymentChange(val) {
            this.formData.paymentType = this.paymentTypeList[val.detail.value].value
        },
        // 币种change事件
        onCurrencyChange(val) {
            if (val === 'CNY') {
                this.draftInfo.exchangeRate = 1
            }
        },
        onBankAccountCodeChangeAll(e) {
            if (e.detail.value !== '') {
                this.formData.bankAccountCode = this.bankAccountList[
                    e.detail.value
                ].code
                this.formData.bankCode = this.bankAccountList[
                    e.detail.value
                ].data.bankCode
            } else {
                this.formData.bankCode = ''
            }
        },
        // 承兑汇票回调
        acceptanceNoCallback(param) {
            if (param.currency !== this.formData.currency) {
                setTimeout(() => {
                    uni.showToast({
                        title: '所选承兑汇票与付款申请币种不一致，请重新选择',
                        icon: 'none',
                    })
                }, 1000) //延迟时间
                return
            }
            if (
                param.acceptanceDirection === 'SIGN' &&
                param.customerNo !== this.formData.customerNo
            ) {
                setTimeout(function () {
                    //要延时执行的代码
                    uni.showToast({
                        title:
                            '所选承兑汇票票据方向为签发时票据客户需要与付款申请客户一致，请重新选择',
                        icon: 'none',
                    })
                }, 1000) //延迟时间

                return
            }
            this.formData.acceptanceBillNo = param.infoNo
            this.formData.acceptanceDirection = param.acceptanceDirection
            this.formData.acceptanceNo = param.acceptanceNo
            this.formData.paymentAmount = param.acceptanceAmount
        },
        // 承兑汇票选择验证
        SelectAcceptanceNo() {
            if (this.formData.customerNo === '') {
                uni.showToast({
                    title: '请选择客户',
                    icon: 'none',
                })
                return
            }
            if (this.formData.bizOrganCode === '') {
                uni.showToast({
                    title: '请选择业务机构',
                    icon: 'none',
                })
                return
            }
            this.$Router.push({
                name: 'fund-acceptanceInfo',
                params: {
                    bizOrganCode: this.formData.bizOrganCod,
                },
            })
        },
        letterCreditNoValidateFunc() {
            if (this.formData.customerNo === '') {
                uni.showToast({
                    title: '请选择客户',
                    icon: 'none',
                })
                return
            }
            if (this.formData.bizOrganCode === '') {
                uni.showToast({
                    title: '请选择业务机构',
                    icon: 'none',
                })
                return
            }
            this.$Router.push({
                name: 'fund-lcConfirmDialog',
                params: {
                    bizOrganCode: this.formData.bizOrganCod,
                    customerNo: this.formData.customerNo,
                },
            })
        },
        letterCreditNoCallback(param) {
            if (param.currency !== this.formData.currency) {
                setTimeout(function () {
                    //要延时执行的代码
                    uni.showToast({
                        title: '所选信用证与付款申请币种不一致，请重新选择',
                        icon: 'none',
                    })
                }, 1000) //延迟时间
                return
            }
            this.formData.letterCreditBillNo = param.confirmNo
            this.formData.letterCreditNo = param.letterCreditNo
            this.formData.paymentAmount = (
                Number(param.letterCreditAmount) - Number(param.usedAmount)
            ).toFixed(2)
        },
        selectFundApplyCallback(param) {
            console.log(param)
            this.formData.customerNo = param.customerNo
            this.formData.customerName = param.customerName
            this.formData.applyNo = param.applyNo
            this.formData.applyBillType = param.applyBillType
            this.formData.paymentAmount = (
                Number(param.applyAmount) - Number(param.confirmAmount)
            ).toFixed(2)
            this.formData.currency = param.currency
            this.formData.bizOrganCode = param.bizOrganCode
            this.clearFundInfo()
            this.changeBankAccountSelectInfo()
            this.onCurrencyChange(param.currency)
        },
        // 清空付款申请信息
        clearApplyInfo() {
            this.formData.applyBillType = ''
            this.formData.paymentAmount = ''
            this.formData.currency = ''
        },
        // 付款金额change事件
        onPaymentAmountChange(val) {
            this.formData.paymentAmount = val.detail.value
            this.calculateDraftAmount()
        },
        // 改变付款帐号下拉框
        async changeBankAccountSelectInfo() {
            const bankAccountList = await this.getconList({
                type: 'DD_ORGAN_BANK_ACCOUNT',
                queryParams: {
                    organCode: this.formData.bizOrganCode,
                },
            })
            this.bankAccountList = bankAccountList
        },
        // 清空付款信息
        clearFundInfo() {
            this.formData.bankCode = ''
            this.formData.bankAccountCode = ''
            this.formData.acceptanceBillNo = ''
            this.formData.acceptanceDirection = ''
            this.formData.acceptanceNo = ''
            this.formData.letterCreditBillNo = ''
            this.formData.letterCreditNo = ''
        },
        // 选择付款申请
        selectFundApply() {
            this.$Router.push({
                name: 'choose-fund-apply',
                params: {
                    bizOrganCode: this.formData.bizOrganCod,
                    customerNo: this.formData.customerNo,
                },
            })
        },
    },
}
</script>

<style scoped lang="scss">
.danger {
  color: red;
}
.fundPages {
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
        background-color: #f5f7fa;
        border-bottom: 1px solid #efefef;
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
