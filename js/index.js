/*
    scriptmail@163.com 
    https://github.com/ZhongxuYang
 */
(function(){
	setload1();
	setPerc();
})();
/*--------根据屏幕大小来计算景深--------*/
/*
 * 1.保持视野的角度大小不变,计算出景深.
 * 2.保持我和景物之间的距离不变.
 */
function setPerc(){
	resetView();
	window.onresize = resetView;
	function resetView(){
		var view = document.getElementById('view');
		var main = document.getElementById('main');
		var deg = 52.5;//是参照原网站
		var height = document.documentElement.clientHeight;
		var R = Math.round(Math.tan(deg/180*Math.PI)*height*0.5);
		
		view.style.perspective = R + 'px';
		view.style.webkitPerspective = R + 'px';
//		css(main,'translateZ',R);
	}
}

/*--------做图片预加载--------*/
document.addEventListener('touchstart',function(ev){
	ev.preventDefault();
});
function setload1(){
	var data = [];//用来存放所有的图片
	var load = document.getElementById('load');
	var logoText = document.getElementsByClassName('logoText')[0];
	
	for(var attr in imgData){
		//for in循环数组键值对,把所有图片放在一个数组里
		data = data.concat(imgData[attr]);
	}
	var num = 0;//计算加载进来图片个数
	var len = data.length;
	for(var i=0;i<len;i++){
		var img = new Image();
		img.src = data[i];//把每张图片都从浏览器下载到本地
		img.onload = function(){
			num++;
			var per = Math.floor(num/len*100);
			logoText.innerHTML = '已加载' + per + '%';
			if( num == len ){
				anmt1();
			}
		}
	}
}
/*---------load1渐隐,logo2显示----------*/
function anmt1(){
	/*  创建logo2  */
	var load1 = document.getElementById('load1');
	var logo2 = document.createElement('div');
	var img2 = new Image();
	logo2.id = 'logo2';
	logo2.className = 'logo';
	img2.src = imgData.logo[0];
	css(logo2,"translateZ",-1000);
	logo2.appendChild(img2);
	/*  创建logo3(为了让logo2和logo3动画同步,所以要一起创建)  */
	var logo3 = document.createElement('div');
	var img3 = new Image();
	logo3.id = 'logo3';
	logo3.className = 'logo';
	img3.src = imgData.logo[1];
	css(logo3,"translateZ",-1000);
	logo3.appendChild(img3);
	
	css(logo2,"opacity",0);
	css(logo3,"opacity",0);
	load.appendChild(logo2);
	load.appendChild(logo3);
	
	/*  隐藏load1,把创建好的logo2插入结构  */
	MTween({
		el: load1,
		target: {opacity:0},
		time: 1000,
		type: 'easeOut',
		callBack: function(){
			/*  logo1消失之后logo2显示  */
			load.removeChild(load1);
			css(logo2,"opacity",100);
			var audio = document.getElementById('audio');
			audio.innerHTML = '<audio src="bgm/bgm.mp3" autoplay="autoplay" loop="loop"></audio>';
			MTween({
				el: logo2,
				target: {translateZ:0},
				time: 300,
				type: 'easeBoth',
				callBack: anmt2
			});
		}
	});
};
/*---------logo2消失,logo3显示----------*/
function anmt2(){
	var logo2 = document.getElementById('logo2');
	/*  logo2缩小  */
	setTimeout(function(){
		MTween({
			el: logo2,
			target: {translateZ:-1000},
			time: 800,
			type: 'linear',
			callBack: function(){
				load.removeChild(logo2);
				css(logo3,"opacity",100);
				setTimeout(function(){
					MTween({
						el: logo3,
						target: {translateZ:0},
						time: 300,
						type: 'easeBoth',
						callBack: anmt3
					});
				})
			}
		});
	},2000)
};
/*---------logo3消失,显示boom----------*/
function anmt3(){
	var logo3 = document.getElementById('logo3');
	setTimeout(function(){
		MTween({
			el: logo3,
			target: {translateZ:-2000},
			time: 2000,
			type: 'easeIn',
			callBack: function(){
				load.removeChild(logo3);
				//开始BOOM效果
				anmt4();
			}
		});
	},2000)
};
/*---------logo4生成----------*/
function anmt4(){
	var logo4 = document.createElement('div');
	var logoIcons = document.createElement('div');
	var logo4Img = new Image();
	var iconsLen = 27;
	logo4.id = 'logo4';
	logoIcons.id = 'logoIcons';
	logo4Img.id = 'logo4Img';
	logo4Img.src = imgData.logo[2];
	for(var i=0;i<iconsLen;i++){
		var span = document.createElement('span');
		/*  随机出的半径为20~240px之间,造成碎片的3d的空间感  */
		var xR = 20 + Math.round( Math.random()*240 );
		var yR = 10 + Math.round( Math.random()*240 );
		/*  随机角度,围起来会是一个圆.为了有杂乱的视觉   */
		var xDeg = Math.round( Math.random()*360 );
		var yDeg = Math.round( Math.random()*360 );
		/*  执行顺序是先位再旋转,后写的先执行  */
		css(span,'rotateY',xDeg);
		css(span,'translateZ',xR);
		css(span,'rotateX',yDeg);
		css(span,'translateY',yR);
		span.style.backgroundImage = 'url(' + imgData.logoIco[i%imgData.logoIco.length] + ')';
		logoIcons.appendChild(span);
	}
	/*  为了造成爆炸效果从内向外,要让碎片逐渐拉近  */
	css(logo4,'translateZ',-10000);
	logo4.appendChild(logoIcons);
	logo4.appendChild(logo4Img);
	load.appendChild(logo4);
	/*  碎片逐渐拉近  */
	MTween({
		el: logo4,
		target: {translateZ: 0},
		time: 300,
		type: 'easeOutStrong',
		/*  碎片逐渐拉远  */
		callBack: function(){
			setTimeout(function(){
				MTween({
					el: logo4,
					target: {translateZ: -2000,scale: 0},
					time: 1000,
					type: 'linear',
					/*  动画执行完直接在结构中删除  */
					callBack: function(){
						load.removeChild(logo4);
						anmt5();
					}
				});
			},500);
		}
	});
}
/*---------入场动画----------*/
function anmt5(){
	var tZ = document.getElementById('tZ');
	css(tZ,'translateZ',-2000);
	anmt7();
	anmt6();
	createPano();
	MTween({
		el: tZ,
		target: {translateZ: 200},
		time: 3600,
		type: 'easeBoth'
	})
}
/*---------生成背景圆柱,圆柱入场----------*/
function anmt6(){
	var panoBg = document.getElementById('panoBg');
	var len = imgData.bg.length;
	var width = 129;
	var deg = 360/len;
	var R = parseInt( Math.tan( (180-deg)/2*Math.PI/180 )*(width/2) ) - 1;
	var startDeg = 180;
	css(panoBg,'rotateX',0);
	css(panoBg,'rotateY',-695);
	for(var i=0;i<len;i++){
		var span = document.createElement('span');
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		span.style.backgroundImage = 'url(' + imgData.bg[i] + ')';
		span.style.display = 'none';
		panoBg.appendChild(span);
		startDeg -= deg;
	}
	var num = 0;
	var timer = setInterval(function(){
		panoBg.children[num].style.display = 'block';
		num++;
		if( num >= len ){
			clearInterval(timer);
		}
	},3600/2/len);
	MTween({
		el:panoBg,
		target:{rotateY:25},
		time:3600,
		type:'linear',
		callBack: function(){
			drag();
			setTimeout(function(){
//				sensor();
			},1000);
		}
	})
}
/*----------祥云动画---------*/
function anmt7(){
	var cloud = document.getElementById('cloud');
	/* 因为让云成为一个圆柱之后,有的云离我们太近,所以整体向后移动 */
	css(cloud,'translateZ',-400);
	/* 生成9朵祥云 */
	for(var i=0;i<9;i++){
		var span = document.createElement('span');
		span.style.backgroundImage = 'url('+ imgData.cloud[i%imgData.cloud.length] +')'
		var R = 200 + ( Math.random()*150 );
		var deg = (360/9)*i;
		var x = Math.sin(deg*Math.PI/180)*R;
		var z = Math.cos(deg*Math.PI/180)*R;
		var y = (Math.random() - 0.5)*200;
		css(span,'translateX',x);
		css(span,'translateZ',z);
		css(span,'translateY',y);
		span.style.display = 'none';
		cloud.appendChild(span);
	}
	var num = 0;
	/*  让云朵一个一个出来  */
	var timer = setInterval(function(){
		cloud.children[num].style.display = 'block';
		num++;
		if(num >= cloud.children.length){
			clearInterval(timer);
		}
	},50);
	MTween({
		el: cloud,
		target: {rotateY:540},
		time: 3500,
		type: 'easeIn',
		/*  让云朵即使在旋转的时候也一直正面面向屏幕  */
		callIn: function(){
			var deg = -css(cloud,'rotateY');
			for(var i=0;i<cloud.children.length;i++){
				/*  云朵往父级的反方向旋转,就造成了云朵不动的效果  */
				css(cloud.children[i],'totateY',deg);
			}
		},
		/*  动画停止之后删掉云  */
		callBack: function(){
			cloud.parentNode.removeChild(cloud);
			bgShow();
		}
	});
}
/*---------拖拽----------*/
function drag(){
	var tZ = document.getElementById('tZ');
	var panoBg = document.getElementById('panoBg');
	var pano = document.getElementById('pano');
	var startPoint = {x:0,y:0};
	var startEle = {x:0,y:0};
	/*  1deg需要移动多少px  */
	var scale = {x:129/18,y:1170/90};
	var startZ = css(tZ,'translateZ');
	var lastDeg = {x:0,y:0};
	var lastDis = {x:0,y:0};
	document.addEventListener('touchstart',function(ev){
		startPoint.x = ev.changedTouches[0].pageX;
		startPoint.y = ev.changedTouches[0].pageY;
		startEle.x = css(panoBg,'rotateY');
		startEle.y = css(panoBg,'rotateX');
	});
	document.addEventListener('touchmove',function(ev){
		var nowPoint = {x:0,y:0};
		var nowDeg = {};
		var nowDegSlow = {};//为了让人物慢一点,有立体的感觉
		nowPoint.x = ev.changedTouches[0].pageX;
		nowPoint.y = ev.changedTouches[0].pageY;
		var dis = {};
		dis.x = nowPoint.x - startPoint.x;
		dis.y = nowPoint.y - startPoint.y;
		var disDeg = {};
		disDeg.x = -dis.x/scale.x;
		disDeg.y = dis.y/scale.y;
		nowDeg.y = startEle.y + disDeg.y;
		nowDeg.x = startEle.x + disDeg.x;
		nowDegSlow.x = (startEle.x + disDeg.x)*0.9;
		nowDegSlow.y = (startEle.y + disDeg.y)*0.9;
		if( nowDeg.y > 40 ){
			nowDeg.y = 40;
		}else if( nowDeg.y < -40 ){
			nowDeg.y = -40;
		}
		if( nowDegSlow.y > 40 ){
			nowDegSlow.y = 40;
		}else if( nowDegSlow.y < -40 ){
			nowDegSlow.y = -40;
		}
		lastDis.x = nowDeg.x - lastDeg.x;
		lastDeg.x = nowDeg.x;
		lastDis.y = nowDeg.y - lastDeg.y;
		lastDeg.y = nowDeg.y;
		css(panoBg,'rotateX',nowDeg.y);
		css(panoBg,'rotateY',nowDeg.x);
		css(pano,'rotateX',nowDegSlow.y);
		css(pano,'rotateY',nowDegSlow.x);
		if(Math.abs(dis.x) > 300){
			dis.x = 300;
		}
		/*  触摸移动的时候图片会向后撤  */
		css(tZ,'translateZ',startZ - Math.abs(dis.x));
	});
	
	document.addEventListener('touchend',function(){
		var nowDeg = {x:css(panoBg,'rotateY'),y:css(panoBg,'rotateX')};
		var disDeg = {x:lastDis.x*10,y:lastDis.y*10};
		/*  停止移动的时候回到原位  */
		MTween({
			el: tZ,
			target: {translateZ: startZ},
			time: 800,
			type: 'easeOut'
		});
		/*  停止移动的时候缓冲停止  */
		MTween({
			el: panoBg,
			target: {rotateY: nowDeg.x +　disDeg.x, rotateX: nowDeg.y +　disDeg.y },
			time: 800,
			type: 'easeOut'
		});
		MTween({
			el: pano,
			target: {rotateY: nowDeg.x +　disDeg.x, rotateX: nowDeg.y +　disDeg.y },
			time: 800,
			type: 'easeOut'
		});
	});
}
/*---------背景图显示---------*/
function bgShow(){
	var pageBg = document.getElementById('pageBg');
	MTween({
		el: pageBg,
		target: {opacity: 100},
		time: 1000,
		type: 'linear'
	});
}
/*---------生成漂浮层---------*/
function createPano(){
	var pano = document.getElementById('pano');
	var deg = 18;
	var R = 406;
	var num = 0;
	var startDeg = 180;
	css(pano,'rotateX',0);
	css(pano,'rotateY',-180);
	css(pano,'scale',0);
	
	var pano1 = document.createElement('div');
	pano1.className = 'pano';
	css(pano1,'translateX',1.564);
	css(pano1,'translateZ',-9.877);
	for(var i=0;i<2;i++){
		var span = document.createElement('span');
		span.style.cssText = 'height:344px; margin-top:-172px;'
		span.style.background = 'url('+imgData['pano'][num]+')';
		css(span,'translateY',-163);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		num++;
		startDeg -= deg;
		pano1.appendChild(span);
	}
	pano.appendChild(pano1);
	
	var pano2 = document.createElement('div');
	pano2.className = 'pano';
	css(pano2,'translateX',20.225);
	css(pano2,'translateZ',-14.695);
	for(var i=0;i<3;i++){
		var span = document.createElement('span');
		span.style.cssText = 'height:326px; margin-top:-163px;'
		span.style.background = 'url('+imgData['pano'][num]+')';
		css(span,'translateY',278);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		num++;
		startDeg -= deg;
		pano2.appendChild(span);
	}
	pano.appendChild(pano2);
	
	var pano3 = document.createElement('div');
	pano3.className = 'pano';
	css(pano3,'translateX',22.275);
	css(pano3,'translateZ',11.35);
	for(var i=0;i<4;i++){
		var span = document.createElement('span');
		span.style.cssText = 'height:195px; margin-top:-97.5px;'
		span.style.background = 'url('+imgData['pano'][num]+')';
		css(span,'translateY',192.5);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		num++;
		startDeg -= deg;
		pano3.appendChild(span);
	}
	pano.appendChild(pano3);
	
	var pano4 = document.createElement('div');
	pano4.className = 'pano';
	css(pano4,'translateX',20.225);
	css(pano4,'translateZ',14.695);
	startDeg = 90;
	for(var i=0;i<5;i++){
		var span = document.createElement('span');
		span.style.cssText = 'height:468px; margin-top:-234px;'
		span.style.background = 'url('+imgData['pano'][num]+')';
		css(span,'translateY',129);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		num++;
		startDeg -= deg;
		pano4.appendChild(span);
	}
	pano.appendChild(pano4);
	
	var pano5 = document.createElement('div');
	pano5.className = 'pano';
	css(pano5,'translateX',-4.54);
	css(pano5,'translateZ',8.91);
	startDeg = 18;
	for(var i=0;i<6;i++){
		var span = document.createElement('span');
		span.style.cssText = 'height:444px; margin-top:-222px;'
		span.style.background = 'url('+imgData['pano'][num]+')';
		css(span,'translateY',-13);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		num++;
		startDeg -= deg;
		pano5.appendChild(span);
	}
	pano.appendChild(pano5);
	
	var pano6 = document.createElement('div');
	pano6.className = 'pano';
	css(pano6,'translateX',-11.35);
	css(pano6,'translateZ',22.275);
	startDeg = 18;
	for(var i=0;i<6;i++){
		var span = document.createElement('span');
		span.style.cssText = 'height:582px; margin-top:-291px;'
		span.style.background = 'url('+imgData['pano'][num]+')';
		css(span,'translateY',256);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		num++;
		startDeg -= deg;
		pano6.appendChild(span);
	}
	pano.appendChild(pano6);
	
	var pano7 = document.createElement('div');
	pano7.className = 'pano';
	css(pano7,'translateX',-20.225);
	css(pano7,'translateZ',-14.695);
	startDeg = -72;
	for(var i=0;i<6;i++){
		var span = document.createElement('span');
		span.style.cssText = 'height:421px; margin-top:-210.5px;'
		span.style.background = 'url('+imgData['pano'][num]+')';
		css(span,'translateY',-19.5);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		num++;
		startDeg -= deg;
		pano7.appendChild(span);
	}
	pano.appendChild(pano7);
	
	var pano8 = document.createElement('div');
	pano8.className = 'pano';
	css(pano8,'translateX',-17.82);
	css(pano8,'translateZ',-19.08);
	startDeg = -108;
	for(var i=0;i<3;i++){
		var span = document.createElement('span');
		span.style.cssText = 'height:523px; margin-top:-261.5px;'
		span.style.background = 'url('+imgData['pano'][num]+')';
		css(span,'translateY',176.5);
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		num++;
		startDeg -= deg;
		pano8.appendChild(span);
	}
	pano.appendChild(pano8);
	
	setTimeout(function(){
		MTween({
			el: pano,
			target: {
				rotateY: 25,
				scale: 100
			},
			time: 2000,
			type: 'easeBoth'
		});
	},2400);
}
/*--------重力感应--------*/
//function sensor(){
//	var pano = document.getElementById('pano');
//	var panoBg = document.getElementById('panoBg');
//	var last = {x:0,y:0};
//	var isStart = false;
//	var start = {};
//	var now = {};
//	var startEl = {};
//
//	window.addEventListener('deviceorientation', function(e){
//		var x = e.beta;
//		var y = e.gamma;
//		if(Math.abs(x - last.x)>=1||Math.abs(y - last.y)>=1) {
//			if(isStart){
//				//相当于move
//				now.x = x;
//				now.y = y;
//				var dis = {};
//				dis.x = now.x - start.x;
//				dis.y = now.y + start.y;
//				var deg = {};
//				deg.x = startEl.x + dis.x;
//				deg.y = startEl.y + dis.y;
//				if(deg.x > 40){
//					deg.x = 40;
//				} else if(deg.x < -40){
//					deg.x = 40;
//				}
//				
//				css(pano,"rotateY",deg.x);
//				css(pano,"rotateX",deg.y);
//				css(panoBg,"rotateY",deg.x);
//				css(panoBg,"rotateX",deg.y);
//				/*MTween({
//					el:pano,
//					target:{rotateX:deg.x,rotateY:deg.y},
//					time: 1000,
//					type: "easeBoth"
//				});
//				MTween({
//					el:panoBg,
//					target:{rotateX:deg.x,rotateY:deg.y},
//					time: 1000,
//					type: "easeBoth"
//				});*/
//			} else {
//				isStart = true;//相当于start
//				start.x = x;
//				start.y = y;
//				startEl.x = css(pano,"rotateX");
//				startEl.y = css(pano,"rotateY");
//			}
//			last.x = x;
//			last.y = y;
//		} else {
//			if(isStart){
//				isStart = false;
//				//执行end要执行的内容
//				now.x = x;
//				now.y = y;
//				var dis = {};
//				dis.x = now.x - start.x;
//				dis.y = now.y + start.y;
//				var deg = {};
//				deg.x = startEl.x + dis.x;
//				deg.y = startEl.y + dis.y;
//				if(deg.x > 40){
//					deg.x = 40;
//				} else if(deg.x < -40){
//					deg.x = 40;
//				}
//				MTween({
//					el:pano,
//					target:{rotateX:deg.x,rotateY:deg.y},
//					time: 1000,
//					type: "easeBoth"
//				});
//				MTween({
//					el:panoBg,
//					target:{rotateX:deg.x,rotateY:deg.y},
//					time: 1000,
//					type: "easeBoth"
//				});
//
//			}
//		}
//	});
//}