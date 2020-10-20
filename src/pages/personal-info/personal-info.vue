<template>
	<view class="personal-info">
		<qm-navbar title="个人资料" url="/pages/mine/index"></qm-navbar>
		<view class="info-list">
			<uni-list>
				<uni-list-item title="头像" :showArrow="true">
					<template v-slot:right="">
						<image style="width: 40px;height: 40px;" src="../../static/img/mine/header.jpg" mode="widthFix"></image>
					</template>
				</uni-list-item>
				<uni-list-item title="账号" :rightText="users.account" :showArrow="false"></uni-list-item>
				<uni-list-item title="姓名" :rightText="users.name" :showArrow="false"></uni-list-item>
				<uni-list-item title="登陆时间" :rightText="users.timeNow" :showArrow="false"></uni-list-item>
				<uni-list-item title="机构" :rightText="users.userOrganCode" :showArrow="false"></uni-list-item>
				<uni-list-item title="部门" :rightText=" users.userDeptCode " :showArrow="false"></uni-list-item>
				<uni-list-item title="员工" :rightText="users.userEmployeeCode" :showArrow="false"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import Vue from 'vue'
	import request from "@/utils/request.js"
	export default {
		data() {
			return {
				users: {}
			}
		},
		async onLoad() {
			this.users = this.$Route.query.userInfo
			
			const organList = await request.post('/vrm/api/dd/selectData/list', {
				data: {
					type: "FUNC_ORG",
					queryParams: {}
				},
				funcModule: "登录",
				funcOperation: "查询"
			})
			const userOrgan = organList.data.filter(v => v.code === this.users.userOrganCode)[0]
			this.users.userOrganCode = userOrgan ? userOrgan.name : ''
			
			const deptList = await request.post('/vrm/api/dd/selectData/list', {
				data: {
					type: "FUNC_DEPT",
					queryParams: {}
				},
				funcModule: "登录",
				funcOperation: "查询"
			})
			const userDept = deptList.data.filter(v => v.code === this.users.userDeptCode)[0]
			this.users.userDeptCode = userDept ? userDept.name : ''
			
			const employeeList = await request.post('/vrm/api/dd/selectData/list', {
				data: {
					type: "FUNC_EMPLOYEE",
					queryParams: {}
				},
				funcModule: "登录",
				funcOperation: "查询"
			})
			const userEmployee = employeeList.data.filter(v => v.code === this.users.userEmployeeCode)[0]
			this.users.userEmployeeCode = userEmployee ? userEmployee.name : ''
		}
	}
</script>

<style scoped lang="scss">
	.personal-info {
		background: #f5f5f5;
		height: 100vh
	}
</style>
