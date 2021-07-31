<template>
	<view class="contain">
		<view class="content">
			<view class="list">
				<view class="item">
					<text>当前版本号</text>
					<text>v{{version}}</text>
				</view>
			</view>
			<u-cell-group>
				<u-cell-item title="密码修改"  :border-bottom="false" :title-style="menuListTitleStyle" @click="passwordModification">
					<u-icon name="/static/icon/mmxg.png" slot="icon" size="40" ></u-icon>
				</u-cell-item>
				<u-cell-item title="收款账户维护" :border-bottom="false" :title-style="menuListTitleStyle"  @click="accountMaintenance">
					<u-icon name="/static/icon/zh.png" slot="icon" size="40" ></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="bottom">
			<button class="btn" type="default" @click="exit()">退出登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				version:'127',
				menuListTitleStyle:{
					color:'#000000',
					fontWeight:'600',
					paddingLeft:'20rpx'
				},
			}
		},
		onLoad:function(){
			const that=this
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				that.version = widgetInfo.versionCode
			});  
			// #endif
		},
		methods: {
			exit:function(){
				uni.clearStorage();
				uni.reLaunch({
					url:'/pages/login/login'
				})
			},
			passwordModification(){
				console.log('passwordModification')
				const userInfo=uni.getStorageSync('userInfo')
				console.log('userInfo',userInfo)
				uni.navigateTo({
					url: '/pages/login/verification/verification?mobile='+(userInfo.mobile || '')
				})
			},
			accountMaintenance(){
				console.log('accountMaintenance')
				uni.navigateTo({
					url:'/pages/mine/account-maintenance/account-maintenance'
				})
			}
		}
	}
</script>

<style scoped>
.list{
	margin-top: 28rpx;
}
.item{
	height: 98rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #FFFFFF;
}
.item text{
	font-size: 28rpx;
	color: #000000;
	padding: 30rpx;
}

.bottom{
	position: fixed;
	bottom: 60rpx;
	left: 35rpx;
}
.bottom .btn{
	width: 680rpx;
	height: 120rpx;
	background: #532da3;
	border-radius: 20rpx;
	padding: 0;
	color: #FFFFFF;
	line-height: 120rpx;
}
</style>
