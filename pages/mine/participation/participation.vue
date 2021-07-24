<template>
	<view class="contain">
		<view class="header">
			<view class="price">
				<view class="left">
					<u-icon name="/static/icon/mine-data-icon3@2x.png" size="60"></u-icon>
					<text>{{user.accountShareBonus}}</text>
				</view>
				<view class="menu_btn">
					<button class="btn" type="default" size="mini" @click="routeBuyBalance">转到余额</button>
					<button class="btn" type="default" size="mini" @click="routeBuyAlipay">转到拼团积分</button>
				</view>
			</view>
			<view class="menu">
				<text>当前可用分红{{user.accountShareBonus}}，累计获得分红{{user.accountTotalShareBonus}}，冻结部分{{user.accountFreezeShareBonus}}</text>
			</view>
		</view>
		<view class="content">
			<!-- <view class="title">
				<text>规则说明</text>
			</view> -->
			<view class="tag">
				<view :class="['tag_item',tagCurrent==0 ? 'tag_active' : '']" @click="tagChange(0)">
					<text>获得记录</text>
					<view :class="['tag_line',tagCurrent==0 ? 'tag_line_active' : '']"></view>
				</view>
				<view :class="['tag_item',tagCurrent==1 ? 'tag_active' : '']" @click="tagChange(1)">
					<text>使用记录</text>
					<view :class="['tag_line',tagCurrent==1 ? 'tag_line_active' : '']"></view>
				</view>
			</view>
			<view class="list">
				<view class="item" v-for="(item,index) in ptUserAccountBonusRecord" :key="index">
					<text>{{item.createtime}} {{item.memo}}</text>
					<text v-if="tagCurrent == 0">+{{item.amount}}</text>
					<text v-else>{{item.amount}}</text>
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
				current:1,
				user:{},
				ptUserAccountBonus:{},
				ptUserAccountBonusRecord:[],
				reachBottomOpen:true,
				loadmoreShow:false,
			}
		},
		onLoad:function(){
			this.user = uni.getStorageSync('user');
			this.ptUserAccount_bonusRecord(0)
		},
		onReachBottom:function(){
			if( this.reachBottomOpen ){
				this.current = this.current + 1
				if( this.tagCurrent == 1 ){
					this.ptUserAccount_bonusRecord(0)
				}else{
					this.ptUserAccount_bonusRecord(1)
				}
			}

		},
		onShow() {
			this.get_userCenter()
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
			//分红记录
			ptUserAccount_bonusRecord:function(type){
				let that = this
				this.$u.api.ptUserAccount_bonusRecord({
					size: that.current,
					optype: type,
					pageSize: 30
				}).then(res => {
					if( res.code == 0 ){
						that.ptUserAccountBonusRecord = [...that.ptUserAccountBonusRecord,...res.data]
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
				this.ptUserAccountBonusRecord = []
				if( index == 0 ){
					this.ptUserAccount_bonusRecord(0)
				}else{
					this.ptUserAccount_bonusRecord(1)
				}
			},
			//路由 - 购买余额
			routeBuyBalance:function(){
				let that = this
				if( that.user.accountShareBonus <= 0 ){
					this.$u.toast('当前可用分红不足');
					return
				}
				uni.showModal({
				    title: '提示',
				    content: '您正在将' + that.user.accountShareBonus + '分红转为余额操作',
				    success: function (res) {
				        if (res.confirm) {
				      console.log('用户点击确定',that.user);
							that.$u.api.bonus_balance({
								"bonus": that.user.accountShareBonus,
								"remark": "",
								"userId": that.user.userId
							}).then(res => {
								if( res.code == 0 ){
									uni.showToast({
										title:'操作成功'
									})
									that.ptUserAccount_bonus()
									that.get_userCenter()
									that.tagCurrent = 1
									that.current = 0
									that.ptUserAccount_bonusRecord(1)
								}else{
									that.$u.toast(res.msg)
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			//路由 - 支付宝购买
			routeBuyAlipay:function(){
				let that = this
				if( that.user.accountShareBonus <= 0 ){
					this.$u.toast('当前可用分红不足');
					return
				}
				uni.showModal({
				    title: '提示',
				    content: '您正在将' + that.user.accountShareBonus + '分红转为积分操作',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							that.$u.api.bonus_integral({
									"bonus": that.user.accountShareBonus,
									"remark": "",
									"userId": that.user.userId
							}).then(res => {
								if( res.code == 200 ){
									uni.showToast({
										title:'操作成功'
									})
									that.ptUserAccount_bonus()
									that.get_userCenter()
									that.tagCurrent = 1
									that.current = 0
									that.ptUserAccount_bonusRecord(1)
								}else{
									that.$u.toast(res.msg)
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
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
.price{
	display: flex;
	align-items: center;
	justify-content: space-between;
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
	padding:  0 40rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.list .item text{
	font-size: 28rpx;
	color: #000000; 
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
