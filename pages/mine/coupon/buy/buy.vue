<template>
	<view class="contain">
		<view class="content">
			<view class="role">
				<view class="role_title">
					<text>您当前可以投入分红的开团券数量为：{{user.accountAvailableCoupon}}</text>
				</view>
				<u-radio-group v-model="value" active-color="#532DA3" @change="radioChange">
					<view class="role_item" v-for="(item,index) in shareBonusNumArr" :key="index">
						<text>投入{{item.couponnum}}张开团券，累计分红{{item.maxprofit}}积分出局</text>
						<u-radio :name="index"></u-radio>
					</view>
				</u-radio-group>
			</view>
			<!-- <view class="warn">
				<text>查看规则</text>
			</view> -->
		</view>
		<view class="bottom">
			<button class="btn" type="default" @click="submit()">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: 0,
				shareBonusNumArr: [],
				regionShow: false,
				qualifications: true, //兑换分红资格
			}
		},
		onLoad: function() {
			this.user = uni.getStorageSync('user');
			this.shareBonusNum()
		},
		methods: {
			regionChange: function(e) {
				this.form.accounttype = e[0].value
				this.form.accounttypeName = e[0].label
			},
			radioChange: function(e) {
				console.log('选择', e)
				this.value = e

				console.log('可用开团券', this.user.accountAvailableCoupon)
				console.log('分红列表', this.shareBonusNumArr)
				if (this.user.accountAvailableCoupon < this.shareBonusNumArr[e].couponnum) {
					uni.showToast({
						title: '当前开团券不足,无法购买',
						icon: 'none'
					})
					return
				}
			},
			//提交
			submit: function() {
				console.log(this.value)
				let that = this
				if (this.user.accountAvailableCoupon < this.shareBonusNumArr[this.value].couponnum) {
					uni.showToast({
						title: '当前开团券不足,无法购买',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '转换中'
				})
				this.$u.api.bonusProduct({
					bounsLevelId: that.shareBonusNumArr[that.value].id
				}).then(res => {
					if (res.code == 0) {
						uni.hideLoading()
						uni.showToast({
							title: '投入成功',
							mask: true
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1000)
					} else {
						uni.hideLoading()
						uni.showToast({
							title: '投入失败，请稍后重试',
							icon: 'none'
						})
					}
				})
			},
			//当前分红产品份数
			shareBonusNum: function(type) {
				let that = this
				this.$u.api.shareBonusNum().then(res => {
					if (res.code == 0) {
						that.shareBonusNumArr = res.data
					}
				})
			},
		}
	}
</script>

<style>
	.role {
		margin-bottom: 20rpx;
	}

	.role_title {
		padding: 30rpx 26rpx;
		color: #000000;
		font-size: 28rpx;
	}

	.role_item {
		width: 750rpx;
		height: 82rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #000000;
		font-size: 28rpx;
		padding: 0 26rpx;
		background-color: #FFFFFF;
	}

	.warn {
		padding: 20rpx;
		color: #999;
	}

	.bottom {
		position: fixed;
		bottom: 60rpx;
		left: 35rpx;
	}

	.bottom .btn {
		width: 680rpx;
		height: 120rpx;
		background: #532da3;
		border-radius: 20rpx;
		padding: 0;
		color: #FFFFFF;
		line-height: 120rpx;
	}
</style>
