<template>
	<view>
		<!-- 状态栏 -->
		<view class="status" :style="{position:headerPosition}"></view>
		<view class="header" :style="{position:headerPosition}">
			<view class="input-box">
				<input placeholder="默认关键字" placeholder-style="color:#c0c0c0;" @tap="toSearch()" />
				<view class="icon iconfont  icon-search"></view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<view class="category-list">
			<!-- 左侧分类导航 -->
			<scroll-view scroll-y="true" class="left">
				<view class="row" v-for="(category,index) in categoryList" :key="category.id"
					:class="[index==showCategoryIndex?'on':'']" @tap="showCategory(index)">
					<view class="text">
						<view class="block"></view>
						{{category.title}}
					</view>
				</view>

			</scroll-view>
			<!-- 右侧子导航 -->
			<scroll-view scroll-y="true" class="right" @scrolltolower="scrolltolower">
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
							<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon iconfont  icon-shangjiantou"></text>
							<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon iconfont  icon-xiajiantou"></text>
						</view>
					</view>
				</view>
				<view class="goods-list">
					<view class="product-list">
						<view class="product" v-for="(goods) in goodsList" :key="goods.goods_id" @tap="toGoods(goods)">
							<image mode="widthFix" :src="goods.img"></image>
							<view class="content">
								<view class="name">{{goods.name}}</view>
								<view class="info">
									<view class="price">{{goods.price}}</view>
									<view class="slogan">{{goods.slogan}}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="loading-text">{{loadingText}}</view>
				</view>
			</scroll-view>
		</view>
		
			<u-tabbar v-model="current" :list="list" :mid-button="true"></u-tabbar>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				showCategoryIndex: 0,
				headerPosition: "fixed",
				headerTop: '',
				current: 2,
				filterIndex: 0,
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				//菜单
				list: [{
						iconPath: "/static/tabbar/i_home@2x.png",
						selectedIconPath: "/static/tabbar/i_home_fill@2x.png",
						customIcon: false,
						"pagePath": "/pages/home/home",
					},
					{
						iconPath: "/static/tabbar/Search@2x.png",
						selectedIconPath: "/static/tabbar/Search_fill@2x.png",
						customIcon: false,
						"pagePath": "/pages/category/category",
					},
					{
						iconPath: "/static/tabbar/button_float_tap@2x.png",
						selectedIconPath: "/static/tabbar/button_float_tap@2x.png",
						midButton: true,
						customIcon: false,
						"pagePath": "/pages/group-buy/group-buy",
					},
					{
						iconPath: "/static/tabbar/i_Chat@2x.png",
						selectedIconPath: "/static/tabbar/i_Chat_fill@2x.png",
						customIcon: false,
						"pagePath": "/pages/message/message",
					},
					{
						iconPath: "/static/tabbar/Bag@2x.png",
						selectedIconPath: "/static/tabbar/Bag_fill@2x.png",
						customIcon: false,
						"pagePath": "/pages/mine/mine",
					},
				],
				//分类列表
				categoryList: [{
						id: 1,
						title: '家用电器',
						banner: '/static/image/category/banner.jpg',
					},
					{
						id: 2,
						title: '办公用品',
						banner: '/static/image/category/banner.jpg',
					},
					{
						id: 3,
						title: '日常用品',
						banner: '/static/image/category/banner.jpg',
					},
					{
						id: 4,
						title: '蔬菜水果',
						banner: '/static/image/category/banner.jpg',
					}
				],
				goodsList: [{
						goods_id: 0,
						img: '/static/image/goods/p1.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥168',
						slogan: '1235人付款'
					},
					{
						goods_id: 1,
						img: '/static/image/goods/p2.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥168',
						slogan: '1235人付款'
					},
					{
						goods_id: 2,
						img: '/static/image/goods/p3.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥168',
						slogan: '1235人付款'
					},
					{
						goods_id: 3,
						img: '/static/image/goods/p4.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥168',
						slogan: '1235人付款'
					},
					{
						goods_id: 4,
						img: '/static/image/goods/p5.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥168',
						slogan: '1235人付款'
					},
					{
						goods_id: 5,
						img: '/static/image/goods/p6.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥168',
						slogan: '1235人付款'
					},
					{
						goods_id: 6,
						img: '/static/image/goods/p7.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥168',
						slogan: '1235人付款'
					},
					{
						goods_id: 7,
						img: '/static/image/goods/p8.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥168',
						slogan: '1235人付款'
					},
					{
						goods_id: 8,
						img: '/static/image/goods/p9.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥168',
						slogan: '1235人付款'
					},
					{
						goods_id: 9,
						img: '/static/image/goods/p10.jpg',
						name: '商品名称商品名称商品名称商品名称商品名称',
						price: '￥168',
						slogan: '1235人付款'
					}
				],
				loadingText: "正在加载...",
			}
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		onLoad() {
		},
		methods: {
			toGoods(){
				
			},
			//筛选点击
			tabClick(index){
				if(this.filterIndex === index && index !== 2){
					return;
				}
				this.filterIndex = index;
				if(index === 2){
					this.priceOrder = this.priceOrder === 1 ? 2: 1;
				}else{
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				uni.showLoading({
					title: '正在加载'
				})
			},
			scrolltolower(){
				uni.showToast({title: '触发上拉加载'});
				let len = this.goodsList.length;
				if(len>=40){
					this.loadingText="到底了";
					return false;
				}else{
					this.loadingText="正在加载...";
				}
				let end_goods_id = this.goodsList[len-1].goods_id;
				for(let i=1;i<=10;i++){
					let goods_id = end_goods_id+i;
					let p = { goods_id: goods_id, img: '/static/image/goods/p'+(goods_id%10==0?10:goods_id%10)+'.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' };
					this.goodsList.push(p);
				}
			},
			//消息列表
			toMsg() {
				uni.navigateTo({
					url: '../../msg/msg'
				})
			},
			//分类切换显示
			showCategory(index) {
				this.showCategoryIndex = index;
			},
			toCategory(e) {
				uni.setStorageSync('catName', e.name);
				uni.navigateTo({
					url: '../../goods/goods-list/goods-list?cid=' + e.id + '&name=' + e.name
				});
			},
			//搜索跳转
			toSearch() {
				uni.showToast({
					title: "建议跳转到新页面做搜索功能"
				});
			}
		}
	}
</script>
<style lang="scss">
	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */

	}

	.header {
		width: 100%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */

		.addr {
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			font-size: 28upx;

			.icon {
				height: 60upx;
				margin-right: 5upx;
				display: flex;
				align-items: center;
				font-size: 42upx;
				color: #ffc50a;
			}
		}

		.input-box {
			width: 100%;
			height: 60upx;
			background-color: #f5f5f5;
			border-radius: 30upx;
			position: relative;
			display: flex;
			align-items: center;

			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				top: 0;
				right: 0;
				width: 60upx;
				height: 60upx;
				font-size: 34upx;
				color: #c0c0c0;
			}

			input {
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
			}
		}

		.icon-btn {
			width: 60upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;

			.icon {
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42upx;
			}
		}
	}

	.place {

		background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.navbar{
		position: fixed;
		left: 24%;
		display: flex;
		width: 76%;
		height: 80upx;
		background: #fff;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			position: relative;
			&.current{
				color: #532da3;
				&:after{
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
		.cate-item{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;
			&:after{
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
		.p-box{
			display: flex;
			flex-direction: column;
			.yticon{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;
				&.active{
					color: #007AFF;
				}
			}
			.xia{
				transform: scaleY(-1);
			}
		}
	}

	.category-list {
		width: 100%;
		background-color: #fff;
		display: flex;

		.left,
		.right {
			position: absolute;

			top: 100upx;
			/*  #ifdef  APP-PLUS  */
			top: calc(100upx + var(--status-bar-height));
			/*  #endif  */
			bottom: 0upx;
		}

		.left {
			width: 24%;
			left: 0upx;
			background-color: #f2f2f2;

			.row {
				width: 100%;
				height: 90upx;
				display: flex;
				align-items: center;

				.text {
					width: 100%;
					position: relative;
					font-size: 28upx;
					display: flex;
					justify-content: center;
					color: #3c3c3c;

					.block {
						position: absolute;
						width: 0upx;
						left: 0;
					}
				}

				&.on {
					height: 100upx;
					background-color: #fff;

					.text {
						font-size: 30upx;
						font-weight: 600;
						color: #2d2d2d;

						.block {
							width: 10upx;
							height: 80%;
							top: 10%;
							background-color: #f06c7a;
						}
					}
				}
			}
		}

		.right {
			width: 76%;
			left: 24%;

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
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;

					.product {
						display: flex;
						justify-content: flex-start;
						background-color: #fff;
						margin: 0 0 15upx 0;
						padding: 10upx;
						box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);

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
							
							.info {
								position: absolute;
								bottom: 10upx;
								display: flex;
								justify-content: space-between;
								align-items: flex-end;
								width: 92%;
								padding: 10upx 4% 10upx 4%;
							
								.price {
									color: #e65339;
									font-size: 30upx;
									font-weight: 600;
								}
							
								.slogan {
									color: #807c87;
									font-size: 24upx;
								}
							}
						}
						
					}

				}
			}


		}
	}
</style>
