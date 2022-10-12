<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryObj: {
					query: "", //查询关键词
					cid: "", //商品分类id
					pagenum: 1, //页码
					pagesize: 10 //每页显示数据个数
				}, //请求参数对象
				goodsList: [], //列表数据
				total: 0, //总数量
				isloading: false, //是否正在请求数据（节流阀）
			};
		},
		onLoad(options) {
			this.queryObj.query = options.query || ""
			this.queryObj.cid = options.cid || ""

			this.getGoodsList()
		},
		methods: {
			// 获取商品数据
			async getGoodsList(cb) {
				// 打开节流阀
				this.isloading = true
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 关闭节流阀
				this.isloading = false
				cb && cb()
				if (res.meta.status1 == 200) return uni.$showMag()
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			// 点击跳转
			gotoDetail(goods){
				uni.navigateTo({
					url:"/subpkg/goods_detail/goods_detail?goods_id="+goods.goods_id
				})
			}
		},
		// 下拉加载
		onReachBottom() {
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg("数据加载完毕！")

			if (this.isloading) return
			// 页码值加1
			this.queryObj.pagenum++
			this.getGoodsList()
		},
		// 上拉刷新
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">
.goods-list{
	background-color: #fff;
}
</style>
