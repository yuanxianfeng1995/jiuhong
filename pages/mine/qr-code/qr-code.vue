<template>
	<view class="contain">
		<canvas style="width: 682rpx; height: 1134rpx;" canvas-id="my_qr" id="my_qr"></canvas>
		<button class="submit" type="default" @click="download_erweima()">保存到相册</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl:''
			}
		},
		onReady:function(){
			uni.showLoading({
			    title: '生成中'
			});
			let token = uni.getStorageSync('token')
			//生产环境
			let imgUrl = this.$u.http.config.baseUrl + '/user/ptFans/erweima.jpg?Authorization=Bearer' + token
			//测试环境
			// let imgUrl = 'http://47.108.39.183:8083/user/ptFans/erweima.jpg?Authorization=BearereyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxODc5ODgwODU2OCIsImNyZWF0ZWQiOjE2MjE0MzM3NDAyNDQsImV4cCI6MTc0MTQzMzc0MH0.ksN3ilscjcRclwXHfXC5rMEAVirT50Qxzc9u5hZiTaLlZk8mwahJfUuvc5bonnXFhJYr69k9gaWVLgh10M3KpQ'
			
			var context = uni.createCanvasContext('my_qr')
			context.drawImage('/static/image/share@2x.png', 0, 0, 341, 567)
			context.drawImage(imgUrl, 88, 201, 164, 164) 
			context.draw()
			setTimeout(function () {
			    uni.hideLoading();
			}, 1500);
		},
		methods: {
			download_erweima:function(){
				 let that = this
				 uni.canvasToTempFilePath({
				   x: 0,
				   y: 0,
				   width: 341,
				   height: 567,
				   destWidth: 341,
				   destHeight: 567,
				   canvasId: 'my_qr',
				   success: function(res) {
				     // 在H5平台下，tempFilePath 为 base64
				     // console.log(res.tempFilePath)
					 let tempFilePath = res.tempFilePath
					 uni.saveImageToPhotosAlbum({
						 filePath: tempFilePath,
						 success: function (res) {
							 uni.showToast({
							 	title:'保存成功'
							 })
						 },fail(res) {
						 	uni.showToast({
						 		title:'保存失败，请稍后重试',
								icon:'none'
						 	})
						 }
					 });
				   } 
				 })
			},
		}
	}
</script>

<style>
.contain{
	padding: 30rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
}
.contain .submit{
	width: 680rpx;
	height: 120rpx;
	background: #532da3;
	border-radius: 20rpx;
	padding: 0;
	line-height: 120rpx;
	color: #FFFFFF;
	margin-top: 84rpx;
}
</style>
