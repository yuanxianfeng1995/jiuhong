<template>
	<view class="contain">
		<view class="header">
			<view class="price">
				<u-icon name="/static/icon/mine-data-icon1@2x.png" size="60"></u-icon>
				<text>{{user.accountIntegral}}</text>
			</view>
			<view class="menu">
				<text>当前可用拼团积分 {{user.accountAvailableIntegral}}</text>
				<view class="menu_btn">
					<button class="btn" type="default" size="mini" @click="routeBuyBalance">转到余额</button>
					<!-- <button class="btn" type="default" size="mini" @click="routeBuyAlsipay">微信购买</button> -->
				</view>
			</view>
		</view>
		<view class="content">
			<!-- <view class="title">
				<text>规则说明</text>
			</view> -->
			<!-- <view class="tag">
				<view :class="['tag_item',tagCurrent==0 ? 'tag_active' : '']" @click="tagChange(0)">
					<text>获得记录</text>
					<view :class="['tag_line',tagCurrent==0 ? 'tag_line_active' : '']"></view>
				</view>
				<view :class="['tag_item',tagCurrent==1 ? 'tag_active' : '']" @click="tagChange(1)">
					<text>使用记录</text>
					<view :class="['tag_line',tagCurrent==1 ? 'tag_line_active' : '']"></view>
				</view>
			</view> -->
			<view class="list">
				<view class="item">
					<text>日期时间</text>
					<text>操作说明</text>
					<text>交易积分</text>
					<text>结余积分</text>
				</view>
				<view class="item" v-for="(item,index) in userCenter_integral" :key="index">
					<text>{{item.createtime}}</text>
					<text>{{item.realtype}}</text>
					<text>{{(item.optype===0?'+':'-')+item.sjmoney}}</text>
					<text>{{item.jymoney}}</text>
				</view>
				<u-loadmore :status="'nomore'" :bg-color="'#F8F7F7'"  v-if="loadmoreShow" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tagCurrent:0,
				user:'',
				current:1,
				userCenter_integral:[],
				reachBottomOpen:true,
				loadmoreShow:false,
			}
		},
		onLoad(option) {
			this.user = uni.getStorageSync('user');
			this.get_userCenter_integral()
		},
		onShow() {
			this.get_userCenter()
		},
		onReachBottom:function(){
			console.log(this.reachBottomOpen)
			if( this.reachBottomOpen ){
				this.current = this.current + 1
				this.get_userCenter_integral()
				// if( this.tagCurrent == 0 ){
				// 	this.get_userCenter_integral(0)
				// }else{
				// 	this.get_userCenter_integral(1)
				// }
			}
		},
		methods: {
			//我的信息
			get_userCenter:function(){
				 let that = this
				 this.$u.api.get_userCenter().then(res => {
					if( res.code == 0 ){
						this.user = res.data
					}
				 })
			},
			//积分记录	
			get_userCenter_integral:function(type){
				 let that = this
				 this.$u.api.get_userCenter_integral({
					 size: that.current,
					 optype: type,
					 pageSize: 30
				 }).then(res => {
					if( res.code == 0 ){
						that.userCenter_integral = [...that.userCenter_integral,...res.data]
						if( res.data.length < 30 ){
							that.reachBottomOpen = false
						}
						if( res.data.length == 0 ){
							that.loadmoreShow = true
						}else{
							that.loadmoreShow = false
						}
					}
				 })
			},
			//Tag改变
			tagChange:function(index){
				this.tagCurrent = index
				this.current = 0
				this.userCenter_integral = []
				this.reachBottomOpen = true
				if( index == 0 ){
					this.get_userCenter_integral(0)
				}else{
					this.get_userCenter_integral(1)
				}
			},
			//路由 - 购买余额
			routeBuyBalance:function(){
				uni.navigateTo({
					url:'buy-balance?amount=' + this.user.accountAvailableIntegral
				})
			},
			//路由 - 支付宝购买
			routeBuyAlipay:function(){
				uni.navigateTo({
					url:'buy-alipay'
				})
			},
		}
	}
</script>

<style>
.header{
	background: #532da3;
	box-shadow: 0px 4rpx 4rpx 2rpx rgba(44,44,44,0.20); 
	padding: 68rpx 20rpx 32rpx;
}
.menu_btn .btn{
	height: 68rpx;
	line-height: 68rpx;
	color: #FFFFFF;
	background: #532da3;
	border: 2rpx solid #ffffff;
	border-radius: 14rpx;
	padding:  0 20rpx;
	margin-left: 20rpx;
}
.header .price text{
	font-size: 70rpx;
	color: #ffffff;
	padding-left: 10rpx;
}
.menu{
	display: flex;
	justify-content: space-between;
	padding-top: 20rpx;
}
.menu text{
	color: #FFFFFF;
	font-size: 24rpx;
	padding-top: 10rpx;
}
.content .title{
	font-size: 28rpx;
	color: #9c9c9c;
	padding: 40rpx;
	text-align: center;
}
.content .tag{
	display: flex;
	padding: 20rpx 0;
}
.tag_item{
	margin-left: 40rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	line-height: 48rpx;
}
.tag_item text{
	font-size: 24rpx;
	color: #939393;
}
.tag_active text{
	font-size: 28rpx;
	color: #532DA3;
}
.tag_line{
	height: 0;
	width: 102rpx;
	border-bottom: 2rpx solid #F8F7F7;
}
.tag_line_active{
	border-bottom: 2rpx solid #532DA3;
}
.list{
	background-color: #FFFFFF;
}
.list .item{
	height: 96rpx;
	width: 750rpx;
	border-bottom: 2rpx solid #F9F9F9;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.list .item text{
	font-size: 28rpx;
	color: #000000; 
	flex: 1;
	text-align: center;
}
.list .item text.status{
	font-weight: 600;
}
.role{
	margin-bottom: 20rpx;
}
.role_title{
	padding: 30rpx 26rpx;
	color: #000000;
	font-size: 28rpx;
}
.role_item{
	height: 82rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #000000;
	font-size: 28rpx;
	padding: 0 26rpx;
	background-color: #FFFFFF;
}
</style>
