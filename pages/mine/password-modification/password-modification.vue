<template>
	<view class="contain">
		<view class="content">
			<view class="header">
				<view class="title">
					<text>请输入新密码</text>
				</view>
			</view>
			<view class="form">
				<view class="tel">
					<text>密码</text>
					<input class="input" v-model="password" maxlength="11" type="password" placeholder="请输入密码" />
				</view>
				<view class="tel">
					<text>确认密码</text>
					<input class="input" v-model="password1" maxlength="11" type="password" placeholder="请输入密码" />
				</view>
			</view>
		</view>
		<view class="bottom">
			<!-- <button class="btn" @click="prev">上一步</button> -->
			<button class="btn" @click="register">完成</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				password: '',
				password1: '',
				code: '',
				mobile: '',
				delta: 1
			}
		},
		onLoad(option) {
			this.code = option.code
			this.mobile = option.mobile
			this.delta=option.delta
		},
		methods: {
			register() {
				const that = this;
				if (that.password.length < 6) {
					wx.showToast({
						title: '密码输入最少六位',
						icon: 'none'
					})
					return
				}
				if (that.password !== that.password1) {
					wx.showToast({
						title: '密码输入不一致',
						icon: 'none'
					})
					return
				}
				const userInfo = uni.getStorageSync('userInfo') || {};
				let params = {
					"password": that.password,
				}
				userInfo.id?params.userId=userInfo.id:null
				if (that.code) {
					params = {
						...params,
						code: that.code,
						mobile: that.mobile,
					}
				}

				that.$u.api.modifyPwd(params).then((res) => {
					if (res.code == 0) {
						uni.showToast({
							title: '密码修改成功'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: that.delta||2
							})
						}, 1000)
					} else {
						that.$u.toast(res.msg);
					}
				})

			},
		}
	}
</script>

<style scoped>
	.contain {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: space-between;
		height: 100vh;
	}

	.title {
		font-size: 50rpx;
		font-weight: 400;
		text-align: center;
		color: #532da3;
		padding-top: 260rpx;
		margin-bottom: 80rpx;
	}

	.sub_title {
		opacity: 0.8;
		font-size: 30rpx;
		font-weight: 400;
		text-align: center;
		color: rgba(28, 25, 57, 0.80);
		line-height: 50rpx;
		padding: 66rpx 36rpx 126rpx;
	}

	.tel {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 90rpx 24rpx;
	}

	.tel text {
		border-right: 2rpx solid #8A959A;
		width: 74px;
		text-align: right;
		padding-right: 10px;
		color: #000;
		font-weight: bold;
	}

	.tel .input {
		flex: 1;
		padding-left: 33rpx;
		color: #000;
		font-weight: bold;
	}

	.bottom {
		background-color: #f9f9f9;
		padding: 0 36rpx 120rpx;
		display: flex;
		justify-content: flex-end;
	}

	.bottom .btn{
		width: 680rpx;
		height: 120rpx;
		background: #532da3;
		border-radius: 20rpx;
		padding: 0;
		color: #FFFFFF;
		line-height: 120rpx;
	}
</style>
