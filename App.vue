<script>
	export default {
		globalData:{
			userInfo:{},
			user:{},
			// #ifdef APP-PLUS
			appid: plus.runtime.appid,  
			version: plus.runtime.version,
			// #endif
		},
		onLaunch: function() {
			// console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";	
	/*每个页面公共css */
	@import "/static/iconfont/font.scss";
	page{
		background-color: #F8F7F7;
	}
	//状态栏高度
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	//提示信息
	.warn_message{
		width: 100%;
		height: 44rpx;
		line-height: 44rpx;
		background: #532da3;
		font-size: 24rpx;
		color: #ffffff;
		padding: 0 16rpx;
		display: flex;
		justify-content: space-between;
	}
	.warn_message_warn{
		background: #AA1212;
	}
	//没有内容
	.no_content{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 20%;
	}
	.no_content image{
		width: 140rpx;
		height: 140rpx;
	}
	.no_content .text_none{
		padding-top: 20rpx;
	}
	.no_content text{
		font-size: 28rpx;
		color: #bfbfbf;
	}
</style>
