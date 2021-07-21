<template>
	<view class="contain">
		<view class="content">
			<view class="header">
				<view class="title">
					<text>请输入收款账户</text>
				</view>
			</view>
			<view class="form">
				<view class="tel">
					<text>收款账户</text>
					<input class="input" v-model="account" type="number" placeholder="请输入收款账户"/>
				</view>
			</view>
		</view>
		<view class="bottom">
			<button class="btn" @click="register">完成</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: '',
			}
		},
		methods: {
			register() {

			},
		}
	}
</script>

<style>
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
		margin-bottom: 150rpx;
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
		padding-right: 33rpx;
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
		flex: 1;
		background-color: #f9f9f9;
		padding: 0 36rpx 120rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.bottom .btn {
		width: 680rpx;
		height: 120rpx;
		line-height: 120rpx;
		color: #FFFFFF;
		background: #532da3;
	}
</style>
