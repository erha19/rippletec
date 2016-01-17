$(function() {
	var translateNumber=['one','two','three','four','five'];
	function getBanner(){
		var url='/index.php/index/banner/getAll',
			str='',
			$banner=$('#rpt-banner');
		$.post(url).then(function(data){
			data=JSON.parse(data)
			console.log(data)
			for(var i in data){
				str+='<div class="pogoSlider-slide " data-transition="slide" data-duration="1000"><a href="'+data[i].target+'"><div class="rpt-banner-bg" style="background-image:url('+data[i].backImg+')"></div><div class="rpt-banner-front" style="background-image:url('+data[i].frontImg+')"></div></a></div>'
			}
			
			$banner.append(str)
			setTimeout(function(){
				$banner.pogoSlider({
					autoplay: true,
					autoplayTimeout: 5000,
					displayProgess: true,
					preserveTargetSize: true,
					targetWidth: 1000,
					targetHeight: 300,
					responsive: true
				}).data('plugin_pogoSlider')
			}, 1000);
			setTimeout(function(){
				$banner.removeClass('loadding')
			}, 500);
		})
	}
	console.log(getBanner())
	// $('#rpt-activity-pic').pogoSlider({
	// 	autoplay: true,
	// 	autoplayTimeout: 5000,
	// 	displayProgess: true,
	// 	preserveTargetSize: true,
	// 	targetWidth: 1000,
	// 	targetHeight: 300,
	// 	responsive: true
	// }).data('plugin_pogoSlider');

	var $newsTitles = $('.rpt-news-item'),
		$newsPics = $('.rpt-news-pic img'),
		titleSelect = 0,
		timer = null;
	$($newsTitles[titleSelect]).addClass('actived');
	$($newsPics[titleSelect]).addClass('actived');
	$('.rpt-news-right').on('mouseenter', '.text-title', function(e) {
		var that = this;
		timer = setTimeout(function() {
			$($newsTitles[titleSelect]).removeClass('actived');
			$($newsPics[titleSelect]).removeClass('actived');
			$(that).next('.text-container').addClass('showItem');
			$($newsPics[$(that).closest('.rpt-news-item').index() - 1]).addClass('showPic');
		}, 200);
	})
	$('.rpt-news-right').on('mouseout', '.rpt-news-item', function(e) {
		clearTimeout(timer);
		$(this).find('.text-container').removeClass('showItem')
		$($newsPics[$(this).index() - 1]).removeClass('showPic');
		$($newsTitles[titleSelect]).addClass('actived')
		$($newsPics[titleSelect]).addClass('actived');
	})
	$('.rpt-news-right').on('click', '.rpt-news-item', function(e) {
		$($newsTitles[titleSelect]).removeClass('actived');
		titleSelect = $(this).index() - 1;
	})

	/*---加载动画---*/

	var template = '<div class="page-transform-mask"><canvas id="mask"></canvas></div>';
	var page;
	var tid = null;
	var ogg = {
		myProp: 0
	};

	getPage();

	$('.rpt-show-news').on('click', function(e) {
		e.preventDefault();
		$('body').prepend(template);
		tid = null;
		easeHide();
	});

	function easeShow() {
		TweenLite.set(".page-transform-mask", {
			y: 0,
			backgroundColor: "transparent"
		});
		ogg = {
			myProp: 0
		};
		TweenLite.to(ogg, 1, {
			myProp: page.w,
			ease: Power4.easeIn,
			onUpdate: initMask,
			onComplete: removeMask
		});
	}

	function easeHide() {
		TweenLite.set(".page-transform-mask", {
			y: 0,
			backgroundColor: "transparent"
		});
		ogg = {
			myProp: page.w
		};
		TweenLite.to(ogg, 1, {
			myProp: 0,
			ease: Power4.easeOut,
			onUpdate: initMask,
			onComplete:Ajaxsource
		});
	}
	function Ajaxsource(){
		setTimeout(easeShow, 0);
	}

	$(window).resize(function() {
		getPage();
	});
	function getPage() {
		page = {
			h: window.innerHeight,
			w: $("body").innerWidth()
		};
	}

	function initMask() {
		
		$(".page-transform-mask canvas").attr({
			width: page.w,
			height: page.h
		});
		var masks = document.getElementById('mask');
		var cx = masks.getContext('2d');

		cx.beginPath();
		cx.rect(0, 0, page.w, page.h);
		cx.arc(page.w * 0.5, page.h * 0.5, ogg.myProp, 0, 2 * Math.PI, true);
		cx.fillStyle = "#fff";
		cx.fill();
	}

	function removeMask() {
		clearInterval(tid);
		$('.page-transform-mask').remove();
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