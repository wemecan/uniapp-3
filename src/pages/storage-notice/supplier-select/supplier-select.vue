<template>
    <view class="supplier-pages">
        <qm-navbar title="供应商" btnName="确定" :event="goBack" @myEvent="onConfirm"></qm-navbar>
        <uni-search-bar @confirm="search" :radius="100" class="searchbar" />
        <view class="supplier-content">
            <radio-group @change="radioChange">
                <label class="supplier-item" v-for="(item, index) in supplierList" :key="item.code">
                    <view class="title">{{ item.name }}</view>
                    <view class="radio">
                        <radio :value="item.code" :checked="index === current" />
                    </view>
                </label>
            </radio-group>
        </view>
    </view>
</template>

<script>
import request from "@/utils/request.js";
export default {
    data() {
        return {
            current: "",
            supplierCode: "",
			supplierName: "",
            supplierList: []
        }
    },
	onLoad() {
		this.supplierCode = this.$Route.query.supplierCode
		this.supplierName = this.$Route.query.supplierName
		this.getList()
	},
    methods: {
		async getList() {
		    const res = await request.post("/vrm/api/dd/selectData/list", {
		        data: {
		            type: "CUST_INFO",
		            queryParams: {
		                auditStatus: "3",
		                typeCode: "2",
		                usingFlag: "1",
		            },
		        },
		        funcModule: "入库通知新增",
		        funcOperation: "查询",
		    })
		    this.supplierList = res.data
		    this.supplierList.forEach((item) => {
		        item.show = true
		    })
			this.supplierList.forEach((item, index) => {
				if (item.code === this.$Route.query.supplierCode) {
					this.current = index
				}
			})
		},
        radioChange(evt) {
            for (let i = 0; i < this.supplierList.length; i++) {
                if (this.supplierList[i].code === evt.target.value) {
                    this.current = i;
                    break;
                }
            }
            this.supplierCode = this.supplierList[this.current].code
            this.supplierName = this.supplierList[this.current].name
        },
        onConfirm() {
            if (!this.supplierCode) {
                uni.showToast({
                    title: "请选择供应商",
                    duration: 2000,
                    icon: "none",
                });
            } else {
				const params = {
					supplierCode: this.supplierCode,
					supplierName: this.supplierName
				}
				this.$Router.push({
					path: '/pages/storage-notice/storage-notice',
					params: Object.assign({}, this.$Route.query, params)
				})
            }
        },
		goBack() {
			this.$Router.push({
				path: '/pages/storage-notice/storage-notice',
				params: this.$Route.query
			})
		},
        search() { }
    }
}
</script>

<style scoped lang="scss">
.supplier-pages {
    height: 100%;
    width: 100%;

    .searchbar {
        margin: 10upx 30upx;
    }

    .supplier-content {
        height: calc(100vh - 210upx);
        overflow: scroll;

        .supplier-item {
            background-color: #fff;
            border-bottom: 1px solid #eee;
            padding-left: 20upx;
            font-size: 24upx;
            line-height: 80upx;
            display: flex;

            .radio {
                text-align: center;
                width: 100upx;
                radio {
                    transform: scale(0.8);
                }
            }

            .title {
                flex: 1;
            }
        }
    }
}
</style>
