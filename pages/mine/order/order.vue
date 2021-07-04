<template>
	<view class="contain">
		<view class="header">
			<u-tabs :list="list" :is-scroll="false" :current="current" active-color="#532DA3" @change="change"></u-tabs>
		</view>
		<view class="content" v-for="(item,index) in ptOrder_list" :key="index">
			<view class="date">
				<text>{{$u.timeFormat(parseInt(item.createTime), 'yyyy-mm-dd hh:MM:ss')}}</text>
			</view>
			<view class="list">
				<view class="item">
					<view class="line_1">
						<text>订单:{{item.orderNo}}</text>
						<text class="status" v-if="item.status == 1">拼中商品，待发货</text>
						<text class="status" v-else-if="item.status == 2">拼中商品，已发货</text>
						<text class="status" v-else-if="item.status == 3">拼中商品，已收货</text>
					</view>
					<view class="line_2">
						<view class="img">
							<image class="img" :src="item.picture" mode="aspectFill"></image>
							<!-- <view class="history">
								<image class="history_item" :src="ite" mode="aspectFill" v-for="(ite,inde) in item.headUrls" :key="inde"></image>
							</view> -->
						</view>
						<view class="detail">
							<text>{{item.productName}}</text>
							<text class="tag">{{item.productPrice}}积分</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="reach_bottom" v-if="ptOrder_list.length == 0">
				<text>我也是有底线的...</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{
						name: '全部'
					}, 
					{
						name: '待发货'
					}, 
					{
						name: '已发货'
					}, 
					{
						name: '已签收',
						// count: 5
					},
				],
				current: 0,
				ptOrder_list:[],
				ptOrder_receive:[],
				ptOrder_send:[],
				ptOrder_wait:[],
				detail:{},
			}
		},
		onLoad:function(){
			this.get_ptOrder_list()
		},
		methods: {
			//Tab 改变
			change(index) {
				this.current = index;
				console.log(index)
				uni.showLoading({
					title:'加载中'
				})
				if( index == 0 ){
					this.get_ptOrder_list()
				}else if( index == 1 ){
					this.get_ptOrder_wait()
				}else if( index == 2 ){
					this.get_ptOrder_send()
				}else{
					this.get_ptOrder_receive()
				}
			},
			//全部订单
			get_ptOrder_list:function(){
				 let that = this
				 this.$u.api.get_ptOrder_list({
					"current": 0,
					"params": {},
					"size": 100
				 }).then(res => {
					if( res.code == 200 ){
						that.ptOrder_list = res.data.records.map( item => {
							item.picture = ''
							item.headUrls = []
							return item
						})
						that.get_product_detail()
					}
				 })
			},
			//已收货
			get_ptOrder_receive:function(){
				 let that = this
				 this.$u.api.get_ptOrder_receive({
					"current": 0,
					"params": {},
					"size": 100
				 }).then(res => {
					if( res.code == 200 ){
						that.ptOrder_list = res.data.records.map( item => {
							item.picture = ''
							item.headUrls = []
							return item
						})
						that.get_product_detail()
					}
				 })
			},
			//已发货	
			get_ptOrder_send:function(){
				 let that = this
				 this.$u.api.get_ptOrder_send({
					"current": 0,
					"params": {},
					"size": 100
				 }).then(res => {
					if( res.code == 200 ){
						that.ptOrder_list = res.data.records.map( item => {
							item.picture = ''
							item.headUrls = []
							return item
						})
						that.get_product_detail()
					}
				 })
			},
			//待发货	
			get_ptOrder_wait:function(){
				 let that = this
				 this.$u.api.get_ptOrder_wait({
					"current": 0,
					"params": {},
					"size": 100
				 }).then(res => {
					if( res.code == 200 ){
						that.ptOrder_list = res.data.records.map( item => {
							item.picture = ''
							item.headUrls = []
							return item
						})
						that.get_product_detail()
					}
				 })
			},
			//接口 - 商品详情
			get_product_detail:function(productId){
				let that = this
				that.ptOrder_list = that.ptOrder_list.map( item => {
					 that.$u.api.get_product_detail({
						productId:item.productId
					 }).then(res => {
						if( res.code == 200 ){
							item.picture = res.data.picture.split(',')[0]
							item.headUrls = res.data.headUrls
						}
					 })
					return item
				 })
				 uni.hideLoading()
				 console.log( that.ptOrder_list)
			},
		}
	}
</script>

<style>
.date{
	font-size: 26rpx;
	color: #4d4949;
	padding: 30rpx;
	text-align: center;
}
.line_1{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 38rpx;
}
.line_1 text{
	font-size: 28rpx;
	color: #040404;
}
.line_1 .status{
	color: #FF0000;
}
.item{
	padding: 22rpx 34rpx;
	background-color: #FFFFFF;
	margin-bottom: 20rpx;
}
.item .img{
	width: 320rpx;
	height: 192rpx;
	border-radius: 12rpx;
	position: relative;
}
.history{
	position: absolute;
	left: 0;
	bottom: 0;
	width: 320rpx;
	height: 48rpx;
	background: rgba(0,0,0,0.47);
	border-radius: 0px 0px 12rpx 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.history image{
	width: 30rpx;
	height: 30rpx;
	border: 2rpx solid #ffffff;
	border-radius: 50%;
}
.line_2{
	display: flex;
	align-items: stretch;
}
.detail{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding:10rpx 0 10rpx 36rpx;
}
.detail text{
	font-size: 28rpx;
	color: #181725;
	line-height: 36rpx;
}
.detail .tag{
	font-size: 32rpx;
	color: #532da3;
}
.reach_bottom{
	padding: 30rpx;
	color: #999;
	font-size: 28rpx;
	text-align: center;
}
</style>
