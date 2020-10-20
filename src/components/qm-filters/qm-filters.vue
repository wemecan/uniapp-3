<template>
    <view class="filter">
        <view class="left">
            <picker @change="bindPickerChange" :value="index" :range="array">
                <view class="uni-input">
                    {{ array[index] }}<img src="static/img/down.png" alt="">
                </view>
            </picker>
        </view>
        <view class="right" @click="drawerShow">
            筛选<img src="static/img/screen.png" alt="">
            <uni-drawer ref="drawer" mode="right">
                <view style="padding: 30rpx;">
                    <slot name="drawer"></slot>
                </view>
            </uni-drawer>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            index: 0
        }
    },
    props: {
        array: Array
    },
    methods: {
        bindPickerChange(e) {
            this.index = e.target.value
            this.$emit('changeLeft', e.target.value)
        },
        drawerShow() {
            this.$refs.drawer.open()
        },
        closeDrawer() {
            this.$refs.drawer.close()
        }
    }
}
</script>

<style scoped lang="scss">
.filter {
  width: 100%;
  font-size: 26upx;

  .left {
    float: left;
    width: 50%;
    height: 80upx;
    line-height: 76upx;
    border: 1px solid #e1e1e1;
    border-left: none;
    box-sizing: border-box;

    uni-picker {
      text-align: center;

      img {
        width: 20upx;
        margin-left: 20upx;
      }
    }
  }

  .right {
    position: relative;
    float: left;
    width: 50%;
    height: 80upx;
    line-height: 76upx;
    text-align: center;
    border: 1px solid #e1e1e1;
    border-left: none;
    border-right: none;
    box-sizing: border-box;

    img {
      width: 20upx;
      margin-left: 20upx;
    }
  }

  &::after {
    display: block;
    clear: both;
    content: "";
  }
}
</style>
