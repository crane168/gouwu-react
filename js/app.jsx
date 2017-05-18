(function (React, ReactDOM, ReactRouter, Reflux, $) {
// 定义全局变量
var BANNER_NUM = 2;
var ITEM_NUM = 33;
// 存储数据
var DATABASE = [];
var processDOM = $('#app .loader-text span');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Redirect = ReactRouter.Redirect;
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.hashHistory;

// 第一步 定义分类页面消息
var TypeAction = Reflux.createActions(['changeType']);
// 第二步 定义分类页面store
var TypeStore = Reflux.createStore({
	// 监听消息
	listenables: [TypeAction],
	// 定义消息监听函数
	onChangeType: function (msg) {
		// 根据msg过滤database中的数据，传递给组件更新视图
		var result = [];
		DATABASE.forEach(function (obj, index) {
			// 判断obj的type类型是否是msg
			if (obj.type === msg) {
				result.push(obj)
			}
		})
		// 更新组件
		this.trigger(result)
		// console.log(123, arguments)
		// 一会用this.trigger更新状态数据
		// this.trigger(msg);
	}
})

// 1 创建消息
var SearchAction = Reflux.createActions(['changeSearch']);
// 2 创建store
var SearchStore = Reflux.createStore({
	// 监听消息
	listenables: [SearchAction],
	// 注册消息
	onChangeSearch: function (query) {
		// console.log(query)
		// 根据query过滤database
		var result = [];
		DATABASE.forEach(function (obj, index) {
			// 判断obj每一个字段是否包含query
			for (var i in obj) {
				// obj[i]表示属性值
				if (obj[i].indexOf(query) >= 0) {
					result.push(obj)
					// 到这里我们已经将任务执行完毕了
					// 停止遍历，并返回
					return;
				}
			}
		})
		// 更新组件
		this.trigger(result)
		// console.log(result)
	}
})

// 渲染首页列表的方法可能被复用，因此我们可以使用混合
var RenderMethod = {
	// 随机获取背景图片的方法
	getBackgroundImageUrl: function () {
		var num = parseInt(Math.random() * ITEM_NUM);
		return 'url(img/item/item' + num + '.jpg)';
	},
	// 创建列表方法
	createList: function () {
		return this.state.data.map(function (obj, index) {
			// 定义背景
			var style = {
				backgroundImage: this.getBackgroundImageUrl()
			}
			return (
				<li key={index} style={style}>
					<a href={obj.site} target="_blank">
						<div className="content">
							<h2>{obj.name}</h2>
						</div>
						<div className="layer">
							<p>{'公司：' + obj.company}</p>
							<p>{'类型：' + obj.type}</p>
							<p>{'描述：' + obj.description}</p>
						</div>
					</a>
				</li>
			)
		}.bind(this))
	}
}

// 定义组件
var Home = React.createClass({
	// 初始化状态数据
	getInitialState: function () {
		return {
			data: DATABASE
		}
	},
	// 使用混合
	mixins: [RenderMethod],
	render: function () {
		return (
			<section className="page">
				<div className="container">
					<ul>{this.createList()}</ul>
				</div>
			</section>
		)
	}
})
// 分类列表组件
var Type = React.createClass({
	// 第三步 绑定状态数据
	mixins: [Reflux.connect(TypeStore, 'data'), RenderMethod],
	// 初始化状态
	getInitialState: function () {
		return {
			data: []
		}
	},
	render: function () {
		return (
			<section className="page">
				<div className="container">
					<ul>{this.createList()}</ul>
				</div>
			</section>
		)
	}
})
// 搜索组件
var Search = React.createClass({
	// 绑定消息
	mixins: [Reflux.connect(SearchStore, 'data'), RenderMethod],
	// 初始化状态
	getInitialState: function () {
		return {
			data: []
		}
	},
	render: function () {
		return (
			<section className="page">
				<div className="container">
					<ul>{this.createList()}</ul>
				</div>
			</section>
		)
	}
})
// 定义header组件
var Header = React.createClass({
	// 第二种条转发方式
	goHome: function () {
		hashHistory.replace('/')
	},
	// 定义搜索事件
	goToSearch: function (e) {
		// 判断按键
		if (e.keyCode === 13){
			// 如果是回车键，跳转
			hashHistory.replace('/search/' + e.target.value)
			// 清空内容
			e.target.value = '';
			// 非约束组件使用ref
			// 约束性组件修改状态
		}
	},
	render: function () {
		return (
			<div className="app-header">
				<header>
					<div className="container">
						<input type="text" className="pull-right" onKeyDown={this.goToSearch}/>
						{/*<a href="#/"><img src="img/logo.png" alt="" className="pull-left"/></a>*/}
						<img src="img/logo.png" alt="" width='120px' height='48px' className="pull-left" onClick={this.goHome}/>
						<ul className="nav nav-pills nav-justified">
							<li>
								<a href="#/type/mall">商城</a>
							</li>
							<li>
								<a href="#/type/dressing">化妆</a>
							</li>
							<li>
								<a href="#/type/clothing">服装</a>
							</li>
							<li>
								<a href="#/type/shoes">鞋子</a>
							</li>
							<li>
								<a href="#/type/bag">箱包</a>
							</li>
							<li>
								<a href="#/type/children">母婴</a>
							</li>
						</ul>
					</div>
				</header>
				<div className="banner banner-2"></div>
			</div>
		)
	}
})
// 定义应用程序组件
var App = React.createClass({
	// 定义触发消息的方法
	sendAction: function () {
		// 根据pathname做判断
		var pathname = this.props.location.pathname;
		// console.log(pathname)
		// 如果是type页面
		if (pathname.indexOf('/type/') === 0){
			// 第四步触发消息
			TypeAction.changeType(this.props.params.id)
		} else {
			// 发送search消息
			SearchAction.changeSearch(this.props.params.id)

		}
	},
	// 创建期发送
	componentDidMount: function() {
		this.sendAction();
	},
	// 存在期发送
	componentDidUpdate: function() {
		this.sendAction();
	},
	render: function () {
		// this.sendAction();
		return (
			<div>
				<Header></Header>
				{/*<Link to="/type/games">分类页面</Link>
				<Link to="/search/hello">搜索页面</Link>*/}
				{/*第一步 定义组件容器 这里组件页面渲染的容器，各个页面渲染在这里*/}
				{this.props.children}
			</div>
		)
	}
})
// 第二步 定义路由
// 定义路由规则
var routes = (
	<Router>
		<Route path="/" component={App}>
			{/*定义子路由组件*/}
			<IndexRoute component={Home}></IndexRoute>
			<Route path="type/:id" component={Type}></Route>
			<Route path="search/:id" component={Search}></Route>
		</Route>
		{/*<ReactRouter.Redirect path="*" to="/" />*/}
	</Router>
)

/**
 * 创建图片加载器
 * @params	图片配置对象
 * @step 	每加载完成一张图片执行的回调函数
 * @success 加载完成执行的回到函数
 * @fail 	图片加载失败时候的回调函数
 ***/ 
var ImageLoaer = function (params, step, success, fail) {
	// 缓存图片数量
	this.bannerNum = params.bannerNum || 0;
	this.itemNum = params.itemNum || 0;
	this.step = step || function () {};
	this.success = success || function () {};
	this.fail = fail || function () {};
	// 初始化应用
	this.init();
}
// 定义原型方法
ImageLoaer.prototype = {
	// 初始化方法Init
	init: function () {
		// 计算总数
		this.total = this.bannerNum + this.itemNum;
		this.bannerTotal = this.bannerNum;
		this.itemTotle = this.itemNum;
		// 加载这些图片
		this.loader();
	},
	// 加载图片方法
	loader: function () {
		// 加载banner图片, 图片id可以是0·
		while(this.bannerNum--) {
			this.loaderImage(this.bannerNum, true)
		}
		// 加载item图片
		while(this.itemNum--) {
			this.loaderImage(this.itemNum)
		}
		// 当值是-1的时候开始加，所以当值是-1的时候还要加回来
		this.bannerNum++;
		this.itemNum++;
	},
	// 根据id，生成banner图片的原始地址
	getBannerUrl: function (num) {
		return 'img/banner/banner' + num + '.jpg';
	},
	getItemUrl: function (num) {
		return 'img/item/item' + num + '.jpg';
	},
	// 根据id，生成item图片的原始地址
	/**
	 * 加载单张图片的方法
	 * @num 		图片的id
	 * @isBanner 	是否是banner图片
	 **/
	loaderImage: function (num, isBanner) {
		// 拼凑地址
		if (isBanner) {
			var url = this.getBannerUrl(num);
		} else {
			var url = this.getItemUrl(num);
		}
		// 加载图片
		var img = new Image();
		// 图片加载成功时候的回调函数
		img.onload = function () {
			this.updateNum(isBanner);
			// 执行step方法
			// 当前加载完成的数目，总数目
			this.step(this.bannerNum + this.itemNum, this.total);
			// 全部加载完成之后要执行success
			this.done();
		}.bind(this)
		// 监听加载失败
		img.onerror = function () {
			this.updateNum(isBanner);
			this.fail(this.bannerNum + this.itemNum, this.total)
			this.done();
		}.bind(this)
		// 加载图片
		img.src = url;
	},
	// 执行成功时候的回调函数
	done: function () {
		if (this.bannerNum + this.itemNum === this.total) {
			this.success(this.total);
		}
	},
	// 加载图片，更新num
	updateNum: function (isBanner) {
		// 如果是banner图片。加bannernum
		if (isBanner) {
			this.bannerNum++;
		} else {
			this.itemNum++;
		}
	}
}

// 异步请求加载数据
$.get('data/sites.json', function (res) {
	// console.log(res)
	// 请求成功保存数据
	if (res && res.errno === 0) {
		DATABASE = res.data;
		// 加载图片
		new ImageLoaer({
			bannerNum: BANNER_NUM,
			itemNum: ITEM_NUM
		}, function (num, total) {
			// 每加载一张图片更新内容 * 100% 保留两位小数
			processDOM.html((num / total * 100).toFixed(2))
		}, function () {
			// 成功时候，将元素删除
			processDOM.html('100.00');
			// setTimeout(function () {
				// 第三步 渲染
				ReactDOM.render(routes, document.getElementById('app'))
			// }, 200)
		})
	}
})

})(window.React, window.ReactDOM, window.ReactRouter, window.Reflux, window.jQuery)