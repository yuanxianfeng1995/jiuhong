<template>
	<view class="contain">
		<view class="header">
			<view class="warn_message" v-if="accountList.length===0">
				<text>您当前没有添加收款账户，请完善收款账户后再下单</text>
			</view>
		</view>
		<view class="account">
			<view class="none" v-if="!chooseaccount" @click="routeAccount">
				<image src="/static/icon/add@2x.png"></image>
				<text>手动添加收款账户</text>
				<u-icon name="arrow-right" size="24"></u-icon>
			</view>
			<view class="account_detail" v-else @click="routeAccount">
				<view class="detail_text">
						<u-icon name="/static/icon/yh.png" size="40"></u-icon>
					<view class="item_detail">
						<text>姓名:{{chooseaccount.name}}</text>
						<text>账户类型:{{chooseaccount.accounttypeName}}</text>
						<text>提现账号:{{chooseaccount.accountnumber}}</text>
					</view>
				</view>
				<u-icon name="arrow-right" size="30"></u-icon>
			</view>
		</view>
		<view class="form">
			<view class="title">
				<text>请输入提现金额（100的整数倍）</text>
			</view>
			<view class="input">
				<text>￥</text>
				<text class="line">|</text>
				<u-input v-model="form.money" name="money" type="number"></u-input>
			</view>
		</view>
		<view class="warn">
			<text>规则说明</text>
		</view>
		<view class="sumbit">
			<u-button class="btn" type="default" @click="submit">下一步</u-button>
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
					money:null,
					walletid: null
				},
				isOnLoad: null,
				isOnShow: null,
				chooseaccount: null,
				accountList: [],
				dictionaries: {1:'支付宝',2:'微信',3:'银行卡'},
			}
		},
		onLoad:function(option){
			console.log('可用余额',option.amount)
			this.isOnLoad=true
			this.amount = option.amount
		},
		onShow(){
			this.isOnShow=true
			this.getAccountList()
		},
		methods: {
			routeAccount: function() {
				let that = this
				uni.navigateTo({
					url: '/pages/mine/account-maintenance/account-maintenance?type=choose',
					events: {
						chooseAccount: function(data) {
							console.log('chooseAccount',data)
							that.chooseaccount = data.data||{}
							that.form.walletid=that.chooseaccount.id
							console.log('that.chooseaccount',that.chooseaccount,!that.chooseaccount)
						},
					},
				})
			},
			getAccountList: function() {
				let that = this
				this.$u.api.getAccountList().then(res => {
					console.log(res);
					if (res.code == 0) {
						if(that.isOnLoad||(this.isOnShow&&!that.chooseaccount)){
							that.accountList = res.data?res.data.map(item=>{
								return {
									...item,
									accounttypeName: that.dictionaries[item.accounttype]
								}
							}):[]
							that.chooseaccount = that.accountList[0]
							that.form.walletid=that.chooseaccount.id
						  that.isOnLoad=false
						}
					}
				})
			},
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
				if( !that.form.money || that.form.money  <= 0 || that.form.money > that.amount ){
					uni.showToast({
						title:'请正确填写金额',
						icon:'none'
					})
					return
				}
				if( !that.form.money ){
					that.$u.toast('请填写提现金额')
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
.account .none{
	display: flex;
	padding: 40rpx;
	align-items: center;
}
.account .none image {
		width: 40rpx;
		height: 40rpx;
	}

	.account .none text {
		flex: 1;
		padding-left: 32rpx;
		font-size: 24rpx;
		color: #090a0f;
		font-weight: 600;
	}

	.account_detail {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 680rpx;
		margin: 30rpx auto;
		padding: 38rpx 34rpx;
		background-color: #FFFFFF;
	}

	.account_detail .detail_text {
		font-size: 28rpx;
		color: #606060;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
	}

	.account_detail .detail_text text {
		padding: 15rpx 0;
	}

</style>
