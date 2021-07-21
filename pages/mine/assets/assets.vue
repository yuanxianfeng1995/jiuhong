<template>
	<view class="assets-content">
		<view class="assets-list">
			<view v-for="(item,index) in list" :key="item.id" class="assets-list-item" @click="goPage(item)">
				<view class="list-header">
					<view class="text">
						<image class="data_icon" :src="item.src"></image>
						<text class="name">{{item.lable}}</text>
					</view>
					<view class="icon iconfont  icon-jiantou"></view>
				</view>
				<view class="content">
					<view class="content-item">
						<view class="label">可用</view>
						<text class="value">{{item.value}}</text>
					</view>
					<view class="content-item">
						<view class="label">冻结</view>
						<text class="value">{{item.value}}</text>
					</view>
					<view class="content-item">
						<view class="label">累计</view>
						<text class="value">{{item.value}}</text>
					</view>
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
						id: 1,
						lable: '拼团积分',
						src: '/static/icon/mine-data-icon1@2x.png',
						url:"../integral/integral",
						value: 0
					},
					{
						id: 2,
						lable: '开团卷',
						src: '/static/icon/mine-data-icon2@2x.png',
						url:"../coupon/coupon",
						value: 0
					},
					{
						id: 3,
						lable: '玖花',
						src: '/static/icon/mine-data-icon3@2x.png',
						url:"../integral/integral",
						value: 0
					},
					{
						id: 4,
						lable: '分红',
						src: '/static/icon/mine-data-icon3@2x.png',
						url:"../participation/participation",
						value: 0
					},
				]
			}
		},
		onLoad: function(option) {
			let that = this
			//用户信息
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('detail', function(data) {
				console.log('获取详情数据222', data)
				that.detail = data.data
				that.list[0].value=data.data.accountAvailableIntegral
				that.list[1].value=data.data.accountAvailableCoupon
				that.list[2].value=data.data.accountIntegral
				that.list[3].value=data.data.accountIntegral
			})
		},
		methods:{
			goPage(item){
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
				.data_icon{
					width: 80rpx;
					height: 80rpx;
					margin-right: 20rpx;
				}
			}
		}
	}
	
</style>
