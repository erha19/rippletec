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
		SHOW_NEWS: '.rpt-show-news',
		SHOW_INDEX: '.showIndex',
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
		GETBANNER_URL: '/index.php/index/banner/getAll',
		GETINDEX_NEWS_URL: '/index.php/Index/News/getSummary',
		GETPARTNER_URL: '/index.php/Index/Cooperation/getAll',
		GETPAGENUMBER_URL: '/index.php/Index/News/getPageNum',
		GETNEWSDETAIL_URL:'/index.php/Index/News/getDetail'

	}

	function getBanner() {
		var url = RIPPLETEC_CONFIG.GETBANNER_URL,
			str = '',
			$banner = $(RIPPLETEC_CONFIG.BANNER);
		$.post(url).then(function(data) {
			data = JSON.parse(data)
			for (var i in data) {
				str += '<div class="pogoSlider-slide " data-transition="slide" data-duration="1000"><a href="' + data[i].target + '"><div class="rpt-banner-bg" style="background-image:url(' + data[i].backImg + ')"></div><div class="rpt-banner-front" style="background-image:url(' + data[i].frontImg + ')"></div></a></div>'
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

	function getNewList() {
		var url = RIPPLETEC_CONFIG.GETLIST_URL,
			pagenegation_url = RIPPLETEC_CONFIG.GETPAGENUMBER_URL,
			str = '',
			pagestr = '',
			$news_type_menu = $(RIPPLETEC_CONFIG.NEWS_TITLE_TYPE_MENU).find('dd');
		$news_type_menu.removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
		$($news_type_menu[RIPPLETEC_CONFIG.GETNEWLIST_TYPE]).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
		$newList = $(RIPPLETEC_CONFIG.NEWLIST);
		$newpagenagation = $(RIPPLETEC_CONFIG.NEWLIST_PAGENAGATION);
		$newList.html('');
		$newpagenagation.html('');
		$newList.addClass(RIPPLETEC_CONFIG.LOADDING_CSSNAME)
		$.post(url, {
			page_num: RIPPLETEC_CONFIG.GETNEWLIST_PAGENUM,
			type: RIPPLETEC_CONFIG.GETNEWLIST_TYPE
		}).then(function(data) {
			data = JSON.parse(data);
			for (var i in data) {
				str += '<li class="clearfix rpt-news-item-btn" data-id="'+data[i].id+'"><em></em><p>' + data[i].title + '</p><i>' + RIPPLETEC_CONFIG.TYPENAME[RIPPLETEC_CONFIG.GETNEWLIST_TYPE] + '</i><span>' + data[i].updateTime.slice(0, 10) + '</span></li>'
			}
			if (str == '')
				str = '<p>暂无任何内容</p>'
			$(str).hide().appendTo($newList).fadeIn()
			$newList.removeClass(RIPPLETEC_CONFIG.LOADDING_CSSNAME)

		})
		$.post(pagenegation_url, {
			type: RIPPLETEC_CONFIG.GETNEWLIST_TYPE
		}).then(function(num) {
			for (var i = 1; i <= num; i++) {
				if (i == RIPPLETEC_CONFIG.GETNEWLIST_PAGENUM)
					pagestr += '<a class="actived">' + i + '</a>'
				else
					pagestr += '<a>' + i + '</a>'
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
			data = JSON.parse(data)
			console.log(data)
			for (var i in data) {
				img += '<img src="' + data[i].coverImg + '" alt="">'
				str += '<div class="rpt-news-item rpt-news-item-btn" data-id="'+data[i].id+'"><p class="text-title">' + data[i].title + '</p><p class="text-container">' + data[i].summary + '</p></div>'
			}
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
				$('.rpt-news-right').on('mouseenter', '.text-title', function(e) {
					var that = this;
					timer = setTimeout(function() {
						$($newsTitles[titleSelect]).removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
						$($newsPics[titleSelect]).removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME);
						$(that).next('.text-container').addClass('showItem');
						$($newsPics[$(that).closest('.rpt-news-item').index() - 1]).addClass('showPic');
					}, 200);
				})
				$('.rpt-news-right').on('mouseout', '.rpt-news-item', function(e) {
					clearTimeout(timer);
					$(this).find('.text-container').removeClass('showItem')
					$($newsPics[$(this).index() - 1]).removeClass('showPic');
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

	function getPartner() {
		var url = RIPPLETEC_CONFIG.GETPARTNER_URL,
			len,
			img = '',
			$partner = $($(RIPPLETEC_CONFIG.PARTNER)[0]);
		$.post(url).then(function(data) {
			data = JSON.parse(data);
			len = data.length;
			console.log(data)
			for (var i = 0; i < 12; i++) {
				if (i % 4 == 0) {
					if (data[i])
						img += '<dl><dd><img src="' + data[i].logo + '" alt=""></dd>'
					else
						img += '<dl><dd></dd>'
				} else if ((i + 1) % 4 == 0) {
					if (data[i])
						img += '<dd><img src="' + data[i].logo + '" alt=""></dd></dl>'
					else
						img += '<dd></dd></dl>'
				} else {
					if (data[i])
						img += '<dd><img src="' + data[i].logo + '" alt=""></dd>'
					else
						img += '<dd></dd>'
				}
			}
			$partner.append(img)
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
			console.log(data)
			str+='<h1>'+data[0].title+'</h1><p><span>'+RIPPLETEC_CONFIG.TYPENAME[data[0].type]+'</span><i>'+data[0].updateTime.slice(0,10)+'</i></p><div>'+data[0].content+'</div>'
			$(str).hide().appendTo($container).fadeIn();
			$container.removeClass(RIPPLETEC_CONFIG.LOADDING_CSSNAME);
		})

	}

	function loadNewPage() {
		$(RIPPLETEC_CONFIG.MAIN).hide()
		$(RIPPLETEC_CONFIG.NEWS_TOP_HEADER).show()
		$(RIPPLETEC_CONFIG.SECONDPAGE).fadeIn()
		if($(RIPPLETEC_CONFIG.SECONDPAGE).html()=='')
			$(RIPPLETEC_CONFIG.SECONDPAGE).html(RIPPLETEC_CONFIG.NEW_TEMPLATE)
		setTimeout(function() {
			getNewList();
		}, 500);
	}

	function loadIndexPage() {
		$(RIPPLETEC_CONFIG.NEWS_TOP_HEADER).hide()
		$(RIPPLETEC_CONFIG.SECONDPAGE).hide()
		$(RIPPLETEC_CONFIG.THIRDPAGE).hide()
		$(RIPPLETEC_CONFIG.MAIN).fadeIn();
	}

	function loadNewDetailPage(){
		$(RIPPLETEC_CONFIG.SECONDPAGE).hide()
		$(RIPPLETEC_CONFIG.NEWS_TOP_HEADER).show()
		$(RIPPLETEC_CONFIG.MAIN).hide()
		if($(RIPPLETEC_CONFIG.THIRDPAGE).html()=='')
			$(RIPPLETEC_CONFIG.NEWDetail_TEMPLATE).hide().appendTo($(RIPPLETEC_CONFIG.THIRDPAGE)).fadeIn();
		setTimeout(function() {
			getNewDetail();
		}, 500);
	}
	$(RIPPLETEC_CONFIG.SHOW_NEWS).on('click', function(e) {
		e.preventDefault();
		$(RIPPLETEC_CONFIG.MENU).find('a').removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
		$(this).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
		$('body').prepend(RIPPLETEC_CONFIG.LOADDING_TEMPLATE);
		tid = null;
		easeHide(loadNewPage);
	});

	$(RIPPLETEC_CONFIG.SHOW_INDEX).on('click', function(e) {
		e.preventDefault();
		$(RIPPLETEC_CONFIG.MENU).find('a').removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
		$(this).addClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
		$('body').prepend(RIPPLETEC_CONFIG.LOADDING_TEMPLATE);
		tid = null;
		easeHide(loadIndexPage);
	});
	$(document).on('click',RIPPLETEC_CONFIG.NEWS_DETAIL_ITEM,function(e){
		e.stopPropagation();
		e.preventDefault();
		$(RIPPLETEC_CONFIG.MENU).find('a').removeClass(RIPPLETEC_CONFIG.ACTIVED_CSSNAME)
		$('body').prepend(RIPPLETEC_CONFIG.LOADDING_TEMPLATE);
		tid = null;
		RIPPLETEC_CONFIG.GETNEWS_DETAIL_ID=$(this).data('id');
		easeHide(loadNewDetailPage);
	})
	$(document).on('click',RIPPLETEC_CONFIG.NEWLIST_PAGENAGATION+' a',function(e){
		e.stopPropagation();
		e.preventDefault();
		RIPPLETEC_CONFIG.GETNEWLIST_PAGENUM = $(this).text();
		getNewList();
	})
	$(document).on('click', RIPPLETEC_CONFIG.NEWS_TITLE_TYPE_MENU + ' dd', function(e) {
		e.preventDefault();
		e.stopPropagation()
		var type = 0;
		for (; type < RIPPLETEC_CONFIG.TYPENAME.length; type++) {
			if ($(this).text() == RIPPLETEC_CONFIG.TYPENAME[type])
				break;
		}
		console.log(type)
		RIPPLETEC_CONFIG.GETNEWLIST_TYPE = type;
		getNewList();
	})

	function init(){
		getPartner()
		getNews()
		getBanner()
	}
	/*---启动函数---*/
	init();


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
		setTimeout(fn, 1000);
		setTimeout(easeShow, 1000);
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
})