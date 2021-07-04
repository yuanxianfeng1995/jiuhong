<template>
	<view class="contain">
		<view class="content">
			<view class="title">
				<text>{{article.title}}</text>
			</view>
			<view class="date">
				<text>{{article.createTime}}</text>
			</view>
			<view class="detail">
				<u-parse :html="article.content" :tag-style="parseStyle"></u-parse>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail:`这是详情`,
				parseStyle: {
					img: 'display:block;',
				},
				article:{},
			}
		},
		onLoad:function(option){
			console.log(option.id)
			let that = this
			this.$u.api.ptArticle_detail({
				articleId: option.id,
			}).then(res => {
				that.article = res.data
			})
		},
		methods: {
			
		}
	}
</script>

<style>
.content{
	margin: 30rpx;
	border: 12rpx;
	box-shadow: 0px 4rpx 4rpx 0px rgba(214,214,214,0.25); 
	background-color: #FFFFFF;
}
.title{
	font-size: 28rpx;
	color: #000000;
	line-height: 50rpx;
	font-weight: 600;
	padding: 20rpx 30rpx 10rpx;
	text-align: center;
}
.date{
	font-size: 20rpx;
	color: #000000;
	text-align: center;
	padding-bottom: 20rpx;
	border-bottom: 2rpx solid #E8E8E8;
}
.detail{
	padding: 36rpx 20rpx;
}
</style>
