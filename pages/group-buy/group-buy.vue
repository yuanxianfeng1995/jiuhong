<template>
	<view class="contain">
		<view class="header">
			<view style="height: var(--status-bar-height);width: 100%;background-color: #FFFFFF;"></view>
			<view class="tab">
				<view :class="['tab_item', tabActive == 1 ? 'active' : '']" @click="tabChange(1)">
					<text>拼团广场</text>
					<!-- <view :class="['tab_line', tabActive == 1 ? 'tab_line_active' : '']"></view> -->
				</view>
				<view :class="['tab_item', tabActive == 2 ? 'active' : '']" @click="tabChange(2)">
					<text>我参与的</text>
					<!-- <view :class="['tab_line', tabActive == 2 ? 'tab_line_active' : '']"></view> -->
				</view>
			</view>
			<view class="warn_message">
				<text>温馨提示：您今日还可开团{{openAndJoin_num.surplusCreateGroupTotal<0?0:openAndJoin_num.surplusCreateGroupTotal}}次，参团{{openAndJoin_num.surplusJoinGroupTotal}}次</text>
				<text @click="routeRole">查看规则</text>
			</view>
		</view>
		<view class="content" v-if="tabActive == 1">
			<swiper :indicator-dots="false" :autoplay="true" :circular="true" :interval="3000" :duration="1000"
				style="height: 364rpx;" v-if="group_pt_successList_list.length > 0">
				<swiper-item v-for="(item,index) in group_pt_successList_list" :key="index">
					<view class="recommend" @click.stop="routeDetailHose(item)">
						<view class="line_1">
							<text class="date">开团时间：{{item.createtime}}</text>
							<!-- <text>团号：{{item.groupNo}}</text> -->
						</view>
						<view class="line_2">
							<view class="author">
								<view class="author_img">
									<image class="icon" src="../../static/icon/crown-icon@2x.png"></image>
									<image class="headimg" :src="item.isWinningHeadUrl" mode="aspectFill"></image>
								</view>
								<view class="author_name">
									<view class="u-line-1" style="width: 110rpx;">{{item.winUserno?item.winUserno.substr(0,1):''}}**
									</view>
									<!-- <text>贵阳</text> -->
								</view>
							</view>
							<view class="success">
								<view class="prod">
									<text>{{item.pname}}</text>
								</view>
								<view class="coupon">
									<text>获得开团券：</text>
									<u-icon name="/static/icon/coupon.png" size="30"></u-icon>
									<text class="num">+ {{item.giveCoupon ? item.giveCoupon : 0}}</text>
								</view>
							</view>
						</view>
						<view class="line_3">
							<view class="img_list">
								<block v-for="(ite,inde) in item.members" :key="inde">
									<image :src="ite.headPortrait" mode="aspectFill"
										v-if="item.isWinningHeadUrl != ite"></image>
								</block>
							</view>
							<view class="award">
								<text>获得积分奖励：+{{item.ptPrice}}</text>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>


			<view class="list">
				<view class="item" v-for="(item,index) in group_square_list" :key="index"
					@click.stop="routeDetailHose(item)">
					<view class="item_top">
						<view class="item_name">
							<!-- <image :src="item.openGroupHeadPortrait" mode="aspectFill"></image> -->
							<text>
								<!--{{item.openGroupNickname.substr(0,1)}}-->***发起拼团
							</text>
						</view>
						<view class="item_num">
							<text class="color_red">{{item.joinNum}}人团</text>
							<text>还差{{item.joinNumRemind}}人</text>
						</view>
					</view>
					<view class="item_middle">
						<view class="img_box">
							<image class="img" :src="item.picture" mode="aspectFill"></image>
							<view class="history" v-if="item.headUrls&&item.headUrls.length > 0">
								<image class="history_item" :src="ite.headPortrait" mode="aspectFill"
									v-for="(ite,inde) in item.headUrls" :key="inde"></image>
							</view>
						</view>
						<!-- <image :src="item.picture" mode="aspectFill"></image>、 -->
						<view class="item_detail prod_detail">
							<view class="detail_title">
								<text>{{item.gname}}</text>
							</view>
							<view class="detail_price">
								<text>￥{{item.marketPrice}}</text>
								<text>市场价</text>
							</view>
							<view class="group_buy">
								<text class="group_price">{{item.ptPrice}}积分</text>
								<text>拼团价</text>
							</view>
						</view>
					</view>
					<view class="item_bottom">
						<view class="time">
							<text class="time_title">倒计时：</text>
							<u-count-down :timestamp="time" font-size="24" bg-color="none" v-if="time"></u-count-down>
							<text v-else>开团失败</text>
						</view>
						<view class="handle">
							<!-- <text>团号：{{item.groupNo}}</text> -->
							<button class="btn" type="default" @click.stop="joinGroup(item)">加入拼团</button>
						</view>
					</view>
				</view>
				<u-loadmore :status="loadingStatusTab1" />
			</view>
		</view>
		<view class="content" v-if="tabActive == 2">
			<view class="tab2_menu">
				<u-grid :col="5" :border="false" @click="tab2MenuClick">
					<u-grid-item v-for="(item,index) in tab2_menu" :index="index" :key="index">
						<view :class="['tab2_menu_num',tab2_current == index ? 'tab2_menu_num_active' : '']">
							{{item.num ? item.num : 0}}
						</view>
						<view :class="['tab2_menu_name',tab2_current == index ? 'tab2_menu_name_active' : '']">
							{{item.name}}
						</view>
					</u-grid-item>
				</u-grid>
			</view>
			<view class="list">
				<block v-for="(item,index) in group_participate_list" :key="index">

					<view class="recommend" v-if="item.status == 2 || tab2_current == 2"
						@click="routeDetailHose(item)">
						<view class="line_1">
							<text class="date">开团时间：{{item.startTime}}</text>
							<!-- <text>团号：{{item.groupNo}}</text> -->
						</view>
						<view class="line_2">
							<view class="author">
								<view class="author_img">
									<image class="icon" src="../../static/icon/crown-icon@2x.png"></image>
									<image class="headimg" :src="item.winUserHeadPortrait" mode="aspectFill"></image>
								</view>
								<view class="author_name">
									<view class="u-line-1" style="width: 110rpx;">{{item.winUserno?item.winUserName.substr(0,1):''}}**
									</view>
									<!-- <text>贵阳</text> -->
								</view>
							</view>
							<view class="success">
								<view class="prod">
									<text>获得商品：{{item.pname}}</text>
								</view>
								<view class="coupon">
									<text>获得开团券：</text>
									<u-icon name="/static/icon/coupon.png" size="30"></u-icon>
									<text class="num">+ {{detail.giveCoupon ? detail.giveCoupon : 0}}</text>
								</view>
							</view>
						</view>
						<view class="line_3">
							<view class="img_list">
								<block v-for="(ite,inde) in item.members" :key="inde">
									<image :src="ite.headPortrait" mode="aspectFill"
										v-if="item.winUserHeadPortrait != ite"></image>
								</block>
							</view>
							<view class="award">
								<text>获得积分奖励：+{{item.ptPrice ? item.ptPrice : 0}}</text>
							</view>
						</view>
					</view>

					<view class="item" v-else @click="routeDetailHose(item)">
						<view class="item_top">
							<view class="item_name">
								<!-- <image :src="item.openGroupHeadPortrait" mode="aspectFill"></image> -->
								<text>
									<!--{{item.openGroupNickname.substr(0,1)}}-->***发起拼团
								</text>
							</view>
							<view class="item_num">
								<text class="color_red">{{item.joinNum}}人团</text>
								<text>还差{{item.joinRemindNum}}人</text>
							</view>
						</view>
						<view class="item_middle">
							<view class="img_box">
								<image class="img" :src="item.picture" mode="aspectFill"></image>
								<view class="history" v-if="item.members&&item.members.length > 0">
									<image class="history_item" :src="ite.headPortrait" mode="aspectFill"
										v-for="(ite,inde) in item.members" :key="inde"></image>
								</view>
							</view>
							<view class="item_detail prod_detail">
								<view class="detail_title">
									<text>{{item.pname}}</text>
								</view>
								<view class="detail_price">
									<text>￥{{item.marketPrice}}</text>
									<text>市场价</text>
								</view>
								<view class="group_buy">
									<text class="group_price">{{item.ptPrice}}积分</text>
									<text>拼团价</text>
								</view>
							</view>
						</view>
						<view class="item_bottom">
							<view class="time">
								<text class="time_title">倒计时：</text>
								<text v-if="item.status == 3">开团失败</text>
								<u-count-down :timestamp="time" font-size="24" bg-color="none" v-else></u-count-down>
							</view>
							<view class="handle">
								<!-- <text>团号：{{item.groupNo}}</text> -->
								<button class="btn btn_active" type="default" v-if="!item.createBySelf">您已加入</button>
								<button class="btn btn_active" type="default" v-else>您开的团</button>
							</view>
						</view>
						<u-line margin="24rpx 0"></u-line>
						<view class="item_bottom join_time">
							<text>加入时间：{{$u.timeFrom(item.joinTime)}}</text>
							<text class="color_red">{{item.status == 3 ? '因人数不满拼团失败' : '待开奖'}}</text>
						</view>
					</view>
				</block>
				<u-loadmore :status="loadingStatus" />
			</view>
		</view>
		<u-tabbar v-model="current" :list="list" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//下拉刷新开关
				pullDownRefreshOnoff: true,
				pullDownRefreshTime: 10, //下拉刷新定时
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
				current: 2,
				page: 1,
				page1: 1,
				pageSize: 20,
				//菜单
				loadingStatus: 'loadmore',
				loadingStatusTab1: 'loadmore',
				group_square_list: [],
				group_pt_successList_list: [],
				group_participate_list: [],
				ptGroupRecordStaticData: {},
				openAndJoin_num: {},
				tabActive: 1,
				tab2_current: 0,
				tab2_menu: [{
						num: 0,
						name: '全部',
					},
					{
						num: 0,
						name: '待开奖',
					},
					{
						num: 0,
						name: '中奖',
					},
					{
						num: 0,
						name: '未中奖',
					},
					{
						num: 0,
						name: '拼团失败',
					},
				],
				time: ''
			}
		},
		onLoad: function() {
			this.get_openAndJoin_num()
			this.group_square()
			this.get_group_time_config()
			this.group_pt_successList()
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			if (this.tabActive == 1) {
				let len = this.group_square_list.length;
				if (len < this.pageSize * this.page) {
					this.loadingStatusTab1 = 'nomore'
					return false;
				}
				this.page++
				this.group_square()
			} else {
				let len = this.group_participate_list.length;
				if (len < this.pageSize * this.page1) {
					this.loadingStatus = 'nomore'
					return false;
				}
				this.page1++
				this.group_participate()
			}
		},
		onPullDownRefresh() {
			//定时器节流
			if (!this.pullDownRefreshOnoff) {
				this.$u.toast('请在' + this.pullDownRefreshTime + '秒后再刷新');
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 500);
				return
			}
			this.page = 1
			this.pullDownRefreshOnoff = false
			this.group_square_list=[]
			this.get_openAndJoin_num()
			this.group_square()
			this.get_group_time_config()
			this.group_pt_successList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);

			this.timer = setInterval(() => {
				if (this.pullDownRefreshTime <= 0) {
					this.pullDownRefreshTime = 10
					this.pullDownRefreshOnoff = true
					clearInterval(this.timer)
				} else {
					this.pullDownRefreshTime--
				}
				// console.log(this.pullDownRefreshTime)
			}, 1000)
		},
		methods: {
			get_group_time_config() {
				this.$u.api.get_group_time_config().then((res) => {
					console.log('res get_group_time_config', res)
					this.time = (new Date(res.data.end.replace(/-/g, '/')).getTime() - new Date().getTime()) / 1000
					console.log('this.time', this.time)
				})
			},
			//我参与的 - (1:全部,2:拼团中,3:中奖,4:未中奖,5:拼团失败)
			group_participate: function(status) {
				let that = this
				that.loadingStatus = 'loading'
				let id = getApp().globalData.user.id || uni.getStorageSync('user').userId
				let parma = {}
				switch (status) {
					case 1:
						parma = {
							isWin: null,
							status: null,
						}
						break;
					case 2:
						parma = {
							isWin: null,
							status: 1,
						}
						break;
					case 3:
						parma = {
							isWin: 1,
							status: null,
						}
						break;
					case 4:
						parma = {
							isWin: 0,
							status: null,
						}
						break;
					default:
						parma = {
							isWin: null,
							status: 3,
						}
				}
				this.$u.api.group_participate({
					userId: id,
					...parma,
					page: this.page1,
					pageSize: this.pageSize,
				}).then(res => {
					// (1:开团中,2:开团成功,3：开团失败)
					that.group_participate_list = res.data || []
					that.loadingStatus = that.group_participate_list.length < that.pageSize * that.page1 ?
						'nomore' : 'loadmore'
					console.log('that.loadingStatus', that.loadingStatus)
				})
			},
			//我参与的上面的数字统计
			ptGroupRecord_staticData: function(status) {
				let that = this
				this.$u.api.ptGroupRecord_staticData().then(res => {
					that.ptGroupRecordStaticData = res.data
					that.tab2_menu[0].num = res.data.ptAll
					that.tab2_menu[1].num = res.data.dkj
					that.tab2_menu[2].num = res.data.zj
					that.tab2_menu[3].num = res.data.wzj
					that.tab2_menu[4].num = res.data.ptFailed
				})
			},
			//拼团广场
			group_square: function() {
				let that = this
				that.loadingStatusTab1 = 'loading'
				this.$u.api.group_square({
					page: this.page,
					pageSize: this.pageSize,
				}).then(res => {
					if (res.code == 0) {
						if (res.data) that.group_square_list.push(...res.data)
						that.loadingStatusTab1 = res.data.length < that.pageSize * that.page ? 'nomore' :
							'loadmore'
					}
				})
			},
			//今日可参团 、开团
			get_openAndJoin_num: function() {
				let id = getApp().globalData.user.id || uni.getStorageSync('user').userId
				this.$u.api.get_openAndJoin_num({
					userId: id
				}).then(res => {
					console.log(res)
					this.openAndJoin_num = res.data
				})
			},
			//Tab切换
			tabChange: function(index) {
				if (this.tabActive == index) {
					return
				}
				this.tabActive = index
				if (index == 2) {
					this.tab2_current = 0 //重置下标
					this.group_participate(1)
					this.ptGroupRecord_staticData()
				}
			},
			//我参与的 菜单切换
			tab2MenuClick: function(index) {
				console.log('tabIndex', index)
				this.tab2_current = index
				this.group_participate(index + 1)
			},
			//路由 - 拼团规则
			routeRole() {
				uni.navigateTo({
					url: '/pages/index/production/coupon-info'
				})
			},
			//路由 - 拼团详情
			routeDetail: function() {
				uni.navigateTo({
					url: 'group-detail'
				})
			},
			//路由 - 拼团购买
			joinGroup: function(item) {
				console.log('拼团item', item)
				if (this.openAndJoin_num.joinGroupNum <= 0) {
					this.$u.toast('您当前拼团次数不足哦')
					return
				}
				// console.log('剩下开团次数',this.openAndJoin_num)
				//开团失败判断
				if (item.status&&item.status == 3) { //拼团失败
					this.$u.toast('因人数不满开团失败，请选择其他商品继续拼团!');
					return
				}
				uni.navigateTo({
					url: '/pages/index/production/buy?type=2',
					success: function(res) {
						res.eventChannel.emit('groupData', {
							data: item
						})
					}
				})
			},
			//路由 - 拼团房间
			routeDetailHose: function(item) {
				let that = this
				console.log('item',item)
				//开团失败判断
				if (item.status&&item.status == 3) { //拼团失败
					this.$u.toast('因人数不满开团失败，请选择其他商品继续拼团!');
					return
				}
				console.log('item111',item)
				uni.navigateTo({
					url: '/pages/group-buy/group-detail?id=' + item.groupNo
				})
			},
			//开团成功列表
			group_pt_successList: function() {
				let that = this
				this.$u.api.group_pt_successList({
					offset: 50,
					page: 1
				}).then(res => {
					if (res.code == 0) {
						that.group_pt_successList_list = res.data
					}
				})
			},
		}
	}
</script>

<style>
	.header {
		background-color: #FFFFFF;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 996;
		width: 100%;
	}

	.header .tab {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content {
		padding-bottom: 30rpx;
		padding-top: var(--status-bar-height);
		margin-top: 132rpx;
	}

	.tab .tab_item {
		margin: 0 60rpx;
		font-size: 28rpx;
		color: #9e9e9e;
		height: 88rpx;
		line-height: 88rpx;
	}

	.tab .active {
		font-size: 32rpx;
		color: #532da3;
	}

	.tab_line {
		width: 40rpx;
		height: 4rpx;
		border: 4rpx solid #FFFFFF;
	}

	.tab_line_active {
		border: 4rpx solid #532da3;
	}

	.warn_message {
		width: 100%;
		height: 44rpx;
		line-height: 44rpx;
		background: #532da3;
		font-size: 24rpx;
		color: #ffffff;
		padding: 0 16rpx;
		display: flex;
		justify-content: space-between;
	}

	.recommend {
		width: 706rpx;
		height: 320rpx;
		background: url(../../static/image/group-bg-red@2x.png) no-repeat top left;
		background-size: cover;
		border-radius: 12rpx;
		box-shadow: 0px 2rpx 2rpx 0px rgba(186, 167, 167, 0.25);
		margin: 22rpx auto;
		padding: 12rpx 34rpx;
		position: relative;
	}

	.background_green {
		background: url(../../static/image/group-bg-green@2x.png) no-repeat top left;
		background-size: cover;
	}

	.recommend .line_1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.recommend .line_1 text {
		font-size: 24rpx;
		color: #424242;
	}

	.background_green .line_1 text {
		color: #FFFFFF;
	}

	.recommend .line_1 text.date {
		color: #000000;
	}

	.background_green .line_1 text.date {
		color: #FFFFFF;
	}

	.recommend .line_2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.line_2 .author {
		display: flex;
		align-items: center;
	}

	.author_img {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.author_img .icon {
		width: 56rpx;
		height: 56rpx;
		display: block;
	}

	.author_img .headimg {
		width: 100rpx;
		height: 100rpx;
		border: 4rpx solid #ffffff;
		border-radius: 54rpx;
		box-shadow: 0px 8rpx 8rpx 0rpx rgba(0, 0, 0, 0.25);
		display: block;
		margin-top: -20rpx;
	}

	.author_name {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 18rpx;
		white-space: nowrap;
	}

	.author_name text {
		display: block;
		padding: 6rpx 0;
		font-size: 24rpx;
		color: #000000;
	}

	.background_green .author_name text {
		color: #FFFFFF;
	}

	.success {
		width: 390rpx;
		height: 120rpx;
		border: 2rpx solid rgba(0, 0, 0, 0.16);
		border-radius: 14rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 34rpx;
		line-height: 48rpx;
	}

	.background_green .success {
		background: url(../../static/image/group-green-bg.png) no-repeat top left;
		background-size: contain;
	}

	.success text {
		font-size: 24rpx;
		color: #000000;
	}

	.background_green text {
		color: #FFFFFF;
	}

	.coupon {
		display: flex;
		align-items: center;
	}

	.coupon .num {
		padding-left: 20rpx;
	}

	.line_3 {
		position: absolute;
		left: 34rpx;
		bottom: 0;
		right: 34rpx;
		height: 104rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.img_list image {
		width: 40rpx;
		height: 40rpx;
		border: 4rpx solid #ffffff;
		border-radius: 24px;
		box-shadow: 0px 4rpx 4rpx 0px rgba(0, 0, 0, 0.40);
	}

	.line_3 .award text {
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.list .item {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20rpx 14rpx;
		width: 706rpx;
		background: #ffffff;
		border-radius: 12rpx;
		box-shadow: 0px 2rpx 0px 0px rgba(236, 236, 236, 0.25);
		margin: 0 auto;
		margin-bottom: 20rpx;
	}

	.item_top,
	.item_top .item_name {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.item_top .item_name image {
		width: 40rpx;
		height: 40rpx;
		border: 2rpx solid #532da3;
		border-radius: 22rpx;
		box-shadow: 0px 8rpx 8rpx 0px rgba(0, 0, 0, 0.25);
	}

	.item_top .item_name text {
		font-size: 28rpx;
		color: #040404;
		padding-left: 30rpx;
	}

	.item_num text {
		font-size: 28rpx;
		color: #000000;
	}

	.item_num .color_red {
		color: #FF0000;
		padding-right: 48rpx;
	}

	.item_middle {
		margin-top: 36rpx;
		margin-bottom: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.item_middle image {
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

	.item_bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.item_bottom .time {
		font-size: 24rpx;
		color: #532da3;
	}

	.item_bottom .time_title {
		color: #606060;
	}

	.handle {
		display: flex;
		align-items: center;
	}

	.handle text {
		padding-right: 32rpx;
		color: #2f2f2f;
		font-size: 24rpx;
	}

	.handle .btn {
		width: 158rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #532da3;
		border-radius: 12rpx;
		padding: 0;
		color: #FFFFFF;
		font-size: 24rpx;
	}

	.handle .btn_active {
		background-color: #FFFFFF;
		border: 2rpx solid #532da3;
		color: #532da3;
	}

	.tab2_menu {
		margin-top: 30rpx;
		margin-bottom: 24rpx;
	}

	.tab2_menu_num {
		width: 86rpx;
		height: 86rpx;
		line-height: 84rpx;
		border: 4rpx solid #FFFFFF;
		border-radius: 54rpx;
		text-align: center;
		font-size: 28rpx;
		color: #000000;
		margin-bottom: 26rpx;
	}

	.tab2_menu_num_active {
		border: 4rpx solid #532da3;
	}

	.tab2_menu_name {
		color: #8f8f8f;
		font-size: 28rpx;
	}

	.tab2_menu_name_active {
		color: #532da3;
	}

	.join_time {
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 22rpx;
	}

	.color_red {
		color: #FF0000;
	}

	.img_box {
		position: relative;
	}

	.img_box .history {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 320rpx;
		height: 48rpx;
		background: rgba(0, 0, 0, 0.47);
		border-radius: 0px 0px 12rpx 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.img_box .history image {
		width: 30rpx;
		height: 30rpx;
		border: 2rpx solid #ffffff;
		border-radius: 50%;
	}
</style>
