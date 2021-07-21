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
					<input class="input" v-model="password" maxlength="11" type="password" placeholder="请输入密码"/>
				</view>
				<view class="tel">
					<text>确认密码</text>
					<input class="input" v-model="password1" maxlength="11" type="password" placeholder="请输入密码"/>
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
			}
		},
		onLoad(option) {},
		methods: {
			register() {
				if (this.password.length<6) {
					wx.showToast({
						title: '密码输入最少六位',
						icon: 'none'
					})
					return
				}
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

	.bottom .btn {
		width: 40%;
		height: 60rpx;
		line-height: 60rpx;
		color: #FFFFFF;
		background: #532da3;
	}
</style>
