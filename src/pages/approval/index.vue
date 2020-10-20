<template>
    <view class="approval">
        <qm-navbar :url="option.opType === 'view' ? '/pages/complete/index' : '/pages/handle/index'" :title="option.businessName"></qm-navbar>

        <view class="header">
            <view class="title">
                <view class="name" :style="{ width: option.startTime ? '50%' : '100%' }">{{ option.todoThat }}</view>
                <view class="time">{{ option.startTime }}</view>
            </view>
            <view class="card">
                <view :class="['item', { 'active': activeTab === item.label }]" v-for="item in tabs" :key="item.label" @click="tabClick(item)">
                    <view>
                        <img :src="item.src" alt="">
                    </view>
                    <view>{{ item.label }}</view>
                </view>
            </view>
        </view>

        <view v-if="activeTab === '审批信息'" :class="['approval-list', { 'view-list': option.opType === 'view' }]">
            <view class="item" v-for="(info, index) in infos" :key="info" v-show="!information[info].isHideFlag">
                <view class="title">
                    <view class="border" :style="{ 'background': information[info].formData ? titleLeftBorder[index] : '#26c9ae' }"></view>
                    <uni-text>{{ information[info].title }}</uni-text>
                    <uni-text class="controll" @click="showMap[info] = !showMap[info]">{{ showMap[info] ? "收起" : "展开" }}</uni-text>
                </view>
                <view class="content" v-if="showMap[info]">
                    <view v-if="information[info].formData">
                        <view class="line" v-for="item in information[info].formData" :key="item.label">
                            <uni-text class="label">{{ item.label }}</uni-text>
                            <uni-text class="value" v-if="item.dict">{{ formData[item.prop] | dataDictFormate(dictData(item.dict)) }}</uni-text>
                            <uni-text class="value" v-else-if="item.formate === 'date'">{{ formData[item.prop] | dateFormate }}</uni-text>
                            <uni-text class="value" v-else-if="item.formate === 'thousands'">{{ formData[item.prop] | numFormate(item.precision) }}</uni-text>
                            <uni-text class="value" v-else>{{ formData[item.prop] }}</uni-text>
                        </view>
                    </view>
                    <view v-else-if="information[info].tableData && tablesData[info] && tablesData[info].length">
                        <view class="line" v-for="item in tablesData[info]" :key="item.label">
                            <uni-text class="label">{{ item[information[info].mainColumn] | dataDictFormate(dictData(information[info].mainColumnDict)) }}</uni-text>
                            <uni-text class="value" @click="showTabDetail(item, information[info])">
                                <uni-icons type="arrowright" color="#999999" size="18"></uni-icons>
                            </uni-text>
                        </view>
                    </view>
                    <view class="line" v-else>
                        <uni-text class="label">暂无数据</uni-text>
                    </view>
                </view>
            </view>
            <view class="submit">
                <view class="uni-form-item">
                    <view class="title">提交人</view>
                    <input class="value" v-model="formData.submitter" disabled />
                    <!-- <view class="value">{{ formData.submitter }}</view> -->
                </view>
                <view class="uni-form-item" v-if="option.assistId">
                    <view class="title">协助信息</view>
                    <view class="value">{{ formData.assistMsg }}</view>
                </view>
                <view class="uni-form-item" v-if="option.opType === 'view'">
                    <view class="title">审核意见</view>
                    <view class="uni-textarea">
                        <textarea v-model="formData.assistResult" disabled placeholder-style="color:#999999" placeholder="请输入审核意见"></textarea>
                    </view>
                </view>
            </view>
        </view>

        <view v-if="activeTab === '附件'" :class="['attachment-list', { 'view-list': option.opType === 'view' }]">
            <view class="item" v-for="item in attachList" :key="item.id">
                <view class="title">
                    <img src="static/img/approval/approval_attachment_icon.png" alt="">
                    <uni-text class="filename">{{ item.fileName }}</uni-text>
                    <uni-text class="date">{{ item.createDate }}</uni-text>
                </view>
                <view class="txt">
                    <uni-text>{{ item.createUser }}&nbsp;{{ item.remark }}</uni-text>
                    <view class="img">
                        <img @click="preview(item)" src="static/img/approval/approval_attachment_preview.png" class="preview" />
                        <img @click="download(item)" src="static/img/approval/approval_attachment_download.png" class="download" />
                    </view>
                </view>
            </view>
        </view>

        <view v-if="activeTab === '审核历史'" :class="['history-list', { 'view-list': option.opType === 'view' }]">
            <view class="audit_history_index">
                <view class="item" v-for="(item, index) in auditHistory" :key="index">
                    <uni-text>{{ index + 1 }}</uni-text>
                    <view class="underline" v-if="auditHistory.length - 1 !== index"></view>
                </view>
            </view>
            <view class="audit_history_content">
                <view class="step_content" v-for="(item, index) in auditHistory" :key="index">
                    <view class="handle_info">
                        <uni-text class="person">{{ item.accountName }}</uni-text>
                        <uni-text class="date">{{ item.updateDate }}</uni-text>
                    </view>
                    <view class="handle_result">
                        <img src="static/img/approval/approval_ok.png" style='width: 32upx;vertical-align: middle;' v-if="item.agreeFlg !== '0'" />
                        <img src="static/img/approval/approval_refuse.png" style='width: 32upx;vertical-align: middle;' v-if="item.agreeFlg === '0'" />
                        <uni-text class="result">
                            {{ item.agreeFlg | dataDictFormate(dictData('agreeFlg')) }}&nbsp;{{ item.trackType | dataDictFormate(dictData('trackType')) }}
                        </uni-text>
                    </view>
                </view>
            </view>
        </view>

        <view :class="['bottom-btn', { 'bottom-btn-3': option.assistId }]" v-if="option.opType === 'edit'">
            <button class="cancel" @click="doCancel">取消</button>
            <button class="refuse" @click="doRefuse">拒绝</button>
            <button v-if="!option.assistId" class="assist" @click="doAssist">协助</button>
            <button class="agree" @click="doAgree">通过</button>
        </view>

        <!-- 审核 -->
        <view class="dialog" v-if="approvalVisible">
            <view class="dialog-mask"></view>
            <view class="dialog-content">
                <view class="title">
                    {{ approvalStatus === 'refuse' ? '拒绝审核' : approvalStatus === 'assist' ? '协助审核' : '确认审核' }}
                    <uni-icons class="close" type="closeempty" color="#ffffff" size="16" @click.native="approvalVisible = false"></uni-icons>
                </view>
                <!-- 拒绝 -->
                <view class="approval-main main" v-if="approvalStatus === 'refuse'">
                    <view class="uni-form-item">
                        <view class="title">审核意见</view>
                        <view class="value">
                            <textarea v-model="formData.opinion" placeholder-style="color:#999999" placeholder="请输入审核意见"></textarea>
                        </view>
                    </view>
                    <button type="primary" @click="onRefuseConfirm">确认</button>
                </view>
                <!-- 协助 -->
                <view class="approval-main main" v-if="approvalStatus === 'assist'">
                    <view class="uni-form-item">
                        <view class="title">
                            选择协助人
                        </view>
                        <view class="value">
                            <picker @change="employeeChange" :value="employeeIndex" :range="employeeList" range-key="name">
                                <view class="uni-input">{{ employeeList[employeeIndex] && employeeList[employeeIndex].name }}</view>
                            </picker>
                        </view>
                    </view>
                    <view class="uni-form-item">
                        <view class="title">协助信息</view>
                        <view class="value">
                            <textarea v-model="formData.assistMsg" placeholder-style="color:#999999" placeholder="请输入审核意见"></textarea>
                        </view>
                    </view>
                    <button type="primary" @click="onAssistConfirm">确认</button>
                </view>
                <!-- 通过 -->
                <view class="approval-main main" v-if="approvalStatus === 'agree'">
                    <view class="uni-form-item">
                        <view class="title">审核意见</view>
                        <view class="value">
                            <textarea v-model="formData.opinion" placeholder-style="color:#999999" placeholder="请输入审核意见"></textarea>
                        </view>
                    </view>
                    <button type="primary" @click="onAgreeConfirm">确认</button>
                </view>
            </view>
        </view>

        <!-- 下一级审批人 -->
        <view class="dialog" v-if="nextUserTaskVisible">
            <view class="dialog-mask"></view>
            <view class="dialog-content">
                <view class="title">
                    选择审核人
                    <uni-icons class="close" type="closeempty" color="#ffffff" size="16" @click.native="nextUserTaskVisible = false"></uni-icons>
                </view>
                <view class="approval-main main">
                    <view class="uni-form-item" v-for="item in nextUserList" :key="item.id">
                        <view class="title">
                            选择协助人
                        </view>
                        <view class="value">
                            <picker @change="nextUserChange($event, item)" :value="item.accountIndex" :range="item.list" range-key="firstName">
                                <view class="uni-input">{{ item.list[item.accountIndex] && item.list[item.accountIndex].firstName }}</view>
                            </picker>
                        </view>
                    </view>
                    <button type="primary" @click="onNextUserTaskConfirm">确认</button>
                </view>
            </view>
        </view>

        <!-- 列表详情查看 -->
        <view class="dialog" v-if="dialogVisible">
            <view class="dialog-mask"></view>
            <view class="dialog-content">
                <view class="title">
                    {{ currentTitle }}
                    <uni-icons class="close" type="closeempty" color="#ffffff" size="16" @click.native="dialogVisible = false"></uni-icons>
                </view>
                <view class="main">
                    <view class="line" v-for="item in currentCols" :key="item.prop">
                        <uni-text class="label">{{ item.name }}</uni-text>
                        <uni-text class="value">{{ currentRow[item.prop] | dataDictFormate(dictData(item.dict)) }}</uni-text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import request from "@/utils/request"
import approval from "@/static/js/approval"
import approvalInfo from "@/static/js/approvalInfo"

export default {
    data() {
        return {
            dialogPdfVisible: false,
            titleLeftBorder: [
                '#2484cf',
                '#ff5960',
                '#f39900',
                '#e400f3',
                '#606266'
            ],
            activeTab: '审批信息',
            tabs: [{
                label: '审批信息',
                src: 'static/img/approval/approval_information.png'
            }, {
                label: '附件',
                src: 'static/img/approval/approval_attachment.png'
            }, {
                label: '审核历史',
                src: 'static/img/approval/approval_history.png'
            }],
            a: [{}, {}, {},
            {}],
            showMap: {},
            infos: [],
            information: {},
            formData: {
                submitter: '', // 提交人
                assistMsg: '', // 协助审核信息
                opinion: '', // 审核信息
                assistResult: '' // 审核结果
            },
            tablesData: [],
            option: {},
            currentRow: {},
            currentCols: [],
            currentTitle: '',
            dialogVisible: false,
            approvalVisible: false,
            approvalStatus: '',
            employeeList: [],
            employeeIndex: 0,
            nextUserTaskVisible: false,
            nextUserList: [],
            attachList: [],
            auditHistory: []
        }
    },
    async onLoad() {
        this.option = this.$Route.query.queryParams
        this.formData.submitter = this.option.submitter
        this.formData.assistMsg = this.option.assistMsg
        this.formData.assistResult = this.option.assistResult
        this.information = approval[this.option.bpmComponent] || approvalInfo[this.option.bpmComponent]
        this.infos = Object.keys(this.information).slice(1)

        request.post('/vrm/api' + this.information['api']['get'], {
            data: this.option.uk,
            funcModule: this.option.businessName,
            funcOperation: '查看'
        }).then(res => {
            if (res.status) {
                this.formData = Object.assign({}, this.formData, res.data)
                // 请求下拉选数据回显表单值
                this.infos.forEach(i => {
                    this.$set(this.showMap, i, false)
                    // 根据条件隐藏部分信息
                    if (Array.isArray(this.information[i].isHide)) {
                        const isHideFlag = []
                        this.information[i].isHide.forEach((f) => {
                            isHideFlag.push(f.value.includes(this.formData[f.key]))
                        })
                        this.information[i].isHideFlag = isHideFlag.includes(true)
                    }
                    if (Array.isArray(this.information[i].formData)) {
                        this.information[i].formData.forEach((form) => {
                            if (Array.isArray(form.isHide)) {
                                const isHideFlag = []
                                form.isHide.forEach((f) => {
                                    isHideFlag.push(f.value.includes(this.formData[f.key]))
                                })
                                form.isHideFlag = isHideFlag.includes(true)
                            }
                            if (form.selectData) {
                                request.post('/vrm/api/dd/selectData/list', {
                                    data: form.selectData,
                                    funcModule: this.option.businessName,
                                    funcOperation: '查询'
                                }).then(res => {
                                    if (res.status) {
                                        const f = res.data.filter((v) => v.code === this.formData[form.prop])
                                        if (f && f.length) this.formData[form.prop] = f[0].name
                                    }
                                })
                            }
                        })
                    }
                })
                // 默认展开第一项
                this.showMap[this.infos[0]] = true
            }
        })

        this.infos.forEach((i) => {
            // 请求TAB列表数据
            if (this.information[i].api) {
                const params = {
                    data: {},
                    funcModule: this.option.businessName,
                    funcOperation: '查询'
                }
                if (this.information[i].params || this.information[i].query) {
                    if (this.information[i].params) {
                        params.data = Object.assign(
                            params.data,
                            this.information[i].params
                        )
                    }
                    if (this.information[i].query) {
                        if (typeof this.information[i].query === 'string') {
                            params.data = this.option[this.information[i].query]
                        } else if (typeof this.information[i].query === 'object') {
                            Object.keys(this.information[i].query).forEach((q) => {
                                params.data[q] = this.option[this.information[i].query[q]]
                            })
                        }
                    }
                } else {
                    delete params.data
                }
                request.post('/vrm/api' + this.information[i].api, params).then((res) => {
                    if (res.status) {
                        this.tablesData[i] = res.data

                        this.information[i].tableData.forEach((t) => {
                            if (t.selectData) {
                                request.post('/vrm/api/dd/selectData/list', {
                                    data: t.selectData,
                                    funcModule: this.option.businessName,
                                    funcOperation: '查询'
                                })
                                    .then((res) => {
                                        if (res.status) {
                                            this.tablesData[i].forEach((row) => {
                                                if (res.data.filter((f) => f.code === row[t.prop])[0]) {
                                                    row[t.prop] = res.data.filter((f) => f.code === row[t.prop])[0].name
                                                }
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                            }
                        })
                    }
                })
            }
        })
    },
    methods: {
        // 获取指定字典数据
        dictData(query) {
            return this.$store.state.dictData && this.$store.state.dictData[query]
        },
        // 切换tab
        tabClick(item) {
            this.activeTab = item.label
            if (this.activeTab === '附件') {
                request.post('/vrm/api/sys/file/list', {
                    data: {
                        billNo: this.option.uk || this.formData.ladingBillNo,
                        billType: this.option.billType
                    },
                    funcModule: this.option.businessName,
                    funcOperation: '查询'
                })
                    .then(response => {
                        if (response.status) {
                            this.attachList = response.data
                        }
                    })
            } else if (this.activeTab === '审核历史') {
                const url = this.option.opType === 'view' ? '/vrm/api/bpm/bpmApproveTrack/listAllBusinessTrackModuleUK' :
                    '/vrm/api/bpm/bpmApproveTrack/listAllBusinessTrack'
                const data = this.option.opType === 'view' ? this.option : this.option.id

                request.post(url, {
                    funcModule: this.option.businessName,
                    funcOperation: '查询',
                    data
                })
                    .then(response => {
                        if (response.status) {
                            this.auditHistory = response.data
                        }
                    })
            }
        },
        // 查看列表详情
        showTabDetail(row, data) {
            this.dialogVisible = true
            this.currentRow = row
            this.currentCols = data.tableData
            this.currentTitle = data.title
        },
        // 审批人修改
        employeeChange(e) {
            this.employeeIndex = e.target.value
        },
        // 下一级审批人修改
        nextUserChange(e, item) {
            item.accountIndex = e.target.value
            item.account = item.list[item.accountIndex].id
        },
        // 下载附件
        download(item) {
            request.post('/vrm/api/sys/file/download', {
                funcModule: this.option.businessName,
                funcOperation: '下载',
                data: item.attachmentNo
            })
                .then(response => {
                    if (response) {
                        const url = window.URL.createObjectURL(new Blob([response]))
                        const link = document.createElement('a')
                        link.style.display = 'none'
                        link.href = url
                        link.setAttribute('download', item.fileName)
                        document.body.appendChild(link)
                        link.click()
                        link.remove()
                    }
                })
        },
        // 预览附件
        preview(item) {
            request.post('/vrm/api/sys/file/preview', {
                funcModule: this.option.businessName,
                funcOperation: '预览',
                data: item.attachmentNo
            })
                .then(async response => {
                    if (response.status) {
                        this.$Router.push({
                            path: '/pages/pdf-view/index',
                            params: {
                                url: response.data
                            }
                        })
                    }
                })
        },
        // 取消
        doCancel() {
            this.$Router.replace('/pages/handle/index')
        },
        // 拒绝
        doRefuse() {
            this.formData.opinion = ''
            this.approvalVisible = true
            this.approvalStatus = 'refuse'
        },
        // 协助
        doAssist() {
            this.formData.assistMsg = ''
            this.approvalVisible = true
            this.approvalStatus = 'assist'
            request.post("/vrm/api/dd/selectData/list", {
                data: {
                    type: "FUNC_EMPLOYEE"
                },
                funcModule: this.option.businessName,
                funcOperation: '查询'
            })
                .then(response => {
                    this.employeeList = response.data
                })
        },
        // 通过
        doAgree() {
            this.formData.opinion = ''
            this.approvalVisible = true
            this.approvalStatus = 'agree'
        },
        // 确认拒绝
        onRefuseConfirm() {
            if (!this.formData.opinion.trim()) {
                uni.showToast({
                    title: '审核意见不能为空',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            this.approvalVisible = false

            if (this.option.assistId) {
                this.toCompleteAssistAudit(0) // 调用完成协助审核
            } else {
                this.tocompleteGeneralAudit(0) // 调用完成一般审核操作，拒绝时直接提交，不选人
            }
        },
        // 确认协助
        onAssistConfirm() {
            if (!this.formData.assistMsg.trim()) {
                uni.showToast({
                    title: '协助信息不能为空',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            request
                .post("/vrm/api/bpm/backlog/sendAssistAudit", {
                    funcModule: this.option.businessName,
                    funcOperation: '协助审核',
                    data: [{
                        taskId: this.option.id, // 任务ID
                        account: this.employeeList[this.employeeIndex].code, // 协助人账号
                        accountName: this.employeeList[this.employeeIndex].name, // 协助人名称
                        assistMsg: this.formData.assistMsg // 协助信息
                    }]
                })
                .then(response => {
                    this.approvalVisible = false
                    this.haveToDo(response, '发送协助审核成功')
                })
        },
        // 确认通过
        onAgreeConfirm() {
            if (!this.formData.opinion.trim()) {
                uni.showToast({
                    title: '审核意见不能为空',
                    icon: 'none',
                    duration: 2000
                })
                return
            }
            this.approvalVisible = false
            if (this.option.assistId) {
                this.toCompleteAssistAudit(1)
            } else {
                this.showNextUserTaskNodeInfoDialog()
            }
        },
        // 显示选择下一级用户任务信息对话框
        showNextUserTaskNodeInfoDialog() {
            request.post('/vrm/api/bpm/task/listNextUserTaskNodeInfo', {
                funcModule: this.option.businessName,
                funcOperation: '查询',
                data: {
                    taskId: this.option.id
                }
            })
                .then(async response => {
                    if (response.status) {
                        const data = response.data
                        if (Array.isArray(data) && data.some(i => i.takeMode === '1')) {
                            this.nextUserTaskVisible = true
                            this.nextUserList = []
                            data.forEach(i => {
                                if (i.takeMode === '1') {
                                    request.post("/vrm/api/bpm/user/listUser", {
                                        funcModule: this.option.businessName,
                                        funcOperation: '查询',
                                        data: {
                                            memberOfGroup: i.candidateGroup
                                        }
                                    })
                                        .then(res => {
                                            i.list = res.data
                                            i.accountIndex = 0
                                            i.account = i.list[0].id
                                            this.nextUserList.push(i)
                                        })
                                }
                            })

                        } else {
                            this.tocompleteGeneralAudit(1)
                        }
                    } else {
                        uni.showToast({
                            title: response.msgText,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })
        },
        // 下一级用户任务确认
        onNextUserTaskConfirm() {
            let selectFlg = true
            const completeGeneralAuditObj = {
                taskId: this.option.id, // 任务ID
                auditOption: this.formData.opinion, // 审核意见
                auditResult: 1, // 审核结果
                auditType: 0, // 审核类型  0 一般审核 1 协助审核
                bpmVariableParamList: [] // 下一环节审批人变量值
            }
            this.nextUserList.forEach(i => {
                var str = i.assigneeFormVar
                var strOne = str.split('#{')[1]
                var strTwo = strOne.match(/(\S*)}/)[1]
                const item = {
                    name: strTwo, // 变量名称
                    value: i.account // 变量值
                }
                if (!i.account) {
                    uni.showToast({
                        title: '请选择下一环节审批人',
                        icon: 'none',
                        duration: 2000,
                        success() {
                            selectFlg = false
                        }
                    })
                }
                completeGeneralAuditObj.bpmVariableParamList.push(item)
            })
            if (selectFlg) {
                request.post("/vrm/api/bpm/backlog/businessCompletionBacklog", {
                    funcModule: this.option.businessName,
                    funcOperation: '发送',
                    data: completeGeneralAuditObj
                })
                    .then(response => {
                        // 跳转至已办页面
                        this.haveToDo(response)
                    })
            }
        },
        // 完成一般审核操作
        tocompleteGeneralAudit(auditResultType) {
            request.post('/vrm/api/bpm/backlog/businessCompletionBacklog', {
                funcModule: this.option.businessName,
                funcOperation: '发送',
                data: {
                    taskId: this.option.id, // 任务ID
                    auditOption: this.formData.opinion, // 审核意见
                    auditResult: auditResultType, // 审核结果
                    auditType: 0 // 审核类型  0 一般审核 1 协助审核
                }
            })
                .then(response => {
                    // 跳转至已办页面
                    this.haveToDo(response)
                })
        },
        // 完成协助审核操作
        toCompleteAssistAudit(agreeFlgType) {
            request.post('/vrm/api/bpm/backlog/assistAuditCompletionBacklog', {
                funcModule: this.option.businessName,
                funcOperation: '协助审核',
                data: {
                    assistId: this.option.assistId, // 协助审核ID
                    auditOption: this.formData.opinion, // 协助意见
                    agreeFlg: agreeFlgType, // 是否同意
                    auditType: 1 // 审核类型  0 一般审核 1 协助审核
                }
            })
                .then(response => {
                    // 跳转至已办页面
                    this.haveToDo(response)
                })
        },
        // 成功跳转已办
        haveToDo(response, successText = '审核成功') {
            uni.showToast({
                title: response.status ? successText : response.msgText,
                icon: response.status ? "success" : "none",
                duration: 2000,
                success() {
                    if (response.status) {
                        this.$Router.replace('/pages/complete/index')
                    }
                }
            })
        }
    }
}
</script>

<style scoped lang='scss'>
.approval {
    background-color: #ededed;
}

.header {
    position: relative;
    width: 100%;
    height: 170upx;
    padding: 36upx 30upx 0;
    box-sizing: border-box;
    background-color: #2484cf;

    .title {
        color: #ffffff;
        font-size: 28upx;
        height: 50upx;
        line-height: 50upx;
        margin-left: 10upx;
        margin-right: 10upx;

        uni-view {
            width: 50%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .name {
            float: left;
        }

        .time {
            float: right;
            text-align: right;
        }
    }

    .card {
        width: 100%;
        height: 170upx;
        padding: 26upx 0;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 10upx;
        z-index: 99;

        .item {
            float: left;
            width: 33%;
            font-size: 24upx;
            color: #333333;
            margin-top: 2upx;

            uni-view {
                text-align: center;
                height: 59upx;
                line-height: 59upx;

                img {
                    height: 50upx;
                }
            }

            &:nth-of-type(2) {
                margin-top: -4upx;

                uni-view {
                    margin-bottom: 2upx;
                }
            }
        }

        .active {
            color: #2484cf;
        }
    }
}

.approval-list {
    width: 100%;
    height: calc(100vh - 422upx);
    padding: 50upx 30upx 30upx;
    background-color: #ededed;
    box-sizing: border-box;
    overflow-y: auto;

    .item {
        .title {
            position: relative;
            display: flex;
            justify-content: space-between;
            width: 100%;
            heigth: 80upx;
            line-height: 80upx;
            background-color: #ffffff;
            border-radius: 10upx;
            color: #333333;
            overflow: hidden;
            margin-bottom: 2upx;
            padding: 0 30upx;
            box-sizing: border-box;

            uni-text {
                font-size: 26upx;
            }

            .controll {
                color: #2484cf;
            }

            .border {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                content: "";
                width: 4upx;
                background: #26c9ae;
            }
        }

        .content {
            background-color: #ffffff;
            border-radius: 10upx;
            overflow: hidden;
            padding: 0 30upx;
            box-sizing: border-box;
            margin-bottom: 10upx;

            .line {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 90upx;
                line-height: 90upx;

                uni-text {
                    font-size: 26upx;
                }

                .label {
                    color: #999999;
                }

                .value {
                    color: #666666;
                }
            }
        }
    }

    .submit {
        width: 100%;
        padding: 30upx;
        margin-top: 10upx;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 10upx;

        .uni-form-item {
            margin-bottom: 40upx;

            &:last-of-type {
                margin-bottom: 0;
            }

            .title {
                color: #333333;
                font-size: 26upx;
                margin-bottom: 10upx;
            }

            .value,
            textarea {
                background-color: #f9f9f9;
                font-size: 26upx;
                padding: 10upx;
            }
        }
    }
}

.attachment-list {
    width: 100%;
    height: calc(100vh - 422upx);
    padding: 50upx 30upx 30upx;
    background-color: #ededed;
    box-sizing: border-box;
    overflow-y: auto;

    .item {
        background-color: #ffffff;
        padding: 20upx;
        border-radius: 10upx;

        .title {
            height: 48upx;
            line-height: 48upx;

            img {
                width: 28upx;
                vertical-align: top;
                margin: 10upx 10upx 0 0;
            }

            uni-text {
                width: 50%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-right: 10upx;
                color: #666666;
                font-size: 28upx;
            }

            .date {
                width: 40%;
                font-size: 24upx;
                text-align: right;
                color: #999999;
            }
        }

        .txt {
            height: 80upx;
            line-height: 80upx;
            color: #999999;

            uni-text {
                width: 70%;
                padding-left: 40upx;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .img {
                display: inline-block;
                width: 30%;
                vertical-align: top;
                text-align: right;

                img {
                    max-width: 50%;
                    width: 52upx;
                    vertical-align: top;
                    margin-right: 30upx;
                }

                .download {
                    margin-top: 14upx;
                }

                .preview {
                    margin-top: 24upx;
                }
            }
        }
    }
}

.history-list {
    display: flex;
    width: 100%;
    height: calc(100vh - 422upx);
    padding: 50upx 30upx 30upx;
    background-color: #ededed;
    box-sizing: border-box;
    overflow-y: auto;

    .audit_history_index {
        width: 80upx;
        margin: 34upx 16upx 0 0;

        .item {
            width: 100%;
            text-align: center;

            uni-text {
                display: inline-block;
                width: 46upx;
                height: 46upx;
                color: #2484cf;
                background-color: #ededed;
                border: 2upx solid #2484cf;
                border-radius: 50%;
                text-align: center;
                line-height: 46upx;
            }

            .underline {
                width: 0;
                height: 116upx;
                margin: 0 auto;
                border-left: 2upx dashed #2484cf;
            }
        }
    }

    .audit_history_content {
        flex: 1;

        .step_content {
            position: relative;
            width: 100%;
            padding: 20upx 20upx 20upx 10upx;
            margin-bottom: 20upx;
            background: #ffffff !important;
            border: 2upx solid #d1d1d1;
            border-radius: 10upx;
            box-sizing: border-box;

            .handle_info {
                line-height: 50upx;

                .person {
                    float: left;
                    margin-left: 40upx;
                    font-size: 30upx;
                    color: #666666;
                }

                .date {
                    float: right;
                    font-size: 24upx;
                    color: #999999;
                }

                &::after {
                    clear: both;
                    display: block;
                    content: "";
                }
            }

            .handle_result {
                line-height: 50upx;

                .result {
                    display: inline-block;
                    font-size: 26upx;
                    color: #999999;
                    margin-left: 10upx;
                }
            }

            &::before {
                position: absolute;
                display: inline-block;
                left: -14upx;
                top: 50%;
                margin-top: -20upx;
                content: "";
                width: 20upx;
                height: 20upx;
                background: #ffffff;
                border: 2upx solid #d1d1d1;
                border-top-color: transparent;
                border-right-color: transparent;
                transform: rotate(45deg);
            }
        }
    }
}

.view-list {
    height: calc(100vh - 318upx);
}

.bottom-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 106upx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #ededed;
    border-top: 2upx solid #d5d5d6;

    uni-button {
        width: 154upx;
        height: 70upx;
        line-height: 70upx;
        color: #ffffff;
        font-size: 32upx;
    }

    .cancel {
        background-color: rgb(152, 154, 162);
    }

    .refuse {
        background-color: rgb(240, 65, 65);
    }

    .assist {
        background-color: rgb(12, 209, 232);
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

.dialog {
    position: fixed;
    z-index: 999;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    box-sizing: border-box;

    .dialog-mask {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 999;
        background: rgba(0, 0, 0, 0.6);
    }

    .dialog-content {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 80%;
        max-height: 80vh;
        overflow-y: auto;
        transform: translate(-50%, -50%);
        background-color: #ffffff;
        border-radius: 3px;
        overflow: hidden;
        z-index: 999;

        & > .title {
            width: 100%;
            height: 88upx;
            line-height: 88upx;
            color: #ffffff;
            background-color: #2484cf;
            text-align: center;
            font-size: 32upx;

            .close {
                position: absolute;
                right: 20upx;
            }
        }

        .main {
            width: 100%;
            height: calc(80vh - 88upx);
            overflow-y: auto;
            padding: 20upx 40upx;
            box-sizing: border-box;

            .line {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 90upx;
                line-height: 90upx;

                uni-text {
                    width: 50%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 26upx;
                }

                .label {
                    text-align: left;
                    color: #999999;
                }

                .value {
                    text-align: right;
                    color: #666666;
                }
            }

            .uni-form-item {
                margin-bottom: 60upx;

                .title {
                    color: #333333;
                    font-size: 32upx;
                    margin-bottom: 10upx;
                }

                .value {
                    font-size: 26upx;

                    textarea {
                        width: 100%;
                        padding: 10upx 0;
                        font-size: 26upx;
                    }
                }
            }

            uni-button {
                font-size: 32upx;
            }
        }

        .approval-main {
            height: auto;
        }
    }
}
</style>
