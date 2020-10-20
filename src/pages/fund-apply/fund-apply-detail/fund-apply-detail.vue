<template>
    <view class="batchPages">
        <qm-navbar title="选择批次" :event='goBack' btnName='确定' @myEvent='onHeaderConfirm'></qm-navbar>
        <qm-filters ref="filter" :array="array" @changeLeft="onChangeLeft">
            <view slot="drawer">
                <view class="drawer-item">
                    <view class="item-lable">
                        签订开始时间
                    </view>
                    <picker mode="date" class="item-input" v-model="formData.signDateFrom" @change="bindStartDateChange">
                        <view class="uni-input">{{ formData.signDateFrom }}</view>
                    </picker>
                </view>
                <view class="drawer-item">
                    <view class="item-lable">
                        签订结束时间
                    </view>
                    <picker mode="date" class="item-input" v-model="formData.signDateTo" @change="bindEndDateChange">
                        <view class="uni-input">{{ formData.signDateTo }}</view>
                    </picker>
                </view>
                <view class="drawer-item">
                    <view class="item-lable">
                        合同号
                    </view>
                    <view class="item-input">
                        <input type="text" value="" v-model="formData.contractNo" style="font-size: 22upx; height: 52upx; line-height: 52upx" />
                    </view>
                </view>
                <view class="drawer-item">
                    <view class="item-lable">
                        批次号
                    </view>
                    <view class="item-input">
                        <input type="text" value="" v-model="formData.lotNo" style="font-size: 22upx; height: 52upx; line-height: 52upx" />
                    </view>
                </view>
                <view class="drawer-item">
                    <view class="item-lable">
                        商品名称
                    </view>
                    <view class="item-input">
                        <picker mode="selector" @change="bindPickerChange" :value="index" :range="productList" v-model="formData.productCode">
                            <view>{{productList[index]}}</view>
                        </picker>
                    </view>
                </view>
                <view class="uni-btn-v">
                    <button type="default" size="mini" class="reset">重置</button>
                    <button type="primary" size="mini" class="confirm" @click="onConfirm">确定</button>
                </view>
            </view>
        </qm-filters>
        <scroll-view scroll-y="true" class="priceBatchcon" lower-threshold='50' @scrolltolower="lower">
            <view class="pricelist">
                <view class="priceBatch-item" v-for="(item,i) in list" :key='i'>
                    <view class="confirm-header">
                        <view class="confirm-header-badge">
                            <view class="tag">
                                {{item.tradeType | dataDictFormat('tradeType') }}
                            </view>
                            <view class="tag">
                                {{item.billType === 'CON_SL_INFO' ? '销' : '采' }}
                            </view>
                        </view>
                        <view class="confirm-header-title">
                            {{ item.lotNo }}
                        </view>
                        <view class="confirm-header-time">
                            {{item.docMakeDt | dateFormate}}
                        </view>
                    </view>
                    <view class="confirm-content">
                        <view>{{ item.customerNames }}</view>
                        <view class="">
                            {{ item.productName }}：{{ item.brand }}-{{ item.origin }}-{{ item.spec }}-{{ item.productKeyAttr01 }}
                        </view>

                        <view>
                            货值(币种)：{{ item. goodsAmount}}({{item.currency | dataDictFormat('currency')}})
                        </view>
                        <view>
                            计量数量(单位): {{ item.measurementQuantity}}({{item.measurementUnitCode| dataDictFormat('measurementUnit') }})
                        </view>
                        <view>
                            可申请金额(币种)：{{ item. noneApplyAmount}}({{item.currency | dataDictFormat('currency')}})
                        </view>
                    </view>
                    <view class="confirm-header-bottom">
                        <button type="primary" size="mini" class="viewbtn" @click="detaile(item)">查看详情</button>
                        <button type="primary" v-bind:data-val="item.num" v-if="!item.disabled" size="mini" @click="onJoin(item)">立即加入</button>
                        <button type="primary" size="mini" v-if="item.disabled" style="opacity: 0.5;" @click="offJoin(item)">取消加入</button>
                    </view>
                </view>
                <view v-if="!hasMore" class="more">
                    ---------- 没有更多了 -----------
                </view>
            </view>
        </scroll-view>
        <view class="dialog" v-if='dialogVisible'>
            <view class="mask">
            </view>
            <view class="dialogCon">
                <qm-dialog-list ref="uniPop" fileName='batchDetails' :queryParams='popItem' @hideClick='hideClick'></qm-dialog-list>
            </view>
        </view>
    </view>
</template>

<script>
import request from '@/utils/request.js'
export default {
    data() {
        return {
            dialogVisible: false,
            hasMore: false,
            index: 0,
            productList: [],
            array: ['全部'],
            billTypeLot: [],
            bizEmployeeList: [],
            popItem: {},
            tradeTypeList: [],
            formData: {
                billType: '',
                bizEmployeeCode: '',
                contractNo: '',
                customerCode: '',
                lotNo: '',
                productCode: '',
                qmQueryExtras: [],
                tradeType: '',
                signDateFrom: '',
                signDateTo: '',
            },

            ladingNoFormData: {
                ladingBillNo: '',
                productCodeList: [],
                qmQueryExtras: [],
                supplierCode: '',
            },

            productItemFormData: {
                productCode: '',
            },
            list: [],
            type: '',
        }
    },
    async onShow() {
        this.$store.state.dictData.billTypeLot.forEach((item) => {
            this.array.push(item.label)
        })
        this.tradeTypeList = this.$store.state.dictData.tradeType
        // 机构
        const productList = await this.selectDataRequest({
            type: 'DD_PRODUCT',
        })
        this.productList = productList.data
        // 机构
        const bizEmployeeList = await this.selectDataRequest({
            type: 'FUNC_EMPLOYEE',
        })
        this.bizEmployeeList = bizEmployeeList.data
    },
    onLoad() {
		const option = this.$Route.query
        this.formData.customerCode = option.customerNo
        this.formData.bizOrganCode = option.bizOrganCode
        if (option.businessType === 'S') {
            this.array = ['销售批次']
            this.formData.billType = 'CON_SL_INFO'
        } else if (option.businessType === 'B') {
            this.array = ['采购批次']
            this.formData.billType = 'CON_PL_INFO'
        } else {
            this.formData.billType = ''
        }
        this.getList()
    },
    methods: {
        selectDataRequest(params) {
            return request.post('/vrm/api/dd/selectData/list', {
                funcModule: '付款申请新增',
                funcOperation: '查询',
                data: params,
            })
        },
        bindPickerChange(e) {
            // this.index = e.target.value
            if (this.productList[e.target.value]) {
                this.formData.productCode = this.productList[e.target.value].code
            } else {
                this.formData.productCode = ''
                this.index = 0
            }
        },
        lower() {
            if (this.hasMore) {
                this.current += 1
                this.getList()
            }
        },
        hideClick(va) {
            this.dialogVisible = false
        },
        async getList() {
            this.list = []
            const res = await request.post(
                '/vrm/api/contract/slProductDetail/listChoosePurchaseSaleForFund', {
                    funcModule: '付款申请新增',
                    funcOperation: '查询',
                    isPage: true,
                    size: 20,
                    sortString: 'docMakeDt.desc',
                    data: this.formData,
                }
            )
            this.list = res.data
        },
        goBack() {
            // uni.redirectTo({
            // 	url: '/pages/fund-apply/fund-apply'
            // })

            this.$Router.back(1)
        },
        onChangeLeft(val) {
            this.formData.billType =
                val === 1 ? 'CON_PL_INFO' : val === 2 ? 'CON_SL_INFO' : ''
            this.current = 1
            this.getList()
        },
        onConfirm() { },
        onHeaderConfirm() {
            const list = this.list.filter((item) => item.disabled)
            if (list.length === 0) {
                uni.showToast({
                    title: '请选择一条信息',
                    icon: 'none',
                })
            } else {
                uni.showModal({
                    title: '提示',
                    content: '请确认当前数据已经准确无误，是否确定保存？',
                    success: (res) => {
                        if (res.confirm) {
                            let pages = getCurrentPages()
                            let nowPage = pages[pages.length - 1]
                            let prevPage = pages[pages.length - 2]
                            prevPage.$vm.init = !prevPage.$vm.init
                            // this.$member.globalData.fundApplyDetailDtoList = list
                            // uni.navigateBack({
                            //   delta: -1,
                            // })

                            this.$Router.push({
                                path: '/pages/fund-apply/fund-apply',
                                params: {
                                    fundApplyDetailDtoList: list
                                }
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    },
                })
            }
        },
        detaile(item) {
            this.dialogVisible = true
            this.popItem = item
        },
        onJoin(item) {
            this.list.map((item) => {
                this.$set(item, 'disabled', false)
                this.$set(item, 'num', 0)
            })
            this.$set(item, 'disabled', !item.disabled)
            this.$set(item, 'num', 1)
        },
        offJoin(item) {
            this.$set(item, 'disabled', !item.disabled)
            this.$set(item, 'num', 1)
        },
    },
}
</script>

<style scoped lang="scss">
.opciton {
  opacity: 0.5;
}

.batchPages {
  background: #f5f5f5;

  .priceBatchcon {
    height: calc(100vh - 170upx);
    overflow: scroll;
    background-color: #f5f5f5;
  }

  .more {
    font-size: 28upx;
    text-align: center;
    color: #999;
    margin: 20upx 0;
  }

  .pricelist {
    font-size: 28upx;

    .priceBatch-item {
      background-color: #fff;
      margin: 30upx;
      padding: 20upx;
    }

    .confirm-header {
      width: 100%;
      height: 60upx;
      line-height: 60upx;
      display: flex;

      .confirm-header-badge {
        width: 150upx;

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
      }

      .confirm-header-title {
        width: 350upx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .confirm-header-time {
        width: 150upx;
        color: #999;
        font-size: 20upx;
        border-radius: 50upx;
        text-align: right;
      }
    }

    .confirm-content {
      color: #666;
      padding: 20upx;
      font-size: 24upx;
      line-height: 42upx;
    }

    .confirm-header-bottom {
      text-align: right;
      line-height: 50upx;

      uni-button {
        margin-left: 10upx;
        border-radius: 50upx;
      }

      .viewbtn {
        color: rgb(0, 143, 255);
        background: rgb(212, 233, 252);
      }
    }
  }
}

.drawer-item {
  margin-bottom: 20upx;

  .item-lable {
    text-align: left;
  }

  .item-input {
    flex: 1;
    height: 52upx;
    line-height: 52upx;
    background-color: #f9f9f9;
    font-size: 24upx;
    border: 2upx solid #f5f5f5;
    text-align: left;
    padding-left: 20upx;
  }

  .msg {
    display: flex;
    font-size: 24upx;
    height: 52upx;
    line-height: 50upx;

    .msg-select {
      flex: 1;
      font-size: 22upx;
      background: #f1f1f1;
      border: 2upx solid #d3d3d3;
      margin: 0 5upx;
      color: #666;
    }

    .msg-select-active {
      color: #2484cf;
      background: #b7defc;
      border: 2upx solid #2484cf;
    }
  }
}

.uni-btn-v {
  position: absolute;
  bottom: 10upx;
  left: 30upx;
  right: 30upx;

  uni-button {
    width: 50%;

    &::after {
      border-radius: 0;
    }
  }

  .reset {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .confirm {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.dialog {
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
  }

  .dialogCon {
    background-color: #fff;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
  }
}
</style>
