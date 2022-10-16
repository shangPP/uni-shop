<template>
	<view class="login-container">
		<uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
		<!-- 教学写法 -->
		<!-- <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button> -->
		<!-- 实际写法 -->
		<button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		name: "my-login",
		data() {
			return {

			};
		},
		computed: {
			...mapState('m_user', ['redirectInfo'])
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			// 用户授权之后，获取用户的基本信息
			getUserInfo(e) {
				console.log(e);
				if (e.detail.errMsg === "getUserInfo:fail auth deny") return uni.$showMsg('您取消了登录授权！')

				this.updateUserInfo(e.detail.userInfo)
			},
			// 用户授权之后，获取用户的基本信息
			getUserProfile() {
				uni.getUserProfile({
					desc: "用于完善个人资料",
					success: (res) => {
						// console.log(res);
						this.updateUserInfo(res.userInfo)

						this.getToken(res)
					},
					fail: (res) => {
						return uni.$showMsg('您取消了登录授权！')
					}
				})
			},
			// 调用登录接口，获取永久的token
			async getToken(info) {
				const [err, res] = await uni.login().catch(err => err)

				if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
				// console.log(info);

				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				// 写死的token：Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo
				const {
					data: loginResult
				} = await uni.$http.post('/api/public/v1/users/wxlogin', query)

				loginResult.meta.status = 200
				loginResult.message = {}
				loginResult.message.token =
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
				// console.log(loginResult);
				if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
				this.updateToken(loginResult.message.token)
				this.navigateBack()
			},
			// 跳转回之前保存的页面
			navigateBack() {
				if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					let that = this
					uni.switchTab({
						url: this.redirectInfo.from,
						complete: () => {
							that.updateRedirectInfo(null)
						}
					})
				}
			}

		}
	}
</script>

<style lang="scss">
	.login-container {
		height: 750rpx;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;

		&::after {
			content: " ";
			display: block;
			width: 100%;
			height: 40px;
			background-color: #fff;
			position: absolute;
			bottom: 0;
			left: 0;
			border-radius: 100%;
			transform: translateY(50%);
		}

		.contact-filled {}

		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
