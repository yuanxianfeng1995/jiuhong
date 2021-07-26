<template>
	<view class="assets-content">
		<view class="assets-list">
			<view v-for="(item,index) in list" :key="item.id" class="assets-list-item" @click="goPage(item)">
				<view class="list-header">
					<view class="text">
						<image class="data_icon" :class="{'is-icfont': item.isIconfont}" :src="item.src" ></image>
						<text class="name">{{item.lable}}</text>
					</view>
					<view  v-if="!item.isFrozen" class="icon iconfont  icon-jiantou"></view>
				</view>
				<view class="content">
					<view class="content-item">
						<view class="label">可用</view>
						<text class="value">{{item.available}}</text>
					</view>
					<view class="content-item" v-if="!item.isFrozen">
						<view class="label">冻结</view>
						<text class="value">{{item.frozen}}</text>
					</view>
					<view class="content-item">
						<view class="label">累计</view>
						<text class="value">{{item.cumulative}}</text>
					</view>
					<view v-if="item.isFrozen"></view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				menuListTitleStyle:{
					color:'#000000',
					fontWeight:'600',
					paddingLeft:'20rpx'
				},
				list: [
					{
						id: 0,
						lable: '余额',
						isIconfont: true,
						src: '/static/icon/mine-icon1@2x.png',
						url:"../wallet/wallet",
						available: 0,
						frozen: 0,
						cumulative: 0
					},
					{
						id: 1,
						lable: '拼团积分',
						isIconfont: true,
						src: '/static/icon/mine-icon2@2x.png',
						url:"../integral/integral",
						available: 0,
						frozen: 0,
						cumulative: 0
					},
					{
						id: 2,
						lable: '拼团券',
						isIconfont: true,
						src: '/static/icon/mine-icon3@2x.png',
						url:"../coupon/coupon",
						available: 0,
						frozen: 0,
						cumulative: 0
					},
					{
						id: 3,
						lable: '分红',
						src: '/static/icon/mine-icon4@2x.png',
						url:"../participation/participation",
						available: 0,
						frozen: 0,
						cumulative: 0
					},
					{
						id: 4,
						lable: '玖花',
						isIconfont: true,
						src: '/static/icon/mine-icon5@2x.png',
						url:"../nine-flowers/nine-flowers",
						available: 0,
						frozen: 0,
						cumulative: 0
					},
					{
						id: 5,
						lable: '购物券',
						isIconfont: true,
						src: '/static/icon/mine-icon6@2x.png',
						url:"../nine-flowers/nine-flowers",
						available: 0,
						isFrozen: true,
						frozen: 0,
						cumulative: 0
					},
				]
			}
		},
		onLoad: function(option) {
			let that = this
			//用户信息
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('detail', function(data) {
				console.log('获取详情数据222', data.data)
				const userInfo=uni.getStorageSync('userInfo')
				try{
					const obj=data.data
					let list = JSON.parse(JSON.stringify(that.list)) 
					list[0]={
						...list[0],
						available: obj.accountAvailableAmount,
						frozen: obj.accountFreezeAmount,
						cumulative: obj.accountAmount
					}
					list[1]={
						...list[1],
						available: obj.accountAvailableIntegral,
						frozen: obj.accountFreezeIntegral,
						cumulative: obj.accountIntegral
					}
					list[2]={
						...list[2],
						available: obj.accountAvailableCoupon,
						frozen: obj.accountFreezeCoupon,
						cumulative: obj.accountCoupon
					}
					list[3]={
						...list[3],
						available: obj.accountAvailableShareBonus,
						frozen: obj.accountFreezeShareBonus,
						cumulative: obj.accountTotalShareBonus
					}
					list[4]={
						...list[4],
						available: obj.accountAvailableShareBonus,
						frozen: obj.accountFreezeShareBonus,
						cumulative: obj.accountTotalShareBonus
					}
					list[5]={
						...list[5],
						available: obj.accountShopvoucher,
						cumulative: obj.accountTotalShareBonus
					}
					console.log('userInfo.isDirector==1',userInfo.isDirector==1)
					userInfo.isDirector==1?list.splice(4,1):list.splice(5,1)
					that.list=list
				}catch(e){
					console.log('catch',e)
				}
			})
		},
		methods:{
			goPage(item){
				if(item.isFrozen) return;
				uni.navigateTo({
					url: item.url
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.assets-content{
		height: 100vh;
		.header {
			background-image: linear-gradient(#0396ff, #ffffff);
			//background-color: #0396ff;
			height: 300upx;
			color: #FFFFFF;
			text-align: center;
			font-size: 40rpx;
			padding-top: 30rpx;
			/*  #ifdef  APP-PLUS  */
			margin-top: var(--status-bar-height);
			/*  #endif  */
		}
		.assets-list{
			// position: relative;
			// top: -230rpx;
			margin-top: 20rpx;
			.assets-list-item{
				margin: 0 2%;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				padding: 20rpx;
				font-size: 30rpx;
				background: #532da3;
				border: 1px solid #6d2ef3;
				color: #ffffff;
				.list-header{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 20rpx;
					font-size: 30rpx;
					.name{
						font-size: 35rpx;
					}
					.text{
						display: flex;
						align-items: center;
					}
				}
				.content{
					padding-left: 20rpx;
					color: #f3d66c;
					display: flex;
					font-size: 35rpx;
					justify-content: space-between;
					padding: 0 40rpx;
					.label{
						color: #FFFFFF;
						font-size: 30rpx;
						margin-bottom: 10rpx;
					}
				}
				.content-item{
					text-align: center;
				}
				.data_icon{
					width: 80rpx;
					height: 80rpx;
					margin-right: 20rpx;
				}
				.is-icfont{
					width: 60rpx;
					height: 60rpx;
					margin-right: 20rpx;
				}
			}
		}
	}
	
</style>
