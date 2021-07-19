// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	const url='/web'
	//const url=''
	/** 
	 * 用户管理
	 * --------------------------------------------------------------------
	 * */
	let get_wxOpenAccount = (params = {}) => vm.$u.get('/user/ptUser/wxOpenAccount', params); //获取开放平台账号信息
	let get_smsLogin = (params = {}) => vm.$u.get(url+'/sms/sendCode', params);	//获取短信验证码
	let regist = (params = {}) => vm.$u.post(url+'/member/regist', params);	//注册
	let wxLogin = (params = {}) => vm.$u.post(url+'/member/wxLogin', params);	//登录
	/** 
	 * 拼团
	 * --------------------------------------------------------------------------
	 * */
	 
	 let get_member_total = (params = {}) => vm.$u.get(url+'/member/getMemberTotal', params);	//首页会员总数
	let get_headportrait = (params = {}) => vm.$u.get(url+'/member/getLastList', params);	//首页头像与拼团人数
	let get_openAndJoin_num = (params = {}) => vm.$u.get(url+'/member/getMemberDailyModelData', params);

	let get_product_list = (params = {}) => vm.$u.get(url+'/group/getGroupProjectList', params);	//首页热门专区
	let get_product_detail = (params = {}) => vm.$u.get(url+'/group/getGroupProductDetail', params);	//商品详情
	//let get_openAndJoin_num = (params = {}) => vm.$u.get('/group/ptGroupRecord/day/openAndJoin/num', params);	//今日可参团数量
	let openGroup = (params = {}) => vm.$u.post(url+'/group/ktSubmit', params);	//开团
	let joinGroup = (params = {}) => vm.$u.post('/group/ptGroupRecord/joinGroup', params);	//加团
	let group_square = (params = {}) => vm.$u.get(url+'/group/getGroupBuyList', params);	//拼团广场
	let get_group_time_config = (params = {}) => vm.$u.get(url+'/group/getGroupTimeConfig', params); //倒计时
	let group_participate = (params = {}) => vm.$u.get(url+'/group/getMemberGroupBuyList', params);	//我参与的
	let group_pt_successList = (params = {}) => vm.$u.get(url+'/group/getPtSuccessList', params);	//拼团成功列表
	let group_random = (params = {}) => vm.$u.post(url+'/group/randomJoin', params);	//创建拼团
	let openGroup_fail = (params = {}) => vm.$u.post('/group/ptGroupRecord/openGroup/failure', params);	//开团失败
	let openGroup_success = (params = {}) => vm.$u.post('/group/ptGroupRecord/openGroup/success', params);	//开团成功
	let ptGroupRecord_view = (params = {}) => vm.$u.get('/group/ptGroupRecord/view', params);	//查询团信息
	let group_banner = (params = {}) => vm.$u.get('/group/ptGroupRecord/group/square/shuffling', params);	//拼团广场轮播团
	let ptGroupRecord_staticData = (params = {}) => vm.$u.get('/group/ptGroupRecord/staticData', params);	//我参与的上面的数字统计
	/** 
	 * banner
	 * --------------------------------------------------------------------------
	 * */
	let get_banner_list = (params = {}) => vm.$u.get('/banner/list', params);	//banner
	/** 
	 * 消息中心
	 * --------------------------------------------------------------------------
	 * */
	let get_notice_list = (params = {}) => vm.$u.get(url+'/notice/getNoticeList', params);	//公告列表
	let get_message_list = (params = {}) => vm.$u.get(url+'/notice/getNoticeList', params);	//消息列表
	let set_message_readed = (params = {}) => vm.$u.get('/sys/message/read', params);	//消息设置为已读
	//地址管理 -----------------------------------------------------------------------------
	let get_ptAddress_list = (params = {}) => vm.$u.post('/user/ptAddress/list', params);	//地址列表
	let add_ptAddress =  (params = {}) => vm.$u.post('/user/ptAddress/add', params);	//新增地址
	let edit_ptAddress =  (params = {}) => vm.$u.post('/user/ptAddress/edit', params);	//编辑地址
	let default_ptAddress =  (params = {}) => vm.$u.post('/user/ptAddress/' + params.id);	//设置默认
	let delete_ptAddress =  (params = {}) => vm.$u.delete('/user/ptAddress/' + params.id);	//删除
	//用户中心 ---------------------------------------
	let get_userCenter = (params = {}) => vm.$u.get(url+'/member/getMemberAccountDetail', params);	//个人中心信息	
	let get_userCenter_integral = (params = {}) => vm.$u.get('/user/ptUserAccount/integral/record', params);	//积分记录	
	let get_ptOrder_list = (params = {}) => vm.$u.post('/group/ptOrder/list', params);	//全部订单	
	let get_ptOrder_receive = (params = {}) => vm.$u.post('/group/ptOrder/receive', params);	//已收货		
	let get_ptOrder_send = (params = {}) => vm.$u.post('/group/ptOrder/send', params);	//已发货		
	let get_ptOrder_wait = (params = {}) => vm.$u.post('/group/ptOrder/wait', params);	//待发货	
	let ptUserAccount_bonus = (params = {}) => vm.$u.get('/user/ptUserAccount/bonus', params);	//当前可用分红累计分红冻结分红
	let ptUserAccount_bonusRecord = (params = {}) => vm.$u.get('/user/ptUserAccount/bonusRecord', params);	//分红记录
	let bonus_balance = (params = {}) => vm.$u.get('/user/ptUserAccount/bonus/balance', params);	//分红转余额
	let bonus_integral = (params = {}) => vm.$u.get('/user/ptUserAccount/bonus/integral', params);	//分红转积分
	let couponList = (params = {}) => vm.$u.get('/user/ptUserAccount/couponList', params);	//券记录
	let shareBonusNum = (params = {}) => vm.$u.get('/user/ptUserAccount/shareBonusNum', params);	//当前分红产品份数
	let currenthold = (params = {}) => vm.$u.get('/user/ptUserAccount/currenthold', params);	//当前持有分红产品份数
	let bonusProduct = (params = {}) => vm.$u.post('/user/ptUserAccount/bonusProduct?id=' + params.id, params);	//投入分红产品
	//粉丝管理
	let get_ptFans_list = (params = {}) => vm.$u.get('/user/ptFans/list', params);	//粉丝列表
	let get_erweima = (params = {}) => vm.$u.get('/user/ptFans/erweima.jpg', params);	//获取二维码
	let get_ptFans_count = (params = {}) => vm.$u.get('/user/ptFans/count', params);	//我的粉丝数
	let add_ptFans = (params = {}) => vm.$u.post('/user/ptFans/add', params);	//锁粉
	//文章管理
	let ptArticle_list =  (params = {}) => vm.$u.get(url+'/article/getArticleList', params);	//文章列表
	let ptArticle_detail =  (params = {}) => vm.$u.get(url+'/article/getArticleDetail', params);	//文章列表
	//充值 - 支付
	let appPrePay =  (params = {}) => vm.$u.post('/WxPay/appPrePay', params);	//充值
	let cashMoney =  (params = {}) => vm.$u.post('/WxPay/cash', params);	//提现
	let chargeList =  (params = {}) => vm.$u.post('/WxPay/chargeList', params);	//充值记录
	let cashList =  (params = {}) => vm.$u.post('/WxPay/cashList', params);	//提现记录
	let balanceBuy =  (params = {}) => vm.$u.post('/user/ptUserAccount/balanceBuy', params, { "Content-Type": "application/x-www-form-urlencoded" });	//余额购买
	let integralToBalance =  (params = {}) => vm.$u.get('/user/ptUserAccount/integralToBalance', params);	//积分转余额
	//版本号
	let getVersionApp =  (params = {}) => vm.$u.get(' /group/ptVersion/update', params);	//积分转余额
	
	
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		getVersionApp,
		integralToBalance,
		currenthold,
		bonusProduct,
		shareBonusNum,
		couponList,
		balanceBuy,
		get_wxOpenAccount, 
		get_smsLogin,
		regist,
		wxLogin,
		get_member_total,
		get_headportrait,
		get_product_list,
		get_product_detail,
		get_banner_list,
		get_notice_list,
		get_message_list,
		set_message_readed,
		get_ptAddress_list,
		add_ptAddress,
		edit_ptAddress,
		default_ptAddress,
		delete_ptAddress,
		get_userCenter,
		get_ptFans_list,
		get_erweima,
		get_openAndJoin_num,
		openGroup,
		joinGroup,
		ptArticle_list,
		ptArticle_detail,
		appPrePay,
		cashMoney,
		chargeList,
		cashList,
		group_square,
		get_group_time_config,
		group_participate,
		group_pt_successList,
		group_random,
		openGroup_fail,
		openGroup_success,
		ptGroupRecord_view,
		group_banner,
		get_ptFans_count,
		add_ptFans,
		get_userCenter_integral,
		get_ptOrder_list,
		get_ptOrder_receive,
		get_ptOrder_send,
		get_ptOrder_wait,
		ptUserAccount_bonus,
		ptUserAccount_bonusRecord,
		bonus_balance,
		bonus_integral,
		ptGroupRecord_staticData,
	};
}

export default {
	install
}