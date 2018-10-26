(function (window, Vue, Undefined) {
	new Vue({
		el: '#app',
		data: {
			// 数据是在localStorage里面存储的
			// 拿出来的时是个json格式字符串 
			// 使用 JSON.parse
			dataList: JSON.parse(window.localStorage.getItem('dataList')) || [],
			newTodo: '',
			beforeUpdate: {},
			activeBtn: 1,
			showArr: []
		},
		// 监听
		watch: {
			// 
			dataList: {
				handler(newArr) {
					window.localStorage.setItem('dataList', JSON.stringify(newArr))
					// 如果当前是 #/completed
					// 判断 dataList 里面有没有 isFinish 为 true 的数据
					// 如果没有切换到 #/


					// 当数组改变时 重新调用 hashchange
					this.hashchange();

				},
				deep: true
			}
		},
		computed: {
			activeNum() {
				return this.dataList.filter(item => !item.isFinish).length;
			},
			toggleAll: {
				get() {
					// 使用数组方法 every 判断 todo 是否全部完成 isFinish全部为true返回true
					return this.dataList.every(item => item.isFinish);
				},
				set(v) {
					// 触发了改变的行为
					// 将数组元素中每一个isFinish的值设置为 v(改变后的值)
					console.log(v);
					this.dataList.forEach(item => item.isFinish = v);
				}
			}
		},
		// 自定义focus指令
		directives: {
			focus: {
				inserted(el) {
					el.focus();
				}
			}
		},
		methods: {
			// 添加一个todo
			addItem() {
				// 判断内容不能为空
				if(!this.newTodo.trim()) {
					return;
				}
				// 组装一个对象将对象添加到数组中
				this.dataList.push({
					content: this.newTodo.trim(),
					isFinish: false,
					id: this.dataList.length ? this.dataList.sort((a, b) => a.id - b.id)[this.dataList.length - 1]['id'] + 1 : 1
				})
				this.newTodo = ''
			},
			// 删除一个todo
			delItem(index) {
				this.dataList.splice(index, 1);
			},
			// 删除所有 完成的 toddo
			delAllItem() {
				this.dataList = this.dataList.filter(item => !item.isFinish);
			},
			// 让当前li添加 editing类名
			showEdit(index) {
				// 保存之前的信息(直接赋值是地址指向的时通过一个对象,
				// 所以要将其转化为json字符串再将json字符串转为对象实现深拷贝)
				this.beforeUpdate = JSON.parse(JSON.stringify(this.dataList[index]));
				// 先清除所有li的editing类名
				this.$refs.show.forEach(item => item.classList.remove('editing'));
				// 给当前双击的li添加editing类名
				this.$refs.show[index].classList.add('editing');
			},
			// 编辑事件
			updateTodo(index) {
				// 判断是否为空 如果为空删除todo 
				if(!this.dataList[index].content.trim()) return this.dataList.splice(index, 1);
				// 判断如果之前的信息与现在的信息不一样 将其设置为未完成
				if(this.dataList[index].content !== this.beforeUpdate.content) this.dataList[index].isFinish = false;
				// 回车时清除当里的editing类名
				this.$refs.show[index].classList.remove('editing');
				// 将beforeUpdate还原
				this.beforeUpdate = {};
			},
			// 后退还原
			backTodo(index) {
				// 按esc键 将beforeUpdate中的内容 赋值给当前的todo
				this.dataList[index].content = this.beforeUpdate.content;
				// 回车时清除当里的editing类名
				this.$refs.show[index].classList.remove('editing');
				// 将beforeUpdate还原
				this.beforeUpdate = {};
			},
			// hashchange 事件
			hashchange() {
				switch (window.location.hash) {
					case '':
					case '#/':
						this.activeBtn = 1;
						this.showAll();
						break;
					case '#/active':
						this.activeBtn = 2;
						this.showBool(false);
						break;
					case '#/completed':
						this.activeBtn = 3;
						this.showBool(true);
						break;
				}
			},
			// 创建一个显示所有的数组
			showAll() {
				this.showArr = this.dataList.map(() => true);
				console.log(this.showArr);
			},
			showBool(bool) {
				this.showArr = this.dataList.map(item => item.isFinish === bool);
				// 判断是否有为 bool 的todo 如果没有将hash设置为 #/
				if(this.dataList.every(item => item.isFinish !== bool)) window.location.hash = '#/';
			}
		},
		// 生命周期
		// Vue实例创建之后
		created() {
			this.hashchange()
			window.onhashchange = () => {
				// hash改变时也要触发
				this.hashchange()
			}
		}
	});

})(window, Vue);
