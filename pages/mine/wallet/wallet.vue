<template>
	<view class="contain">
		<view class="header">
			<view class="price">
				<text>￥{{account.accountAvailableAmount.toFixed(2)}}</text>
			</view>
			<view class="menu">
				<view></view>
				<!-- <view class="" style="width: 200rpx;">
					<text>钱包累计余额</text>
					<text>{{account.accountAmount.toFixed(2)}}</text>
				</view> -->
				<view class="menu_btn">
					<button class="btn" type="default" size="mini" @click="routeIntegral">购买拼团积分</button>
					<button class="btn" type="default" size="mini" @click="routeChargeMoney">充值</button>
					<button class="btn" type="default" size="mini" @click="routewithdraw">提现</button>
				</view>
			</view>
		</view>
		<view class="content">
			<!-- <view class="title">
				<text>规则说明</text>
			</view> -->
			<!-- <view class="tag">
				<view :class="['tag_item',tabCurrent == 0 ? 'tag_active' : '']" @click="rabChange(0)">
					<text>提现记录</text>
					<view :class="['tag_line', tabCurrent == 0 ? 'tag_line_active' : '']"></view>
				</view>
				<view :class="['tag_item',tabCurrent == 1 ? 'tag_active' : '']" @click="rabChange(1)">
					<text>充值记录</text>
					<view :class="['tag_line', tabCurrent == 1 ? 'tag_line_active' : '']"></view>
				</view>
			</view> -->
			<view class="list">
				<view class="item">
					<text>日期时间</text>
					<text>操作说明</text>
					<text>交易金额</text>
					<text>结余金额</text>
				</view>
				<view class="item" v-for="(item,index) in cashList_arr" :key="index" v-if="tabCurrent == 0">
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
				cashList_arr:[],
				tabCurrent:0,
				loadmoreShow:false,
				account:'',
				//分页
				current: 1,
				reachBottem: true,
			}
		},
		onLoad:function(option){
			this.account = uni.getStorageSync('user')
			console.log('this.account',this.account)
		},
		onShow() {
			this.cashList_arr=[]
			this.chargeList()
			this.get_userCenter()
		},
		onReachBottom:function(){
			console.log('到底了',)
			if(this.reachBottem ){
				this.current ++
				this.chargeList()
				// if( this.tagCurrent == 0 ){
				// 	this.chargeList(0)
				// }else{
				// 	this.chargeList(1)
				// }
			}
		},
		onNavigationBarButtonTap:function(e){
			// console.log(e)
			uni.navigateTo({
				url:'buy-history'
			})
		},
		methods: {
			//我的信息
			get_userCenter:function(){
				 let that = this
				 this.$u.api.get_userCenter().then(res => {
					if( res.code == 0 ){
						this.account = res.data
						console.log('get_userCenter this.account',this.account)
					}
				 })
			},
			//tab改变
			rabChange:function(e){
				this.tabCurrent = e
				this.cashList_arr = []
				this.current = 1
				if( e == 0 ){
					this.chargeList(0)
				}else{
					this.chargeList(1)
				}
			},
			chargeList:function(optype){ // optype:(0-收入，1-支出)
				let that = this
				this.$u.api.get_member_amount_logs({ 
					size: that.current,
					optype: optype,
					pageSize: 20
				}).then(res=>{
					if( res.code == 0 ){
						that.cashList_arr = [...that.cashList_arr,...res.data]
						if( res.data.length < 20 ){
							that.reachBottem = false
						}
						if( res.data.length == 0 ){
							that.loadmoreShow = true
						}else{
							that.loadmoreShow = false
						}
					}
				})
			},
			//路由 - 购买积分
			routeIntegral:function(){
				uni.navigateTo({
					url:'/pages/mine/wallet/buy-integral?amount=' + this.account.accountAvailableAmount
				})
			},
			//路由- 充值
			routeChargeMoney:function(){
				// if(true){
				// 	uni.showToast({
				// 		title: '暂未开放',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				uni.navigateTo({
					url:"charge-money"
				})
			},
			//路由 - 提现
			routewithdraw:function(){
				// if(true){
				// 	uni.showToast({
				// 		title: '暂未开放',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				uni.navigateTo({
					url:'withdraw-deposit?amount=' + this.account.accountAvailableAmount
				})
			}
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
	flex: 2;
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
</style>
