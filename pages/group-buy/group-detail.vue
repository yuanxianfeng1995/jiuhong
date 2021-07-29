<template>
	<view class="contain">
		<view class="header">
			<view class="recommend" v-if="detail.status == 2 && detail.winUserHeadPortrait">
				<view class="line_1">
					<text class="date">开团时间：{{detail.startTime}}</text>
					<!-- <text>团号：{{detail.groupNo}}</text> -->
				</view>
				<view class="line_2">
					<view class="author">
						<view class="author_img">
							<image class="icon" src="../../static/icon/crown-icon@2x.png"></image>
							<image class="headimg" :src="detail.winUserHeadPortrait" mode="aspectFill"></image>
						</view>
						<view class="author_name">
							<text>{{detail.winUserName?detail.winUserName.substr(0,1):''}}**</text>
							<!-- <text>贵阳</text> -->
						</view>
					</view>
					<view class="success">
						<view class="prod">
							<text>拼中商品: {{detail.pname}}</text>
						</view>
						<view class="coupon">
							<text>获得拼团券：</text>
							<u-icon name="/static/icon/coupon.png" size="30"></u-icon>
							<text class="num">+ {{detail.giveCoupon ? detail.giveCoupon : 0}}</text>
						</view>
					</view>
				</view>
				<view class="line_3">
					<view class="img_list">
						<scroll-view scroll-x="true" style="white-space: nowrap;">
							<image :src="item.headPortrait" mode="aspectFill" v-for="(item,index) in detail.members" :key="index" 
							v-if="index < detail.headUrlsLength && detail.winUserId != item.userId">
							</image>
						</scroll-view>
					</view>
					<view class="award">
						<text>获得积分奖励：+{{detail.givePoint ? detail.givePoint : 0}}</text>
					</view>
				</view>
			</view>
			<view class="item" v-else>
				<view class="item_top">
					<view class="item_name">
						<!-- <image :src="detail.openGroupHeadPortrait" mode="aspectFill"></image> -->
						<text><!--{{detail.openGroupNickname.substr(0,1)}}-->***发起拼团</text>
					</view>
					<view class="item_num">
						<text class="color_red">{{detail.joinNum}}人团</text>
						<text>还差{{detail.joinRemindNum}}人</text>
					</view>
				</view>
				<view class="item_middle">
					<image :src="detail.picture" mode="aspectFill"></image>
					<view class="item_detail prod_detail">
						<view class="detail_title">
							<text>{{detail.pname}}</text>
						</view>
						<view class="detail_price">
							<text>￥{{detail.marketPrice}}</text>
							<text>市场价</text>
						</view>
						<view class="group_buy">
							<text class="group_price">{{detail.ptPrice}}积分</text>
							<text>拼团价</text>
						</view>
					</view>
				</view>
				<view class="item_bottom">
					<view class="time">
						<text class="time_title">倒计时：</text>
						<u-count-down :timestamp="time" font-size="24" bg-color="none" @end="endTime()" v-if="detail.status !== 3"></u-count-down>
						<text v-else>开团失败</text>
					</view>
					<view class="handle">
						<!-- <text>团号：{{detail.groupNo}}</text> -->
						<button class="btn btn_active" type="default" size="">{{joinStatusText}}</button>
					</view>
				</view>
				<u-line margin="24rpx 0"></u-line>
				<view class="item_bottom join_time">
					<text>加入时间：{{joinTime}}</text>
					<text class="color_red">待开奖</text>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="turnplate">
				<image class="turnplate_bg" :animation="animationData" src="../../static/image/turnplate-bg@2x.png">
				</image>
				<view class="turnplate_content">
					<image :class="['turnplate_img','turnplate_img' + (index + 1)]" :src="item.headPortrait" mode="aspectFill"
						v-for="(item,index) in detail.members" :key="index" v-if="index < 10"></image>
					<image class="middle_img" :src="detail.winUserHeadPortrait" mode="aspectFill" v-if="detail.status == 3 || detail.status == 2"></image>
					<image class="middle_img" src="/static/image/none-get-icon.png" mode="aspectFill" v-else-if="detail.status == 1"></image>
				</view>
			</view>
		</view>
		<view class="footer">
			<template v-if="detail.status == 1">
				<button class="btn" type="default" @click="ptGroupRecord_view()" v-if="refreshShow">刷新</button>
				<button class="btn close" type="default" v-else>
					<view class="btn_content" style="display: flex;align-items: center;justify-content: center;">
						<view class="count_down" style="font-size: 28rpx;">
							<text>刷新(</text>
							<u-count-down :timestamp="5" color="#ffffff" :show-days="false" :show-hours="false" :show-minutes="false" font-size="24" bg-color="none" @end="refreshEndTime()"></u-count-down>s)
						</view>
					</view>
				</button>
				<button class="btn low" type="default" @click="routeShare()">邀请</button>
			</template>
			<template v-else>
				<text class="message_text" v-if="detail.selfHeadPortrait && detail.members.indexOf(detail.selfHeadPortrait) != -1 && detail.status == 2 && detail.selfHeadPortrait == detail.winUserHeadPortrait">客官您好，本次您中奖了哦~</text>
				<text class="message_text" v-else-if="detail.selfHeadPortrait && detail.members.indexOf(detail.selfHeadPortrait) != -1 && detail.status == 2 && detail.selfHeadPortrait != detail.winUserHeadPortrait">客官您好，本次您未中奖~</text>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {
					countDown: "",
					couponNum: 0,
					groupNo: "",
					groupPrice: 0,
					members: [],
					isWinning: 0,
					winUserHeadPortrait: "",
					isWinningNikeName: "",
					joinCreateTime: "",
					joinGroupNumber: 0,
					marketPrice: 0,
					openCreateTime: "",
					openGroupHeadPortrait: "",
					openGroupNickname: "",
					picture: "",
					productId: "",
					productName: "",
					rewardIntegral: 0,
					selfHeadPortrait: "",
					status: 0,
					surpNumber: 0,
				},
				headUrlsLength: 0,
				animationData: {},
				joinStatusText:'你未加入',
				joinTime: null,
				refreshShow:true,
				time: null
			}
		},
		onLoad: function(option) {
			console.log(option)
			this.groupNo = option.id
		},
		onShow: function() {
			this.get_group_time_config()
			this.joinTime=this.$u.timeFormat(new Date(), 'mm-dd hh:MM:ss')
			this.ptGroupRecord_view()
		},
		onReady:function(){
			let that = this
		},
		onUnload: function() {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
		methods: {
			get_group_time_config() {
				this.$u.api.get_group_time_config().then((res) => {
					this.time = (new Date(res.data.end.replace(/-/g, '/')).getTime() - new Date().getTime()) / 1000
				})
			},
			//倒计时结束
			endTime:function(){
				console.log('倒计时结束')
				this.failGroup()
			},
			//开团失败 - 无用
			openGroup_fail: function(id) {
				let that = this
				this.$u.api.openGroup_fail({
					groupNo: id
				}).then(res => {

				})
			},
			//开团成功 - 无用
			openGroup_success: function(id) {
				let that = this
				this.$u.api.openGroup_success({
					groupNo: that.groupNo
				}).then(res => {

				})
			},
			//开团房间数据查询
			ptGroupRecord_view: function(id) {
				let that = this
				uni.showLoading({
					title: '加载中'
				})
				this.$u.api.ptGroupRecord_view({
					groupNo: that.groupNo
				}).then(res => {
					if (res.code == 0) {
						let detail = res.data
						if(!detail) return;
						let i = detail.members?detail.members.length:0
						detail.headUrlsLength = i
						while (i < 10) {
							detail.members.push('/static/icon/group-none@2x.png')
							i++
						}
						
						const obj=detail.members?detail.members.find(item2=>item2.userId===detail.winUserId):null
						that.detail = {
							...detail,
							winUserHeadPortrait: obj?obj.headPortrait:detail.winUserHeadPortrait,
							winUserName:  obj?obj.nickname:detail.winUserName,
						}
						
						//找到中奖人的位置
						detail.members.map( (item,index) => {
							if( item.createBySelf ){
								that.joinStatusText = '你已开团'
								that.joinTime=detail.joinTime
							}
							if( detail.queryUserId == item.userId  ){
								that.joinStatusText = '你已加入'
								that.joinTime=item.createTime
							}
							if( item.userId == detail.winUserId ){ //找到中奖人
								var animation = uni.createAnimation({
									duration: 500,
									timingFunction: 'linear',
								})
								this.animation = animation
								animation.rotate(36*index).step()
								this.animationData = animation.export()
							}
						}) 
						
						
						if( detail.status == 1 ){
							console.log('转动动画')
							//转动动画
							var animation = uni.createAnimation({
								duration: 10000000,
								timingFunction: 'linear',
							})
							this.animation = animation
							animation.rotate(360000).step()
							this.animationData = animation.export()
						}else{
							// that.openGroup_success()
						}
						
						that.failGroup() //开团失败判断
						
					}
					uni.hideLoading()
				})
				this.refreshShow = false
			},
			/**
			 * 刷新倒计时
			 * */
			 refreshEndTime:function(){
				 this.refreshShow = true
			 },
			//开团失败 - 逻辑判断
			failGroup:function(){
				let that = this
				//开团失败判断
				if( that.status&&that.status == 3 ){ //拼团失败
					this.$u.toast('因人数不满开团失败，请选择其他商品继续拼团!');
					setTimeout(()=>{
						uni.switchTab({
							url:'/pages/group-buy/group-buy'
						})
					},1500)
				}
			},
			//路由 - 分享
			routeShare: function() {
				uni.navigateTo({
					url: '/pages/mine/qr-code/qr-code'
				})
			},
		}
	}
</script>

<style>
	.contain {
		min-height: 100vh;
		background: url(../../static/image/constellations.jpg) no-repeat top left;
		background-size: cover;
		padding: 20rpx 0 200rpx;
	}

	.item {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20rpx 14rpx;
		width: 706rpx;
		background: rgba(255, 255, 255, 0.80);
		border-radius: 12rpx;
		box-shadow: 0px 2rpx 0px 0px rgba(236, 236, 236, 0.25);
		margin: 0 auto;
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
		color: #4d4949;
	}

	.color_red {
		color: #FF0000;
	}

	.turnplate {
		width: 544rpx;
		height: 544rpx;
		margin: 182rpx auto 0;
		position: relative;
	}

	.turnplate_bg,
	.turnplate_content {
		position: absolute;
		top: 0;
		left: 0;
		width: 544rpx;
		height: 544rpx;
	}

	.turnplate_content .turnplate_img {
		width: 50rpx;
		height: 50rpx;
		border: 2rpx solid #532da3;
		border-radius: 28px;
	}

	.turnplate_img1 {
		position: absolute;
		top: 44rpx;
		left: 245rpx;
	}

	.turnplate_img2 {
		position: absolute;
		top: 80rpx;
		right: 128rpx;
	}

	.turnplate_img3 {
		position: absolute;
		top: 180rpx;
		right: 56rpx;
	}

	.turnplate_img4 {
		position: absolute;
		bottom: 180rpx;
		right: 56rpx;
	}

	.turnplate_img5 {
		position: absolute;
		bottom: 80rpx;
		right: 128rpx;
	}

	.turnplate_img6 {
		position: absolute;
		bottom: 44rpx;
		left: 245rpx;
	}

	.turnplate_img7 {
		position: absolute;
		bottom: 80rpx;
		left: 128rpx;
	}

	.turnplate_img8 {
		position: absolute;
		bottom: 180rpx;
		left: 56rpx;
	}

	.turnplate_img9 {
		position: absolute;
		top: 180rpx;
		left: 56rpx;
	}

	.turnplate_img10 {
		position: absolute;
		top: 80rpx;
		left: 128rpx;
	}

	.middle_img {
		position: absolute;
		left: 134rpx;
		top: 134rpx;
		width: 266rpx;
		height: 266rpx;
		border: 6rpx solid #ffffff;
		border-radius: 50%;
		box-shadow: 0px 0px 2rpx 2rpx #00b1ff;
	}

	.footer {
		position: fixed;
		bottom: 58rpx;
		left: 32rpx;
		right: 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.footer .btn {
		width: 484rpx;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0;
		background: #532da3;
		border: 2rpx solid #ffffff;
		border-radius: 21rpx;
		box-shadow: 0px 8rpx 8rpx 0px rgba(255, 255, 255, 0.25);
		color: #FFFFFF;
	}
	
	.footer .close{
		background-color: #999999;
	}

	.footer .low {
		width: 168rpx;
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
	
	.background_green .success{
		background:url(../../static/image/group-green-bg.png) no-repeat top left;
		background-size: contain;
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
	
	.img_list{
		width: 420rpx;
		white-space: nowrap;
	}

	.img_list image {
		width: 40rpx;
		height: 40rpx;
		border: 4rpx solid #ffffff;
		border-radius: 24px;
		box-shadow: 0px 4rpx 4rpx 0px rgba(0, 0, 0, 0.40);
	}
	.line_3 .award{
		width: 260rpx;
		text-align: right;
	}
	.line_3 .award text {
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.message_text {
		flex: 1;
		text-align: center;
		font-size: 34rpx;
		font-weight: 600;
		background-image: -webkit-linear-gradient(bottom, #532DA3, #ffffff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
