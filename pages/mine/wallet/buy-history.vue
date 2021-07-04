<template>
	<view class="contain">
		<view class="content">
			<view class="list">
				<view class="item">
					<text>2021-04-23</text>
					<text class="status">审核中</text>
				</view>
				<view class="item">
					<text>2021-04-23</text>
					<text class="status">已拒绝</text>
				</view>
				<view class="item">
					<text>2021-04-23</text>
					<text>-200</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.list{
	background-color: #FFFFFF;
	margin-top: 24rpx;
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
</style>
