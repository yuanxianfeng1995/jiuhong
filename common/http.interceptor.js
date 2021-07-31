// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token变量
const install = (Vue, vm, bon) => {
	// 此为自定义配置参数，具体参数见上方说明
	if (!bon) {
		Vue.prototype.$u.http.setConfig({
			//baseUrl: 'http://47.106.123.165:8813', //测试环境
			baseUrl: 'http://apisss.jiuhongtianxia.com', //生产环境 (这里、版本更新、二维码获取的统一地址)
			loadingTime: 800,
		});
	}
	
	let time=null

	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		// 引用token
		// 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的
		// 所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
		//uni.setStorageSync('token',null);
		const token = uni.getStorageSync('token');
		config.header.Authorization = token?'Bearer '+token:null;
		//console.log('config.header.Authorization',config.header.Authorization)
		// const urls=[];
		const urls = ['/member/regist', '/member/wxLogin', '/sms/sendCode'] //白名单
		if (!urls.includes(config.url)) {

			/**
			 * 开发
			 * --------------------------------------------------------------------------
			 * */
			/**
			 * 生产环境打开 - 未登录跳转
			 * ------------------------------------------------------------------------
			 * */
			if(time) return;
			if(!token || config.header.Authorization.length < 6 ){
				console.log('跳转1')
				vm.$u.route('/pages/login/login') 
				time=true
				return
			}

		}

		// 可以对某个url进行特别处理，此url参数为this.$u.get(url)中的url值
		// if(config.url == '/user/ptUser/smsLogin') config.header.noToken = true;
		// 最后需要将config进行return
		return config;
		// 如果return一个false值，则会取消本次请求
		// if(config.url == '/user/rest') return false; // 取消某次请求
	}

	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		// console.log('接口拦截', res,res.code)
		if (res.code == 1002||res.code == 3002) {
			// 假设201为token失效，这里跳转登录
			vm.$u.toast('登录信息已失效，请重新登录');
			if(time) return;
			time=setTimeout(() => {
				console.log('跳转2')
				// 此为uView的方法，详见路由相关文档
				vm.$u.route('/pages/login/login')
			}, 1500)
			return res;
		} else {
			// 如果返回false，则会调用Promise的reject回调，
			// 并将进入this.$u.post(url).then().catch(res=>{})的catch回调中，res为服务端的返回值
			// vm.$u.route('/pages/login/login') //测试
			return res;
		}
		return res;
	}
}

export default {
	install
}
