export default {
	namespaced: true,
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含以下6个属性
		// {goods_id, goods_name, goods_price, goods_count,goods_small_logo, goods_state}
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),

	mutations: {
		// 添加商品到购物车
		addToCart(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			if (!findResult) {
				state.cart.push(goods)
			} else {
				findResult.goods_count++
			}
			this.commit('m_cart/saveToStorage')
		},
		// 将购物车里的数据持久化存储本地
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 更新购物车中商品的勾选状态
		updateGoodsState(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_state = goods.goods_state

				this.commit('m_cart/saveToStorage')
			}
		},
		// 更新购物车中商品数量
		updateGoodsCount(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_count = goods.goods_count

				this.commit('m_cart/saveToStorage')
			}
		},
		// 从购物车中删除商品
		removeGoodsById(state, goods_id) {
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)

			this.commit('m_cart/saveToStorage')
		},
		// 更改所有商品的勾选状态
		updateAllGoodsState(state, newState) {
			state.cart.forEach(x => x.goods_state = newState)

			this.commit('m_cart/saveToStorage')
		}
	},

	getters: {
		// 统计购物车中商品的总数量
		total(state) {
			// let c = 0
			// state.cart.forEach(goods => {
			// 	c += goods.goods_count
			// })
			// return c

			return state.cart.reduce((total, item) => total += item.goods_count, 0)
		},
		// 勾选的商品数量
		checkedCount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		// 已勾选的商品总价
		checkedGoodsAmount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price, 0).toFixed(2)
		}
	},
}
