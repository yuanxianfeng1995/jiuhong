<template>
	<view>
		<view class="navbar" :style="{position:headerPosition,top:headerTop}">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				综合排序
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				销量优先
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}"
						class="yticon iconfont  icon-shangjiantou"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}"
						class="yticon iconfont  icon-xiajiantou"></text>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="(goods) in goodsList" :key="goods.goods_id" @tap="toGoods(goods)">
					<image mode="widthFix" :src="goods.img"></image>
					<view class="content">
						<view class="name">{{goods.name}}</view>
						<view class="price">{{goods.price}}</view>
						<view class="info">
							<view class="freight">{{goods.freight}}</view>
							<view class="slogan">{{goods.slogan}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList: [{
						goods_id: 0,
						img: '/static/image/goods/p1.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						freight: '免运费',
						price: '￥20',
						slogan: '1235人付款'
					},
					{
						goods_id: 1,
						img: '/static/image/goods/p2.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						freight: '免运费',
						price: '￥20',
						slogan: '1235人付款'
					},
					{
						goods_id: 2,
						img: '/static/image/goods/p3.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						freight: '免运费',
						price: '￥20',
						slogan: '1235人付款'
					},
					{
						goods_id: 3,
						img: '/static/image/goods/p4.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						freight: '免运费',
						price: '￥20',
						slogan: '1235人付款'
					},
					{
						goods_id: 4,
						img: '/static/image/goods/p5.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥20',
						slogan: '1235人付款'
					},
					{
						goods_id: 5,
						img: '/static/image/goods/p6.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥20',
						slogan: '1235人付款'
					},
					{
						goods_id: 6,
						img: '/static/image/goods/p7.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥20',
						slogan: '1235人付款'
					},
					{
						goods_id: 7,
						img: '/static/image/goods/p8.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥20',
						slogan: '1235人付款'
					},
					{
						goods_id: 8,
						img: '/static/image/goods/p9.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥20',
						slogan: '1235人付款'
					},
					{
						goods_id: 9,
						img: '/static/image/goods/p10.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥20',
						slogan: '1235人付款'
					}
				],
				loadingText: "正在加载...",
				headerTop: "0px",
				headerPosition: "fixed",
				current: 2,
				filterIndex: 0,
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				orderbyList: [{
						text: "销量",
						selected: true,
						orderbyicon: false,
						orderby: 0
					},
					{
						text: "价格",
						selected: false,
						orderbyicon: ['sheng', 'jiang'],
						orderby: 0
					},
					{
						text: "好评",
						selected: false,
						orderbyicon: false,
						orderby: 0
					}
				],
				orderby: "sheng"
			};
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.cid); //打印出上个页面传递的参数。
			uni.setNavigationBarTitle({
				title: option.name
			});

			//兼容H5下排序栏位置
			// #ifdef H5
			//定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
			let Timer = setInterval(() => {
				let uniHead = document.getElementsByTagName('uni-page-head');
				if (uniHead.length > 0) {
					this.headerTop = uniHead[0].offsetHeight + 'px';
					clearInterval(Timer); //清除定时器
				}
			}, 1);
			// #endif
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(() => {
				this.reload();
				uni.stopPullDownRefresh();
			}, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			let len = this.goodsList.length;
			if (len >= 10) {
				this.loadingText = "到底了";
				return false;
			} else {
				this.loadingText = "正在加载...";
			}
			let end_goods_id = this.goodsList[len - 1].goods_id;
			for (let i = 1; i <= 10; i++) {
				let goods_id = end_goods_id + i;
				let p = {
					goods_id: goods_id,
					img: '/static/image/goods/p' + (goods_id % 10 == 0 ? 10 : goods_id % 10) + '.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '￥20',
					slogan: '1235人付款'
				};
				this.goodsList.push(p);
			}
		},
		methods: {
			reload() {
				console.log("reload");
				let tmpArr = []
				this.goodsList = [];
				let end_goods_id = 0;
				for (let i = 1; i <= 10; i++) {
					let goods_id = end_goods_id + i;
					let p = {
						goods_id: goods_id,
						img: '/static/image/goods/p' + (goods_id % 10 == 0 ? 10 : goods_id % 10) + '.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥20',
						slogan: '1235人付款'
					};
					this.goodsList.push(p);
				}
			},
			//商品跳转
			toGoods(e) {
				uni.showToast({
					title: '正在开发中',
					icon: "none"
				});
				// uni.navigateTo({
				// 	url: '../goods'
				// });
			},
			//筛选点击
			tabClick(index) {
				if (this.filterIndex === index && index !== 2) {
					return;
				}
				this.filterIndex = index;
				if (index === 2) {
					this.priceOrder = this.priceOrder === 1 ? 2 : 1;
				} else {
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				// uni.showLoading({
				// 	title: '正在加载'
				// })
			},
		}

	}
</script>

<style lang="scss">
	.icon {
		font-size: 26upx;
	}

	.navbar {
		position: fixed;
		display: flex;
		width: 100%;
		height: 90upx;
		background: #fff;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			position: relative;

			&.current {
				color: #532da3;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid #532da3;
				}
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: #007AFF;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}
	}

	.place {

		background-color: #ffffff;
		height: 90upx;
		margin-bottom: 20upx;
	}

	.goods-list {
		.loading-text {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}

		.product-list {
			width: 100%;
			padding: 0 4% 3vw 4%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.product {
				width: 95%;
				display: flex;
				justify-content: flex-start;
				background-color: #fff;
				margin: 0 auto 15upx auto;
				padding: 10upx;

				image {
					width: 50%;
					border-radius: 20upx 20upx 0 0;
				}

				.content{
					position: relative;
					.name {
						width: 92%;
						padding: 10upx 4%;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						text-align: justify;
						overflow: hidden;
						font-size: 30upx;
					}
					.price {
						color: #e65339;
						font-size: 30upx;
						margin-top: 20upx;
						margin-left: 4%;
						font-weight: 600;
					}
					.info {
						position: absolute;
						bottom: 10upx;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						width: 92%;
						padding: 10upx 4% 10upx 4%;
						color: #807c87;
						font-size: 24upx;
					}
				}
			}

		}
	}
</style>
