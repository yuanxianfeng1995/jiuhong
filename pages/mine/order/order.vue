<template>
	<view class="contain">
		<view class="header">
			<u-tabs :list="list" :is-scroll="false" :current="current" active-color="#532DA3" @change="change"></u-tabs>
		</view>
		<view class="content" v-for="(item,index) in ptOrder_list" :key="index">
			<view class="list">
				<view class="item">
					<view class="date">
						<text>时间:{{item.createtime}}</text>
					</view>
					<text class="title">订单:{{item.orderNo}}</text>
					<view class="line_1">
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
		<u-loadmore :status="loadingStatus" />
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
				page: 1,
				pageSize: 20,
				loadingStatus: 'loadmore',
			}
		},
		onReachBottom() {
			let len = this.ptOrder_list.length;
			if (len < this.pageSize * this.page) {
				this.loadingStatusTab1 = 'nomore'
				return false;
			}
			this.page++
			this.get_ptOrder_list()
		},
		onLoad:function(){
			this.get_ptOrder_list()
		},
		methods: {
			//Tab 改变
			change(index) {
				this.current = index;
				console.log('index',index)
				console.log(index)
				uni.showLoading({
					title:'加载中'
				})
				this.ptOrder_list=[]
				this.get_ptOrder_list(index)
			},
			//全部订单
			get_ptOrder_list:function(status){ //1待发 2已发 3签收
				 let that = this
				 that.$u.api.get_ptOrder_list({
					"page": that.page,
					"status": status===0?'':status,
					"pageSize": that.pageSize
				 }).then(res => {
					if( res.code == 0 ){
						if (res.data) that.ptOrder_list.push(...res.data)
						that.loadingStatus = res.data.length < that.pageSize * that.page ? 'nomore' :
							'loadmore'
					}
				 })
			},
		}
	}
</script>

<style scoped>
	.content{
		margin-top: 30rpx;
	}
.date{
	font-size: 26rpx;
	color: #4d4949;
	padding: 0 0 20rpx 0;
}
.line_1{
	padding: 20rpx 0;
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
.u-load-more-wrap{
	margin-top: 20rpx!important;
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
