<template>
	<view class="contain">
		<view class="header">
			<view class="warn_message" v-if="groupItem.groupNo && !chooseAddress">
				<text>您当前没有添加收货地址，请完善收货地址后再下单</text>
			</view>
		</view>
		<view class="content">
			<view class="address" v-if="groupItem.groupNo">
				<view class="none" v-if="addressList.length == 0 || !chooseAddress" @click="routeAddress">
					<image src="/static/icon/add@2x.png"></image>
					<text>手动添加收货地址</text>
					<u-icon name="arrow-right" size="24"></u-icon>
				</view>
				<view class="address_detail" v-else @click="routeAddress">
					<u-icon name="/static/icon/local@2x.png" size="40"></u-icon>
					<view class="detail_text">
						<text class="name">{{chooseAddress.receiverName}} {{chooseAddress.receiverPhone}}</text>
						<text>{{chooseAddress.receiverProvince}} {{chooseAddress.receiverCity}}{{chooseAddress.receiverArea}} {{chooseAddress.receiverAddress}}</text>
					</view>
					<u-icon name="arrow-right" size="30"></u-icon>
				</view>
			</view>
			<view class="prod_detail">
				<image class="prod_img" :src="detail.picture" mode="aspectFill"></image>
				<view class="detail_text">
					<view class="title">
						<text class="u-line-2">{{detail.pname}}</text>
					</view>
					<view class="price">
						<text>{{detail.ptPrice}}积分</text>
					</view>
					<view class="num">
						<text>数量：1</text>
					</view>
				</view>
			</view>
			<view class="block_item">
				<view class="title">
					<text>说明</text>
				</view>
				<view class="value">
					<text v-if="!groupItem.groupNo">该商品开团需开团券{{detail.coupon}}张</text>
					<text v-else>该商品开团需拼团积分{{detail.ptPrice}}</text>
				</view>
			</view>
			<!-- <view class="block_item">
				<view class="title weight">
					<text>请选择支付方式</text>
				</view>
			</view> -->
			<view class="pay_method" v-if="!groupItem.groupNo">
				<view class="block_item">
					<view class="title">
						<image src="/static/icon/coupon.png"></image>
						<text>开团券</text>
					</view>
					<view class="value value_gray">
						<text>已开启抵扣</text>
					</view>
				</view>
				<view class="coupon_num">
					<text>剩余：{{userInfo.accountAvailableCoupon}}张</text>
					<text class="message">当前最大可抵扣{{detail.coupon}}张</text>
					<u-switch v-model="couponChecked" size="36" active-color="#532DA3" @change="switchChange">
					</u-switch>
				</view>
			</view>
			<view class="pay_method" v-else>
				<view class="block_item">
					<view class="title">
						<image src="/static/icon/integral-icon@2x.png"></image>
						<text>拼团积分</text>
					</view>
					<view class="value value_gray">
						<text>已开启抵扣</text>
					</view>
				</view>
				<view class="coupon_num">
					<text>剩余：{{userInfo.accountAvailableIntegral}}</text>
					<u-switch v-model="couponChecked" size="36" active-color="#532DA3" @change="switchChange">
					</u-switch>
				</view>
			</view>
			<!-- <view class="block_item" v-if="groupItem.groupNo">
				<view class="title">
					<text>抵扣后还需支付</text>
				</view>
				<view class="value">
					<text style="color: #000000;">{{total}}积分（￥{{total}}）</text>
				</view>
			</view> -->
		</view>
		<view class="footer">
			<!-- <view class="warn_message warn_message_warn" v-if="userInfo.account.accountAvailableCoupon > 0 && warn_message_show">
				<text>每次开团之前需参团1次及以上哦~，赶紧先去参团后再来把~</text>
			</view> -->
			<view class="warn_message" v-if="groupItem.groupNo && detail.ptPrice > userInfo.accountAvailableIntegral">
				<text>客官您好，您当前积分不足，暂不可参团。</text>
			</view>
			<view class="handle" v-if="false">
				<text>还需抵开团券1张</text>
				<button class="btn" disabled="true" type="default" v-if="true">立即开团</button>
				<button class="btn open" disabled="true" type="default" v-else>立即开团</button>
			</view>
			<view class="handle" v-else>
				<text>
					<!--还需支付：￥{{total}}-->
				</text>
				<button class="btn open" type="default" @click.stop="wxPay('join')" v-if="groupItem.groupNo">支付</button>
				<button class="btn open" type="default" @click.stop="wxPay('open')" v-else>立即开团</button>
				<u-popup v-model="payResult" mode="center" border-radius="12" width="526rpx" height="690rpx">
					<view class="pay_result">
						<view class="result_top">
							<u-icon name="checkmark-circle" size="60" color="#532DA3"></u-icon>
							<view class="result_text"><text>支付成功</text></view>
							<view class="result_price">
								<text v-if="groupItem.groupNo">积分抵扣 -{{detail.ptPrice}}</text>
								<text v-else>开团券抵扣 -{{detail.coupon}}</text>
							</view>
						</view>
						<view class="result_bottom" style="text-align: center;">
							<text>{{second}}s 进入拼团房间</text>
							<view style="margin-top: 40rpx;" @click="routeHouse(groupItem.groupNo)">立即进入</view>
						</view>
					</view>
				</u-popup>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				couponChecked: true,
				payResult: false,
				detail: {},
				groupItem: {},
				addressList: [],
				chooseAddress: {},
				total: 0,
				second: 3,
				type: 1,
				isOnLoad: true,
			}
		},
		onLoad: function(option) {
			let that = this
			//用户信息
			this.userInfo = uni.getStorageSync('user');
			console.log('用户信息', this.userInfo)

			if (option.type && option.type == 2) { //拼团广场 
				this.type = 2
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.on('groupData', function(data) {
					console.log('获取详情数据222', data)
					that.detail = data.data
					that.detail.picture = data.data.picture ? data.data.picture.split(',')[0] : ''
					that.groupItem = data.data
				})
			} else {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.on('detail', function(data) {
					console.log('获取详情数据', data)
					that.detail = data.data
					that.detail.picture = data.data.picture.split(',')[0]
				})

				eventChannel.on('groupItem', function(data) {
					console.log('获取拼团数据', data)
					that.groupItem = data.data
				})
			}
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('groupData', function(data) {
				console.log('获取详情数据222', data)
				that.detail = data.data
				that.detail.picture = data.data.picture ? data.data.picture.split(',')[0] : ''
				that.groupItem = data.data
			})
			console.log('load')
			this.get_ptAddress_list()
		},
		methods: {
			//进入房间
			routeHouse: function(e) {
				if (this.groupItem && this.groupItem.groupNo) {
					uni.redirectTo({
						url: '/pages/group-buy/group-detail?id=' + this.groupItem.groupNo
					})
				} else {
					uni.switchTab({
						url: '/pages/group-buy/group-buy'
					})
				}
			},
			switchChange() {
				this.couponChecked = true
			},
			/**
			 * 收货地址
			 * */
			//获取收货地址
			get_ptAddress_list: function() {
				let that = this
				this.$u.api.get_ptAddress_list().then(res => {
					console.log(res);
					if (res.code == 0) {
						console.log('地址', res)
						that.addressList = res.data
						if(that.isOnLoad){
							const obj=res.data.find(item=>item.isDefault===1);
							console.log('obj',obj)
							that.chooseAddress=that.groupItem.groupNo&&obj?{
								receiverName: obj.consignee,
								receiverPhone: obj.tel,
								receiverProvince: obj.province,
								receiverCity: obj.city,
								receiverArea: obj.area,
								receiverAddress: obj.address,
							}:null
							console.log('that.chooseAddress',that.chooseAddress)
					    that.isOnLoad=false
						}
					} else {
						that.chooseAddress = null
					}
				})
			},
			//地址管理
			routeAddress: function() {
				let that = this
				uni.navigateTo({
					url: '/pages/mine/address/address?type=choose',
					events: {
						chooseAddressEmit: function(data) {
							that.chooseAddress = data.data||{}
							that.get_ptAddress_list()
							console.log('chooseAddressEmit', that.chooseAddress)
						},
					},
				})
			},
			//微信支付
			wxPay: function(type) {
				console.log('开团类型', type)
				let that = this
				console.log('12312313132')
				if (type == 'join') {
					//拦截收货地址为空
					console.log('收货地址', that.chooseAddress)
					if (!that.chooseAddress) {
						uni.showToast({
							title: '请填写收货地址',
							icon: 'none'
						})
						return
					}
					//拼团
					//积分拦截
					if (that.detail.ptPrice > that.userInfo.accountAvailableIntegral) {
						uni.showModal({
							title: '提示',
							content: '您的积分不足，是否去充值！',
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/mine/wallet/charge-money'
									})
								}
							}
						});
						return
					}
					console.log(this.payResult, '微信支付')

					uni.showLoading({
						title: '拼团中...',
						mask: true
					})
					if (that.groupItem.groupNo) { //拼团
						that.$u.api.joinGroup({
							"groupNo": that.groupItem.groupNo,
							...that.chooseAddress
						}).then(res => {
							if (res.code == 0) {
								that.payResult = true
								let time = setInterval(() => {
									that.second = that.second - 1
									console.log('定时器id', time)
								}, 1000)
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/group-buy/group-detail?id=' + that
											.groupItem.groupNo
									})
									clearInterval(time)
									uni.hideLoading()
								}, 3000)
							} else {
								uni.hideLoading()
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							}
						})
						return
					}
				} else {
					console.log('详情', that.detail)
					if (that.detail.coupon > that.userInfo.accountAvailableCoupon) {
						uni.showToast({
							title: '您当前开团券不足，暂不可开团。',
							icon: 'none'
						})
						return
					}
					/**
					 * 开团
					 * */
					this.$u.api.openGroup({
						"groupProductId": parseInt(that.detail.id),
					}).then(res => {
						if (res.code == 0) {
							that.payResult = true
							let time = setInterval(() => {
								that.second = that.second - 1
								console.log('定时器id', time)
							}, 1000)
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/group-buy/group-buy'
								})
								clearInterval(time)
								uni.hideLoading()
							}, 3000)
						} else {
							uni.hideLoading()
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				}
			},
		}
	}
</script>

<style>
	.address {
		background-color: #FFFFFF;
		margin-top: 24rpx;
		padding: 22rpx 24rpx;
		border-bottom: 2rpx dashed #532DA3;
	}

	.address .none {
		display: flex;
		align-items: center;
	}

	.address .none image {
		width: 40rpx;
		height: 40rpx;
	}

	.address .none text {
		flex: 1;
		padding-left: 32rpx;
		font-size: 24rpx;
		color: #090a0f;
		font-weight: 600;
	}

	.address_detail {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.address_detail .detail_text {
		font-size: 28rpx;
		color: #606060;
		display: flex;
		flex-direction: column;
		padding: 0 32rpx;
	}

	.address_detail .detail_text text {
		padding: 15rpx 0;
	}

	.prod_detail {
		display: flex;
		align-items: stretch;
		padding: 32rpx 28rpx;
		background-color: #FFFFFF;
		margin-top: 20rpx;
	}

	.prod_detail .prod_img {
		width: 320rpx;
		height: 192rpx;
		border-radius: 12rpx;
	}

	.detail_text {
		flex: 1;
		padding-left: 22rpx;
	}

	.detail_text .title {
		font-size: 28rpx;
		color: #181725;
		line-height: 36rpx;
		font-weight: 600;
	}

	.detail_text .price {
		padding-top: 20rpx;
		font-size: 32rpx;
		color: #532da3;
	}

	.detail_text .num {
		padding-top: 18rpx;
		font-size: 28rpx;
		color: #000000;
	}

	.block_item {
		padding: 22rpx 20rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 24rpx;
	}

	.block_item .title {
		font-size: 28rpx;
		color: #000000;
		display: flex;
		align-items: center;
	}

	.block_item .title image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}

	.block_item .weight {
		font-weight: 600;
	}

	.block_item .value {
		color: #ff0000;
	}

	.block_item .value_gray {
		color: #8f8488;
	}

	.coupon_num {
		padding: 0 22rpx 30rpx;
		background-color: #FFFFFF;
		font-size: 26rpx;
		color: #6a6a6a;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.coupon_num .message {
		flex: 1;
		color: #FF0000;
		font-size: 24rpx;
		padding-left: 42rpx;
	}

	.coupon_num .switch {
		width: 66rpx;
		height: 36rpx;
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.footer .handle {
		height: 98rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
	}

	.footer .handle .btn {
		margin: 0;
		padding: 0;
		width: 236rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #c4c4c4;
		border-radius: 12rpx;
	}

	.footer .handle .open {
		background-color: #532DA3;
		color: #FFFFFF;
	}

	.footer .handle .btn::after {
		border: none;
	}

	.pay_result {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 89rpx 30rpx;
		height: 690rpx;
	}

	.result_top {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.result_text,
	.result_price {
		font-size: 32rpx;
		color: #532DA3;
		padding-top: 50rpx;
	}

	.result_price {
		color: #636363;
	}

	.result_bottom text {
		font-size: 32rpx;
		color: #532DA3;
	}
</style>
