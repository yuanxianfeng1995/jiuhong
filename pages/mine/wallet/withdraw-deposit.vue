<template>
	<view class="contain">
		<view class="form">
			<view class="title">
				<text>请输入提现金额（100的整数倍）</text>
			</view>
			<view class="input">
				<text>￥</text>
				<text class="line">|</text>
				<u-input v-model="form.money" name="money"></u-input>
			</view>
		</view>
		<view class="warn">
			<text>规则说明</text>
		</view>
		<view class="sumbit">
			<button class="btn" type="default" @click="submit">下一步</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount:0,
				integral:'',
				form:{
					money:'',
				}
			}
		},
		onLoad:function(option){
			console.log('可用余额',option.amount)
			this.amount = option.amount
		},
		methods: {
			submit:function(){
				console.log(this.form)
				let that = this
				//表单拦截
				if( that.form.money < 100 || that.form.money != parseInt(that.form.money) ){
					uni.showToast({
						title:'提现金额需是大于100的整数',
						icon:'none'
					})
					that.form.money = parseInt(that.form.money)
					return
				}
				if( !that.form.money || that.form.money  <= 0 ){
					uni.showToast({
						title:'请正确填写金额',
						icon:'none'
					})
					return
				}
				// if( parseFloat(that.form.money) > parseFloat(that.amount) ){
				// 	console.log(  that.form.money, that.amount )
				// 	uni.showToast({
				// 		title:'余额不足',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				if( !this.form.money ){
					this.$u.toast('请填写提现金额')
					return
				}
				uni.navigateTo({
					url:"withdraw-deposit-step?form=" + JSON.stringify(that.form)
				})
			}
		}
	}
</script>

<style>
.form{
	width: 680rpx;
	height: 294rpx;
	background: #ffffff;
	border-radius: 12rpx;
	margin: 30rpx auto;
	padding: 38rpx 34rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.title{
	font-size: 30rpx;
	color: #979797;
}
.input{
	display: flex;
	align-items: center;
}
.input text{
	font-size: 30rpx;
	color: #000000;
}
.input .line{
	font-size: 50rpx;
	color: #9c9c9c;
	font-weight: 300;
	padding-left: 16rpx;
	padding-right: 30rpx;
}
.sumbit{
	position: fixed;
	left: 35rpx;
	bottom: 20rpx;
}
.sumbit .btn{
	width: 680rpx;
	height: 120rpx;
	background: #532da3;
	border-radius: 20rpx;
	color: #FFFFFF;
	line-height: 120rpx;
}
.warn{
	color: #9c9c9c;
	font-size: 28rpx;
	text-align: center;
	padding-top: 40rpx;
}
.pay_name{
	width: 680rpx;
	background-color: #FFFFFF;
	margin: 0 auto;
}
.pay_item{
	height: 98rpx;
	padding: 0 34rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.pay_item input{
	color: #8f8f8f;
	font-size: 28rpx;
}
</style>
