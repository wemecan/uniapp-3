<template>
	<view>
		<qm-navbar :event="goBack" title="新建入库单"></qm-navbar>
		<view class="storageWrap">
			<view class="storageList">
				<!-- 供应商 -->
				<view class="storageItem">
					<view class="item-left danger">
						供应商*
					</view>
					<view class="item-right" @click="supplierSelect">
						{{ formData.supplierName }}
						<uni-icons type="arrowright" color="#999"></uni-icons>
					</view>
				</view>
				<!-- 仓库 -->
				<view class="storageItem">
					<view class="item-left danger">
						仓库*
					</view>
					<view class="item-right" @click="storageSelect">
						{{ formData.warehouseName }}
						<uni-icons type="arrowright" color="#999"></uni-icons>
					</view>
				</view>
				<!-- 币种 -->
				<view class="storageItem">
					<view class="item-left danger">
						币种*
					</view>
					<view class="item-right">
						<picker :value="currencyIndex" :range="curreryList" :range-key="'label'" @change="currenyChange">
							<view class="uni-input">{{ formData.currencyCode | dataDictFormat("currency") }}</view>
						</picker>
					</view>
				</view>
				<!-- 商品信息 -->
				<view class="storageItem">
					<view class="item-left " style="width: 80%;" @click="showFlag = !showFlag">
						商品信息
					</view>
					<view class="item-right">
						<button type="primary" size="mini" class="mini-btn" @click="addList">
							添加
						</button>
					</view>
				</view>
				<view class="productInfoWrap" v-if="showFlag">
					<view class="productInfoItem" v-for="(item, index) in formData.inProductList" :key="index">
						<view style="flex:1">
							<view class="productInfoItem-title">
								<text class="text">批次号{{ item.lotNo }}</text>
								<uni-icons type="clear" color="#bdbdbd" class="icons" @click="inProductDel(index)"></uni-icons>
							</view>
							<view class="productInfoItem-header">
								<view class="item-left">
									{{ item.productName }}
								</view>
								<view class="item-con">
									<view class="con-title">
										{{ item.brand }} - {{ item.origin }} - {{ item.spec }}
									</view>
									<view class="con-text">
										<view v-if="item.includeTaxPrice">
											￥ {{ item.includeTaxPrice }} * {{ item.measurementQuantity || 0 }}{{ item.productUnitCode | dataDictFormat("goodsUnit") }}
										</view>
									</view>
									<view class="con-text">
										入库数量：{{ item.inQuantity || 0 }}{{ item.productUnitCode | dataDictFormat("goodsUnit") }}
									</view>
								</view>
								<view class="item-right">
									<view v-if="item.includeTaxPrice">
										￥{{ item.includeTaxPrice * item.measurementQuantity }}<uni-icons type="arrowright" color="#999"></uni-icons>
									</view>
								</view>
							</view>
							<view class="productInfoItem-btn">
								<label class="radio">
									<checkbox :value="item.rightFlag" :checked="item.checked" />
									<text>货权转移</text>
								</label>
								<label class="radio">
									<checkbox :value="item.goodsFlag" :checked="item.checked" />
									<text>货齐</text>
								</label>
								<label class="radio" @click="onAddCost(item, index)">
									<uni-icons type="plus-filled" color="red" size="20"></uni-icons><text style='vertical-align:top;margin:4upx;'>其他费用</text>
								</label>
							</view>
							<view>
								<view class="storageItem">
									<view class="item-left ">
										费用信息
									</view>
									<view class="item-right" @click="showClick(item)">
										<text style="color:#007aff;" v-if="!!item.showFlagCost">收起</text>
										<text style="color:#007aff;" v-else>展开</text>
									</view>
								</view>
							</view>
							<uni-swipe-action class="inBillCostList" :style="{ padding: item.inBillCostList.length ? '20upx' : 0 }" v-if="item.showFlagCost">
								<uni-swipe-action-item class="inBillCostItem" v-for="(cost, index) in item.inBillCostList" :key="index" :right-options="options" @click="bindClick(i, index)">
									<view class="item-con">
										<view class="cost-left">
											<view class="leftNum">
												{{ index + 1 }}
											</view>
										</view>
										<view class="cost-con">
											<view class="cost-con-box">
												<view class="con-title text">
													{{ cost.productName }}：{{ cost.brand }} - {{ cost.origin }} - {{ cost.spec }}
												</view>
												<view class="text">{{ cost.settlementName }}</view>
												<view class="text">{{ cost.feeName }}</view>
											</view>
										</view>
										<view class="cost-right">
											<view class="tag collect">
												{{ cost.feeDirectionName }}
											</view>
											<text>￥{{ cost.includeTaxAmount }}</text>
										</view>
									</view>
								</uni-swipe-action-item>
							</uni-swipe-action>
						</view>
					</view>
				</view>
				<!-- 入库日期 -->
				<view class="storageItem">
					<view class="item-left danger">
						入库日期*
					</view>
					<view class="item-right">
						<picker mode="date" v-model="formData.inDate" @change="bindStartDateChange">
							<view class="uni-input">{{ formData.inDate | dateFormate() }}
								<uni-icons type="arrowright" color="#999"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<!-- 业务机构-->
				<view class="storageItem">
					<view class="item-left">
						业务机构
					</view>
					<view class="item-right">
						<picker mode="selector" :value="bizOrganIndex" :range="bizOrganList" :range-key="'name'" @change="bizOrganChange">
							<view class="uni-input">
								{{ formData.bizOrganName }}
								<uni-icons type="arrowright" color="#999"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<!-- 业务部门-->
				<view class="storageItem">
					<view class="item-left">
						业务部门
					</view>
					<view class="item-right">
						<picker mode="selector" :value="bizDeptIndex" :range="bizDeptList" :range-key="'name'" @change="bizDeptChange">
							<view class="uni-input">
								{{ formData.bizDeptName }}
								<uni-icons type="arrowright" color="#999"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<!-- 业务员-->
				<view class="storageItem">
					<view class="item-left">
						业务员
					</view>
					<view class="item-right">
						<picker mode="selector" :value="formData.bizEmployeeCode" :range="bizEmployeeList" :range-key="'name'" @change="bizEmployeeChange">
							<view class="uni-input">
								{{ formData.bizEmployeeName }}
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
						<textarea placeholder="请输入备注信息" v-model="formData.remark"></textarea>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-btn">
		  <button class="cancel" @click="doCancle">取消</button>
		  <button class="save" @click="doSave">保存</button>
		</view>
	</view>
</template>

<script>
import request from "@/utils/request.js";
export default {
    data() {
        return {
            ifOnShow: false,
            showFlag: true,
            curreryList: [],
            currencyIndex: 0,
            bizOrganIndex: 0,
            bizDeptIndex: 0,
            bizEmployeeIndex: 0,
            bizOrganList: [],
            bizDeptList: [],
            bizEmployeeList: [],
            proindex: "",
            formData: {
                supplierName: "",
                supplierCode: "",
                warehouseName: "",
                warehouseCode: "",
                currencyCode: "CNY",
                inDate: "",
                bizOrganCode: "",
                bizOrganName: "",
                bizDeptCode: "",
                bizDeptName: "",
                bizEmployeeCode: "",
                bizEmployeeName: "",
                remark: "",
                inProductList: [],
                inBillCostList: []
            },
            options: [
                {
                    text: "删除",
                    style: {
                        backgroundColor: "#dd524d"
                    }
                }
            ]
        }
    },
    async onLoad() {
		this.formData = Object.assign({}, this.formData, this.$Route.query)
		this.formData.inProductList.forEach(item => {
			if (item.inBillCostList.length) {
				item.inBillCostList.forEach(i => {
					i.showFlagCost = false
				})
			}
		})
		// 获取币种列表
		this.curreryList = this.$store.state.dictData.currency
		// 获取部门信息
		const bizOrganList = await this.getConList({
			type: "FUNC_ORG"
		})
		// 获取业务机构信息（x下拉）
		const bizDeptList = await this.getConList({
			type: "FUNC_DEPT"
		})
		// 业务员
		const bizEmployeeList = await this.getConList({
			type: "FUNC_EMPLOYEE"
		})
		this.bizOrganList = bizOrganList.data
		this.bizDeptList = bizDeptList.data
		this.bizEmployeeList = bizEmployeeList.data
    },
    methods: {
        bindClick(i, index) {
            this.formData.inProductList[i].inBillCostList.splice(index, 1);
        },
        inProductDel(index) {
            this.formData.inProductList.splice(index, 1)
        },
        showClick(item) {
			this.$set(item, 'showFlagCost', !item.showFlagCost)
        },
        onAddCost(item, index) {
            this.proindex = index
            if (!item.inQuantity) item.inQuantity = 0
			this.formData.currentProductInfo = item
			this.$Router.push({
				path: 'add-cost/add-cost',
				params: {
					...this.formData,
					index: index
				}
			})
        },
        addList() {
            uni.showActionSheet({
                itemList: ["批次入库"],
                success: (res) => {
					this.$Router.push({
						path: '/pages/storage-notice/purchase-batch-select/purchase-batch-select',
						params: {
							...this.formData,
							type: res.tapIndex.toString()
						}
					})
                }
            })
        },
        getConList(parmas) {
            return request.post("/vrm/api/dd/selectData/list", {
                data: parmas,
                funcModule: "入库通知新增",
                funcOperation: "查询",
            });
        },
		// 供应商修改
        supplierSelect() {
			this.$Router.push({
				path: '/pages/storage-notice/supplier-select/supplier-select',
				params: this.formData
			})
        },
		// 仓库修改
        storageSelect() {
			this.$Router.push({
				path: '/pages/storage-notice/storage-select/storage-select',
				params: this.formData
			})
        },
		// 币种修改
        currenyChange(e) {
            this.currencyIndex = e.target.value;
            this.formData.currencyCode = this.curreryList[this.currencyIndex].value;
        },
		// 入库日期修改
        bindStartDateChange(e) {
            this.formData.inDate = e.target.value;
        },
		// 机构修改
        bizOrganChange(e) {
            this.bizOrganIndex = e.target.value;
            this.formData.bizOrganCode = this.bizOrganList[this.bizOrganIndex].code;
            this.formData.bizOrganName = this.bizOrganList[this.bizOrganIndex].name;
        },
		// 部门修改
        bizDeptChange(e) {
            this.bizDeptIndex = e.target.value;
            this.formData.bizDeptCode = this.bizDeptList[this.bizDeptIndex].code;
            this.formData.bizDeptName = this.bizDeptList[this.bizDeptIndex].name;
        },
		// 员工修改
        bizEmployeeChange(e) {
            this.bizEmployeeIndex = e.target.value;
            this.formData.bizEmployeeCode = this.bizEmployeeList[this.bizEmployeeIndex].code;
            this.formData.bizEmployeeName = this.bizEmployeeList[this.bizEmployeeIndex].name;
        },
        dateFormate(date) {
            if (date) {
                const year = new Date(date).getFullYear() + "";
                const month = new Date(date).getMonth() + 1 > 9 ? new Date(date).getMonth() + 1 : "0" + (new Date(date).getMonth() + 1);
                const day = new Date(date).getDate() > 9 ? new Date(date).getDate() : "0" + new Date(date).getDate();
                return year + month + day;
            }
        },
		goBack() {
			this.$Router.replace("/pages/work/index")
		},
        doCancle() {
			this.$Router.replace('/pages/work/index')
        },
        async doSave() {
            if (
                !this.formData.supplierName ||
                !this.formData.warehouseName ||
                !this.formData.currencyCode ||
                !this.formData.inDate ||
                !this.formData.bizOrganCode ||
                !this.formData.bizDeptCode ||
                !this.formData.bizEmployeeCode
            ) {
                uni.showToast({
                    title: "必填项不得为空",
                    icon: "none",
                });
                return;
            }
            uni.showModal({
                title: "提示",
                content: "请确认当前数据已经准确无误，是否确定保存？",
                success: async (res) => {
                    if (res.confirm) {
                        const formData = JSON.stringify(this.formData)
                        const params = Object.assign({}, JSON.parse(formData))
                        delete params.currentProductInfo
                        params.inDate = this.dateFormate(params.inDate)
                        params.deliverCode = params.inProductList[0].lot.supplierCodeList[0]
                        params.inType = "LOT"
                        params.lotNo = params.inProductList[0].lotNo
                        params.contractNo = params.inProductList[0].contractNo
                        params.inProductList.forEach((item) => {
                            item.lotProductDetailCode = item.productDetailNo
                            item.preBillProductDetailCode = item.productDetailNo
                            item.rightFlag = !!+item.rightFlag ? "1" : "0"
                            item.goodsFlag = !!+item.goodsFlag ? "1" : "0"
                            if (item.goodsFlag === "1") {
								item.settlementQuantity = item.inQuantity
							}
                        })
                        const res = await request.post("/vrm/api/warehouse/inBill/save", {
                            funcModule: "入库通知新增",
                            funcOperation: "保存",
                            data: params
                        })
                        if (res.status) {
                            uni.showToast({
                                title: "保存成功"
                            })
							this.$Router.replace('/pages/work/index')
                        } else {
                            uni.showToast({
                                title: "res.msgText",
                                icon: "none"
                            })
                        }
                    } else if (res.cancel) {
                        console.log("用户点击取消")
                    }
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.storageWrap {
    height: calc(100vh - 88upx);
    background-color: #f5f5f5;
    overflow: scroll;

    .storageList {
        font-size: 28upx;

        .storageItem {
            padding-left: 20upx;
            padding-right: 20upx;
            background-color: #fff;
            display: flex;
            line-height: 86upx;
            border-bottom: 1px solid #f5f5f5;

            .item-left {
                width: 20%;
            }

            .item-right {
                flex: 1;
                text-align: right;
                line-height: 86upx;
                font-size: 24upx;

                button {
                    margin: 5upx;
                    display: inline-flex;
                }
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
                border: 1px solid #f1f1f1;
                font-size: 24upx;
                padding: 10upx;
                height: 130upx !important;
            }
        }
    }
    .productInfoWrap {
        width: 100%;
        background-color: #fff;
        .productInfoItem {
            margin: 10upx 0;
            & > view {
                width: 100%;
            }
            .productInfoItem-title {
                color: #999;
                display: flex;
                padding: 20upx 20upx 0upx 20upx;
                .text {
                    flex: 1;
                }
                .icons {
                    text-align: right;
                    width: 40upx;
                }
            }
            .productInfoItem-header {
                padding: 20upx;
                display: flex;
                border-bottom: 1px solid #eee;
                .item-left {
                    width: 120upx;
                    height: 120upx;
                    background-color: #2484cf;
                    color: #fff;
                    text-align: center;
                    line-height: 120upx;
                }
                .item-con {
                    flex: 1;
                    padding-left: 20upx;
                    .con-title {
                        color: #333;
                        font-size: 28upx;
                        font-weight: 600;
                        margin-bottom: 8upx;
                    }
                    .con-text {
                        color: #666;
                        font-size: 24upx;
                        line-height: 40upx;
                    }
                }
                .item-right {
                    width: 200upx;
                    text-align: right;
                    color: #999;
                    line-height: 120upx;
                }
            }
            .productInfoItem-btn {
                display: flex;
                padding: 20upx;
                border-bottom: 1px solid #eee;
                .radio {
                    flex: 1;
                    text-align: center;
					/deep/ .uni-checkbox-input {
						width: 30upx !important;
						height: 30upx !important;
					}
                    uni-icons {
                        padding-right: 10upx;
                    }
                    text {
                        color: #333;
                    }
                }
            }
            .storageItem {
                border-bottom: 1px solid #eee;
            }
        }
        .inBillCostList {
            background-color: #f1f1f1;
            .inBillCostItem {
                background-color: #fff;
                border-radius: 10upx;
                margin-bottom: 10upx;
                &:last-child {
                    margin-bottom: 0upx;
                }
                .item-con {
                    width: 100%;
                    display: flex;
                    .cost-left {
                        width: 50upx;
                        padding: 20upx;
                        align-items: center;
                        .leftNum {
                            width: 60upx;
                            height: 60upx;
                            background-color: #2484cf;
                            border-radius: 60upx;
                            color: #fff;
                            text-align: center;
                            line-height: 60upx;
                            margin-top: 36upx;
                        }
                    }
                    .cost-con {
                        overflow: hidden;
                        flex: 1;
                        padding: 20upx;
                        text-overflow: ellipsis;
                        width: 400upx;
                        .cost-con-box {
                            .con-title {
                                font-size: 30upx;
                                color: #666;
                                margin-bottom: 10upx;
                            }
                            .text {
                                overflow: hidden;
                                white-space: nowrap;
                                font-size: 28upx;
                                text-overflow: ellipsis;
                            }
                        }
                    }
                    .cost-right {
                        width: 140upx;
                        padding: 20upx;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        .tag {
                            width: 100upx;
                            height: 40upx;
                            padding: 4upx;
                            border-radius: 50upx;
                            text-align: center;
                            margin-bottom: 10upx;
                            font-weight: bold;
                            &.collect {
                                border: 1px solid #ff7163;
                                background-color: #fbe1e2;
                                color: #ff7163;
                            }
                            &.cope {
                                border: 1px solid #0ba231;
                                background-color: #d8fadf;
                                color: #0ba231;
                            }
                        }
                        text {
                            color: #666;
                        }
                    }
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
	border-top: 1px solid #d5d5d6;
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

    &.bottom-btn-3 {
        uni-button {
            width: 228upx;
        }
    }
}
</style>
