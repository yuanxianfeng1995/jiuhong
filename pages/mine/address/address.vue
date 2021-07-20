<template>
	<view class="contain">
		<view class="content">
			<u-radio-group v-model="radioValue" size="40">
				<view class="item" v-for="(item,index) in addressList" :key="index">
					<view class="line_1" @click="chooseAddress(item)">
						<u-icon name="/static/icon/local@2x.png" size="40"></u-icon>
						<view class="item_detail">
							<text>{{item.consignee}} {{item.tel}}</text>
							<text>{{item.province}} {{item.city}} {{item.area}} {{item.address}}</text>
						</view>
						<u-icon name="/static/icon/sure@2x.png" size="40" v-if="false"></u-icon>
					</view>
					<view class="line_2">
						<u-radio :name="item.id" icon-size="28" label-size="28" active-color="#000000" @change="radioGroupChange(item)">设为默认</u-radio>
						<view class="btn">
							<text @click="edit(item)">修改</text>
							<text @click="deleteAddress(item)">删除</text>
						</view>
					</view>
				</view>
			</u-radio-group>
			<view class="no_content" v-if="addressList.length == 0">
				<image src="../../../static/no-content/content-none.png"></image>
				<view class="text_none">
					<text>还没有地址哦，赶快去添加吧...</text>
				</view>
			</view>
		</view>
		<view class="footer">
			<button class="btn" type="default" @click="add()">新增收货地址</button>
		</view>
		<u-popup v-model="formShow" mode="center" border-radius="12" width="632" :closeable="true">
			<view class="form_content">
				<view class="title">
					<text>{{formTitle}}收货地址</text>
				</view>
				<view class="form">
					<u-form :model="form" ref="uForm" label-width="130">
						<u-form-item label="收货人"><u-input v-model="form.consignee" /></u-form-item>
						<u-form-item label="手机号"><u-input v-model="form.tel" :maxlength="11" /></u-form-item>
						<u-form-item label="地区">
							<view class="right" @click="regionShow = true">
								<text>{{form.province ? form.province + form.city + form.area : '请选择'}}</text>
								<u-icon name="arrow-right" size="26"></u-icon>
							</view>
						</u-form-item>
						<u-form-item label="详细地址"><u-input v-model="form.address" /></u-form-item>
						<button class="form_btn" @click="submit">保存</button>
					</u-form>
				</view>
			</view>
		</u-popup>
		<u-picker mode="region" v-model="regionShow" :safe-area-inset-bottom="true" @confirm="regionChange"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				radioValue:'',
				formShow:false,
				form:{
					consignee:'',
					tel:'',
					address:'',
					province:'',
					city:'',
					area:'',
				},
				regionShow:false,
				addressList:[],
				//是否是选择
				chooseRadio:false,
				formTitle:'添加',
				
			}
		},
		onLoad:function(option){
			if(option && option.type){
				this.chooseRadio = true
			}
			this.get_ptAddress_list()
		},
		//监听返回按钮
		onBackPress:function(){
			//如用户删掉所有地址，返回清空上一页选择
			if( this.addressList.length == 0 ){
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('chooseAddressEmit', {data: {}});
			}
		},
		methods: {
			//列表
			get_ptAddress_list:function(){
				 let that = this
				 this.$u.api.get_ptAddress_list().then(res => {
					console.log(res);
					if( res.code == 0 ){
						console.log('地址',res)
						that.addressList = res.data
						res.data.map( (item,index) => {
							if( item.isDefault == 1 ){ //是默认地址
								that.radioValue = item.id
							}
						})
					}else{
						
					}
				 })
			},
			//新增
			add:function(){
				this.formTitle = '添加'
				this.form = {
					consignee:'',
					tel:'',
					address:'',
					province:'',
					city:'',
					area:'',
				}
				this.formShow = true
			},
			//删除
			deleteAddress:function(value){
				let that = this
				this.$u.api.delete_ptAddress({
					addressId:value.id
				}).then(res => {
					if( res.code == 0 ){
						uni.showToast({
							title:'删除成功'
						})
						that.get_ptAddress_list()
					}
				})
			},
			//修改
			edit:function(value){
				console.log(value)
				this.formTitle = '编辑'
				this.form = value
				this.formShow = true
			},
			//设置默认
			radioGroupChange:function(value){
				// console.log('value',value)
				let form = value
				let that = this
				this.$u.api.default_ptAddress(form).then(res => {
					if( res.code == 0 ){
						that.get_ptAddress_list()
						uni.showToast({
							title:'设置成功'
						})
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
			},
			//表单提交
			submit:function(type){
				console.log('form数据',this.form)
				let formData = this.form
				//表单验证
				if( !formData.consignee ){
					uni.showToast({
						title:'请填写姓名',
						icon:'none'
					})
					return
				}
				if( !formData.tel || formData.tel.length != 11 ){
					uni.showToast({
						title:'请检查手机号',
						icon:'none'
					})
					return
				}
				if( !formData.province || !formData.area || !formData.city ){
					uni.showToast({
						title:'请选择省市区',
						icon:'none'
					})
					return
				}
				if( !formData.address ){
					uni.showToast({
						title:'请填写详细地址',
						icon:'none'
					})
					return
				}
				let that = this
				if( this.formTitle == '编辑' ){
					this.$u.api.edit_ptAddress(this.form).then(res => {
						if( res.code == 0 ){
							uni.showToast({
								title:'修改成功'
							})
							that.formShow = false
							that.get_ptAddress_list()
						}else{
							uni.showToast({
								title:'修改失败，请稍后重试',
								icon:'none'
							})
						}
					})
				}else{
					this.addAddress(this.form)
				}
			},
			//接口 - 新增
			addAddress:function(form){
				let that = this
				this.$u.api.add_ptAddress(form).then(res => {
					if( res.code == 0 ){
						that.get_ptAddress_list()
						uni.showToast({
							title:'操作成功'
						})
						that.formShow = false
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
			},
			//省市区改变
			regionChange:function(e){
				 // console.log(e)
				 this.form.province = e.province.label
				 this.form.city = e.city.label
				 this.form.area = e.area.label
			},
			//事件 - 选择地址
			chooseAddress:function(item){
				 console.log(item)
				 if( this.chooseRadio ){
					 const eventChannel = this.getOpenerEventChannel()
					 eventChannel.emit('chooseAddressEmit', {data: {
						 "receiverAddress": item.address,
						 "receiverArea": item.area,
						 "receiverCity": item.city,
						 "receiverName": item.consignee,
						 "receiverPhone": item.tel,
						 "receiverProvince": item.province,
						 "addressId": item.id,
					 }});
					 uni.navigateBack({
					 	delta:1
					 })
				 }
			},
		}
	}
</script>

<style>
.content{
	padding-bottom: 160rpx;
}
.item{
	padding: 14rpx 24rpx;
	background-color: #FFFFFF;
	margin-top: 20rpx;
	width: 750rpx;
}
.line_1{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.item_detail{
	flex: 1;
	font-size: 28rpx;
	color: #000000;
	padding: 0 32rpx;
	display: flex;
	flex-direction: column;
}
.item_detail text{
	padding: 15rpx 0;
}
.line_2{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 54rpx;
	padding-bottom: 14rpx;
}
.line_2 .btn text{
	margin: 0 22rpx;
}
.footer{
	position: fixed;
	bottom: 30rpx;
	left: 0;
	width: 100%;
	text-align: center;
}
.footer .btn{
	width: 578rpx;
	height: 100rpx;
	background: #532da3;
	border-radius: 12rpx;
	box-shadow: -2rpx 0px 2rpx 0px rgba(0,0,0,0.10); 
	color: #FFFFFF;
}
.form_content .title{
	font-size: 32rpx;
	color: #000000;
	padding: 32rpx;
	text-align: center;
	border-bottom: 2rpx solid #f9f9f9;
}
.form_content .right{
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #747272;
	font-size: 32rpx;
}
.form_content .form{
	padding: 0 32rpx 32rpx;
}
.form_btn{
	width: 578rpx;
	height: 100rpx;
	background: #532da3;
	border-radius: 12rpx;
	color: #FFFFFF;
	padding: 0;
	margin-top: 50rpx;
}
</style>
