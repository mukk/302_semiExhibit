$(function(){
	//aタグでスクロール
	$('a[href^=#]').click(function() {
		var myHref= $(this).attr("href");
		var myPos = $(myHref).offset().top;
		$("html,body").animate({scrollTop : myPos}, 300, 'swing');
		return false;
	});

	function naviSelect(){
		// jQueryで各idの座標を取得
		var off_intro = $("#intro").offset();
		var off_profs = $("#professors").offset();
		var off_works = $("#works").offset();
		var off_access = $("#access").offset();
		if($(window).scrollTop() < 150){
			// $(".navTop").animate({'marginTop':'29px'},400);
		}else if(150 <= $(window).scrollTop() && $(window).scrollTop() < off_intro.top-300){
			$(".navTop").animate({'marginLeft':'-5px'},200);
			document.navintro.src = 	"img/util/nav_ripple.png";
			document.navprofs.src = 	"img/util/nav_ripple.png";
			document.navworks.src = 	"img/util/nav_ripple.png";
			document.navaccess.src = 	"img/util/nav_ripple.png";
		}else if(off_intro.top-300 <= $(window).scrollTop() && $(window).scrollTop() < off_profs.top-300){
			$(".navTop").animate({'marginLeft':'10px'},200);
			document.navintro.src = 	"img/util/nav_ripple.png";
			document.navprofs.src = 	"img/util/nav_empty.png";
			document.navworks.src = 	"img/util/nav_empty.png";
			document.navaccess.src = 	"img/util/nav_empty.png";
		}else if(off_profs.top-300 <= $(window).scrollTop() && $(window).scrollTop() < off_works.top-300){
			$(".navTop").animate({'marginLeft':'-10px'},200);
			document.navintro.src = 	"img/util/nav_empty.png";
			document.navprofs.src = 	"img/util/nav_ripple.png";
			document.navworks.src = 	"img/util/nav_empty.png";
			document.navaccess.src = 	"img/util/nav_empty.png";
		}else if(off_works.top-300 <= $(window).scrollTop() && $(window).scrollTop() < off_access.top-300){
			$(".navTop").animate({'marginLeft':'5px'},200);
			document.navintro.src = 	"img/util/nav_empty.png";
			document.navprofs.src = 	"img/util/nav_empty.png";
			document.navworks.src = 	"img/util/nav_ripple.png";
			document.navaccess.src = 	"img/util/nav_empty.png";
		}else if(off_access.top-300 <= $(window).scrollTop() && $(window).scrollTop()+$(window).height() < $(document).height()-150){
			$(".navTop").animate({'marginLeft':'-5px'},200);
			document.navintro.src = 	"img/util/nav_empty.png";
			document.navprofs.src = 	"img/util/nav_empty.png";
			document.navworks.src = 	"img/util/nav_empty.png";
			document.navaccess.src = 	"img/util/nav_ripple.png";
		}else if($(document).height()-150 <= $(window).scrollTop()+$(window).height()){
			document.navintro.src = 	"img/util/nav_empty.png";
			document.navprofs.src = 	"img/util/nav_empty.png";
			document.navworks.src = 	"img/util/nav_empty.png";
			document.navaccess.src = 	"img/util/nav_empty.png";
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
	var profNaviIndex,worksNaviIndex = 0;

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
				$("#professor").animate({opacity:1},200);
				$("#profloading").animate({opacity:0},200,function(){$(this).hide();})
			});
		});
	}
	function profInit(){
		$("#profloading").show().css("opacity","1");
		$("#professor").css("opacity","0");
		$("#toggleprof li").addClass("selected");
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

	//xml読み込み時のファンクション
	function worksListDataLoad(xml){

		//作品リストを一度初期化
		$("#thumbnails").html("");
		$("#hiddencontainer").html("");
		
		var i =0;
		$(xml).find("data").each(function(){
			if($(this).attr("semi") == worksNaviIndex){
				
				var portStud,detailStud,thumbStud,nameStud,mediaStud,titleStud,descStud;
				// portStud = $(this).find("port").text();
				// detailStud = $(this).find("detail").text();
				thumbStud = $(this).find("thumb").text();
				nameStud = $(this).find("name").text();
				// mediaStud = $(this).find("media").text();
				titleStud = $(this).find("title").text();
				// descStud = $(this).find("desc").text();


				$("#thumbnails").append(
				//作品リストに繰り返し読み込みと表示
					"<li class='box'>
						<a class='thumbs' href='#' data-featherlight='#fl'>
							<img class='point' src='" + thumbStud + "'/>
							<div class='caption'>
								<p class='name'>"+ nameStud +"</p>
								<p class='title'>"+ titleStud +"</p>
							</div>
						</a>
					</li>"
				);	
			}
		});
		HoverSetting();
		//リストのローディング設定
		var thumbImgs = $("img","a.thumbs");
		var thumbImgsLength = thumbImgs.length;
		var thumbImgsCompCount = 0;

		for(var i=0; i<thumbImgsLength; i++){
			$(thumbImgs[i]).bind("load", function(){
				thumbImgsCompCount ++;
				if(thumbImgsLength == thumbImgsCompCount){
					$("#workslist").animate({opacity:1},200);
					$("#worksloading").animate({opacity:0},200,function(){$(this).hide();});
				}
			});
		}


		//読み込んで配置したら、リストクリック時実行するファンクション
		// $("#thumbnails li").on("click", function(){
		// 	//worksinfoloadローディングを表示
		// 	$(".worksinfoload").show().css("opacity","1");
		// 	$(".workspic, .worksinfo").css("opacity","0");

		// 	//#worksまでページ内移動
		// 	if($('.workslist').hasClass("workslist_on") == true){
		// 	}else{
		// 		if($(window).height() < 700 && 640 < $(window).width()){
		// 			$("html,body").animate({scrollTop : $(".workslistbox").offset().top-20}, 200, 'swing');
		// 		}else if($(window).width() <= 640){
		// 			$("html,body").animate({scrollTop : $("#togglesemibox").offset().top}, 200, 'swing');
		// 		}else{
		// 			$("html,body").animate({scrollTop : $("#works").offset().top}, 200, 'swing');
		// 		}
		// 	}

		// 	//作品リストのliの順番を代入（0～）
		// 	worksListIndex = $('#thumbnails li').index(this);
		// 	worksListIndexPlus = worksListIndex+1;
		// 	worksListLength = $('#thumbnails li').length;

		// 	$('.worksinfobox').css("display","inline");
		// 	//作品リストの形状を変える
		// 	$('.workslist').addClass("workslist_on");
		// 	//display:noneの切り替え
		// 	$('.workslistshift').addClass("workslist_on");
		// 	$('.workslistbox').addClass("workslist_on");


		// 	//作品リストについているクラスselectを消し、クリックしたリストと同じ順番のリストにクラスselectをつける
		// 	$('#thumbnails li').removeClass("selected");
		// 	$('#thumbnails li:eq('+worksListIndex+')').addClass("selected");

		// 	//ゼミ名リストの順番、作品リストの順番
		// 	//alert(worksNaviIndex +"a"+  worksListIndex);

		// 	$(xml).find("data").each(function(){
		// 		if($(this).attr("semi") == worksNaviIndex && $(this).attr("id") == worksListIndex){
		// 			// 初期化
		// 			$(".point").attr("src",(""));
		// 			$(".name").html("");
		// 			$(".title").html("");

		// 			// $(".worksinfoimg").attr("src",(""));
		// 			// $(".worksinfoname").html("");
		// 			// $(".worksinfotitle").html("");
		// 			// $(".worksinfogenre").html("");
		// 			// $(".worksinfoplace").html("");
		// 			// $(".worksinfocom").html("");
		// 			$(".zemiindex").html("");
		// 			// データの書き込み
		// 			$(".point").attr("src",($(this).find("thumb").text()));
		// 			$(".name").append($(this).find("name").text());
		// 			$(".title").append($(this).find("title").text());
		// 			// $(".worksinfoimg").attr("src",($(this).find("photo").text()));
		// 			// $(".worksinfoname").append($(this).find("nam").text());
		// 			// $(".worksinfotitle").append($(this).find("ttl").text());
		// 			// $(".worksinfogenre").append($(this).find("gnr").text());
		// 			// $(".worksinfoplace").append($(this).find("plc").text());
		// 			// $(".worksinfocom").append($(this).find("com").text());
		// 			$(".zemiindex").append(worksListIndexPlus + "/" + worksListLength);

		// 			//画像を読み込んでからのファンクション
		// 			var imgpic = new Image();
		// 			var imgphoto = new Image();
		// 				imgpic.src = $(this).find("pic").text();
		// 				imgphoto.src = $(this).find("photo").text();
		// 			$(imgpic,imgphoto).bind("load",function(){
		// 				$(".worksinfoload").animate({opacity:0},200,function(){$(this).hide();})
		// 				$(".workspic, .worksinfo").animate({opacity:1},200);
		// 			});
		// 		}
		// 	});
		// });
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

	function detailOpen(xml){
		console.log(worksNaviIndex);

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
				$("#hiddencontainer").append(
					"<div id='fl' class='lightbox'>
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
					</div>"
				);
			}
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
		worksNaviIndex　= worksNaviIndex+1;

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
	// $("img",".introleft").on("click", professorLeft);
	// $("img",".introright").on("click", professorRight);
	// 生徒作品の li変更と右左のチェック
	$(window).on("load", worksNavi);
	$(window).on("load", profInit);
	$("#togglesemi li").on("click", worksNavi);
	$(".thumbs").on("click", detailOpen);

});