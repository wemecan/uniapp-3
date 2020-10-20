import Vue from 'vue'
import request from "@/utils/request"

// 字典码表
Vue.filter('dataDictFormate', (value, dict) => {
	if (!dict) return value
	if (Array.isArray(value)) {
		return value.map(val => {
			return dict.filter(v => v.value === val)[0] && dict.filter(v => v.value === val)[0].label
		}).join()
	} else if (value && dict.filter(v => v.value === value)[0]) {
		return dict.filter(v => v.value === value)[0].label
	}
})
// 日期
Vue.filter('dateFormate', (value) => {
	if (value) {
		if (value.length === 8) {
			return value.slice(0, 4) + '-' + value.slice(4, 6) + '-' + value.slice(6, 8)
		} else {
			return value.slice(0, 10)
		}
	}
	return null
})
// 数值
Vue.filter('numFormate', (value, precision) => {
	if (value === '' || value === undefined || value === null) return
	if (!precision) {
		value = value.toString()
	} else {
		value = Number(value).toFixed(precision)
	}
	if (/\./.test(value)) {
		return value.replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\d{3}(?![.]|$)/g, '$&')
	} else {
		return value.replace(/\d(?=(\d{3})+$)/g, '$&,')
	}
})