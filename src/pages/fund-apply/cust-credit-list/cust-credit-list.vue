<template>
    <view class="creditPages">
        <qm-navbar title="临时授信" btnName='确定' @myEvent='onHeaderConfirm'></qm-navbar>
        <qm-filters ref="filter" :array="array" @changeLeft="onChangeLeft">
            <view slot="drawer">
                <view class="drawer-item">
                    <view class="item-lable">
                        单据号
                    </view>
                    <view class="item-input">
                        <input type="text" value="" v-model="formData.docNo" style="font-size: 22upx; height: 52upx; line-height: 52upx" />
                    </view>
                </view>
                <view class="uni-btn-v">
                    <button type="default" size="mini" class="reset" @click="onReset">重置</button>
                    <button type="primary" size="mini" class="confirm" @click="onConfirm">确定</button>
                </view>
            </view>
        </qm-filters>
        <scroll-view scroll-y="true" class="creditCon" lower-threshold='50' @scrolltolower="lower">
            <view class="creditList">
                <view class="credit-item" v-for="(item,i) in productList" :key='i'>
                    <view class="confirm-header">
                        <view class="confirm-header-badge">
                            <view class="tag">
                                {{item.creditType | dataDictFormat('creditType') }}
                            </view>
                        </view>
                        <view class="confirm-header-title">
                            {{ item.docNo }}
                        </view>
                    </view>
                    <view class="confirm-content">
                        <view>{{ item.contractNo }}</view>
                        <view class="">
                            单据类型：{{ item.docType | dataDictFormat('custCreditDocType') }}
                        </view>

                        <view>
                            授信类型/方式:{{item.creditType| dataDictFormat('creditType') }} / {{item.creditWay|
                            dataDictFormat('creditWay') }}
                        </view>
                        <view>
                            额度类型:{{item.creditQuotaType| dataDictFormat('creditQuotaType') }}
                        </view>
                        <view>
                            授信额度(元): {{ item.creditQuota }}
                        </view>
                    </view>
                    <view class="confirm-header-bottom">
                        <button type="primary" v-bind:data-val="item.num" v-if="!item.disabled" size="mini" @click="onJoin(item)">立即加入</button>
                        <button type="primary" size="mini" v-if="item.disabled" style="opacity: 0.5;" @click="offJoin(item)">取消加入</button>
                    </view>
                </view>
                <view v-if="!hasMore" class="more">
                    ---------- 没有更多了 -----------
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import request from '@/utils/request.js'
export default {
    data() {
        return {
            btnDisabled: true,
            hasMore: true,
            productList: [],
            array: ['全部'],
            custCode: '',
            type: '',
            formData: {
                custCode: this.custCode,
                docNo: '',
                billNo: '',
            },
        }
    },
    onLoad() {
        this.formData.custCode = this.$Route.query.customerNo
        this.getList()
    },
    methods: {
        async getList() {
            const res = await request.post('/vrm/api/cust/credit/listTempDialogCs', {
                data: this.formData,
                funcModule: '付款申请新增',
                funcOperation: '查询',
                sortString: 'custName.desc,docNo.desc',
            })
            if (res) {
                this.productList = res.data
            }
        },
        onJoin(item) {
            this.productList.map((item) => {
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
        onChangeLeft(val) {
            this.getList()
        },
        lower() {
            if (this.hasMore) {
                this.getList()
            }
        },
        onConfirm() {
            this.$refs.filter.closeDrawer()
            this.getList()
        },
        onReset() {
            this.formData.docNo = ''
        },
        onHeaderConfirm() {
            const productList = this.productList.filter((item) => item.disabled)
            if (productList.length === 0) {
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
                            prevPage.$vm.formData.custCreditNo = productList[0].custCreditNo
                            this.$Router.back()
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    },
                })
            }
        },
    },
}
</script>

<style scoped lang="scss">
.opciton {
  opacity: 0.5;
}

.creditPages {
  background: #f5f5f5;

  .creditCon {
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

  .creditList {
    font-size: 28upx;

    .credit-item {
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
        flex: 1;
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
</style>
