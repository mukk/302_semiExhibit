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

var worksDetailIndex = 0;
var worksNaviIndex = 0;

$(function(){

	
	if(_ua.Mobile){
		elasticH = 200;
	}else if(_ua.Tablet){
		elasticH = 500;	
	}else{
		elasticH = 680;
	}
	//aタグでスクロール
	$('a[href^=#]').click(function() {
		var myHref= $(this).attr("href");
		var myPos = $(myHref).offset().top;
		$("html,body").animate({scrollTop : myPos}, 400, 'swing');
		return false;
	});
	// var navflag = 0

	function naviSelect(){
		// jQueryで各idの座標を取得
		var off_intro = $("#intro").offset();
		var off_profs = $("#professors").offset();
		var off_works = $("#works").offset();
		var off_access = $("#access").offset();
		var navflag = $("#navbar").css("opacity");
		$(".nav").removeClass('navselect');
		if($(window).scrollTop() < 500){
			$(".nav").removeClass('navselect');
			if(navflag>=0.5){$("#navbar").animate({opacity:0.2},50);}
		}else if(500 < $(window).scrollTop()  && $(window).scrollTop() < off_profs.top-200){
			$("#navIntro").addClass('navselect');
			if(navflag<=0.5){$("#navbar").animate({opacity:0.8},50);}

		}else if(off_profs.top-200 <= $(window).scrollTop() && $(window).scrollTop() < off_works.top-200){
			// $("#navbar").animate({opacity:.8},10);
			$("#navProf").addClass('navselect');
		}else if(off_works.top-200 <= $(window).scrollTop() && $(window).scrollTop() < off_access.top-200){
			// $("#navbar").animate({opacity:.8},100);
			$("#navWorks").addClass('navselect');
		}else if(off_access.top-200 <= $(window).scrollTop() && $(window).scrollTop()+$(window).height() < $(document).height()-50){
			// $("#navbar").animate({opacity:.8},100);
			$("#navAccess").addClass('navselect');
		}else if($(document).height()-50 <= $(window).scrollTop()+$(window).height()){
			// $("#navbar").animate({opacity:.8},100);
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
	var worksListIndex;
	var worksListIndexPlus;
	var worksListLength;
	var semiRow = [0,2,2,1,4,0,0,5,1,0];

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
					"<li class='box'><a class='thumbs' href='#' data-featherlight='#fl"+i+"'>
					<img class='point' src='" + thumbStud + "'/>
					<div class='caption'>
					<p class='name'>"+ nameStud +"</p><p class='title'>"+ titleStud +"</p>
					</div>
					</a></li>"
				);
				$("#hiddencontainer").append(
					"<div id='fl"+i+"' class='lightbox'><div class='stabilizer'>
							<div class='flRight'>
								<img class='detailStud' src='"+ detailStud + "'/>
							</div>
							<div class='flLeft'>
								<img class='portStud' src='" + portStud + "'/>
								<div class='tag'><div class='nameStud'>" + nameStud + "</div><div class='titleStud'>"+ titleStud + "</div><div class='mediaStud'>"+ mediaStud + "</div></div>
								<div class='clSp'></div>
							</div>
							<div class='clSpsp'></div>
							<div class='flBottom'>
								<div class='cont'><div class='descStud'>"+ descStud + "</div></div>
							</div></div></div>"
				);
				i++;
				$(".detailStud").unveil(300);
			}
		});

		// monopoly.jsのためにここで一回呼び出す必要があるんだ
		$("img").unveil(300);
		//リストのローディング設定
		var thumbImgs = $(".point");
		var thumbImgsLength = thumbImgs.length;
		var rowExtend = semiRow[worksNaviIndex]*161+elasticH;
		// console.log(rowExtend);
		var thumbImgsCompCount = 0;
		$("#works").css("height",rowExtend+"px");
		for(var j=0; j<thumbImgsLength; j++){
			$(thumbImgs[j]).bind("load", function(){
				thumbImgsCompCount ++;
				if(thumbImgsLength == thumbImgsCompCount){
					$("#worksloading").animate({opacity:0},200,function(){$(this).hide();});
					$("#workslist").animate({opacity:1},200);
				}
			});
		}
		HoverSetting();

	}
	

	
	
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
	$(window).on("resize",resizeNaviDisplay());
	$("#toggleprof li").on("click", professorTab);
	$("#togglesemi li").on("click", worksNavi);
	// $(".caption").on("hover",  detailOpen);
	// // $(".caption").hover(detailOpen);
	// $.featherlight.defaults.beforeContent =alert("yo");
	// $.featherlight($('a.thumbs'), {beforeContent: alert("yo")});
	// $(".box").on("hover", detailOpen);
	// $(".caption").on("hover", detailOpen);
	// $("img",".introleft").on("click", professorLeft);
	// $("img",".introright").on("click", professorRight);
	// 生徒作品の li変更と右左のチェック
	$(window).on("load", worksNavi);
	// $(window).on("load", detailOpen);
	$(window).on("load", profInit);
	$("#navbar").hover(function(){$(this).animate({'opacity':'1'},200);},function(){$(this).animate({'opacity':'0.8'},200);});

});

function detailOpen(num){
	// worksDetailIndex = $("thumbnails li").index(this);
	// alert("o");

	$("#hiddencontainer").html("");
	worksDetailIndex = num;
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

// function worksDetailDataLoad(xml){
// 		//作品リストを一度初期化
// 		// $("#thumbnails").html("");
// 		// alert("oy");
// 		// worksNaviIndexPlus = worksNaviIndex+1;
// 		$(xml).find("data").each(function(){
// 			if($(this).attr("semi") == worksNaviIndex && $(this).attr("id") == worksDetailIndex){
				
				
// 				var portStud,detailStud,thumbStud,nameStud,mediaStud,titleStud,descStud;
// 				portStud = $(this).find("port").text();
// 				detailStud = $(this).find("detail").text();
// 				thumbStud = $(this).find("thumb").text();
// 				nameStud = $(this).find("name").text();
// 				mediaStud = $(this).find("media").text();
// 				titleStud = $(this).find("title").text();
// 				descStud = $(this).find("desc").text();
// 				$("#hiddencontainer").append(
// 					"<div id='fl' class='lightbox'>
// 						<div id='stabilizer'>
// 							<div id='flRight'>
// 								<img id='detailStud' src='"+ detailStud + "'/>
// 							</div>
// 							<div id='flLeft'>
// 								<img id='portStud' src='" + portStud + "'/>
								
// 								<div id='tag'>
// 									<div id='nameStud'>" + nameStud + "</div>
// 									<div id='titleStud'>"+ titleStud + "</div>
// 									<div id='mediaStud'>"+ mediaStud + "</div>
// 								</div>
// 								<div id='clSp'></div>
// 							</div>
// 							<div id='clSpsp'></div>
// 							<div id='flBottom'>
// 								<div id='cont'>
// 									<div id='descStud'>"+ descStud + "</div>
// 								</div>
// 							</div>
// 						</div>
// 					</div>"
// 					// "<div cid='fl' class='lightbox'>
// 					// 	<div class='stabilizer'>
// 					// 		<div class='flRight'>
// 					// 			<img class='detailStud' src='"+ detailStud + "'/>
// 					// 		</div>
// 					// 		<div class='flLeft'>
// 					// 			<img class='portStud' src='" + portStud + "'/>
								
// 					// 			<div class='tag'>
// 					// 				<div class='nameStud'>" + nameStud + "</div>
// 					// 				<div class='titleStud'>"+ titleStud + "</div>
// 					// 				<div class='mediaStud'>"+ mediaStud + "</div>
// 					// 			</div>
// 					// 			<div class='clSp'></div>
// 					// 		</div>
// 					// 		<div class='clSpsp'></div>
// 					// 		<div class='flBottom'>
// 					// 			<div class='cont'>
// 					// 				<div class='descStud'>"+ descStud + "</div>
// 					// 			</div>
// 					// 		</div>
// 					// 	</div>
// 					// </div>"
// 				);
// 			}
// 		});
// 		$("img").unveil(300);
// 		// console.log(rowExtend);
// 		var thumbImgsCompCount = 0;
// 		var thumbImgsLength = 0;
// 		// $("#works").css("height",rowExtend+"px");
// 		for(var i=0; i<thumbImgsLength; i++){
// 			$(thumbImgs[i]).bind("load", function(){
// 				thumbImgsCompCount ++;
// 				if(thumbImgsLength == thumbImgsCompCount){
// 					$("#worksloading").animate({opacity:0},200,function(){$(this).hide();});
// 					$("#workslist").animate({opacity:1},200);
// 				}
// 			});
// 		}
// 	}
// }