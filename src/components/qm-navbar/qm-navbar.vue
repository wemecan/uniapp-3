<template>
    <view class="nav">
        <view class="back">
            <uni-icons type="back" color="#ffffff" size="20" v-if="isShowBack" @click="goBack"></uni-icons>
        </view>
        <view class="title">{{ title }}</view>
        <view class="confirm" @click="navBtn">
            {{btnName}}
        </view>
    </view>
</template>

<script>
export default {
    props: {
        title: String,
        btnName: String,
        isShowBack: {
            type: Boolean,
            default: true
        },
        url: {
            type: String,
            default: ''
        },
        event: Function
    },

    methods: {
        goBack() {
            if (this.event) {
                this.event()
            } else {
                this.$Router.back()
            }
        },
        navBtn() {
            this.$emit('myEvent')
        }
    }
}
</script>

<style scoped lang="scss">
.nav {
  width: 100%;
  height: 88upx;
  line-height: 88upx;
  background-color: #2484cf;
  color: #ffffff;
  font-size: 32upx;
  display: flex;

  .back {
    width: 80upx;
    padding-left: 20upx;
  }

  .title {
    flex: 1;
    text-align: center;
  }

  .confirm {
    width: 80upx;
    font-size: 32upx;
    text-align: right;
    padding-right: 20upx;
  }
}
</style>
