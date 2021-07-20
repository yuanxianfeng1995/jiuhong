<template>
	<view class="contain">
		<view class="content">
			<view class="item" v-for="(item,index) in messageList" :key="index">
				<view class="time">
					<text>{{item.createtime}}</text>
					<text>系统消息</text>
				</view>
				<view class="item_detail" @click="readMessage(item,index)">
					<view class="detail_title">
						<text>{{item.title}}</text>
						<!-- <text class="status" v-if="item.isRead">已读</text>
						<text class="status fail" v-else>未读</text> -->
					</view>
					<view class="detail_content">
						<!-- <text>{{item.contents}}</text> -->
						<u-parse :html="item.contents"></u-parse>
					</view>
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
				current: 3,
				messageList:[]
			}
		},
		onLoad:function(){
			let that = this
			this.$u.api.get_message_list({
				page: 1,
				pageSize: 10
			}).then(res => {
				console.log(res);
				if( res.code == 0 ){
					that.messageList = res.data
				}
			})
		},
		onPullDownRefresh() {
			let that = this
			this.$u.api.get_message_list({
				current: 0,
				size: 10,
				params: {},
			}).then(res => {
				console.log(res);
				if( res.code == 200 ){
					let messageList = res.data.records.map( item => {
						item.createTime = item.createTime.replace('T',' ')
						return item
					})
					that.messageList = messageList
				}
			})
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		//导航栏按钮点击事件
		// onNavigationBarButtonTap:function(e){
		// 	console.log(e)
		// 	let that = this
		// 	that.messageList.map(item=>{
		// 		that.$u.api.set_message_readed({
		// 			messageId: item.id,
		// 		}).then(res => {
		// 			console.log(res);
		// 			if( res.code == 200 ){
						
		// 			}
		// 		})
		// 	})
		// },
		methods: {
			//读取消息
			readMessage:function(item,index){
				console.log(item,index)
				let that = this
				this.$u.api.set_message_readed({
					messageId: item.id,
				}).then(res => {
					console.log(res);
					if( res.code == 200 ){
						that.$u.api.get_message_list({
							current: 0,
							size: 10,
							params: {},
						}).then(res => {
							console.log(res);
							if( res.code == 200 ){
								let messageList = res.data.records.map( item => {
									item.createTime = item.createTime.replace('T',' ')
									return item
								})
								that.messageList = messageList
							}
						})
					}
				})
			},
		}
	}
</script>

<style>
.contain{
	background-color: #f8f7f7;
	min-height: 100vh;
}
.content{
	padding: 30rpx;
}
.item .time{
	font-size: 24rpx;
	font-weight: 400;
	text-align: center;
	color: #000000;
}
.item_detail{
	margin: 30rpx 0;
	background: #ffffff;
	border-radius: 12rpx;
	box-shadow: 0px 4rpx 4rpx 0px rgba(214,214,214,0.25); 
}
.detail_title{
	padding: 40rpx;
	border-bottom: 2rpx solid #E8E8E8;
	font-weight: 600;
	font-size: 28rpx;
	color: #000;
	display: flex;
	justify-content: space-between;
}
.detail_title .status{
	color: #999;
	font-weight: 500;
	width: 160rpx;
	text-align: right;
}
.detail_title .fail{
	color: #ff0000;
}
.detail_content{
	padding: 40rpx;
	font-size: 28rpx;
	color: #383838;
	line-height: 40rpx;
}
</style>
