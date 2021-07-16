<template>
	<view>
		<zy-update theme="green" ref="zyupgrade" :h5preview="true" oldversion="1.0.2" :appstoreflag="false"
			:updateurl="update_url"></zy-update>
		<!-- 更新组件 force 是否强制更新 有bug -->
		<app-update ref="app_update" :force="true"></app-update>
		<!-- 状态栏 -->
		<view v-if="showHeader" class="status"
			:style="{ position: headerPosition,top:statusTop,opacity: afterHeaderOpacity}"></view>
		<!-- 顶部导航栏 -->
		<view v-if="showHeader" class="header"
			:style="{ position: headerPosition,top:headerTop,opacity: afterHeaderOpacity }">

			<!-- 搜索框 -->
			<view class="input-box">
				<input placeholder="默认关键字" placeholder-style="color:#c0c0c0;" @tap="toSearch()" />
				<view class="icon iconfont  icon-search"></view>
			</view>
			<!-- 右侧图标按钮 -->
			<view class="icon-btn">
				<view class="icon iconfont  icon-tongzhi1" @tap="toMsg"></view>
			</view>
		</view>
		<!-- 占位 -->
		<view v-if="showHeader" class="place"></view>
		<!-- 轮播图 -->
		<view class="swiper">
			<view class="swiper-box">
				<swiper circular="true" autoplay="true" @change="swiperChange">
					<swiper-item v-for="swiper in swiperList" :key="swiper.id">
						<image :src="swiper.img" @tap="toSwiper(swiper)"></image>
					</swiper-item>
				</swiper>
				<view class="indicator">
					<view class="dots" v-for="(swiper, index) in swiperList"
						:class="[currentSwiper >= index ? 'on' : '']" :key="index"></view>
				</view>
			</view>
		</view>
		<!-- 分类列表 -->
		<view class="category-list">
			<view class="category" v-for="(row, index) in categoryList" :key="index" @tap="toCategory(row)">
				<view class="img">
					<view :class="['icon','iconfont',row.icon]" :style="{'background-color': row.background}"></view>
				</view>
				<view class="text">{{ row.name }}</view>
			</view>
		</view>
		<!-- 通告 -->
		<view class="message">
			<view class="message_icon">
				<image src="/static/icon/trumpet.png"></image>
			</view>
			<u-notice-bar mode="horizontal" type="none" :volume-icon="false" color="#4d4d4d" padding="0rpx 0rpx"
				:list="messageList"></u-notice-bar>
		</view>

		<!-- 广告图 -->
		<view class="banner">
			<image src="/static/image/banner1.jpg"></image>
		</view>

		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="title">
				<text>热卖产品</text>
				<view class="icon iconfont  icon-jiantou" @tap="toProductList()"></view>
			</view>
			<view class="product-list">
				<view class="product" v-for="product in productList" :key="product.goods_id" @tap="toGoods(product)">
					<image mode="widthFix" :src="product.img"></image>
					<view class="name">{{ product.name }}</view>
					<view class="info">
						<view class="price">{{ product.price }}</view>
						<view class="slogan">{{ product.slogan }}</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{ loadingText }}</view>
		</view>
		<u-tabbar v-model="current" :list="list" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import ZyUpdate from '@/components/zy-upgrade/zy-upgrade.vue' //更新插件2
	import appUpdate from "@/components/yzhua006-update/app-update.vue" //更新插件1
	var ttt = 0;
	export default {
		components: {
			ZyUpdate,
			appUpdate,
		},
		mounted() {
			this.$refs.zyupgrade.check_update()
			this.$refs.app_update.update(); //调用子组件 检查更新 有bug
		},
		data() {
			return {
				showHeader: true,
				afterHeaderOpacity: 1, //不透明度
				headerPosition: 'fixed',
				headerTop: null,
				statusTop: null,
				nVueTitle: null,
				currentSwiper: 0,

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
						"pagePath": "/pages/cart/cart",
					},
					{
						iconPath: "/static/tabbar/Bag@2x.png",
						selectedIconPath: "/static/tabbar/Bag_fill@2x.png",
						customIcon: false,
						"pagePath": "/pages/mine/mine",
					},
				],
				current: 1,
				// 轮播图片
				swiperList: [{
						id: 1,
						src: 'url1',
						img: '/static/image/1.jpg'
					},
					{
						id: 2,
						src: 'url2',
						img: '/static/image/2.jpg'
					},
					{
						id: 3,
						src: 'url3',
						img: '/static/image/3.jpg'
					}
				],
				// 分类菜单
				categoryList: [{
						id: 1,
						name: '购物中心',
						icon: 'icon-gouwu',
						url: '/pages/index/index',
						background: '#9e04c5'
					},
					{
						id: 2,
						name: '兑换广场',
						icon: 'icon-duihuan',
						url: '/pages/index/index',
						background: '#4173ce '
					},
					{
						id: 3,
						name: '拼团广场',
						icon: 'icon-pintuangou',
						url: '/pages/index/index',
						background: '#04bdc5'
					},
					{
						id: 4,
						name: '客服中心',
						icon: 'icon-kefuzhongxin',
						url: '/pages/text/contact',
						background: '#9ec504'
					},
				],
				messageList: [
					'寒雨连江夜入吴',
					'平明送客楚山孤',
					'洛阳亲友如相问',
					'一片冰心在玉壶'
				],
				//热门专区列表
				productList: [{
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
				loadingText: '正在加载...',
				update_url: '', // 升级url
			};
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			// this.headerPosition = e.scrollTop>=0?"fixed":"absolute";
			// this.headerTop = e.scrollTop>=0?null:0;
			// this.statusTop = e.scrollTop>=0?null:-this.statusHeight+'px';
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			uni.showToast({
				title: '触发上拉加载'
			});
			let len = this.productList.length;
			if (len >= 40) {
				this.loadingText = '到底了';
				return false;
			}
			// 演示,随机加入商品,生成环境请替换为ajax请求
			let end_goods_id = this.productList[len - 1].goods_id;
			for (let i = 1; i <= 10; i++) {
				let goods_id = end_goods_id + i;
				let p = {
					goods_id: goods_id,
					img: '/static/image/goods/p' + (goods_id % 10 == 0 ? 10 : goods_id % 10) + '.jpg',
					name: '商品名称商品名称商品名称商品名称商品名称',
					price: '￥168',
					slogan: '1235人付款'
				};
				this.productList.push(p);
			}
		},
		onLoad() {
			this.update_url = this.$u.http.config.baseUrl + '/group/ptVersion/update'
			// this.get_banner_list();
			// this.get_notice_list();
			// this.get_product_list();
			// uni.navigateTo({
			// 	url: '/pages/login/login'
			// })
		},
		methods: {
			//轮播图
			get_banner_list: function() {
				let that = this
				this.$u.api.get_banner_list().then(res => {
					console.log(res);
					if (res.code == 200) {
						this.swiperList = res.data
						console.log('轮播图', res.data)
					} else {

					}
				})
			},
			//首页拼团轮播与首页热门专区
			get_product_list: function() {
				let that = this
				this.$u.api.get_product_list({
					current: 1,
					size: 10,
					total: 1
				}).then(res => {
					console.log('llll', res.data);
					if (res.code == 200) {
						that.productList = res.data.records.map(item => {
							item.picture = item.picture.split(',')[0]
							return item
						})
					} else {

					}
				})
			},
			//公告列表
			get_notice_list: function() {
				let that = this
				this.$u.api.get_notice_list({
					current: 0,
					size: 10,
					params: {},
				}).then(res => {
					console.log('消息', res.data);
					if (res.code == 200) {
						res.data.records.map(item => {
							that.messageList.push(item.content)
						})
					} else {

					}
				})
			},
			//消息列表
			toMsg() {
				uni.switchTab({
					url: '../message/message'
				})
			},
			//搜索跳转
			toSearch() {
				uni.showToast({
					title: '建议跳转到新页面做搜索功能'
				});
			},
			//轮播图跳转
			toSwiper(e) {
				uni.showToast({
					title: e.src,
					icon: 'none'
				});
			},
			toProductList() {
				uni.navigateTo({
					url: '/pages/goods/goods-list/goods-list'
				})
			},
			//分类跳转
			toCategory(e) {
				//uni.showToast({title: e.name,icon:"none"});
				uni.setStorageSync('catName', e.name);
				uni.navigateTo({
					url: e.url,
				})
			},
			//推荐商品跳转
			toPromotion(e) {
				uni.showToast({
					title: e.title,
					icon: 'none'
				});
			},
			//商品跳转
			toGoods(e) {
				uni.showToast({
					title: '商品' + e.goods_id,
					icon: 'none'
				});
				uni.navigateTo({
					url: '/pages/goods/goods-list/goods-list'
				})
			},
			//轮播图指示器
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
			}
		}
	};
</script>
<style lang="scss">
	page {
		position: relative;
		background-color: #fff;
	}

	.pullDown-effects {
		position: fixed;
		//top: calc(100upx - 36vw);
		top: 0;
		z-index: 9;
		width: 100%;
		height: 36vw;
		/*  #ifdef  APP-PLUS  */
		padding-top: var(--status-bar-height);

		/*  #endif  */
		image {
			width: 100%;
			height: 36vw;
		}
	}

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
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.icon {
				text-align: right;
				width: 60upx;
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

	.swiper {
		width: 100%;
		margin-top: 10upx;
		display: flex;
		justify-content: center;

		.swiper-box {
			width: 92%;
			height: 30.7vw;

			overflow: hidden;
			border-radius: 15upx;
			box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;

			swiper {
				width: 100%;
				height: 30.7vw;

				swiper-item {
					image {
						width: 100%;
						height: 30.7vw;
					}
				}
			}

			.indicator {
				position: absolute;
				bottom: 20upx;
				left: 20upx;
				background-color: rgba(255, 255, 255, 0.4);
				width: 150upx;
				height: 5upx;
				border-radius: 3upx;
				overflow: hidden;
				display: flex;

				.dots {
					width: 0upx;
					background-color: rgba(255, 255, 255, 1);
					transition: all 0.3s ease-out;

					&.on {
						width: (100%/3);
					}
				}
			}
		}
	}

	.category-list {
		width: 100%;
		padding: 0 4%;
		padding: 0 0 30upx 0;
		border-bottom: solid 2upx #f6f6f6;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.category {
			width: 25%;
			margin-top: 50upx;
			display: flex;
			flex-wrap: wrap;

			.img {
				width: 100%;
				display: flex;
				justify-content: center;

				.icon {
					font-size: 50upx;
					width: 100upx;
					text-align: center;
					line-height: 100upx;
					height: 100upx;
					color: #fff;
					border-radius: 50%;
					background-color: #24dede;
				}
			}

			.text {
				margin-top: 16upx;
				width: 100%;
				display: flex;
				justify-content: center;
				font-size: 24upx;
				color: #3c3c3c;
			}
		}
	}

	.banner {
		width: 100%;

		image {
			width: 100%;
			height: 30vw;
		}
	}

	/**
	 * 滚动消息
	 * -------------------------------------------------------
	 */
	.message {
		padding-left: 40rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 0 20rpx 40rpx;
	}

	.message .message_icon {
		width: 40rpx;
		height: 40rpx;
	}

	.message .message_icon image {
		width: 40rpx;
		height: 40rpx;
		display: block;
	}


	.promotion {
		width: 92%;
		margin: 0 4%;

		.text {
			width: 100%;
			height: 60upx;
			font-size: 34upx;
			font-weight: 600;
			margin-top: -10upx;
		}

		.list {
			width: 100%;
			display: flex;
			justify-content: space-between;

			.column {
				width: 43%;
				padding: 15upx 3%;
				background-color: #ebf9f9;
				border-radius: 10upx;
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.top {
					width: 100%;
					height: 40upx;
					display: flex;
					align-items: center;
					margin-bottom: 5upx;

					.title {
						font-size: 30upx;
					}

					.countdown {
						margin-left: 20upx;
						display: flex;
						height: 40upx;
						display: flex;
						align-items: center;
						font-size: 20upx;

						view {
							height: 30upx;
							background-color: #f06c7a;
							display: flex;
							justify-content: center;
							align-items: center;
							color: #fff;
							border-radius: 4upx;
							margin: 0 4upx;
							padding: 0 2upx;
						}
					}
				}

				.left {
					width: 50%;
					height: 18.86vw;
					display: flex;
					flex-wrap: wrap;
					align-content: space-between;

					.ad {
						margin-top: 5upx;
						width: 100%;
						font-size: 22upx;
						color: #acb0b0;
					}

					.into {
						width: 100%;
						font-size: 24upx;
						color: #aaa;
						margin-bottom: 5upx;
					}
				}

				.right {
					width: 18.86vw;
					height: 18.86vw;

					image {
						width: 18.86vw;
						height: 18.86vw;
					}
				}
			}
		}
	}

	.goods-list {

		// background-color: #f4f4f4;
		.title {
			padding: 0 4%;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80upx;
			color: #030303;
			font-size: 30upx;
			margin-top: 10upx;

			image {
				width: 30upx;
				height: 30upx;
			}
		}

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
				width: 48%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);

				image {
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}

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
</style>
