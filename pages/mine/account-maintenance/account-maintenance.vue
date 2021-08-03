<template>
	<view class="contain">
		<view class="content">
			<u-radio-group v-model="radioValue" size="40">
				<view class="item" v-for="(item,index) in accountList" :key="index">
					<view class="line_1" @click="chooseAddress(item)">
						<u-icon name="/static/icon/yh.png" size="40"></u-icon>
						<view class="item_detail">
							<text>姓名:{{item.name}}</text>
							<text>账户类型:{{item.accounttypeName}}</text>
							<!-- <text>开户行:{{item.bankdeposit}}</text> -->
							<text>提现账号:{{item.accountnumber}}</text>
						</view>
						<u-icon name="/static/icon/sure@2x.png" size="40" v-if="false"></u-icon>
					</view>
					<view class="line_2">
						<view></view>
						<view class="btn">
							<text @click="edit(item)">修改</text>
							<!-- <text @click="deleteAddress(item)">删除</text> -->
						</view>
					</view>
				</view>
			</u-radio-group>
			<view class="no_content" v-if="accountList.length == 0">
				<image src="../../../static/no-content/content-none.png"></image>
				<view class="text_none">
					<text>还没有收款账户哦，赶快去添加吧...</text>
				</view>
			</view>
		</view>
		<view class="footer">
			<button class="btn" type="default" @click="add()">新增账户</button>
		</view>
		<u-popup v-model="formShow" mode="center" border-radius="12" width="632" :closeable="true">
			<view class="form_content">
				<view class="title">
					<text>{{formTitle}}收款账户</text>
				</view>
				<view class="form">
					<u-form :model="form" ref="uForm" label-width="130">
						<u-form-item label="姓名">
							<u-input v-model="form.name" />
						</u-form-item>
						<u-form-item label="账户类型">
							<view class="right" @click="regionShow = true">
								<text>{{form.accounttypeName ? form.accounttypeName : '请选择'}}</text>
								<u-icon name="arrow-right" size="26"></u-icon>
							</view>
						</u-form-item>
						<!-- <u-form-item label="开户行">
							<u-input v-model="form.bankdeposit" />
						</u-form-item> -->
						<u-form-item label="提现账号">
							<u-input v-model="form.accountnumber" />
						</u-form-item>
						<button class="form_btn" @click="submit">保存</button>
					</u-form>
				</view>
			</view>
		</u-popup>
		<u-select v-model="regionShow" mode="single-column" :list="list" placeholder="账户类型" @confirm="regionChange">
		</u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				radioValue: '',
				formShow: false,
				form: {
					accountnumber: null,
					accounttype: 1,
					bankdeposit: null,
					accounttypeName: null,
					consignee: null,
					name: null
				},
				list: [{
						value: 1,
						label: '支付宝'
					},
					{
						value: 2,
						label: '微信'
					},
					{
						value: 3,
						label: '银行卡'
					}
				],
				dictionaries: {1:'支付宝',2:'微信',3:'银行卡'},
				regionShow: false,
				accountList: [],
				//是否是选择
				chooseRadio: false,
				formTitle: '添加',

			}
		},
		onLoad: function(option) {
			if (option && option.type) {
				this.chooseRadio = true
			}
			this.getAccountList()
		},
		//监听返回按钮
		onBackPress: function() {
			//如用户删掉所有地址，返回清空上一页选择
			if (this.accountList.length == 0) {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('chooseAccount', {
					data: {}
				});
			}
		},
		methods: {
			//列表
			getAccountList: function() {
				let that = this
				this.$u.api.getAccountList().then(res => {
					console.log(res);
					if (res.code == 0) {
						that.accountList = res.data.map(item=>{
							return {
								...item,
								accounttypeName: that.dictionaries[item.accounttype]
							}
						})
					}
				})
			},
			//新增
			add: function() {
				this.formTitle = '添加'
				this.form = {
					accountnumber: null,
					accounttype: 1,
					bankdeposit: null,
					accounttypeName: '支付宝',
					consignee: null,
					name: null
				}
				this.formShow = true
			},
			//删除
			deleteAddress: function(value) {
				let that = this
				this.$u.api.delete_ptAddress({
					addressId: value.id
				}).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '删除成功'
						})
						that.getAccountList()
					}
				})
			},
			//修改
			edit: function(value) {
				console.log(value)
				this.formTitle = '编辑'
				this.form = value
				this.formShow = true
			},
			//表单提交
			submit: function(type) {
				console.log('form数据', this.form)
				let formData = this.form
				//表单验证
				if (!formData.name) {
					uni.showToast({
						title: '请填写姓名',
						icon: 'none'
					})
					return
				}
				// if (!formData.bankdeposit) {
				// 	uni.showToast({
				// 		title: '请填写开户行',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				if (!formData.accountnumber) {
					uni.showToast({
						title: '请填写提现账号',
						icon: 'none'
					})
					return
				}
				let that = this
				let userInfo = getApp().globalData.userInfo || localStorage.getItem('userInfo')
				console.log('userInfo', userInfo)
				const form = {
					...that.form,
					userId: userInfo.id,
					userNo: userInfo.userNo,
				}
				if (this.formTitle == '编辑') {
					this.$u.api.updateCollectAccount(form).then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: '修改成功'
							})
							that.formShow = false
							that.getAccountList()
						} else {
							uni.showToast({
								title: '修改失败，请稍后重试',
								icon: 'none'
							})
						}
					})
				} else {
					this.addAddress(form)
				}
			},
			//接口 - 新增
			addAddress: function(form) {
				let that = this
				let userInfo = getApp().globalData.userInfo || localStorage.getItem('userInfo')
				console.log('userInfo', userInfo)
				that.$u.api.saveCollectAccount(form).then((res) => {
					if (res.code === 0) {
						that.getAccountList()
						uni.showToast({
							title: '操作成功'
						})
						that.formShow = false
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			regionChange: function(e) {
				this.form.accounttype = e[0].value
				this.form.accounttypeName = e[0].label
			},
			//事件 - 选择地址
			chooseAddress:function(item){
				 console.log(item)
				 if( this.chooseRadio ){
					 const eventChannel = this.getOpenerEventChannel()
					 eventChannel.emit('chooseAccount', {data: item});
					 uni.navigateBack({
					 	delta:1
					 })
				 }
			},
		}
	}
</script>

<style>
	.content {
		padding-bottom: 160rpx;
	}

	.item {
		padding: 14rpx 24rpx;
		background-color: #FFFFFF;
		margin-top: 20rpx;
		width: 750rpx;
	}

	.line_1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.item_detail {
		flex: 1;
		font-size: 28rpx;
		color: #000000;
		padding: 0 32rpx;
		display: flex;
		flex-direction: column;
	}

	.item_detail text {
		padding: 15rpx 0;
	}

	.line_2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 54rpx;
		padding-bottom: 14rpx;
	}

	.line_2 .btn text {
		margin: 0 22rpx;
	}

	.footer {
		position: fixed;
		bottom: 30rpx;
		left: 0;
		width: 100%;
		text-align: center;
	}

	.footer .btn {
		width: 578rpx;
		height: 100rpx;
		background: #532da3;
		border-radius: 12rpx;
		box-shadow: -2rpx 0px 2rpx 0px rgba(0, 0, 0, 0.10);
		color: #FFFFFF;
	}

	.form_content .title {
		font-size: 32rpx;
		color: #000000;
		padding: 32rpx;
		text-align: center;
		border-bottom: 2rpx solid #f9f9f9;
	}

	.form_content .right {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #747272;
		font-size: 32rpx;
	}

	.form_content .form {
		padding: 0 32rpx 32rpx;
	}

	.form_btn {
		width: 578rpx;
		height: 100rpx;
		background: #532da3;
		border-radius: 12rpx;
		color: #FFFFFF;
		padding: 0;
		margin-top: 50rpx;
	}
</style>
