<template>
	<view class="priceRegistrationPages">
		<qm-navbar title="提单登记"></qm-navbar>
		<view class="registration-content">
			<view class="registration-list">
				<!-- 提单号 -->
				<view class="registration-item">
					<view class="item-left">
						提单号
					</view>
					<view class="item-right">
						<input type="number" placeholder="请输入价格" v-model="formData.ladingBillNo" />
					</view>
				</view>
				<!-- 提单日期 -->
				<view class="registration-item">
					<view class="item-left danger">
						提单日期*
					</view>
					<view class="item-right">
						<picker mode="date" class="item-input" v-model="formData.ladingDate" @change="bindStartDateChange">
							<view class="uni-input">
								{{ formData.ladingDate | dateFormate()}}
								<uni-icons type="arrowright" color="#999"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				
				<!-- 提单类型 -->
				<view class="registration-item disabled">
					<view class="item-left danger">
						提单类型 *
					</view>
					<view class="item-right">
						{{formData.ladingType | dataDictFormat('ladingType') }}
					</view>
				</view>
				<!-- 商品信息 -->
				<view class="registration-item">
					<view class="item-left ">
						定价批次选择
					</view>
					<view class="item-right" @click="showFlag=!showFlag">
						<button type="primary" size='mini' class="mini-btn" @click="addList()">
							添加</button>
					</view>
				</view>
				<view class="detailWrap" v-if="showFlag">
					<view class="productWrap">
						<view class="registration-item">
							<view class="item-left ">
								定价登记号
							</view>
							<view class="item-right">
								{{formData.pricingCode }}
							</view>
						</view>
						<view class="registration-item">
							<view class="item-left ">
								合同号
							</view>
							<view class="item-right">
								{{formData.contractCode }}
							</view>
						</view>
						<view class="registration-item">
							<view class="item-left ">
								定价批次号
							</view>
							<view class="item-right">
								{{formData.pricingLotCode }}
							</view>
						</view>
						<view class="registration-item">
							<view class="item-left ">
								购销类型
							</view>
							<view class="item-right">
								{{formData.purchaseOrSale | dataDictFormat('purchaseOrSale')  }}
							</view>
						</view>
						<view class="registration-item">
							<view class="item-left ">
								购销类型
							</view>
							<view class="item-right">
								{{formData.currency | dataDictFormat('currency') }}
							</view>
						</view>
						<view class="registration-item">
							<view class="item-left ">
								商品名称
							</view>
							<view class="item-right">
								{{formData.productCode }}
							</view>
						</view>
						<view class="registration-item">
							<view class="item-left ">
								定价方式
							</view>
							<view class="item-right">
								{{formData.pricingType | dataDictFormat('pricingType') }}
							</view>
						</view>
						<view class="registration-item">
							<view class="item-left ">
								定价基准
							</view>
							<view class="item-right">
								{{formData.pricingBenchmark }}
							</view>
						</view>
						<view class="registration-item">
							<view class="item-left ">
								定价数量
							</view>
							<view class="item-right">
								{{formData.pricingQuantity }}
							</view>
						</view>
						<view class="registration-item">
							<view class="item-left ">
								计量单位
							</view>
							<view class="item-right">
								{{formData.valueUnit }}
							</view>
						</view>
						<view class="registration-item">
							<view class="item-left ">
								制单人
							</view>
							<view class="item-right">
								{{formData.docMaker }}
							</view>
						</view>
						<view class="registration-item">
							<view class="item-left ">
								制单日期
							</view>
							<view class="item-right">
								{{formData.docMakeDate | dateFormate()}}
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
  import request from "@/utils/request.js"
  export default {
    data() {
      return {
        showFlag: true,
        optype: 'add',
        formData: {
          price: '',
          ladingDate: '',
          docMakeDate: '',
          docMaker: '',
          note: '',
        },

      }
    },

    async onShow() {
      this.curreryList = this.$store.state.dictData.currency
      const priceList = uni.getStorageSync('priceList')
      if (priceList.length === 0) {
        this.showFlag = false
      } else {
        this.showFlag = true
      }
      this.formData = Object.assign(this.formData, priceList)
      // 获取默认信息     
    },
    onUnload() {
      uni.removeStorageSync('priceList')
    },
    methods: {
      bindStartDateChange(e) {
        this.formData.ladingDate = e.target.value
      },
      // 添加
      addList() {
        this.$Router.replace('/pages/price-registration/price-batch/price-batch')
      },

      // 展开/收起
      toggleShow() {
        this.showFlag = !this.showFlag
      },
      async doSave() {
        let toastFlag = true
        if (this.formData.ladingDate.length <= 0) {
          uni.showToast({
            icon: 'none',
            title: '定价日期不能为空'
          })
          toastFlag = false
          return
        } else if (this.formData.price.length <= 0) {
          uni.showToast({
            icon: 'none',
            title: '价格不能为空'
          })
          toastFlag = false
          return

        }
        if (!this.formData.pricingLotCode) {
          uni.showToast({
            icon: 'none',
            title: '定价批次选择不能为空'
          })
          toastFlag = false
          return
        }
        if (toastFlag) {
          this.formData.ladingDate = this.dateFormate(this.formData.ladingDate)
          uni.showModal({
            title: '提示',
            content: '请确认当前数据已经准确无误，是否确定保存？',
            success: async (res) => {
              if (res.confirm) {
                let params = this.formData
                const res = await request.post('/vrm/api/pricingInfo/save', {
                  funcModule: '定价登记新增',
                  funcOperation: '保存',
                  data: params,
                })
                console.log(res)
                if (res.status) {
                  uni.showToast({
                    title: '保存成功'
                  })
                  uni.removeStorageSync('priceList')
                } else {
                  uni.showToast({
                    title: res.msgText,
                    icon: 'none'
                  })
                }
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      doCancle() {
        this.$Router.replace('/pages/work/index')
      },
      dateFormate(date) {
        if (date) {
          const year = new Date(date).getFullYear() + ''
          const month =
            new Date(date).getMonth() + 1 > 9 ?
            new Date(date).getMonth() + 1 :
            '0' + (new Date(date).getMonth() + 1)
          const day =
            new Date(date).getDate() > 9 ?
            new Date(date).getDate() :
            '0' + new Date(date).getDate()
          return year + month + day
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .danger {
    color: red;
  }
  .priceRegistrationPages {
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
            font-size: 24upx;
            input {
              height: 86upx;
              font-size: 20upx;
              color: #999;
            }
              .arrowright{
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

        .detailWrap {
          border-radius: 10upx;
          overflow: hidden;
          margin: 20upx;
          background-color: #fff;
          .productWrap{
            margin-bottom: 20upx;
            .uni-input-input{
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
            .item-right {
              color: #666;
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
            .item-right textarea  {
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
