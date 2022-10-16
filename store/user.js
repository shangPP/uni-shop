export default {
	namespaced: true,
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}'), //收货地址
		token: uni.getStorageSync('token') || '',
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'), //用户的信息对象
		redirectInfo: null, //存储登录之前的页面信息 {openType,from}
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
		},
		// 修改用户信息
		updateUserInfo(state, userinfo) {
			state.userinfo = userinfo

			this.commit('m_user/saveUserInfoToStorage')
		},
		// 持久化存储用户信息
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
		},
		// 更新token
		updateToken(state, token) {
			state.token = token

			this.commit('m_user/saveTokenToStorage')
		},
		// 持久化存储token
		saveTokenToStorage(state) {
			uni.setStorageSync('token', state.token)
		},
		// 修改登录之前的页面信息对象
		updateRedirectInfo(state, info) {
			state.redirectInfo = info
		}
	},
	getters: {
		// 收货地址
		addstr(state) {
			if (!state.address.provinceName) return ''

			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo
		}
	}
}
