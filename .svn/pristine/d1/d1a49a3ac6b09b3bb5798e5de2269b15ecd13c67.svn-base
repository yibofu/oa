;(function($,window,document,undefined){
	// 代码开始


	// 插件的默认参数
    var defaults = {

    	// 图片的参数
    	'img' : {
    		'num' : 48,					// 默认图片的数量
    		'imgpath' : './images', 	// 默认图片的路径
    		'imgprefix' : '',			// 默认图片名称的前缀
    		'imgsuffix' : 'png',  		// 默认图片的后缀名
    		'imginitnum' : 1			// 插件默认展示的第一张图片坐标
    	},

    	// 默认不自动播放
    	'autoplay' : false,
    	// 自动播放时默认的参数
    	'auto' : {
    		'dir' : 'left',		// 默认的播放方向
    		'imgtime' : 200,	// 切换图片的时间间隔
    		'delaytime' : 3000, // 重新启动播放需要的延长时间
    	},

	    
	};

	// 注册用到的函数
	var methods = {
		// 对插件需要的内容进行CSS初始化设置
		cssInit : function(that){
			that.attr('style', cssCode.img360);
			that.find('.img360_float').attr('style', cssCode.float);
			that.find('.img360_shelf').attr('style', cssCode.shelf);			
			that.find('.img360_shelf img').attr('style', cssCode.shelf_img);

            $("#img360 .indicator i").eq(0).addClass("active");

        },

		// 向images添加预加载图片
		addImages : function(that, nums, imgPath, imgprefix, imgtype, nowNum){
			var str = '';
			for (var i = 1; i < nums+1; i++) {
				str += '<img data-src="'+ imgPath + imgprefix + i +'.'+ imgtype + '" src="###" style="display:none" />';
			}
			that.find('.img360_images').html(str);
			that.find('.img360_shelf').html('<img src="'+ imgPath + imgprefix + nowNum +'.'+ imgtype + '">');
		},

		// 先载入一定数量的图片
		loadAdvance : function(that, nums, loadNums, nowNum){
			for(var i = nowNum; i < nowNum+loadNums; i++) {
				var k = i + 1;
					j = i - loadNums;
				k = k > nums ? k-nums : k;
				j = j <= 0 ? nums + j : j;
				methods.addImg(that, k-1);
				methods.addImg(that, j-1);
			};			
		},

		// 加载真实的图片
		addImg : function(that,$nth){
			var look = that.find('.img360_images img').eq($nth);
			if ( look.attr('src') == '###') {
				look.attr('src', look.attr('data-src'));
				look.removeAttr("data-src");
			}			
		},

		// 切换图片
		changeImg : function(that, dir, settings){
			var nextNum = 0;
			var nextAddImg = 0;
            // console.log(para.nowNum);

            if (dir=='left')
            {
				nextNum = para.nowNum == 0 ? 0 : para.nowNum - 1;
			}
            else if(dir=='right')
            {
				nextNum = para.nowNum >= settings.img.num-1 ? para.nowNum : para.nowNum + 1;
			}

            // console.log(nextNum);
            that.find(".indicator i").removeClass("active");
            that.find(".indicator i").eq(nextNum).addClass("active");
            var currSrc = $(".img360_images img").eq(nextNum).attr("src");
			that.find('.img360_shelf img').attr('src', currSrc);
			methods.addImg(that, nextAddImg-1);
			para.nowNum = nextNum;
		}
		
	};

	var cssCode = {
		'img360' : 'position: relative;',
		'shelf' : 'width: inherit; height: inherit;',
		'shelf_img' : 'width: inherit; height:inherit;',
		'float' : 'background:#fff; opacity:0; filter:alpha(opacity=0); position: absolute; cursor: move; left: 0px; top: 0px; z-index:2; width: 100%; height: 100%;',
	}


	// 插件运行中用到的参数
	var para = {
		'ele_that' : null,		// 快捷对象插件容器
		'ele_float' : null,		// 快捷对象遮罩层
		'nowPos' : 0,			// 当前鼠标的坐标
		'pastPos' : 0,			// 上个鼠标的坐标
		'loadImgNum' : 3,		// 默认预加载图片的个数
		'timer' : null,			// 插件运行用到的定时器
		'dir' : 'left',			// 方向保持
		'touchOff' : false,		// 触摸开关
		'nowNum' : 1,			// 当前图片的坐标
		'timerOff' : true,		// 定时器开关
		'iSwiperSpacing' : 80,  // 单次滑动时,划过像素触发切图动作
	};


	// 插件启动函数
    $.fn.image360 = function (options) {

    	
		// 设定参数的覆盖顺序()
		var settings = $.extend( {}, defaults, options);
		var setimg = $.extend(defaults.img, options.img);
		var setauto = $.extend(defaults.auto, options.auto);
		settings.img = setimg;
		settings.auto = setauto;

		// 把用户定义的方向传到参数para
		para.dir = settings.auto.dir;
		para.nowNum = settings.img.imginitnum;
		para.ele_that = this;
		para.ele_float = this.find('.img360_float');

//        para.iSwiperSpacing = this.find('.img360_float').width()/(para.nowNum) ;
		// 向images添加预加载图片
//		methods.addImages(
//			this,
//			settings.img.num,
//			settings.img.imgpath,
//			settings.img.imgprefix,
//			settings.img.imgsuffix,
//			para.nowNum);

		// 初始化插件需要的样式设定
		methods.cssInit(this);

		// 先载入预加载的图片
//		methods.loadAdvance(
//			this,
//			settings.img.num,
//			para.loadImgNum,
//			para.nowNum);

		// 添加鼠标拖拽事件
		$(para.ele_float).on('mousedown', function(e){
			clearInterval(para.timer);
			para.touchOff = true;
			para.pastPos = e.originalEvent.x || e.originalEvent.layerX || 0;
		});
		$(para.ele_float).on('mouseup', function(e){
			para.touchOff = false;
			if (settings.autoplay) {
				if (para.timerOff) {
					para.timerOff = false;
					clearInterval(para.timer);
					setTimeout(function(){
						para.timer = setInterval(function(){
							methods.changeImg(para.ele_that, para.dir, settings);
						}, settings.auto.imgtime);
						para.timerOff = true;
					}, settings.auto.delaytime);
				}
			}
		});

		
		$(':root').on('mousemove', function(e){
			e.preventDefault();
			if (e.target.className != 'img360_float') {
				para.touchOff = false;
				return;
			}
			if(!para.pastPos)
			para.pastPos = e.originalEvent.x || e.originalEvent.layerX || 0;
			//if (para.touchOff) 
			{
				para.nowPos = e.originalEvent.x || e.originalEvent.layerX || 0;
				if (para.nowPos - para.pastPos >= para.iSwiperSpacing) {
					para.dir = 'right';
					methods.changeImg(para.ele_that, para.dir, settings);
					para.pastPos = para.nowPos;
				}else if(para.nowPos - para.pastPos <= para.iSwiperSpacing*(-1)){
					para.dir = 'left';
					methods.changeImg(para.ele_that, para.dir, settings);
					para.pastPos = para.nowPos;
				}
			}
			
		});

		// 添加手机端滑动事件
		$(para.ele_float).on('touchstart', function(e){
			clearInterval(para.timer);
			para.touchOff = true;
			para.pastPos = e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
			para.pastPosY = e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;

		});
		$(para.ele_float).on('touchend', function(e){
			para.touchOff = false;
			if (settings.autoplay) {
				if (para.timerOff) {
					para.timerOff = false;
					clearInterval(para.timer);
					setTimeout(function(){
						para.timer = setInterval(function(){
							methods.changeImg(para.ele_that, para.dir, settings);
						}, settings.auto.imgtime);
						para.timerOff = true;
					}, settings.auto.delaytime);
				}
			}
		});


        $(para.ele_float).on('touchmove', function(e){
			if (e.target.className != 'img360_float') {
				para.touchOff = false;
				return;
			}
			if (para.touchOff)
			{
				para.nowPos = e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
				para.nowPosY = e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;

				if (para.nowPos - para.pastPos >= para.iSwiperSpacing) {
					e.preventDefault();

					para.dir = 'left';
					methods.changeImg(para.ele_that, para.dir, settings);
					para.pastPos = para.nowPos;
				}else if(para.nowPos - para.pastPos <= para.iSwiperSpacing*(-1)){
					e.preventDefault();

					para.dir = 'right';
					methods.changeImg(para.ele_that, para.dir, settings);
					para.pastPos = para.nowPos;
				}
				else
				{

				}
			}

			
		});

		// 设定自动旋转
//		if(settings.autoplay){
//			para.timer = setInterval(function(){
//				methods.changeImg(para.ele_that, para.dir, settings);
//			}, settings.auto.imgtime)
//		}


		// 返回jquery对象, 保持链式操作
		return this;
    };



})(jQuery,window,document);
