<template>
	<view>
		<view class="search-box">
			<uni-search-bar @input="input" :radius="100" cancelButton="none" :focus="true"></uni-search-bar>
		</view>

		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>

		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item,i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				kw: "", //搜索关键词
				searchResults: [], //搜索结果列表
				historyList: ['a', 'b', 'c'], // 搜索历史的数组
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		computed: {
			// 优先显示最新历史
			histories() {
				return [...this.historyList].reverse()
			}
		},
		methods: {
			// input输入事件
			input(e) {
				// console.log(e);
				this.timer && clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					// console.log(e);
					this.kw = e
					this.getSearchList()
				}, 500)
			},
			// 获取搜索数据
			async getSearchList() {
				// 判断搜索关键词是否为空
				if (this.kw.length === 0) {
					this.searchResults = []
					return
				}
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})
				if (res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message

				this.saveSearchHistory()
			},
			// 点击跳转详情
			gotoDetail(item) {
				// console.log(item);
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			// 保存历史搜索记录
			saveSearchHistory() {
				// this.historyList.push(this.kw)
				// 去重并改变顺序
				const set = new Set(this.historyList)
				set.delete(this.kw)
				set.add(this.kw)

				this.historyList = Array.from(set)
				// 搜索历史进行持久化存储
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			// 清空搜索关键词
			clean(){
				this.historyList=[]
				uni.setStorageSync('kw','[]')
			},
			// 点击搜索历史跳转到页面
			gotoGoodsList(kw){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?query='+kw
				})
			}
		}
	}
</script>

<style lang="scss">
	.uni-searchbar {
		background-color: #c00000;
	}

	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;

			.goods-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			height: 40px;
			align-items: center;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-right: 5px;
				margin-top: 5px;
			}
		}
	}
</style>
