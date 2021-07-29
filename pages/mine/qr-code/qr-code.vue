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
				imgUrl:'',
			}
		},
		onReady:function(){
			const userInfo=uni.getStorageSync('userInfo')
			uni.showLoading({
			    title: '生成中'
			});
			let token = uni.getStorageSync('token')

		this.$u.api.get_share_img().then(res => {
			console.log('res.data',res.data)
			
			var context = uni.createCanvasContext('my_qr')
			context.drawImage(res.data, 0, 0, 347, 567) 
			context.setFontSize(20)
			context.fillStyle = '#FFFFFF'
			context.fillText('ID:'+userInfo.id,125,280)
			// context.Color='#FFFFFF';
			context.draw()
			setTimeout(function () {
			    uni.hideLoading();
			}, 1500);
		})
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

<style scoped>
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
.header{
	font-size: 18px;
	margin-bottom: 20rpx;
}
</style>
