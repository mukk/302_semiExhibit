var _ua = (function(u){
  return {
	Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1) 
	  || u.indexOf("ipad") != -1
	  || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
	  || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
	  || u.indexOf("kindle") != -1
	  || u.indexOf("silk") != -1
	  || u.indexOf("playbook") != -1,
	Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
	  || u.indexOf("iphone") != -1
	  || u.indexOf("ipod") != -1
	  || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
	  || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
	  || u.indexOf("blackberry") != -1
  }
})(window.navigator.userAgent.toLowerCase());

(function() {

	'use strict';

	var wavebox,gui,parameters;
	var composer,precomposer, finalPass;
	var pulse_flg = false;
	var MAX_X = 50;
	var MAX_Y = 40;
	var frameAmp = 35;
	var amp = 1.8;
	var waveWidth=window.innerWidth;
	var waveHeight=window.innerHeight;
	
	var k = 0.34;

	var attenuation = 0.98;

	parameters =
	{
		dotscreenAngle: 2.85, dotscreenScale: 0.1,
		useShaderNone:      function() { setupShaderDotScreen(); },
		useShaderDotScreen: function() { setupShaderDotScreen(); }

	};

	if(_ua.Mobile){
		pulse_flg = true;
		MAX_X = 22;
		frameAmp = 40;
		k = 0.4;
		attenuation = 0.9;
		parameters.dotscreenScale= 0.8;
	}else if(_ua.Tablet){
		MAX_X = 60;
		MAX_Y = 60;
		frameAmp = 30;
		pulse_flg = true;
		parameters.dotscreenScale= 0.4;
	}else{
		if(screen.width<=1400){MAX_X = 100;MAX_Y = 50;frameAmp = 25;}
		else if(screen.width<=1700){MAX_X = 140;MAX_Y = 70;frameAmp = 23;}
		else if(screen.width<=2000){MAX_X = 180;MAX_Y = 90;frameAmp = 21;}
		else if(screen.width<=2300){MAX_X = 220;MAX_Y = 110;frameAmp = 19;}
	}
	var HALF_X =Math.round(MAX_X/2);
	var HALF_Y =Math.round(MAX_Y/2);



	var U = [];
	var Vel = [];

	for (var x = 0; x < MAX_X; x++) {
		U[x]   = [];
		Vel[x] = [];
		for (var y = 0; y < MAX_Y; y++) {
			U[x][y] = 0;
			Vel[x][y] = 0;
		}
	}
	U[HALF_X][HALF_Y] = 10;



	function updateWave() {
		for (var x = 1; x < MAX_X - 1; x++) {
			for (var y = 1; y < MAX_Y - 1; y++) {
				var accel = U[x  ][y-1]
						  + U[x  ][y+1]
						  + U[x-1][y  ]
						  + U[x+1][y  ]
						  - U[x  ][y  ] * 5;
				accel *= k;
				Vel[x][y] = (Vel[x][y] + accel) * attenuation;

			}
		}
		


		for (var x = 0; x < MAX_X - 1; x++) {
			for (var y = 0; y < MAX_Y - 1; y++) {
				U[x][y] += Vel[x][y];
				var idx = y + (MAX_Y * x);
				Vel[0][y]/=2;
				Vel[0][MAX_Y-1]/=2;

				geometry.vertices[idx].z = U[x][y];


			}
			Vel[x][0]/=2;
			Vel[MAX_X-1][0]=2;
		}

		geometry.computeFaceNormals();
		geometry.verticesNeedUpdate = true;
		geometry.normalsNeedUpdate  = true;
		geometry.uvsNeedUpdate      = true;
	}

	// conteiner
	wavebox = document.getElementById( 'Wave' );

	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setClearColor(0xffffff,1.0);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, waveHeight);
	var element =renderer.domElement;

	

	wavebox.appendChild(element);


	function initShaderDotScreen()
	{
		composer = new THREE.EffectComposer( renderer );
		composer.addPass( new THREE.RenderPass( scene, camera ) );
		
		var effectDotScreen = new THREE.DotScreenPass( new THREE.Vector2(0,0), parameters.dotscreenAngle, parameters.dotscreenScale ); 
		effectDotScreen.renderToScreen = true; 
		composer.addPass(effectDotScreen); 
	}

	var scene  = new THREE.Scene();

	var camera = new THREE.OrthographicCamera( waveWidth / - frameAmp, waveWidth / frameAmp, waveHeight / frameAmp, waveHeight / - frameAmp, 1, 300 );

	camera.position.z = 100;
	camera.position.y = 0;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var circle = [];
	var geometry = new THREE.Geometry();
	var material = new THREE.MeshLambertMaterial({
		color    : 0x999999
	});

	var uvs = [];
	var w = MAX_X-1;
	var h = MAX_X-1;
	for (var i = 0; i < MAX_X; i++) {
		var amp_i =i*amp;
		for (var j = 0; j < MAX_Y; j++) {
			var amp_j =j*amp;
			geometry.vertices.push(new THREE.Vector3( amp_i, amp_j, 0));
		}
	}
	
	for (var i = 0; i < MAX_Y - 1; i++) {
		for (var j = 0; j < MAX_X - 1; j++) {
			x + (MAX_X * y)
			var idx0 = i + (MAX_Y*j);
			var idx1 = idx0 + 1;
			var idx2 = idx0 + MAX_Y;
			var idx3 = idx1 + MAX_Y;
			geometry.faces.push(new THREE.Face3(idx1, idx0, idx2));
			geometry.faces.push(new THREE.Face3(idx1, idx2, idx3));

		}

	}


	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.x -= HALF_X*amp ;
	mesh.position.y -= HALF_Y*amp ;
	scene.add(mesh);

	var light = new THREE.DirectionalLight(0xaa99ff);
	light.position.set(10, 10, 80);
	scene.add(light);

	var ambient = new THREE.AmbientLight(0xddeeff);
	scene.add(ambient);

	function pulse(){
		var rand_x =HALF_X+Math.round((Math.random()-0.5)*8);
		var rand_y =HALF_Y+Math.round((Math.random()-0.5)*6);
		U[rand_x][rand_y] += 10;
	}

	function OnMouseDown(e){
		var m_x = Math.round((e.clientX/window.innerWidth)*MAX_X);
		var m_y = Math.round((e.clientY/window.innerHeight)*MAX_Y);
		U[m_x][MAX_Y-m_y] += 5;


	}
	function OnMouseMove(e){
		var m_x = Math.round((e.clientX/window.innerWidth)*MAX_X);
		var m_y = Math.round((e.clientY/window.innerHeight)*MAX_Y);
		U[m_x][MAX_Y-m_y] += 2;

	}
	function TouchStart(e){
		var m_x = Math.round((e.changedTouches[0].pageX/window.innerWidth)*MAX_X);
		var m_y = Math.round((e.changedTouches[0].pageY/window.innerHeight)*MAX_Y);
		U[m_x][MAX_Y-m_y] += 10;
	}
	function TouchMove(e){
		var m_x = Math.round((e.changedTouches[0].pageX/window.innerWidth)*MAX_X);
		var m_x = Math.round((e.changedTouches[0].pageY/window.innerHeight)*MAX_Y);
		U[m_x][MAX_Y-m_y] += 10;
	}

	document.addEventListener('mousedown', OnMouseDown, false);
	document.addEventListener('mousemove', OnMouseMove, false);
	document.addEventListener('touchstart', TouchStart, false);
	document.addEventListener('touchmove', TouchMove, false);
	// document.addEventListener('resize', function(){initShaderDotScreen();}, false);
	THREEx.WindowResize(renderer, camera);
	// THREEx.WindowResize(composer, camera);

	initShaderDotScreen();
	
	var prevTime = Date.now();
	var pulseCount=0;
	(function loop() {
		if(pulse_flg){
			pulseCount++;
			if(pulseCount==50){
				pulse();
				pulseCount=0;
			}
		}
		composer.render();

		
		
		updateWave();
		setTimeout(loop, 24);
	}());
}());
$('head').append(
	'#generalveil, #generalload { display: block; }</style>'
);
 
jQuery.event.add(window,"load",function() { // 全ての読み込み完了後に呼ばれる関数
	$("#generalveil").delay(900).fadeOut(800).remove();
	// $("#generalload").delay(600).fadeOut(300);
	$("#container").css("display", "block");
});

//setting.js line200 あたりで呼び出してる、そうしないと動かないから 
function HoverSetting() {
	 
	if(jQuery.support.opacity){
		 
		var fadeSpeed = 400;
		var rollover = $('a.thumbs');
		 
		rollover.children('img').each(function() { 
			if(this.src.match('_mono')) { 
				var imgWidth = $(this).width();
				var imgHeight = $(this).height();
				$(this).parent('a.thumbs').css( {display: 'inline-block', width: imgWidth, height: imgHeight});
					 
				this.onImgSrc = new Image();
				this.onImgSrc.src = this.getAttribute('src').replace('_mono', '_poly'); 
				$(this.onImgSrc).css( {position: 'absolute', opacity: 0} ).addClass('poly'); 
				$(this).before(this.onImgSrc);
				 
				// $(this.onImgSrc).mousedown(function(){ 
				//     $(this).stop().animate({opacity: 0}, {duration: fadeSpeed, queue: false}); 
				// }); 
		 
				$(this).parent('a.thumbs').hover(
					function(){ 
						$(this).children('.poly').animate( {opacity: 1}, {duration: fadeSpeed, queue: false}); 
						$(this).children('.caption').animate( {opacity: .4}, {duration: fadeSpeed, queue: false}); 
					},
					function(){ 
						$(this).children('.poly').animate( {opacity: 0}, {duration: fadeSpeed, queue: false});
						$(this).children('.caption').animate( {opacity: 1}, {duration: fadeSpeed, queue: false}); 

					}
				); 
			} 
		});
	} else { // IE8-
		$('a[href] img, input[type="image"]').mouseover(function() {
			$(this).attr('src', $(this).attr('src').replace('_mono', '_poly'));
			$(this).mouseout(function() {
				$(this).attr('src', $(this).attr('src').replace('_poly', '_mono'));
			});
		});
	}
 
}

$(function(){
	//aタグでスクロール
	$('a[href^=#]').click(function() {
		var myHref= $(this).attr("href");
		var myPos = $(myHref).offset().top;
		$("html,body").animate({scrollTop : myPos}, 400, 'swing');
		return false;
	});

	function naviSelect(){
		// jQueryで各idの座標を取得
		var off_intro = $("#intro").offset();
		var off_profs = $("#professors").offset();
		var off_works = $("#works").offset();
		var off_access = $("#access").offset();

		$(".nav").removeClass('navselect');
		if($(window).scrollTop() < 500){
			$(".nav").removeClass('navselect');
		}else if(500 < $(window).scrollTop()  && $(window).scrollTop() < off_profs.top-200){
			$("#navIntro").addClass('navselect');
		}else if(off_profs.top-200 <= $(window).scrollTop() && $(window).scrollTop() < off_works.top-200){
			$("#navProf").addClass('navselect');
		}else if(off_works.top-200 <= $(window).scrollTop() && $(window).scrollTop() < off_access.top-200){
			$("#navWorks").addClass('navselect');
		}else if(off_access.top-200 <= $(window).scrollTop() && $(window).scrollTop()+$(window).height() < $(document).height()-150){
			$("#navAccess").addClass('navselect');
		}else if($(document).height()-150 <= $(window).scrollTop()+$(window).height()){
			$(".nav").removeClass('navselect');
		}
	}



	//スマホでの各コンテンツ上ナビゲーション、ドロップダウン
	function smNaviSlideIn(){
		if($(window).width() <= 640){ 
			$("ul",this).slideToggle(200);
		}else{}
	}
	//slideToggleを使ったことで表示なくなるの修正
	function resizeNaviDisplay(){
		if($(window).width() > 640){ 
			$(".contentsnavi").show();
		}else{}
	}

	/*はじめにのliの順番を記憶*/
	var profNaviIndex = 0;

	//xml読み込み時の動作
	function profDataLoad(xml){
		$(xml).find("data:eq("+profNaviIndex+")").each(function(){
			$("#portProf").attr("src",(""));
			$("#nameProf").html("");
			$("#contProf").html("");
			$("#portProf").attr("src",($(this).find("port").text()));
			$("#nameProf").append($(this).find("name").text());
			$("#contProf").append($(this).find("cont").text());
			var	 imgprofpic = new Image();
				imgprofpic.src = $(this).find("port").text();
			$(imgprofpic).bind("load",function(){
				$("#profloading").animate({opacity:0},200,function(){$(this).hide();})
				$("#professor").animate({opacity:1},200);
			});
		});
	}
	function profInit(){
		$("#profloading").show().css("opacity","1");
		$("#professor").css("opacity","0");
		$("#toggleprof li:first").addClass("selected");
		profNaviIndex = 0;

		$.ajax({  
			url:'xml/prof.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:profDataLoad
		});
	}
	function professorTab(){
		//kyojuloadローディングの表示
		$("#profloading").show().css("opacity","1");
		$("#professor").css("opacity","0");

		//タブについているクラスselectを消し、クリックされたタブにクラスselectをつける
		$("#toggleprof li").removeClass("selected");
		$(this).addClass("selected");

		//ナビゲーションのliの順番を代入（0～）
		profNaviIndex = $('#toggleprof li').index(this);

		$.ajax({  
			url:'xml/prof.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:profDataLoad
		});
	}

	function professorLeft(){
		//kyojuloadローディングの表示
		$("#profloading").show().css("opacity","1");
		$("#professor").css("opacity","0");

		//もし今見ているのが序(0)なら
		// if(profNaviIndex == 0){
		// 	$('.introbox').css("display","none");
		// 	$('.kyojubox').css("display","inline");
		// 	profNaviIndex = $("#toggleprof li").length;
		// }else if(profNaviIndex == 1){
		// 	$('.kyojubox').css("display","none");
		// 	$('.introbox').css("display","inline");
		// }else{}
		profNaviIndex = profNaviIndex-1;

		//xml読み込み
		$.ajax({  
			url:'xml/prof.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:profDataLoad
		});

		//タブについているクラスselectを消し、該当のタブにクラスselectをつける
		$("#toggleprof li").removeClass("selected");
		$("#toggleprof li:eq("+profNaviIndex+")").addClass("selected");
	}

	function professorRight(){
		//kyojuloadローディングの表示
		$("#profloading").show().css("opacity","1");
		$("#professor").css("opacity","0");
		
		//もし今見ているのが序(0)なら
		// if(profNaviIndex == 0){
		// 	$('.introbox').css("display","none");
		// 	$('.kyojubox').css("display","inline");
		// }else if(profNaviIndex == $("#toggleprof li").length-1){
		// 	$('.kyojubox').css("display","none");
		// 	$('.introbox').css("display","inline");
		// 	profNaviIndex = -1;
		// }else{}
		profNaviIndex　= profNaviIndex+1;

		//xml読み込み
		$.ajax({  
			url:'xml/prof.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:profDataLoad
		});

		//タブについているクラスselectを消し、該当のタブにクラスselectをつける
		$("#toggleprof li").removeClass("selected");
		$("#toggleprof li:eq("+profNaviIndex+")").addClass("selected");

	}


	//作品リストの順番総数を記録
	var worksNaviIndex = 0;
	var worksDetailIndex = 0;
	var semiRow = [0,2,2,1,4,0,0,5,1,0];
	var worksListIndex;
	var worksListIndexPlus;
	var worksListLength;

	//xml読み込み時のファンクション
	function worksListDataLoad(xml){
		var i=0;
		//作品リストを一度初期化
		$("#thumbnails").html("");
		$("#hiddencontainer").html("");
		// worksNaviIndexPlus = worksNaviIndex+1;
		$(xml).find("data").each(function(){
			if($(this).attr("semi") == worksNaviIndex){
				
				
				var portStud,detailStud,thumbStud,nameStud,mediaStud,titleStud,descStud;
				portStud = $(this).find("port").text();
				detailStud = $(this).find("detail").text();
				thumbStud = $(this).find("thumb").text();
				nameStud = $(this).find("name").text();
				mediaStud = $(this).find("media").text();
				titleStud = $(this).find("title").text();
				descStud = $(this).find("desc").text();

				$("#thumbnails").append(
				//作品リストに繰り返し読み込みと表示
					"<li class='box'>
						<a class='thumbs' href='#' data-featherlight='#fl"+i+"'>
							<img class='point' src='" + thumbStud + "'/>
							<div class='caption'>
								<p class='name'>"+ nameStud +"</p>
								<p class='title'>"+ titleStud +"</p>
							</div>
						</a>
					</li>"
				);
				$("#hiddencontainer").append(
					"<div id='fl"+i+"' class='lightbox'>
						<div class='stabilizer'>
							<div class='flLeft'>
								<img class='portStud' src='" + portStud + "'/>
								<div class='tag'>
									<div class='nameStud'>" + nameStud + "</div>
									<div class='titleStud'>"+ titleStud + "</div>
									<div class='mediaStud'>"+ mediaStud + "</div>
								</div>
								<div class='clSp'></div>
								<div class='cont'>
									<div class='descStud'>"+ descStud + "</div>
								</div>

							</div>
							<div class='flRight'>
								<img class='detailStud' src='"+ detailStud + "'/>
							</div>
						</div>
					</div>"
				);
				i++;
			}
		});
		// monopoly.jsのためにここで一回呼び出す必要があるんだ
		HoverSetting();
		$("img").unveil(300);
		//リストのローディング設定
		var thumbImgs = $(".point");
		var thumbImgsLength = thumbImgs.length;
		var rowExtend = semiRow[worksNaviIndex]*161+660;
		console.log(rowExtend);
		var thumbImgsCompCount = 0;
		$("#works").css("height",rowExtend+"px");
		for(var i=0; i<thumbImgsLength; i++){
			$(thumbImgs[i]).bind("load", function(){
				thumbImgsCompCount ++;
				if(thumbImgsLength == thumbImgsCompCount){
					$("#worksloading").animate({opacity:0},200,function(){$(this).hide();});
					$("#workslist").animate({opacity:1},200);
				}
			});
		}

	}

	// function worksDetailDataLoad(xml){

	// 	//作品リストを一度初期化
	// 	$("#hiddencontainer").html("");
	// 	// $("#hiddencontainer").html("");
	// 	$(xml).find("data").each(function(){
	// 		if($(this).attr("semi") == worksNaviIndex && $(this).attr("id") == 0 ){

	// 		}
	// 	});
	// 	// HoverSetting();
	// 	//リストのローディング設定
	// 	// var thumbImgs = $(".point");
	// 	// var thumbImgsLength = thumbImgs.length;
	// 	// var thumbImgsCompCount = 0;
	// 	// for(var i=0; i<thumbImgsLength; i++){
	// 	// 	$(thumbImgs[i]).bind("load", function(){
	// 	// 		thumbImgsCompCount ++;
	// 	// 		if(thumbImgsLength == thumbImgsCompCount){
	// 	// 			$("#worksloading").animate({opacity:0},200,function(){$(this).hide();});
	// 	// 			$("#workslist").animate({opacity:1},200);
	// 	// 		}
	// 	// 	});
	// 	// }
	// }
	
	function worksNavi(){

		$("#worksloading").show().css("opacity","1");
		$("#workslist").css("opacity","0");
		//ナビゲーションのliの順番を代入（0～）
		worksNaviIndex = $('#togglesemi li').index(this);

		//タブについているクラスselectを消し、クリックされたタブにクラスselectをつける
		$("#togglesemi li").removeClass("selected");
		$(this).addClass("selected");

		$("#profName").html("");
		// $("#thumbnails").html("");


		//初期値が-1、0の新島ゼミに
		if(worksNaviIndex == -1){
			worksNaviIndex = 0;
			$("#togglesemi li:eq(0)").addClass("selected");
			$("#profName").append("後藤ゼミ");
		}
		// それ以外はこの関数でsemiNameを変更します
		semiNameChange(worksNaviIndex);

		//xml読み込み
		$.ajax({
			url:'xml/works.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:worksListDataLoad
		});
	}

	function detailOpen(){
		// worksDetailIndex = $("thumbnails li").index(this);
		worksDetailIndex = 0;
		$.ajax({  
			url:'xml/works.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:worksDetailDataLoad
		});
	}

	function worksListLeft(){
		//workslistloadローディングを表示
		$("#workloading").show().css("opacity","1");
		$("#workslist").css("opacity","0");

		$("#workslist").html("");
		//もし今見ているのが新島ゼミ(0)なら
		if(worksNaviIndex == 0){
			worksNaviIndex = $("#togglesemi li").length;
		}else{}
		worksNaviIndex　= worksNaviIndex-1;

		//xml読み込み
		$.ajax({  
			url:'xml/works.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:worksListDataLoad
		});

		semiNameChange(worksNaviIndex);

	}

	function worksListRight(){
		//workslistloadローディングを表示
		$("#workloading").show().css("opacity","1");
		$("#workslist").css("opacity","0");

		$("#workslist").html("");
		//もし今見ているのが序(0)なら
		if(worksNaviIndex == $("#togglesemi li").length-1){
			worksNaviIndex = -1;
		}else{}
		worksNaviIndex = worksNaviIndex+1;

		//xml読み込み
		$.ajax({  
			url:'xml/works.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:worksListDataLoad
		});

		semiNameChange(worksNaviIndex);
	}

	function semiNameChange(index){
		if(index==0){$("#profName").html("");$("#profName").append("後藤ゼミ");}
		else if(index==1){$("#profName").html("");$("#profName").append("齋藤ゼミ");}
		else if(index==2){$("#profName").html("");$("#profName").append("白井ゼミ");}
		else if(index==3){$("#profName").html("");$("#profName").append("陣内ゼミ");}
		else if(index==4){$("#profName").html("");$("#profName").append("寺山ゼミ");}
		else if(index==5){$("#profName").html("");$("#profName").append("西本ゼミ");}
		else if(index==6){$("#profName").html("");$("#profName").append("キューゼミ");}
		else if(index==7){$("#profName").html("");$("#profName").append("古堅ゼミ");}
		else if(index==8){$("#profName").html("");$("#profName").append("本田ゼミ");}
		else if(index==9){$("#profName").html("");$("#profName").append("大学院");}

		//タブについているクラスselectを消し、該当のタブにクラスselectをつけかえる
		$("#togglesemi li").removeClass("selected");
		$("#togglesemi li:eq("+index+")").addClass("selected");	
		return;
	}
	
	// $(window).on("load", pageLoad);
	$(window).on("scroll", naviSelect);
	$(".profsnavibox").on("click", smNaviSlideIn);
	$("#togglesemibox").on("click", smNaviSlideIn);
	// 教授陣の li変更と右左のチェック
	$(window).on("resize",resizeNaviDisplay);
	$("#toggleprof li").on("click", professorTab);
	$("#togglesemi li").on("click", worksNavi);
	// $(".point").on("hover", detailOpen);
	// $(".box").on("hover", detailOpen);
	// $(".caption").on("hover", detailOpen);
	// $(".name").on("hover", detailOpen);
	// $("img",".introleft").on("click", professorLeft);
	// $("img",".introright").on("click", professorRight);
	// 生徒作品の li変更と右左のチェック
	$(window).on("load", worksNavi);
	// $(window).on("load", detailOpen);
	$(window).on("load", profInit);
	$("#navbar").hover(function(){$(this).animate({'opacity':'1'},200)},function(){$(this).animate({'opacity':'0.8'},200)});

});