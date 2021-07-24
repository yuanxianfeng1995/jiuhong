<template>
	<view class="content">
		<view class="logo">
			<image src="/static/logo.png"></image>
			<view class="logo_name">
				<text>玖红天下</text>
			</view>
		</view>
		<view class="title">
			<view class="welcome">
				<text>欢迎来到玖红天下</text>
			</view>
			<view class="subheading">
				<text>在这里体验不一样的购物浪潮</text>
			</view>
			<view class="login">
				<view class="weixin">
					<image src="../../static/icon/login-weixin.png" @click="login"></image>
				</view>
				<view class="privacy">
					<u-checkbox-group>
						<u-checkbox v-model="checked" shape="circle"></u-checkbox>
					</u-checkbox-group>
					<text @click.stop="routePrivacy">我已阅读并同意《玖红天下用户注册协议》</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				checked:false,
			}
		},
		methods: {
			 // 登录
			login(){
				uni.hideLoading();
				const that=this;
				if( !this.checked ){
					uni.showToast({
						title:'请同意用户协议',
						icon:'none'
					})
					return
				}
				// if(true){
				// 	uni.navigateTo({
				// 		url:'/pages/login/mobile/mobile'
				// 	})
				// 	return;
				// }
				
				//微信登录
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
					app.globalData.wx_authResult = loginRes.authResult
					
				    // 获取用户信息
				    uni.getUserInfo({
				      provider: 'weixin',
				      success: function (infoRes) {
							let userInfo = infoRes.userInfo
							userInfo.headimgurl = userInfo.avatarUrl
							for( let key in userInfo ){
								let newKey = key.toLowerCase()
								if( newKey != key ){
									userInfo[newKey] = userInfo[key]
									delete userInfo[key]
								}
							}
							app.globalData.userInfo = userInfo
							uni.setStorageSync('userInfo', userInfo)
						  console.log('userInfo', userInfo)
							uni.navigateTo({
								url:'/pages/login/mobile/mobile'
							})
				      }
				    });
				  }
				});
			},
			//路由-用户协议
			routePrivacy(){
				// console.log('用户协议')
				uni.navigateTo({
					url:'./privacy/privacy'
				})
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		position: relative;
		height: 100vh;
		background: url(../../static/image/login-bg.png) no-repeat top left;
		background-size: cover;
		padding: 42rpx 34rpx;
	}
	.logo{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: auto;
	}
	.logo image{
		width: 336rpx;
		height: 336rpx;
	}
	.logo_name{
		font-size: 52rpx;
		color: #ffffff;
		padding-top: 40rpx;
	}
	.title{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.welcome{
		color: #FFFFFF;
		font-size: 52rpx;
	}
	.subheading{
		color: #FFFFFF;
		font-size: 32rpx;
		padding-top: 58rpx;
	}
	.weixin{
		margin-top: 58rpx;
	}
	.weixin image{
		width: 680rpx;
		height: 120rpx;
	}
	.privacy{
		margin-top: 42rpx;
		color: #FFFFFF;
		font-size: 24rpx;
		text-align: center;
	}
</style>
