<template>
	<view class="contain">
		<zy-update theme="green" ref="zyupgrade" :h5preview="true" oldversion="1.0.2" :appstoreflag="false"
			:updateurl="update_url"></zy-update>
		<!-- 更新组件 force 是否强制更新 有bug -->
		<app-update ref="app_update" :force="true"></app-update>
		<view class="nav">
			<view style="height: var(--status-bar-height);width: 100%;background-color: #F8F7F7;"></view>
			<view class="history_title">
				<view class="text">
					已有<text>{{memberTotal}}</text>名拼友加入「玖红天下」拼团
				</view>
				<view class="icon">
					<image src="../../static/icon/message-icon.png" @click="routeMessage" v-if="messageLength > 0">
					</image>
					<image src="../../static/icon/message-icon-none.png" @click="routeMessage" v-else></image>
				</view>
			</view>
		</view>
		<view class="header">
			<view class="history">
				<view class="history_img_list">
					<view class="his_img_scroll_content">
						<scroll-view scroll-x="true" style="white-space: nowrap;text-indent: 20rpx;">
							<view class="his_img_scroll_item" v-for="(item,index) in headportrait.headPortraitList"
								:key="index">
								<image :src="item.headPortrait" mode="aspectFill"></image>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
			<view class="news">
				<u-swiper :list="bannerList" name="picture" mode="none" :autoplay="true" :effect3d="true"
					:effect3d-previous-margin="36" @click="routeBanner"></u-swiper>
			</view>
			<view class="message">
				<view class="message_icon">
					<image src="/static/icon/trumpet.png"></image>
				</view>
				<u-notice-bar mode="horizontal" type="none" :volume-icon="false" color="#4d4d4d" padding="0rpx 0rpx"
					:list="messageList"></u-notice-bar>
			</view>
			<view class="menu">
				<view class="menu_item">
					<image src="/static/image/menu1.png" @click="routeIntroduction"></image>
				</view>
				<view class="menu_item">
					<image src="/static/image/menu2.png" @click="routeGroupRole"></image>
				</view>
				<view class="menu_item">
					<image src="/static/image/menu3.png" @click="routeContact"></image>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="area">
				<view class="area_title">
					<text>热门专区</text>
				</view>
				<view class="area_content">
					<view class="area_item" v-for="(item,index) in productionList" :key="index"
						@click.stop="routeProdDetail(item.id)">
						<view class="line_1">
							<image class="detail_img" :src="item.picture" mode="aspectFill"></image>
							<view class="prod_detail">
								<view class="detail_title">
									<text>{{item.pname}}</text>
								</view>
								<view class="detail_price">
									<text>￥{{item.marketprice}}</text>
									<text>市场价</text>
								</view>
								<view class="group_buy">
									<text class="group_price">{{item.ptPrice}}积分</text>
									<text>拼团价</text>
								</view>
							</view>
						</view>
						<view class="line_2" v-if="item.joinsum">
							<text>累计参团{{item.joinsum}}次</text>
						</view>
						<view class="line_3" v-if="item.memberBaseVos && item.memberBaseVos.length > 0">
							<view class="photo_list">
								<image :src="ite.headPortrait" mode="aspectFill"
									v-for="(ite,inde) in item.memberBaseVos" :key="inde" v-if="inde < 10"></image>
							</view>
							<view class="photo_icon">
								<image src="/static/image/group@2x.png" mode=""></image>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore :status="loadingStatus" />
			</view>
		</view>
		<view class="go-home">
			<image class="img" src="/static/tabbar/go-home.png" @click="goHome"></image>
		</view>
		<u-tabbar v-model="current" :list="list" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import ZyUpdate from '@/components/zy-upgrade/zy-upgrade.vue' //更新插件2
	import appUpdate from "@/components/yzhua006-update/app-update.vue" //更新插件1
	export default {
		components: {
			ZyUpdate,
			appUpdate,
		},
		mounted() {
			// this.$refs.zyupgrade.check_update()
			// this.$refs.app_update.update(); //调用子组件 检查更新 有bug
		},
		data() {
			return {
				//菜单
				list: [{
						iconPath: "/static/tabbar/i_home@2x.png",
						selectedIconPath: "/static/tabbar/i_home_fill@2x.png",
						customIcon: false,
						"pagePath": "/pages/index/index",
					},
					{
						iconPath: "/static/tabbar/Search@2x.png",
						selectedIconPath: "/static/tabbar/Search_fill@2x.png",
						customIcon: false,
						"pagePath": "/pages/find/find",
					},
					{
						iconPath: "/static/tabbar/button_float_tap@2x.png",
						selectedIconPath: "/static/tabbar/button_float_tap@2x.png",
						midButton: true,
						customIcon: false,
						"pagePath": "/pages/group-buy/group-buy",
					},
					{
						iconPath: "/static/tabbar/i_Chat@2x.png",
						selectedIconPath: "/static/tabbar/i_Chat_fill@2x.png",
						customIcon: false,
						"pagePath": "/pages/message/message",
					},
					{
						iconPath: "/static/tabbar/Bag@2x.png",
						selectedIconPath: "/static/tabbar/Bag_fill@2x.png",
						customIcon: false,
						"pagePath": "/pages/mine/mine",
					},
				],
				memberTotal: 0,
				current: 0,
				page: 1,
				pageSize: 10,
				loadingStatus: 'loadmore',
				//菜单
				messageList: [],
				headportrait: {
					groupFriendsCount: 0,
					headPortraitList: [],
				},
				productionList: [],
				bannerList: [],
				messageLength: 0,
				statusBarHeight: false,
				update_url: '', // 升级url
			}
		},
		onLoad: function() {
			this.init()
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			let len = this.productionList.length;
			if (len < this.pageSize*this.page) {
				this.loadingStatus = 'nomore'
				return false;
			}
			this.page++
			this.get_product_list()
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.productionList=[];
			this.bannerList=[];
			this.get_headportrait()
			this.get_product_list()
			this.get_notice_list()
			this.get_userCenter()
			this.get_message_list()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			init(){
				console.log('onLoad')
				this.get_member_total()
				this.get_headportrait()
				this.get_product_list()
				this.get_notice_list()
				this.get_userCenter()
				this.get_message_list()
			},
			goHome(){
				console.log('goHome')
				uni.navigateTo({
					url: '/pages/home/home',
				})
			},
			//吸顶
			stickyFixed: function() {
				this.statusBarHeight = true
			},
			//取消吸顶
			stickyUnfixed: function() {
				this.statusBarHeight = false
			},
			//我的信息
			get_userCenter: function() {
				let that = this
				this.$u.api.get_userCenter().then(res => {
					if (res.code == 0) {
						uni.setStorageSync('user', res.data);
					}
				})
			},
			/**
			 * 接口请求
			 * ------------------------------------------------------------
			 * */
			get_member_total() {
				this.$u.api.get_member_total().then(res => {
					this.memberTotal=res.data;
				})
			},
			//获取消息中心
			get_message_list: function() {
				let that = this
				this.$u.api.get_message_list({
					page: 1,
					pageSize: 10
				}).then(res => {
					console.log(res);
					if (res.code == 0) {
						// isRead
						let messageLength = 0
						res.data.map(item => {
							messageLength++
						})
						that.messageLength = messageLength
					} else {

					}
				})
			},
			//首页头像与拼团人数
			get_headportrait: function() {
				let that = this
				this.$u.api.get_headportrait().then(res => {
					console.log(res);
					if (res.code == 0) {
						let headportrait = res.data
						headportrait.headPortraitList = headportrait
						that.headportrait = headportrait
					}
				})
			},
			//首页热门专区
			get_product_list: function() {
				let that = this
				that.loadingStatusTab1 = 'loading'
				that.$u.api.get_product_list({
					current: that.page,
					size: that.pageSize,
					total: 1
				}).then(res => {
					if (res.code == 0) {
						that.productionList.push(...res.data)
						if(that.page===1) this.bannerList=res.data
						that.loadingStatus = res.data.length < that.pageSize*that.page ? 'nomore' : 'loadmore'
					}
				})
			},
			//公告列表
			get_notice_list: function() {
				let that = this
				this.$u.api.get_notice_list({
					page: 1,
					pageSize: 10
				}).then(res => {
					console.log('消息', res.data);
					if (res.code == 0) {
						that.messageList=res.data.map(item => {
							const reg=/<\/?.+?\/?>/g;
							return item.contents.replace(reg,'')
						})
					}
					
				})
			},
			/**
			 * 路由
			 * -----------------------------------------------------------
			 * */
			//路由 - 商品详情
			routeProdDetail: function(id) {
				console.log('商品id', id)
				uni.navigateTo({
					url: '/pages/index/production/detail?groupProductId=' + id,
					complete: function(res) {
						console.log(res)
					}
				})
			},
			// 路由 - 消息通知
			routeMessage: function() {
				uni.switchTab({
					url: '../message/message'
				})
			},
			//路由 - 平台简介
			routeIntroduction: function() {
				uni.navigateTo({
					url: '/pages/text/introduction',
				})
			},
			//路由 - 拼团规则
			routeGroupRole: function() {
				uni.navigateTo({
					url: '/pages/text/group-role',
				})
			},
			//路由 - 联系客服
			routeContact: function() {
				uni.navigateTo({
					url: '/pages/text/contact',
				})
			},
			//路由 - 轮播图
			routeBanner: function(index) {
				this.routeProdDetail(this.bannerList[index].id)
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .uni-swiper .uni-swiper-slides {
		width: 100%;
	}

	.nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 996;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.go-home{
		position: fixed;
		right: 5upx;
		width: 60upx;
		height: 60upx;
		top: 71%;
		.img{
				width: 100%;
				height: 100%;
		}
	}

	/**
	 * header
	 *---------------------------------------------------
	 */
	.history_title {
		/* position: sticky;
		top: var(--status-bar-height);
		left: 0;
		z-index: 99; */
		/* padding-top: var(--status-bar-height); */
		background-color: #F8F7F7;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 40rpx;
	}
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
	.history_title .icon image {
		width: 102rpx;
		height: 102rpx;
	}

	.history_title .text {
		font-size: 24rpx;
		font-weight: 300;
		color: #532da3;
		letter-spacing: 0rpx;
	}

	.history_title .text text {
		font-size: 30rpx;
		color: #000000;
	}

	.history_img_list {
		margin-top: 152rpx;
		padding-top: var(--status-bar-height);
	}

	.his_img_scroll_content {
		display: flex;
		align-items: center;
	}

	.his_img_scroll_item {
		display: inline-block;
		width: 74rpx;
		height: 74rpx;
		margin-right: 20rpx;
	}

	.his_img_scroll_item image {
		display: inline-block;
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		border: 2rpx solid #532da3;
		box-shadow: 0px 6rpx 8rpx 0px rgba(0, 0, 0, 0.40);
	}

	/**
	 * 新闻
	 * -----------------------------------------------------
	 */
	.news {
		padding: 40rpx 0 36rpx;
	}

	.news_scroll {
		white-space: nowrap;
	}

	.news_item image {
		display: block;
		width: 400rpx;
		height: 250rpx;
		border-radius: 14rpx;
		box-shadow: 0px 8rpx 8rpx 0px rgba(0, 0, 0, 0.25);
	}

	.news_scroll .news_item:last-child {
		margin-right: 40rpx;
	}

	/**
	 * 滚动消息
	 * -------------------------------------------------------
	 */
	.message {
		padding-left: 40rpx;
		display: flex;
		align-items: center;
	}

	.message .message_icon {
		width: 40rpx;
		height: 40rpx;
	}

	.message .message_icon image {
		width: 40rpx;
		height: 40rpx;
		display: block;
	}

	/**
	 * 菜单
	 * -------------------------------------------------------
	 */
	.menu {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx;
	}

	.menu_item image {
		display: block;
		width: 208rpx;
		height: 122rpx;
		border-radius: 18rpx;
		box-shadow: 0px 2rpx 8rpx 0px rgba(0, 0, 0, 0.25);
	}

	/**
	 * 热门专区
	 * -------------------------------------------------------
	 */
	.area {
		padding: 0 40rpx;
	}

	.area_title {
		font-size: 36rpx;
		text-align: center;
		color: #030303;
		padding-bottom: 40rpx;
	}

	.area_item {
		opacity: 1;
		background: #ffffff;
		border: 2rpx solid #e2e2e2;
		border-radius: 38rpx;
		box-shadow: 4rpx 2rpx 4rpx 1rpx rgba(203, 203, 203, 0.20);
		padding: 24rpx;
		margin-bottom: 40rpx;
		width: 670rpx;
	}

	.line_1 {
		display: flex;
		align-items: center;
	}

	.detail_img {
		width: 320rpx;
		height: 192rpx;
		border-radius: 12rpx;
	}

	.prod_detail {
		flex: 1;
		padding-left: 20rpx;
	}

	.detail_title {
		font-size: 28rpx;
		color: #181725;
		line-height: 36rpx;
		font-weight: 600;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.detail_price {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #8f8f8f;
		line-height: 36rpx;
		padding-top: 18rpx;
	}

	.group_buy {
		font-size: 24rpx;
		font-weight: 600;
		color: #532da3;
		padding-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.group_buy .group_price {
		font-size: 32rpx;
		font-weight: 500;
	}

	.line_2 {
		padding: 20rpx 0 0;
	}

	.line_2 text {
		font-size: 24rpx;
		font-weight: 500;
		color: #828282;
	}

	.line_3 {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.photo_icon image {
		width: 86rpx;
		height: 86rpx;
	}

	.photo_list image {
		display: inline-block;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		border: 2rpx solid #532DA3;
		margin-right: 2rpx;
	}

	/deep/.u-notice-bar-wrap {
		width: 100%;
	}
</style>
