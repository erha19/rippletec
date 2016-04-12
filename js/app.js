$(function() {
	var RIPPLETEC_CONFIG = {
		//GLOBLE_CONFIG
		GETNEWLIST_PAGENUM: 1,
		GETNEWLIST_TYPE: 0,
		GETINDEX_NEWS_NUMBER: 4,
		GETNEWS_DETAIL_ID:0,
		TYPENAME: ['全部', '公告', '活动', '其他'],
		LOADDING_CSSNAME: 'loadding',
		ACTIVED_CSSNAME: 'actived',
		//DOM SELECTOR
		MAIN: '#main',
		SECONDPAGE: '#s-page',
		THIRDPAGE: '#t-page',
		BANNER: '#rpt-banner',
		ACTIVITY_BANNER: '#rpt-activity-pic',
		NEWLIST: '.rpt-news-list',
		NEWLIST_PAGENAGATION: '.rpt-nems-pagenation',
		INDEX_NEW_PIC: '.rpt-news-pic',
		INDEX_NEW_SUMMARY: '.rpt-news-summary',
		PARTNER: '.rpt-partner-left',
		MENU: '.rpt-menu',
		LOADDINGMASK: '.page-transform-mask',
		NEWS_TOP_HEADER: '.rpt-news-top-header',
		NEWS_TITLE_TYPE_MENU: '.rpt-news-container-title',
		NEWS_DETAIL_ITEM:'.rpt-news-item-btn',
		NEWS_DETAIL_CONTAINER:'.rpt-new-detail',
		//PLUGIN_CONFIG
		SLIDER_DATA: 'plugin_pogoSlider',
		DOCUMENT_PAGE_SIZE:{h: window.innerHeight,w: $("body").innerWidth()},
		//TEMPLATE
		NEW_TEMPLATE: $("#news-template").html(),
		NEWDetail_TEMPLATE: $("#newsdetail-template").html(),
		LOADDING_TEMPLATE: '<div class="page-transform-mask"><canvas id="mask"></canvas></div>',
		//AJAX_CONFIG
		GETLIST_URL: '/index.php/Index/News/getPage',
		GETBANNER_URL: '/index.php/Index/Banner/getAll',
		GETINDEX_NEWS_URL: '/index.php/Index/News/getSummary',
		GETPARTNER_URL: '/index.php/Index/Cooperation/getAll',
		GETPAGENUMBER_URL: '/index.php/Index/News/getPageNum',
		GETNEWSDETAIL_URL:'/index.php/Index/News/getDetail',
		ISPC:''
	}
	RIPPLETEC_CONFIG.ISPC=(function() {
                var userAgentInfo = navigator.userAgent;
                var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
                var flag = true;
                for (var v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) {
                        flag = false;
                        break;
                    }
                }
                return flag;
    })();
	if(RIPPLETEC_CONFIG.ISPC){
		initCircle()
	}
	console.log(RIPPLETEC_CONFIG.ISPC)
	Q.reg([
	    ['home',function(){
	    	var menu=$(RIPPLETEC_CONFIG.MENU).find('a')
	    	menu.removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
			$(menu[0]).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
			$('body').prepend(RIPPLETEC_CONFIG.LOADDING_TEMPLATE);
			tid = null;
			easeHide(loadIndexPage);
	    }],
	    ['article',function(aid){
	    	$(RIPPLETEC_CONFIG.MENU).find('a').removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
			$('body').prepend(RIPPLETEC_CONFIG.LOADDING_TEMPLATE);
			tid = null;
			RIPPLETEC_CONFIG.GETNEWS_DETAIL_ID=aid;
			easeHide(loadNewDetailPage);
	    }],
	    ['news',function(type,page){
	    	var  page = page || 1,
	    		 type = type || 0;
	    		 RIPPLETEC_CONFIG.GETNEWLIST_TYPE = type;
	    		 RIPPLETEC_CONFIG.GETNEWLIST_PAGENUM=page;

			var  menu=$(RIPPLETEC_CONFIG.MENU).find('a')
	    		 menu.removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
				 $(menu[3]).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
			

				 $('body').prepend(RIPPLETEC_CONFIG.LOADDING_TEMPLATE);
				 tid = null;
				 easeHide(loadNewPage);
	    }]
	]);

	Q.init({
	    index:'home' /* 首页地址 不可访问路径也会跳回此地址 */
	});

	function getBanner() {
		var url = RIPPLETEC_CONFIG.GETBANNER_URL,
			str = '',
			$banner = $(RIPPLETEC_CONFIG.BANNER);
		if($banner.html()=='')
			$.post(url).then(function(data) {
				data = JSON.parse(data)
				for (var i in data) {
					str += '<div class="pogoSlider-slide " data-transition="slide" data-duration="1000" style="z-index:'+(data.length*5-i)+'"><a href="' + data[i].target + '"><div class="rpt-banner-bg" style="background-image:url(' + data[i].backImg + ')"></div><div class="rpt-banner-front" style="background-image:url(' + data[i].frontImg + ')"></div></a></div>'
				}
				$(str).hide().appendTo($banner).fadeIn()
				setTimeout(function() {
					$banner.pogoSlider({
						autoplay: true,
						autoplayTimeout: 5000,
						displayProgess: true,
						preserveTargetSize: true,
						targetWidth: 1000,
						targetHeight: 300,
						responsive: true
					}).data(RIPPLETEC_CONFIG.SLIDER_DATA)
				}, 1000);
				setTimeout(function() {
					$banner.removeClass(RIPPLETEC_CONFIG.LOADDING_CSSNAME)
				}, 500);
			})
	}

	function getPartner() {
		var url = RIPPLETEC_CONFIG.GETPARTNER_URL,
			len,
			img = '',
			$partner = $($(RIPPLETEC_CONFIG.PARTNER)[0]);
		// if($partner.html()=='')
		// 	$.post(url).then(function(data) {
		// 		data = JSON.parse(data);
		// 		len = data.length;
		// 		for (var i = 0; i < 12; i++) {
		// 			if (i % 4 == 0) {
		// 				if (data[i])
		// 					img += '<dl><dd><img src="' + data[i].logo + '" alt=""></dd>'
		// 				else
		// 					img += '<dl><dd></dd>'
		// 			} else if ((i + 1) % 4 == 0) {
		// 				if (data[i])
		// 					img += '<dd><img src="' + data[i].logo + '" alt=""></dd></dl>'
		// 				else
		// 					img += '<dd></dd></dl>'
		// 			} else {
		// 				if (data[i])
		// 					img += '<dd><img src="' + data[i].logo + '" alt=""></dd>'
		// 				else
		// 					img += '<dd></dd>'
		// 			}
		// 		}
		// 		$partner.html(img)
				setTimeout(function() {
					$partner.removeClass(RIPPLETEC_CONFIG.LOADDING_CSSNAME)
					$(RIPPLETEC_CONFIG.ACTIVITY_BANNER).pogoSlider({
						autoplay: true,
						autoplayTimeout: 5000,
						displayProgess: true,
						preserveTargetSize: true,
						targetWidth: 1000,
						targetHeight: 300,
						responsive: true
					}).data(RIPPLETEC_CONFIG.SLIDER_DATA);
				}, 500);



	}

	function getNewList() {
		var url = RIPPLETEC_CONFIG.GETLIST_URL,
			pagenegation_url = RIPPLETEC_CONFIG.GETPAGENUMBER_URL,
			str = '',
			pagestr = '',
			$news_type_menu = $(RIPPLETEC_CONFIG.NEWS_TITLE_TYPE_MENU).find('dd'),
			$newpagenagation = $(RIPPLETEC_CONFIG.NEWLIST_PAGENAGATION),
			$newList = $(RIPPLETEC_CONFIG.NEWLIST);
			$newList.html('');
			$newpagenagation.html('');
			$newList.addClass(RIPPLETEC_CONFIG.LOADDING_CSSNAME)
			$news_type_menu.removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
			$($news_type_menu[RIPPLETEC_CONFIG.GETNEWLIST_TYPE]).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
			
			
			$.post(url, {
				page_num: RIPPLETEC_CONFIG.GETNEWLIST_PAGENUM,
				type: RIPPLETEC_CONFIG.GETNEWLIST_TYPE
			}).then(function(data) {
				data = JSON.parse(data);
				for (var i in data) {
					str += '<li class="clearfix rpt-news-item-btn" data-id="'+data[i].id+'"><em></em><a href="#!article/'+data[i].id+'">' + data[i].title + '</a><i>' + RIPPLETEC_CONFIG.TYPENAME[RIPPLETEC_CONFIG.GETNEWLIST_TYPE] + '</i><span>' + data[i].updateTime.slice(0, 10) + '</span></li>'
				}
				if (str == '')
					str = '<p class="text-center">暂无任何内容</p>'
				$(str).hide().appendTo($newList).fadeIn()
				setTimeout(function(){$newList.removeClass(RIPPLETEC_CONFIG.LOADDING_CSSNAME)},1000);

			})
			$.post(pagenegation_url, {
				type: RIPPLETEC_CONFIG.GETNEWLIST_TYPE
			}).then(function(num) {
				for (var i = 1; i <= num; i++) {
					if (i == RIPPLETEC_CONFIG.GETNEWLIST_PAGENUM)
						pagestr += '<a href="#!news/'+RIPPLETEC_CONFIG.GETNEWLIST_TYPE+'/'+i+'" class="actived">' + i + '</a>'
					else
						pagestr += '<a href="#!news/'+RIPPLETEC_CONFIG.GETNEWLIST_TYPE+'/'+i+'" >' + i + '</a>'
				}
				$(pagestr).hide().appendTo($newpagenagation).fadeIn()
			})
	}


	function getNews() {
		var url = RIPPLETEC_CONFIG.GETINDEX_NEWS_URL,
			news_num = RIPPLETEC_CONFIG.GETINDEX_NEWS_NUMBER,
			str = '',
			img = '',
			$newPic = $($(RIPPLETEC_CONFIG.INDEX_NEW_PIC)[0]),
			$news = $($(RIPPLETEC_CONFIG.INDEX_NEW_SUMMARY)[0]);
		$.post(url, {
			news_num: news_num
		}).then(function(data) {
			data=JSON.parse(data)
			for (var i in data) {
				if(RIPPLETEC_CONFIG.ISPC)
					img += '<img src="' + data[i].coverImg + '" alt="">'
				str += '<div class="rpt-news-item rpt-news-item-btn" data-id="'+data[i].id+'"><a href="#!article/'+data[i].id+'" class="text-title">' + data[i].title + '</a><p class="text-container">' + data[i].summary + '</p></div>'
			}
			if(RIPPLETEC_CONFIG.ISPC)
				$newPic.html(img);
			$news.html(str);
			setTimeout(function() {
				$newPic.removeClass(RIPPLETEC_CONFIG.LOADDING_CSSNAME)
				$news.removeClass(RIPPLETEC_CONFIG.LOADDING_CSSNAME)
				var $newsTitles = $('.rpt-news-item'),
					$newsPics = $('.rpt-news-pic img'),
					titleSelect = 0,
					timer = null,
					autoplay=null;
				$($newsTitles[titleSelect]).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
				$($newsPics[titleSelect]).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
				$('.rpt-news-right').on('mouseenter', '.rpt-news-item', function(e) {
					var that = this;
					timer = setTimeout(function() {
						$($newsTitles[titleSelect]).removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
						$($newsPics[titleSelect]).removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
						$(that).find('.text-container').addClass('showItem');
						$($newsPics[$(that).closest('.rpt-news-item').index()]).addClass('showPic');
					}, 200);
				})
				$('.rpt-news-right').on('mouseout', '.rpt-news-item', function(e) {
					clearTimeout(timer);
					$(this).find('.text-container').removeClass('showItem')
					$($newsPics[$(this).index() ]).removeClass('showPic');
					$($newsTitles[titleSelect]).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
					$($newsPics[titleSelect]).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
				})
				$('.rpt-news-right').on('mouseover', '.rpt-news-item', function(e) {
					clearInterval(autoplay);
				})
				autoplay=setInterval(function(){
					$($newsTitles[titleSelect]).removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
					$($newsPics[titleSelect]).removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
					titleSelect=(titleSelect+1)%4;
					$($newsTitles[titleSelect]).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
					$($newsPics[titleSelect]).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
				}, 2000);
			}, 2000);
		})


	}

	

	function getNewDetail(){
		var url = RIPPLETEC_CONFIG.GETNEWSDETAIL_URL,
			len,
			str = '',
			$container = $(RIPPLETEC_CONFIG.NEWS_DETAIL_CONTAINER)
			$container.html('');
		$.post(url,{news_id:RIPPLETEC_CONFIG.GETNEWS_DETAIL_ID}).then(function(data) {
			data=JSON.parse(data);
			str+='<h1 class="detail-title">'+data[0].title+'</h1><p class="detail-tag"><span>'+RIPPLETEC_CONFIG.TYPENAME[data[0].type]+'</span><i>'+data[0].updateTime.slice(0,10)+'</i></p><div>'+data[0].content+'</div>'
			// str='<div><p>    <img src="http://rippletec.net/upload/news/20160407/14599616112360.jpg"></p><p>    又到了一年一度的波纹科技团队春季校园招新活动，与以往不同的是，今年我们将抛弃所有的线下形式宣传，全部改用线上宣传、报名、审核等机制，实现高效环保二合一。</p><p style="white-space: normal;">    <br></p><p style="white-space: normal;">    如果你符合以下条件：</p><ol class=" list-paddingleft-2">    <li>        <p>            追求自由开放的交流氛围；<br>        </p>    </li>    <li>        <p>            不满足于校内的课程学习进度，希望有更快的发展；        </p>    </li>    <li>        <p>            充满激情，对新鲜事物抱有强烈好奇心；        </p>    </li>    <li>        <p>            喜欢团队合作的氛围，希望结交到一起奋斗的小伙伴；        </p>    </li>    <li>        <p>            充满想象力，对事物经常有不同于常人的见解。        </p>    </li></ol><p>    <br></p><p>    那么，请毫不犹豫地加入我们，我们十分欢迎心怀理想、充满想象力、富有执行力和对计算机、互联网领域充满热爱的你，共同营造一个良好的学习和努力的环境。</p><p>    <br></p><p>    我们将与你一起创造并体验以下福利：</p><ol class=" list-paddingleft-2" style="list-style-type: decimal;">    <li>        <p>            良好的团队氛围；        </p>    </li>    <li>        <p>            和谐的人际关系；<br>        </p>    </li>    <li>        <p>            带薪的项目实践；        </p>    </li>    <li>        <p>            定期技术交流沙龙；        </p>    </li>    <li>        <p>            不定期团队出游、活动；        </p>    </li>    <li>        <p>            自由开发活动；        </p>    </li>    <li>        <p>            趣味运动会活动；        </p>    </li>    <li>        <p>            开会必有零食饮料；        </p>    </li>    <li>        <p>            团队内跨组学习机会；        </p>    </li>    <li>        <p>            师兄师姐各方面经验传授；        </p>    </li>    <li>        <p>            等等等等<br>        </p>    </li></ol><p>    <br></p><p>    团队方向及说明</p><table>    <tbody>        <tr class="firstRow">            <td width="483" valign="top" style="word-break: break-all;" height="16">                方向            </td>            <td width="483" valign="top" style="word-break: break-all;" height="16">                学习内容说明            </td>        </tr>        <tr>            <td width="483" valign="top" style="word-break: break-all;">                产品体验设计            </td>            <td width="483" valign="top" style="word-break: break-all;">                产品功能设计、UI界面设计、用户体验设计、简易网页前端开发，目标方向为GUI设计师、交互设计师、产品经理、前端开发等。<br>            </td>        </tr>        <tr>            <td width="483" valign="top" style="word-break: break-all;">                前端开发            </td>            <td width="483" valign="top" style="word-break: break-all;">                深入网页前端开发，简易网页设计，目标方向为前端开发工程师、GUI设计师、交互设计师等。            </td>        </tr>        <tr>            <td width="483" valign="top" style="word-break: break-all;">                后台开发            </td>            <td width="483" valign="top" style="word-break: break-all;">                互联网后台开发，目标方向为各类语言后台开发工程师、数据挖掘、数据分析工程师等。            </td>        </tr>        <tr>            <td width="483" valign="top" style="word-break: break-all;">                Android            </td>            <td width="483" valign="top" style="word-break: break-all;">                Android平台软件开发，目标方向为Android移动端开发工程师。            </td>        </tr>        <tr>            <td width="483" valign="top" style="word-break: break-all;">                IOS            </td>            <td width="483" valign="top" style="word-break: break-all;">                IOS平台软件开发，目标方向为IOS移动端开发工程师。            </td>        </tr>    </tbody></table><p>    <br></p><p>    招新方向设定及人数：</p><table>    <tbody>        <tr class="firstRow">            <td width="483" valign="top" style="word-break: break-all;">                <strong>方向</strong>            </td>            <td width="483" valign="top" style="word-break: break-all;">                <strong>人数</strong>            </td>        </tr>        <tr>            <td width="483" valign="top" style="word-break: break-all;">                产品体验设计            </td>            <td width="483" valign="top" style="word-break: break-all;">                1~2            </td>        </tr>        <tr>            <td width="483" valign="top" style="word-break: break-all;">                前端开发            </td>            <td width="483" valign="top" style="word-break: break-all;">                4~5            </td>        </tr>        <tr>            <td width="483" valign="top" style="word-break: break-all;">                后台开发            </td>            <td width="483" valign="top" style="word-break: break-all;">                4~5            </td>        </tr>        <tr>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                Android            </td>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                3~4            </td>        </tr>        <tr>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                IOS            </td>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                2~3            </td>        </tr>        <tr>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                合计            </td>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                14~20            </td>        </tr>    </tbody></table><p>    <br></p><p>    招新时间地点安排：</p><table>    <tbody>        <tr class="firstRow">            <td width="315" valign="top" style="word-break: break-all;">                项目            </td>            <td valign="top" colspan="1" rowspan="1" width="315" style="word-break: break-all;">                <strong>时间</strong>            </td>            <td width="315" valign="top" style="word-break: break-all;">                <strong>地点</strong>            </td>        </tr>        <tr>            <td width="315" valign="top" style="word-break: break-all;">                宣讲会            </td>            <td valign="top" colspan="1" rowspan="1" width="315" style="word-break: break-all;">                2016年4月11日（星期一）晚上19:00            </td>            <td width="315" valign="top" style="word-break: break-all;">                广东工业大学教学6号楼-待定            </td>        </tr>        <tr>            <td width="315" valign="top" style="word-break: break-all;">                笔试时间（无选修）            </td>            <td valign="top" colspan="1" rowspan="1" width="315" style="word-break: break-all;">                2016年4月15日（星期五）晚上18:30-19:30            </td>            <td width="315" valign="top" style="word-break: break-all;">                待定            </td>        </tr>        <tr>            <td width="315" valign="top" style="word-break: break-all;">                面试时间（无选修）            </td>            <td valign="top" colspan="1" rowspan="1" width="315" style="word-break: break-all;">                2016年4月15日（星期五）晚上19:40-20:40            </td>            <td width="315" valign="top" style="word-break: break-all;">                待定            </td>        </tr>        <tr>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                笔试时间（无选修）            </td>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                2016年4月15日（星期五）晚上20:50-21:50            </td>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                待定            </td>        </tr>        <tr>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                面试时间（无选修）            </td>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                2016年4月15日（星期五）晚上22:00-23:00            </td>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                待定            </td>        </tr>        <tr>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                公布初审结果            </td>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                2016年4月18日（星期一）            </td>            <td valign="top" colspan="1" rowspan="1"></td>        </tr>        <tr>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                暑期培训考核            </td>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                待定            </td>            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">                待定            </td>        </tr>        <tr>            <td width="315" valign="top" style="word-break: break-all;">                公布终审结果            </td>            <td valign="top" colspan="1" rowspan="1" width="315" style="word-break: break-all;">                待定            </td>            <td width="315" valign="top" style="word-break: break-all;">                待定<br>            </td>        </tr>    </tbody></table><p>    <br></p><p>    真正的机会总是留给勇者，世界的推动总是依靠创新，或许你将会在此遇见更好的自己，我们期待你的到来。</p><p>    <br></p><p>    <img src="http://rippletec.net/upload/news/20160407/1459965085117126.jpg" style=""></p><p>    <br></p><p>    <img src="http://rippletec.net/upload/news/20160407/1459965085871537.jpg" style=""></p><p>    <br></p><p>    <img src="http://rippletec.net/upload/news/20160407/1459965085110860.jpg" style=""></p><p>    <br></p><p>    <img src="http://rippletec.net/upload/news/20160407/1459965085350223.jpg" style=""></p><p>    <br></p></div>'
			$(str).hide().appendTo($container).fadeIn();
			$container.removeClass(RIPPLETEC_CONFIG.LOADDING_CSSNAME);
		})

	}

	function loadNewPage() {
		$(RIPPLETEC_CONFIG.MAIN).hide()
		$(RIPPLETEC_CONFIG.THIRDPAGE).hide()
		$(RIPPLETEC_CONFIG.NEWS_TOP_HEADER).show()
		$(RIPPLETEC_CONFIG.SECONDPAGE).fadeIn()
		if($(RIPPLETEC_CONFIG.SECONDPAGE).html()=='')
			$(RIPPLETEC_CONFIG.SECONDPAGE).html(RIPPLETEC_CONFIG.NEW_TEMPLATE)
		setTimeout(function() {
			getNewList();
		}, 500);
	}

	function loadIndexPage() {
		init();
		$(RIPPLETEC_CONFIG.NEWS_TOP_HEADER).hide()
		$(RIPPLETEC_CONFIG.SECONDPAGE).hide()
		$(RIPPLETEC_CONFIG.THIRDPAGE).hide()
		$(RIPPLETEC_CONFIG.MAIN).fadeIn();
	}

	function loadNewDetailPage(){
		$(RIPPLETEC_CONFIG.SECONDPAGE).hide()
		$(RIPPLETEC_CONFIG.NEWS_TOP_HEADER).show()
		$(RIPPLETEC_CONFIG.MAIN).hide()
		$(RIPPLETEC_CONFIG.THIRDPAGE).show()
		if($(RIPPLETEC_CONFIG.THIRDPAGE).html()=='')
			$(RIPPLETEC_CONFIG.NEWDetail_TEMPLATE).hide().appendTo($(RIPPLETEC_CONFIG.THIRDPAGE)).fadeIn();
		setTimeout(function() {
			getNewDetail();
		}, 500);
	}

	function init(){
		if(RIPPLETEC_CONFIG.ISPC){
			getPartner()
		}
		getNews()
		getBanner()
	}


	/*---加载动画---*/

	var tid = null;
	var ogg = {
		myProp: 0
	};

	function easeShow() {
		TweenLite.set(RIPPLETEC_CONFIG.LOADDINGMASK, {
			y: 0,
			backgroundColor: "transparent"
		});
		ogg = {
			myProp: 0
		};
		TweenLite.to(ogg, 0.5, {
			myProp: RIPPLETEC_CONFIG.DOCUMENT_PAGE_SIZE.w,
			ease: Power4.easeIn,
			onUpdate: initMask,
			onComplete: removeMask
		});
	}

	function easeHide(fn) {
		TweenLite.set(RIPPLETEC_CONFIG.LOADDINGMASK, {
			y: 0,
			backgroundColor: "transparent"
		});
		ogg = {
			myProp: RIPPLETEC_CONFIG.DOCUMENT_PAGE_SIZE.w
		};
		TweenLite.to(ogg, 0.5, {
			myProp: 0,
			ease: Power4.easeOut,
			onUpdate: initMask,
			onComplete: Ajaxsource(fn)
		});
	}

	function Ajaxsource(fn) {
		setTimeout(fn,200);
		setTimeout(easeShow, 500);
	}


	function initMask() {

		$(RIPPLETEC_CONFIG.LOADDINGMASK + " canvas").attr({
			width: RIPPLETEC_CONFIG.DOCUMENT_PAGE_SIZE.w,
			height: RIPPLETEC_CONFIG.DOCUMENT_PAGE_SIZE.h
		});
		var masks = document.getElementById('mask');
		var cx = masks.getContext('2d');

		cx.beginPath();
		cx.rect(0, 0, RIPPLETEC_CONFIG.DOCUMENT_PAGE_SIZE.w, RIPPLETEC_CONFIG.DOCUMENT_PAGE_SIZE.h);
		cx.arc(RIPPLETEC_CONFIG.DOCUMENT_PAGE_SIZE.w * 0.5, RIPPLETEC_CONFIG.DOCUMENT_PAGE_SIZE.h * 0.5, ogg.myProp, 0, 2 * Math.PI, true);
		cx.fillStyle = "#fff";
		cx.fill();
	}

	function removeMask() {
		clearInterval(tid);
		$(RIPPLETEC_CONFIG.LOADDINGMASK).remove();
	}

	function initCircle(){
			var Canvas = document.getElementById('bg-canvas');
			var ctx = Canvas.getContext('2d');

			var resize = function() {
				Canvas.width = Canvas.clientWidth;
				Canvas.height = Canvas.clientHeight;
			};
			window.addEventListener('resize', resize);
			resize();

			var elements = [];
			var presets = {};

			presets.o = function(x, y, s, dx, dy) {
				return {
					x: x,
					y: y,
					r: 20 * s,
					w: 1,
					dx: dx,
					dy: dy,
					draw: function(ctx, t) {
						this.x += this.dx;
						this.y += this.dy;

						ctx.beginPath();
						ctx.arc(this.x + +Math.sin((50 + x + (t / 10)) / 100) * 3, this.y + +Math.sin((45 + x + (t / 10)) / 100) * 4, this.r, 0, 2 * Math.PI, false);
						ctx.lineWidth = this.w;
						ctx.strokeStyle = '#ddd';
						ctx.stroke();
					}
				}
			};

			presets.x = function(x, y, s, dx, dy, dr, r) {
				r = r || 0;
				return {
					x: x,
					y: y,
					s: 5 * s,
					w: 5 * s,
					r: r,
					dx: dx,
					dy: dy,
					dr: dr,
					draw: function(ctx, t) {
						this.x += this.dx;
						this.y += this.dy;
						this.r += this.dr;

						var _this = this;
						var line = function(x, y, tx, ty, c, o) {
							o = o || 0;
							ctx.beginPath();
							ctx.moveTo(-o + ((_this.s / 2) * x), o + ((_this.s / 2) * y));
							ctx.lineTo(-o + ((_this.s / 2) * tx), o + ((_this.s / 2) * ty));
							ctx.lineWidth = _this.w;
							ctx.strokeStyle = c;
							ctx.stroke();
						};

						ctx.save();

						ctx.translate(this.x + Math.sin((x + (t / 10)) / 100) * 5, this.y + Math.sin((10 + x + (t / 10)) / 100) * 2);
						ctx.rotate(this.r * Math.PI / 180);

						line(-1, -1, 1, 1, '#ddd');
						line(1, -1, -1, 1, '#ddd');

						ctx.restore();
					}
				}
			};

			for (var x = 0; x < Canvas.width; x += 2) {
				for (var y = 0; y < Canvas.height; y += 3) {
					if (Math.round(Math.random() * 8000) == 1) {
						var s = ((Math.random() * 15) + 1) / 5;
						if (Math.round(Math.random()) == 1)
							elements.push(presets.o(x, y, s, 0, 0));
						// else
						//     elements.push(presets.x(x, y, s, 0, 0, ((Math.random() * 3) - 1) / 10, (Math.random() * 360)));
					}
				}
			}

			setInterval(function() {
				ctx.clearRect(0, 0, Canvas.width, Canvas.height);

				var time = new Date().getTime();
				for (var e in elements)
					elements[e].draw(ctx, time);
			}, 10);
	}
})