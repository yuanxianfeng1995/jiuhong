<template>
	<view class="contain">
		<view class="header">
			<view class="price">
				<u-icon name="/static/icon/mine-data-icon2@2x.png" size="60"></u-icon>
				<text>{{user.accountCoupon}}</text>
			</view>
			<view class="menu">
				<text>当前剩余可用拼团券{{user.accountAvailableCoupon}}张</text>
				<view class="menu_btn">
					<button class="btn" type="default" size="mini" @click="routeBuy">投入分红</button>
				</view>
			</view>
		</view>
		<view class="content">
			<!-- <view class="role">
				<view class="role_title">
					<text>当前持有分红的产品份数如下：</text>
				</view>
				<view class="role_item" v-for="(item,index) in shareBonusNumArr" :key="index">
					<text>投入{{item.coupounum}}张拼团券，累计分红{{item.accountsum}}积分出局</text>
					<text>1份</text>
				</view>
			</view> -->
		<!-- 	<view class="tag">
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
					<text>交易拼团券</text>
					<text>结余拼团券</text>
				</view>
				<view class="item" v-for="(item,index) in couponListArr" :key="index">
					<text>{{item.createtime}}</text>
					<text>{{item.memo}}</text>
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
				user:{},
				current:1,
				reachBottomOpen:true,
				couponListArr:[],
				shareBonusNumArr:[],
				loadmoreShow:false,
			}
		},
		onLoad:function(){
			this.user = uni.getStorageSync('user');
			console.log(this.user)
			this.couponList()
		},
		onShow() {
			this.get_userCenter()
			// this.currenthold()
		},
		onReachBottom:function(){
			if( this.reachBottomOpen ){
				this.current = this.current + 1
				this.couponList()
				// if( this.tagCurrent == 1 ){
				// 	this.couponList(0)
				// }else{
				// 	this.couponList(1)
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
			//当前分红产品份数
			currenthold:function(type){
				let that = this
				this.$u.api.currenthold().then(res => {
					if( res.code == 0 ){
						that.shareBonusNumArr = res.data
					}
				})
			},
			//分红记录
			couponList:function(optype){
				let that = this
				this.$u.api.couponList(
				{
					size: that.current,
					optype: optype,
					pageSize: 30
				}).then(res => {
					if( res.code == 0 ){
						that.couponListArr = [...that.couponListArr,...res.data]
						if( res.data.length < 30 ){
							that.reachBottomOpen = false
						}
						if( res.data.length == 0 ){
							that.loadmoreShow = true
						}else{
							that.loadmoreShow = false
						}
					}else{
						
					}
				})
			},
			//Tag改变
			tagChange:function(index){
				this.tagCurrent = index
				this.current = 0
				this.reachBottomOpen = true
				this.couponListArr = []
				if( index == 0 ){
					this.couponList(0)
				}else{
					this.couponList(1)
				}
			},
			//路由 - 购买积分
			routeBuy:function(){
				uni.navigateTo({
					url:'buy/buy'
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
	padding-bottom: 20rpx;
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
