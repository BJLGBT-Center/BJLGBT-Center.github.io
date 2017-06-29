/*
 	hizhongxu@gmail.com
    https://github.com/ZhongxuYang
 */

setload();
//方块星空
(function () {
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame
	})();
	var canvas = document.getElementById("canvas");
	var c = canvas.getContext("2d");

	var numStars = 1900;
	var radius = '0.' + Math.floor(Math.random() * 9) + 1;
	var focalLength = canvas.width * 2;
	var warp = 0;
	var centerX, centerY;

	var stars = [],
		star;
	var i;

	var animate = true;

	initializeStars();

	function executeFrame() {

		if (animate) requestAnimFrame(executeFrame);
		moveStars();
		drawStars();
	}

	function initializeStars() {
		centerX = canvas.width / 2;
		centerY = canvas.height / 2;

		stars = [];
		for (i = 0; i < numStars; i++) {
			star = {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				z: Math.random() * canvas.width,
				o: '0.' + Math.floor(Math.random() * 99) + 1
			};
			stars.push(star);
		}
	}

	function moveStars() {
		for (i = 0; i < numStars; i++) {
			star = stars[i];
			star.z--;

			if (star.z <= 0) {
				star.z = canvas.width;
			}
		}
	}

	function drawStars() {
		var pixelX, pixelY, pixelRadius;

		if (canvas.width != window.innerWidth || canvas.width != window.innerWidth) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			initializeStars();
		}
		if (warp == 0) {
			c.fillStyle = "rgba(0,10,20,1)";
			c.fillRect(0, 0, canvas.width, canvas.height);
		}
		c.fillStyle = "rgba(255, 255, 255, " + radius + ")";
		for (i = 0; i < numStars; i++) {
			star = stars[i];

			pixelX = (star.x - centerX) * (focalLength / star.z);
			pixelX += centerX;
			pixelY = (star.y - centerY) * (focalLength / star.z);
			pixelY += centerY;
			pixelRadius = 1 * (focalLength / star.z);

			c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
			c.fillStyle = "rgba(255, 255, 255, " + star.o + ")";
		}
	}

	executeFrame();
})();

(function () {
	part2();
	function part2(){
		var part2 = document.getElementById("part2");
		var imgs = part2.getElementsByTagName("img");

		function exchange () {
			part2.removeEventListener("touchstart",exchange);
			if(imgs[1].style.opacity!=1){
				MTween({
					el: imgs[0],
					target: {opacity:0},
					time: 1000,
					type: 'easeOut'
				});
				console.log(imgs[1]);
				MTween({
					el: imgs[1],
					target: {opacity:100},
					time: 1000,
					type: 'easeOut',
					callBack: function(){
						part2.addEventListener("touchstart",exchange );
					}
				});
			}else{
				MTween({
					el: imgs[1],
					target: {opacity:0},
					time: 1000,
					type: 'easeOut'
				});
				MTween({
					el: imgs[0],
					target: {opacity:100},
					time: 1000,
					type: 'easeOut',
					callBack: function(){
						part2.addEventListener("touchstart",exchange );
					}
				});
			}
		};

		part2.addEventListener("touchstart",exchange );
	}
})();

function getPageScroll() {
	var xScroll, yScroll;
	if (self.pageYOffset) {
		yScroll = self.pageYOffset;
		xScroll = self.pageXOffset;
	} else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
		yScroll = document.documentElement.scrollTop;
		xScroll = document.documentElement.scrollLeft;
	} else if (document.body) {// all other Explorers
		yScroll = document.body.scrollTop;
		xScroll = document.body.scrollLeft;
	}
	arrayPageScroll = new Array(xScroll,yScroll);
	return arrayPageScroll;
};

(function () {
	var pic = document.getElementById("pics");
	var divs = pic.getElementsByTagName("div");
	document.addEventListener("touchmove", function () {
		for(var i=0;i<divs.length;i++){
			if(divs[i].getBoundingClientRect().top <  window.innerHeight){
				console.log(divs[i].getBoundingClientRect().top);
				divs[i].className = "";
			}
		}
		setTimeout(function () {
			for(var i=0;i<divs.length;i++){
				if(divs[i].getBoundingClientRect().top <  window.innerHeight){
					console.log(divs[i].getBoundingClientRect().top);
					divs[i].className = "";
				}
			}
		},1000);
	})
})();