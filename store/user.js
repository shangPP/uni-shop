export default {
	namespaced: true,
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}'), //收货地址
	}),
	mutations: {
		// 更新收货地址的方法
		updateAddress(state, address) {
			state.address = address

			this.commit('m_user/saveAddressToStorage')
		},
		// 持久化存储地址
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		}
	},
	getters: {
		// 收货地址
		addstr(state) {
			if (!state.address.provinceName) return ''
			
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	}
}
