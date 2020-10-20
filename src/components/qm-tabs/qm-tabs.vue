<template>
    <view class="tabs">
        <view :class="[ 'item', { active: name === item.label } ]" v-for="item in tabs" :key="item.label" @click="tabClick(item)">
            <uni-text :class="[ 'iconfont', item.className ]"></uni-text>
            <view>{{ item.label }}</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            tabs: [{
                className: 'icon-gongzuotai',
                label: '工作台',
                path: '/pages/work/index'
            }, {
                className: 'icon-xiaoxi',
                label: '消息',
                path: '/pages/news/index'
            }, {
                className: 'icon-yujing',
                label: '预警',
                path: '/pages/warning/index',
                disabled: true
            }, {
                className: 'icon-baobiao',
                label: '报表',
                path: '/pages/report/index'
            }, {
                className: 'icon-wode',
                label: '我',
                path: '/pages/mine/index'
            }]
        }
    },
    props: {
        name: {
            type: String,
            default: '工作台'
        }
    },
    methods: {
        tabClick(query) {
            if (query.disabled || this.name === query.label) return
            this.$Router.push(query.path)
        }
    }
}
</script>

<style scoped lang='scss'>
.tabs {
  position: fixed;
  display: flex;
  bottom: 0;
  width: 100%;
  height: 100upx;
  border-top: 1px solid #f2f2f2;
  background: #ffffff;

  .item {
    width: 20%;
    text-align: center;
    font-size: 20upx;
    margin-top: 10upx;

    uni-text {
      display: inline-block;
      width: 76upx;
      font-size: 42upx;
    }

    &:first-of-type {
      margin-top: 10upx;
      uni-view {
        margin-top: -2upx;
      }
    }
  }

  .active {
    color: #2484cf;

    uni-text {
      color: #2484cf;
    }
  }
}
</style>
