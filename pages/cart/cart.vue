<template>
	<view class="body" v-if="cart.length!==0">
		<!-- 收货地址组件 -->
		<my-address></my-address>

		<!-- 商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 右侧的文本 -->
			<text class="cart-title-text">购物车</text>
		</view>

		<!-- 渲染购物车中的商品信息 -->
		<uni-swiper-action>
			<block v-for="(goods,i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" :auto-close="false" :show="true"
					@click="swipeItemClickHandler(goods)">
					<my-goods :goods="goods" :showRadio="true" :showNum="true" @radioChange="radioChangeHandler"
						@numChange="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swiper-action>

		<!-- 使用自定义的结算组件 -->
		<my-settle></my-settle>
	</view>

	<view class="empty-cart" v-else>
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip">空空如也</text>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		mixins: [badgeMix],
		computed: {
			...mapState('m_cart', ['cart'])
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#c00000'
					}
				}]
			};
		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			// 修改选中状态
			radioChangeHandler(e) {
				this.updateGoodsState(e)
			},
			// 商品数目变化处理函数
			numberChangeHandler(e) {
				this.updateGoodsCount(e)
			},
			// 滑动删除点击事件
			swipeItemClickHandler(goods) {
				this.removeGoodsById(goods.goods_id)
			},
		}
	}
</script>

<style lang="scss">
	.body {
		background-color: #fff;
		min-height: 100vh;
		padding-bottom: 50px;
	}

	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;

		.cart-title-text {
			font-size: 14px;
		}
	}

	.empty-cart {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;

		.empty-img {
			width: 90px;
			height: 90px;
		}

		.tip {
			font-size: 12px;
			color: gray;
			margin-top: 15px;
		}
	}
</style>
