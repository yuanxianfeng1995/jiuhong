<template>
	<view class="contain">
		<view class="header">
			<view class="prod_img_list">
				<u-swiper :list="list" mode="dot" indicator-pos="bottomRight" :height="472" :border-radius="0"></u-swiper>
			</view>
			<view class="title">
				<text>{{detail.pname}}</text>
			</view>
			<view class="tag">
				<view class="tag_left">
					<text class="line_1">{{detail.ptPrice}}积分</text>
					<text class="line_2">拼团价</text>
					<text class="line_3">市场价 ￥{{detail.marketprice}}</text>
				</view>
				<view class="inventory">
					<text>剩余 {{detail.stock}}</text>
				</view>
			</view>
			<view class="history" v-if="detail.memberBaseVos > 0">
				<view class="img_list">
					<template v-for="(item,index) in detail.memberBaseVos">
						<image :src="item.headPortrait" mode="aspectFill" :key="index" v-if="index <= 10"></image>
					</template>
				</view>
				<view class="his_title">
					<text>累计参团{{detail.joinsum}}次</text>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="group">
				<view class="group_msg" v-if="groupDetailVoListLength > 0">
					<view class="title">
						<text>当前{{detail.memberBaseVos ? detail.memberBaseVos.length : 0}}人正在拼团，可直接参与</text>
					</view>
					<!-- <view class="more">
						<text>查看更多</text>
						<u-icon name="arrow-right"></u-icon>
					</view> -->
				</view>
				<view class="group_content">
					<template v-for="(item,index) in detail.memberBaseVos">
						<view class="group_item" :key="index" v-if="index < 10">
								<view class="name">
									<image :src="item.headPortrait" mode=""></image>
									<text>{{item.nickname}}</text>
								</view>
								<view class="handle">
									<view class="time">
										<text>还差{{item.needPeople}}人</text>
										<view class="">
											剩余<u-count-down :timestamp="item.surplusTime" font-size="24" bg-color="none" v-if="item.surplusTime > 0"></u-count-down>
											<text v-else>开团失败</text> 
										</view>
									</view>
									<view class="btn_content">
										<!-- <button class="btn" type="default" size="mini" @click="joinGroup(item)">加入拼团</button> -->
									</view>
								</view>
						</view>
					</template>
				</view>
			</view>
			<view class="detail_content">
				<view class="title">
					<text>商品详情</text>
				</view>
				<view class="detail_parse">
					<!-- <image :src="item" style="width: 100%;" v-for="(item,index) in detail.detailArr" :key="index"></image> -->
					<u-parse :html="detail.productDetail" :tag-style="parseStyle"></u-parse>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="warn_message">
				<template v-if="openAndJoin_num.surplusCreateGroupTotal > 0">
					<text>温馨提示：您今日还可开团{{openAndJoin_num.surplusCreateGroupTotal}}次，参团{{openAndJoin_num.surplusJoinGroupTotal}}次</text>
					<text @click="routeGroupInfo('open')">查看规则</text>
				</template>
				<text v-else>客官您好，今日开团次数已用完，暂不可发起拼团，只可参团。</text>
			</view>
			<view class="footer_handle">
				<view class="explain" v-if="openAndJoin_num.surplusCreateGroupTotal == 0">
					<view class="ask_text">
						<text>如何获取开团券？</text>
					</view>
					<view class="visit_text">
						<text @click="routeGroupInfo('open')">查看详情</text>
					</view>
				</view>
				<view class="btn_content">
					<button class="btn" type="default" size="mini" v-if="openAndJoin_num.surplusCreateGroupTotal > 0" @click="creatGroup()">发起拼团</button>
					<view class=""></view>
					<button :class="['btn','right']" type="default" size="mini" @click.stop="routeBuy">随机参团</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				content: ``,
				parseStyle: {
					img: 'display:block;',
				},
				groupProductId:'',
				detail:{},
				openAndJoin_num:{},
				groupDetailVoListLength: 0
			}
		},
		onLoad:function(option){
			console.log('详情商品id',option.groupProductId)
			// console.log('用户信息',getApp().globalData.user)
			this.groupProductId = option.groupProductId
			this.get_product_detail()
		},
		onShow:function(){
			this.get_openAndJoin_num()
		},
		onHide:function(){
			
		},
		methods: {
			/**
			 * 事件
			 * -----------------------
			 * */
			 //开团
			creatGroup:function(){
				let that = this
				console.log('创建开团',this.detail)
				if( that.openAndJoin_num.surplusCreateGroupTotal <= 0 ){
					uni.showToast({
						title:'客官您好，您当前没有拼团次数，暂不可拼团。',
						icon:'none'
					})
					return
				}
				if( that.detail.stock <= 0 ){
					uni.showToast({
						title:'库存不足',
						icon:'none'
					})
					return
				}
				uni.navigateTo({
					url:'buy',
					success:function(res){
						res.eventChannel.emit('detail', { data: that.detail })
					},
				})
			},
			 //拼团
			joinGroup:function(item){
				let that = this
				if( that.openAndJoin_num.surplusJoinGroupTotal <= 0 ){
					uni.showToast({
						title:'客官您好，您当前没有拼团次数，暂不可拼团。',
						icon:'none'
					})
					return
				}
				if( parseInt(item.surplusTime) <= 0 ){
					uni.showToast({
						title:'当前拼团因人数不足已关闭，请选择其他拼团队伍。',
						icon:'none'
					})
					return
				}
				if( item.needPeople <= 0 ){
					uni.showToast({
						title:'当前拼团已拼满，请选择其他拼团队伍。',
						icon:'none'
					})
					return
				}
				if( that.detail.stock <= 0 ){
					uni.showToast({
						title:'库存不足，暂不可购买',
						icon:'none'
					})
					return
				}
				console.log('创建拼团',this.detail)
				uni.navigateTo({
					url:'buy',
					success:function(res){
						res.eventChannel.emit('detail', { data: that.detail })
						res.eventChannel.emit('groupItem', { data: item })
					},
				})
			},
			/**
			 * 接口请求
			 * --------------------------------------------------
			 * */
			//接口 - 商品详情
			get_product_detail:function(){
				 let that = this
				 this.$u.api.get_product_detail({
					groupProductId:that.groupProductId
				 }).then(res => {
					console.log(res.data);
					if( res.code == 0 ){
						that.detail = res.data
						//商品图片
						let pictureArr = res.data.picture.split(',')
						pictureArr.map( ite => {
							let item = {
								image:ite,
								title:'1'
							}
							that.list = [...that.list,...[item]]
						})
						//详情
						// let content = ``
						// let detailArr =  res.data.detail.split(',')
						// detailArr.map( item => {
						// 	content += '<img src="' +item+ '" />'	
						// })
						// that.content = content
						that.groupDetailVoListLength = res.data.memberBaseVos?res.data.memberBaseVos.length:0
					}else{
						uni.showToast({
							title:'服务器繁忙，请稍后重试',
							icon:'none'
						})
					}
				 })
			},
			// 获取会员每次拼团模式配置 今日可参团 、开团
			get_openAndJoin_num(){
				let id = getApp().globalData.user.id||uni.getStorageSync('user').userId
				this.$u.api.get_openAndJoin_num({
					userId: id
				}).then(res => {
					console.log(res)
					this.openAndJoin_num = res.data
				})
			},
			/**
			 * 路由
			 * ----------------------------
			 * */
			 //拼团券介绍
			routeGroupInfo:function(e){
				uni.navigateTo({
					url:'coupon-info?type=' + e
				})
			},
			//随机拼团
			routeBuy:function(){
				let that = this
				//没有开团券拦截
				// if( that.openAndJoin_num.surplusJoinGroupTotal <= 0 ){
				// 	uni.showToast({
				// 		title:'客官您好，您当前没有拼团次数，暂不可拼团。',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				// if( !that.detail.memberBaseVos||(that.detail.memberBaseVos&&that.detail.memberBaseVos.length == 0) ){
				// 	uni.showToast({
				// 		title:'此商品当前无人开团，暂不可参团，请稍后再试。',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				// if( that.detail.stock <= 0 ){
				// 	uni.showToast({
				// 		title:'库存不足，暂不可购买',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				console.log('创建拼团',that.detail.groupProductId)
				this.$u.api.group_random({
					groupProductId:that.detail.id
				}).then( re => {
					if( re.code == 0 && re.data ){
						uni.navigateTo({
							url:'buy',
							success:function(res){
								res.eventChannel.emit('detail', { data: that.detail })
								res.eventChannel.emit('groupItem', { data: re.data })
							},
						})
					}else{
						uni.showToast({
							title: re.msg,
							icon:'none'
						})
					}
				})
			},
		}
	}
</script>

<style scoped>
.header{
	background-color: #FFFFFF;
}
.header .title{
	padding: 20rpx;
	font-size: 28rpx;
	font-weight: bold;
	color: #181725;
	line-height: 36rpx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	border-bottom: 2rpx solid #F8F7F7;
}
.tag{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx 40rpx 42rpx 20rpx;
	border-bottom: 2rpx solid #F8F7F7;
}
.tag_left text{
	margin-right: 16rpx;
}
.tag_left .line_1{
	font-size: 32rpx;
	color: #532da3;
	font-weight: 600;
}
.tag_left .line_2{
	font-size: 28rpx;
	color: #532da3;
}
.tag_left .line_3{
	font-size: 24rpx;
	color: #8f8f8f;
	text-decoration: line-through;
}
.inventory text{
	font-size: 28rpx;
	color: #000000;
}
.history{
	padding: 40rpx 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.history .img_list{
	display: flex;
	align-items: center;
}
.img_list image{
	width: 40rpx;
	height: 40rpx;
	opacity: 1;
	border: 2rpx solid #532da3;
	border-radius: 152rpx;
	box-shadow: 0px 4rpx 4rpx 0px rgba(0,0,0,0.40); 
	margin-right: 2rpx;
}
.his_title{
	font-size: 24rpx;
	color: #828282;
}
.group{
	border-top: 12rpx solid #F8F7F7;
	background-color: #FFFFFF;
}
.group_msg{
	padding: 12rpx 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 2rpx solid #F8F7F7;
}
.group_msg .title{
	font-size: 24rpx;
	color: #000000;
}
.group_msg .more text{
	font-size: 28rpx;
	color: #8f8f8f;
}
.group_item{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 22rpx;
	border-bottom: 2rpx solid #F8F7F7;
}
.group_item .name{
	display: flex;
	align-items: center;
}
.group_item .name text{
	padding-left: 32rpx;
	font-size: 24rpx;
	color: #000000;
}
.group_item .name image{
	width: 80rpx;
	height: 80rpx;
	border: 2rpx solid #532da3;
	border-radius: 152rpx;
}
.group_item .handle{
	display: flex;
	align-items: center;
}
.handle .time{
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	font-size: 24rpx;
	line-height: 36rpx;
	color: #000000;
}
.handle .btn_content{
	padding-left: 42rpx;
}
.handle .btn_content .btn{
	width: 136rpx;
	height: 52rpx;
	line-height: 52rpx;
	background: #532da3;
	border-radius: 12rpx;
	color: #FFFFFF;
	font-weight: 600;
	padding: 0;
}
.detail_content{
	border-top: 12rpx solid #f8f7f7;
	background-color: #FFFFFF;
}
.detail_content .title{
	padding: 12rpx 20rpx;
	font-size: 32rpx;
	color: #000000;
	text-align: center;
}
.footer{
	position: sticky;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 200rpx;
	background-color: #FFFFFF;
}
.warn_message{
	height: 44rpx;
	line-height: 44rpx;
	background: #532da3;
	font-size: 24rpx;
	color: #ffffff;
	padding: 0 16rpx;
}
.footer_handle{
	height: 156rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16rpx;
}
.explain .ask_text{
	font-size: 24rpx;
	color: #ff0009;
	line-height: 46rpx;
}
.explain .visit_text{
	font-size: 24rpx;
	color: #532da3;
}
.footer_handle .btn_content{
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.footer_handle .btn_content .btn{
	width: 304rpx;
	height: 80rpx;
	line-height: 80rpx;
	background: #532da3;
	border-radius: 40rpx;
	padding: 0;
	margin: 0;
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: 600;
}
.footer_handle .btn_content .forbidden{
	background: #999;
}
</style>
