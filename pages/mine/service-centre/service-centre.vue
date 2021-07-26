<template>
	<view class="agent-info">
		<u-card title="服务中心信息">
				<view class="" slot="body" margin="20rpx">
					<view v-if="data">
						<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0 item">
							<view class="u-body-item-title u-line-2">服务中心名称： {{data.servicename}}</view>
						</view>
						<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0 item">
							<view class="u-body-item-title u-line-2">累计收益： {{data.sumprofit}}</view>
						</view>
						<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0 item">
							<view class="u-body-item-title u-line-2">收益比例： {{data.rate}}</view>
						</view>
						<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0 item">
							<view class="u-body-item-title u-line-2">加入日期： {{data.createtime}}</view>
						</view>
					</view>
					<view v-else class="no-info">
						您暂时还不是服务中心
					</view>
					
				</view>
			</u-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: null
			}
		},
		onReady:function(){
			this.getMemberAgent()
		},
		methods:{
			getMemberAgent(){
				const that=this
				this.$u.api.getMemberServiceInfo().then(res => {
					if( res.code == 0 ){
						that.data = res.data
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.agent-info{
		.item{
			width: 100%;
			text-align: center;
			
			.u-body-item-title{
				padding: 20rpx 0;
			}
		}
		.no-info{
			text-align: center;
		}
	}
</style>
