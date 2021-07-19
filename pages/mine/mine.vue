<template>
	<view class="contain">
		<view class="header">
			<!-- <view class="status_bar"></view> -->
			<view class="mine_bg">
				<view class="mine_bg_view"></view>
				<image class="mine_bg_img" :src="user.headPortrait" mode="aspectFill"></image>
			</view>
			<view class="mine_detail">
				 <view class="status_bar">
					<!-- 这里是状态栏 -->
				</view>
				<image class="author" :src="user.headPortrait" mode="aspectFill"></image>
				<view class="detail_text">
					<text>{{userInfo.nickname}} {{user.levelName}}</text>
					<text>ID: {{user.id}}</text>
					<!-- <text>{{userInfo.level ? userInfo.level.levelName : '普通用户'}}</text> -->
				</view>
				<view class="mine_balance">
					<view class="balance_price" @click="routeWallet">
						<text class="num">￥{{user.accountAmount}}</text>
						<text>钱包可用余额{{user.accountAvailableAmount}}</text>
					</view>
					<view class="balance_btn">
						<button class="btn" type="default" size="mini" @click="routeChargeMoney">充值</button>
						<button class="btn" type="default" size="mini" @click="routewithdraw">提现</button>
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="order_status">
				<u-grid :col="4" :border="false">
					<u-grid-item @click="routeOrder(1)">
						<u-icon name="/static/icon/mine-order-icon1@2x.png" :size="46"></u-icon>
						<view class="order_status_text">待发货</view>
					</u-grid-item>
					<u-grid-item @click="routeOrder(2)">
							<u-icon name="/static/icon/mine-order-icon2@2x.png" :size="46"></u-icon>
						<view class="order_status_text">已发货</view>
					</u-grid-item>
					<u-grid-item @click="routeOrder(3)">
						<u-icon name="/static/icon/mine-order-icon3@2x.png" :size="46"></u-icon>
						<view class="order_status_text">已签收</view>
					</u-grid-item>
					<u-grid-item @click="routeOrder(4)">
						<u-icon name="/static/icon/mine-order-icon4@2x.png" :size="46"></u-icon>
						<view class="order_status_text">全部</view>
					</u-grid-item>
				</u-grid>
			</view>
			<view class="menu_list">
				<view class="menu_list_block">
					<u-cell-group>
						<u-cell-item title="我的资产" :title-style="menuListTitleStyle" :value="userInfo.fansCount" :border-bottom="false" @click="myAssets">
							<u-icon name="/static/icon/mine-menu1@2x.png" slot="icon" size="40" ></u-icon>
						</u-cell-item>
						<u-cell-item title="我的粉丝" :title-style="menuListTitleStyle" :value="userInfo.fansCount" :border-bottom="false" @click="routeTeam">
							<u-icon name="/static/icon/mine-menu1@2x.png" slot="icon" size="40" ></u-icon>
						</u-cell-item>
						<u-cell-item title="邀请朋友" :title-style="menuListTitleStyle" :border-bottom="false" @click="routeQr">
							<u-icon name="/static/icon/mine-menu2@2x.png" slot="icon" size="40" ></u-icon>
							<u-icon name="/static/icon/qr-icon.png" slot="right-icon" size="40" ></u-icon>
						</u-cell-item>
					</u-cell-group>
				</view>
				<view class="menu_list_block">
					<u-cell-group>
						<u-cell-item title="收货地址" :title-style="menuListTitleStyle" :border-bottom="false" @click="routeAddress">
							<u-icon name="/static/icon/mine-menu3@2x.png" slot="icon" size="40" ></u-icon>
						</u-cell-item>
						<u-cell-item title="关于我们" :title-style="menuListTitleStyle" :border-bottom="false" @click="routeAbout">
							<u-icon name="/static/icon/mine-menu4@2x.png" slot="icon" size="40" ></u-icon>
						</u-cell-item>
						<u-cell-item title="平台客服" :title-style="menuListTitleStyle" :border-bottom="false" @click="routeContact">
							<u-icon name="/static/icon/mine-menu5@2x.png" slot="icon" size="40" ></u-icon>
						</u-cell-item>
					</u-cell-group>
				</view>
				<view class="menu_list_block">
					<u-cell-group>
						<u-cell-item title="设置" :title-style="menuListTitleStyle" :border-bottom="false" @click="routeSetting">
							<u-icon name="/static/icon/mine-menu6@2x.png" slot="icon" size="40" ></u-icon>
						</u-cell-item>
					</u-cell-group>
				</view>
			</view>
		</view>
		<u-tabbar v-model="current" :list="list" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//菜单
				list: [
					{
						iconPath: "/static/tabbar/i_home@2x.png",
						selectedIconPath: "/static/tabbar/i_home_fill@2x.png",
						customIcon: false,
						"pagePath":"/pages/index/index",
					},
					{
						iconPath: "/static/tabbar/Search@2x.png",
						selectedIconPath: "/static/tabbar/Search_fill@2x.png",
						customIcon: false,
						"pagePath":"/pages/find/find",
					},
					{
						iconPath: "/static/tabbar/button_float_tap@2x.png",
						selectedIconPath: "/static/tabbar/button_float_tap@2x.png",
						midButton: true,
						customIcon: false,
						"pagePath":"/pages/group-buy/group-buy",
					},
					{
						iconPath: "/static/tabbar/i_Chat@2x.png",
						selectedIconPath: "/static/tabbar/i_Chat_fill@2x.png",
						customIcon: false,
						"pagePath":"/pages/message/message",
					},
					{
						iconPath: "/static/tabbar/Bag@2x.png",
						selectedIconPath: "/static/tabbar/Bag_fill@2x.png",
						customIcon: false,
						"pagePath":"/pages/mine/mine",
					},
				],
				current: 4,
				//菜单标题样式
				menuListTitleStyle:{
					color:'#000000',
					fontWeight:'600',
					paddingLeft:'20rpx'
				},
				user: {},
				userInfo:{},
			}
		},
		onLoad() {
			const data=getApp().globalData.userInfo||{};
			this.userInfo = data.id?getApp().globalData.userInfo.id:uni.getStorageSync('userInfo');
			console.log('this.userInfo',this.userInfo)
		},
		onShow:function(){
			 this.get_userCenter()
		},
		onPullDownRefresh() {
			this.get_userCenter()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			//我的信息
			get_userCenter:function(){
				 let that = this
				 this.$u.api.get_userCenter().then(res => {
					if( res.code == 0 ){
						console.log('用户',res)
						that.user= res.data
						uni.setStorageSync('user', res.data);
					}
				 })
			},
			//路由 - 余额
			routeWallet:function(){
				uni.navigateTo({
					url:'wallet/wallet'
				})
			},
			//路由 - 充值
			routeChargeMoney:function(){
				uni.navigateTo({
					url:'wallet/charge-money'
				})
			},
			//路由 - 提现
			routewithdraw:function(){
				uni.navigateTo({
					url:"wallet/withdraw-deposit?amount=" + this.userInfo.account.accountAvailableAmount
				})
			},
			//路由 - 提现
			routeCoupon:function(){
				uni.navigateTo({
					url:"coupon/coupon"
				})
			},
			//我的资产
			myAssets:function(){
				uni.navigateTo({
					url:"assets/assets"
				})
			},
			//路由 - 拼团积分
			routeIntegral:function(){
				uni.navigateTo({
					url:"integral/integral"
				})
			},
			//路由 - 分红
			routeParticipation:function(){
				uni.navigateTo({
					url:"participation/participation"
				})
			},
			//路由 - 我的粉丝
			routeTeam:function(){
				uni.navigateTo({
					url:"team/team"
				})
			},
			//路由 - 我的二维码
			routeQr:function(){
				uni.navigateTo({
					url:"qr-code/qr-code"
				})
			},
			//路由 - 我的收货地址
			routeAddress:function(){
				uni.navigateTo({
					url:"/pages/mine/address/address"
				})
			},
			//路由 - 关于我们
			routeAbout:function(){
				uni.navigateTo({
					url:"/pages/text/introduction"
				})
			},
			//路由 - 平台客服
			routeContact:function(){
				uni.navigateTo({
					url:"/pages/text/contact"
				})
			},
			//路由 - 设置
			routeSetting:function(){
				uni.navigateTo({
					url:"setting/setting"
				})
			},
			//路由 - 订单
			routeOrder:function(){
				uni.navigateTo({
					url:"order/order"
				})
			}
		}
	}
</script>

<style>
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
.contain{
	background: #f8f7f7;
	min-height: 100vh;
}
.header{
	width: 100%;
	height: 800rpx;
	position: relative;
}
.mine_bg{
	position: relative;
	z-index: 0;
	width: 100%;
	height: 800rpx;
	/* filter: blur(26rpx); */
}
.mine_bg_view{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
	background-color: rgba(0,0,0,0.4);
	border-radius: 0px 0px 60rpx 60rpx;
}
.mine_bg image{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 800rpx;
	filter: blur(6rpx);
	border-radius: 0px 0px 60rpx 60rpx;
}
.mine_detail{
	display: flex;
	flex-direction: column;
	align-items: center;
	position: absolute;
	bottom: 152rpx;
	left: 0;
	z-index: 9;
	width: 100%;
	padding: 60rpx 38rpx 38rpx;
}
.mine_detail .author{
	width: 136rpx;
	height: 136rpx;
	border: 4rpx solid #ffffff;
	border-radius: 50%;
	box-shadow: 0px 8rpx 40rpx 0px rgba(0,0,0,0.10), 0px 4rpx 148rpx 80rpx rgba(0,0,0,0.20); 
}
.detail_text{
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 28rpx;
	color: #ffffff;
	padding-top: 50rpx;
	line-height: 1.5;
}
.mine_balance{
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 38rpx;
	padding-left: 10rpx;
}
.balance_price .num{
	font-size: 70rpx;
	color: #ffffff;
	padding-bottom: 30rpx;
	margin-left: -16rpx;
}
.balance_price{
	font-size: 24rpx;
	color: rgba(249,249,249,0.80);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-between;
}
.balance_btn .btn{
	width: 96rpx;
	height: 68rpx;
	line-height: 68rpx;
	opacity: 1;
	background: #532da3;
	border: 2rpx solid #ffffff;
	border-radius: 14rpx;
	color: #FFFFFF;
	margin-left: 16rpx;
	padding: 0;
}
.mine_data{
	width: 678rpx;
	height: 204rpx;
	opacity: 1;
	background: #532da3;
	border: 2rpx solid #6d2ef3;
	border-radius: 42rpx;
	box-shadow: 0px 4rpx 4rpx 2rpx rgba(44,44,44,0.20); 
	margin: -160rpx auto 0;
	position: relative;
	z-index: 19;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
}
.mine_data_item{
	display: flex;
	flex-direction: column;
	align-items: center;
	color: rgba(255,255,255,0.80);
	font-size: 24rpx;
	padding: 0 20rpx;
}
.mine_data_item .data_num{
	font-size: 36rpx;
	font-weight: 700;
	color: #f3d66c;
	padding: 10rpx 0;
}
.data_icon{
	width: 60rpx;
	height: 60rpx;
}
.order_status{
	margin: -80px 0 30rpx 0;
	padding: 0 30rpx;
	background-color: #FFFFFF;
}
.order_status_text{
	padding-top: 18rpx;
	color: #595959;
}
.status_icon{
	position: relative;
}
.menu_list{
	padding-bottom: 80rpx;
}
.menu_list_block{
	margin-top: 20rpx;
}
</style>
