$(function(){

	//ローディング中の目隠しを表示
	// $(".loadbox").css("display","block");
	// $(".loadicon").css("margin-top",$(window).scrollTop()+$(window).height()*1/3);

	// function pageLoad(){
	// 	$("#generalload").fadeOut(300);
	// 	$("#generalveil").delay(300).fadeOut(300);
	// }

	// function tenjiTitleSize(){
	// 	if($(window).width() <= 640){ 
	// 		document.tenjititlepng.src = "img/tenjititle_sm.png";
	// 	}else{
	// 		document.tenjititlepng.src = "img/tenjititle.png";
	// }
	// }

	//aタグでスクロール
	$('a[href^=#]').click(function() {
		var myHref= $(this).attr("href");
		var myPos = $(myHref).offset().top;
		$("html,body").animate({scrollTop : myPos}, 200, 'swing');
		return false;
   });

	// function naviUnderbar(){
	// 	// jQueryで各idの座標を取得
	// 	var off_intro = $("#intro").offset();
	// 	var off_works = $("#works").offset();
	// 	var off_access = $("#access").offset();

	// 	if($(window).scrollTop() < 150){
	// 		document.naviintro.src = 	"img/navi_intro_on.png";
	// 		document.naviworks.src = 	"img/navi_works_on.png";
	// 		document.naviaccess.src = 	"img/navi_access_on.png";
	// 	}else if(150 <= $(window).scrollTop() && $(window).scrollTop() < off_intro.top-300){
	// 		document.naviintro.src = 	"img/navi_intro.png";
	// 		document.naviworks.src = 	"img/navi_works.png";
	// 		document.naviaccess.src = 	"img/navi_access.png";
	// 	}else if(off_intro.top-300 <= $(window).scrollTop() && $(window).scrollTop() < off_works.top-300){
	// 		document.naviintro.src = 	"img/navi_intro_on.png";
	// 		document.naviworks.src = 	"img/navi_works.png";
	// 		document.naviaccess.src = 	"img/navi_access.png";
	// 	}else if(off_works.top-300 <= $(window).scrollTop() && $(window).scrollTop() < off_access.top-300){
	// 		document.naviintro.src = 	"img/navi_intro.png";
	// 		document.naviworks.src = 	"img/navi_works_on.png";
	// 		document.naviaccess.src = 	"img/navi_access.png";
	// 	}else if(off_access.top-300 <= $(window).scrollTop() && $(window).scrollTop()+$(window).height() < $(document).height()-150){
	// 		document.naviintro.src = 	"img/navi_intro.png";
	// 		document.naviworks.src = 	"img/navi_works.png";
	// 		document.naviaccess.src = 	"img/navi_access_on.png";
	// 	}else if($(document).height()-150 <= $(window).scrollTop()+$(window).height()){
	// 		document.naviintro.src = 	"img/navi_intro.png";
	// 		document.naviworks.src = 	"img/navi_works.png";
	// 		document.naviaccess.src = 	"img/navi_access.png";
	// 	}
	// }

	function memoriRandom(){
		//目盛り画像の総数
		var memoriNum = 6;

		for(var i=0;i<memoriNum;i++){
			// マージンのランダム
			var random = Math.random();
			$("#memori"+String(i)).css("margin-bottom",(5+random*100)+"px");
			// 数秒待った後フェードイン
			$("#memori"+String(i)).delay((memoriNum+1-i)*400).animate({opacity:"1"},300);
			
			if(i==2){
				var randomIn = Math.random();
				$("#memoriin0").css("margin-bottom",(30+randomIn*150)+"px");
				$("#memoriin1").delay((memoriNum+1-i)*400).animate({opacity:"1"},300);
			}else if(i==0){
				$("#memoriin0").delay((memoriNum+1-i)*400).animate({opacity:"1"},300);
			}
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
	var introNaviIndex;
	introNaviIndex = 0;

	//xml読み込み時の動作
	function kyojuDataLoad(xml){
		$(xml).find("data:eq("+introNaviIndex+")").each(function(){
			$(".kyojupic	 img").attr("src",(""));
			$(".kyojuname").html("");
			$(".kyojutxt").html("");
			$(".kyojupic	 img").attr("src",($(this).find("pic").text()));
			$(".kyojuname").append($(this).find("nam").text());
			$(".kyojutxt").append($(this).find("com").text());

			//画像を読み込んでからのファンクション
			var	 imgkyojupic = new Image();
				imgkyojupic.src = $(this).find("pic").text();
			$	(imgkyojupic).bind("load",function(){
				$(".kyojuload").animate({opacity:0},200,function(){$(this).hide();})
				$(".kyojupic, .kyojutxt").animate({opacity:1},200);
			});
		});
	}

	function introTab(){
		//kyojuloadローディングの表示
		$(".kyojuload").show().css("opacity","1");
		$(".kyojupic, .kyojutxt").css("opacity","0");

		//タブについているクラスselectを消し、クリックされたタブにクラスselectをつける
		$(".intronavi li").removeClass("select");
		$(this).addClass("select");

		//ナビゲーションのliの順番を代入（0～）
		introNaviIndex = $('.intronavi li').index(this);

		if(introNaviIndex == 0){
			// リストの0番目が押されたら、kyojuboxを消しintroboxを表示
			$('.kyojubox').css("display","none");
			$('.introbox').css("display","inline");
			//xml読み込み 非表示時も、デフォルトで新島先生の文を入れる
			$.ajax({  
				url:'xml/kyoju.xml',
				type:'get',
				dataType:'xml',
				timeout:1000,
				error:function(){
					//alert("load error");
				},
				success:kyojuDataLoad
			});  
		}else{
			//xml読み込み
			$.ajax({  
				url:'xml/kyoju.xml',
				type:'get',
				dataType:'xml',
				timeout:1000,
				error:function(){
					//alert("load error");
				},
				success:kyojuDataLoad
			});  

			$('.introbox').css("display","none");
			$('.kyojubox').css("display","inline");
		}
	}

	function introLeft(){
		//kyojuloadローディングの表示
		$(".kyojuload").show().css("opacity","1");
		$(".kyojupic, .kyojutxt").css("opacity","0");

		//もし今見ているのが序(0)なら
		if(introNaviIndex == 0){
			$('.introbox').css("display","none");
			$('.kyojubox').css("display","inline");
			introNaviIndex = $(".intronavi li").length;
		}else if(introNaviIndex == 1){
			$('.kyojubox').css("display","none");
			$('.introbox').css("display","inline");
		}else{}
		introNaviIndex　= introNaviIndex-1;

		//xml読み込み
		$.ajax({  
			url:'xml/kyoju.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:kyojuDataLoad
		});

		//タブについているクラスselectを消し、該当のタブにクラスselectをつける
		$(".intronavi li").removeClass("select");
		$(".intronavi li:eq("+introNaviIndex+")").addClass("select");
	}

	function introRight(){
		//kyojuloadローディングの表示
		$(".kyojuload").show().css("opacity","1");
		$(".kyojupic, .kyojutxt").css("opacity","0");
		
		//もし今見ているのが序(0)なら
		if(introNaviIndex == 0){
			$('.introbox').css("display","none");
			$('.kyojubox').css("display","inline");
		}else if(introNaviIndex == $(".intronavi li").length-1){
			$('.kyojubox').css("display","none");
			$('.introbox').css("display","inline");
			introNaviIndex = -1;
		}else{}
		introNaviIndex　= introNaviIndex+1;

		//xml読み込み
		$.ajax({  
			url:'xml/kyoju.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:kyojuDataLoad
		});

		//タブについているクラスselectを消し、該当のタブにクラスselectをつける
		$(".intronavi li").removeClass("select");
		$(".intronavi li:eq("+introNaviIndex+")").addClass("select");

	}



	//ゼミ名ナビゲーションのliの順番を記憶
	var worksNaviIndex;
	//作品リストの順番総数を記録
	var worksListIndex;
	var worksListIndexPlus;
	var worksListLength;

	//xml読み込み時のファンクション
	function worksListDataLoad(xml){

		//作品リストを一度消す
		$(".workslist").html("");

		$(xml).find("data").each(function(){
			if($(this).attr("id") == worksNaviIndex){
				$(".workslist").append(
				//作品リストに繰り返し読み込みと表示
				"<li>	<img src='" + $(this).find("thumb").text() + "'><p class='" + "workslistname" + "'>" + $(this).find("nam").text() + "</p><p class='" + "workslisttitle" + "'>" + $(this).find("ttl").text() + "</p></li>"
				);
			}		
		});

		//リストのローディング設定
		var thumbImgs = $("img",".workslist");
		var thumbImgsLength = thumbImgs.length;
		var thumbImgsCompCount = 0;

		for(var i=0; i<thumbImgsLength; i++){
			$(thumbImgs[i]).bind("load", function(){
				thumbImgsCompCount ++;
				if(thumbImgsLength == thumbImgsCompCount){
					$(".workslistload").animate({opacity:0},200,function(){$(this).hide();});
					$(".workslist").animate({opacity:1},200);
				}
			});
		}


		//読み込んで配置したら、リストクリック時実行するファンクション
		$(".workslist li").on("click", function(){

			//worksinfoloadローディングを表示
			$(".worksinfoload").show().css("opacity","1");
			$(".workspic, .worksinfo").css("opacity","0");

			//#worksまでページ内移動
			if($('.workslist').hasClass("workslist_on") == true){
			}else{
				if($(window).height() < 700 && 640 < $(window).width()){
					$("html,body").animate({scrollTop : $(".workslistbox").offset().top-20}, 200, 'swing');
				}else if($(window).width() <= 640){
					$("html,body").animate({scrollTop : $(".worksnavibox").offset().top}, 200, 'swing');
				}else{
					$("html,body").animate({scrollTop : $("#works").offset().top}, 200, 'swing');
				}
			}

			//作品リストのliの順番を代入（0～）
			worksListIndex = $('.workslist li').index(this);
			worksListIndexPlus = worksListIndex+1;
			worksListLength = $('.workslist li').length;

			$('.worksinfobox').css("display","inline");
			//作品リストの形状を変える
			$('.workslist').addClass("workslist_on");
			//display:noneの切り替え
			$('.workslistshift').addClass("workslist_on");
			$('.workslistbox').addClass("workslist_on");


			//作品リストについているクラスselectを消し、クリックしたリストと同じ順番のリストにクラスselectをつける
			$('.workslist li').removeClass("select");
			$('.workslist li:eq('+worksListIndex+')').addClass("select");

			//ゼミ名リストの順番、作品リストの順番
			//alert(worksNaviIndex +"a"+  worksListIndex);

			$(xml).find("data").each(function(){
				if($(this).attr("id") == worksNaviIndex && $(this).attr("no") == worksListIndex){
					$(".workspic").attr("src",(""));
					$(".worksinfoimg").attr("src",(""));
					$(".worksinfoname").html("");
					$(".worksinfotitle").html("");
					$(".worksinfogenre").html("");
					$(".worksinfoplace").html("");
					$(".worksinfocom").html("");
					$(".zemiindex").html("");
					$(".workspic").attr("src",($(this).find("pic").text()));
					$(".worksinfoimg").attr("src",($(this).find("photo").text()));
					$(".worksinfoname").append($(this).find("nam").text());
					$(".worksinfotitle").append($(this).find("ttl").text());
					$(".worksinfogenre").append($(this).find("gnr").text());
					$(".worksinfoplace").append($(this).find("plc").text());
					$(".worksinfocom").append($(this).find("com").text());
					$(".zemiindex").append(worksListIndexPlus + "/" + worksListLength);

					//画像を読み込んでからのファンクション
					var	 imgpic = new Image();
					var	 imgphoto = new Image();
						imgpic.src = $(this).find("pic").text();
						imgphoto.src = $(this).find("photo").text();
					$	(imgpic	,imgphoto).bind("load",function(){
						$(".worksinfoload").animate({opacity:0},200,function(){$(this).hide();})
						$(".workspic, .worksinfo").animate({opacity:1},200);
					});
				}
			});
		});	
	}

	
	function worksNavi(){

		$(".workslistload").show().css("opacity","1");
		$(".workslist").css("opacity","0");

		//ナビゲーションのliの順番を代入（0～）
		worksNaviIndex = $('.worksnavi li').index(this);

		$('.worksinfobox').css("display","none");
		$('.workslist').removeClass("workslist_on");

		//タブについているクラスselectを消し、クリックされたタブにクラスselectをつける
		$(".worksnavi li").removeClass("select");
		$(this).addClass("select");

		//作品リストの形状を変える
		$('.workslist').removeClass(".workslist_on");
		//display:noneの切り替え
		$('.workslistshift').removeClass("workslist_on");
		$('.workslistbox').removeClass("workslist_on");

		$(".semiName").html("");
		$(".workslist").html("");


		//初期値が-1、0の新島ゼミに
		if(worksNaviIndex == -1){
			worksNaviIndex = 0;
			$(".worksnavi li:eq(0)").addClass("select");
			$(".semiName").append("新島ゼミ");
		}else if(worksNaviIndex==0){$(".semiName").html("");$(".semiName").append("新島ゼミ");}
		else if(worksNaviIndex==1){$(".semiName").html("");$(".semiName").append("寺山ゼミ");}
		else if(worksNaviIndex==2){$(".semiName").html("");$(".semiName").append("古堅ゼミ");}
		else if(worksNaviIndex==3){$(".semiName").html("");$(".semiName").append("白井ゼミ");}
		else if(worksNaviIndex==4){$(".semiName").html("");$(".semiName").append("陣内ゼミ");}
		else if(worksNaviIndex==5){$(".semiName").html("");$(".semiName").append("齋藤ゼミ");}
		else if(worksNaviIndex==6){$(".semiName").html("");$(".semiName").append("後藤ゼミ");}
		else if(worksNaviIndex==7){$(".semiName").html("");$(".semiName").append("大学院");}

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
		$(".workslistload").show().css("opacity","1");
		$(".workslist").css("opacity","0");

		$(".workslist").html("");
		//もし今見ているのが新島ゼミ(0)なら
		if(worksNaviIndex == 0){
			worksNaviIndex = $(".worksnavi li").length;
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

		if(worksNaviIndex==0){$(".semiName").html("");$(".semiName").append("新島ゼミ");}
		else if(worksNaviIndex==1){$(".semiName").html("");$(".semiName").append("寺山ゼミ");}
		else if(worksNaviIndex==2){$(".semiName").html("");$(".semiName").append("古堅ゼミ");}
		else if(worksNaviIndex==3){$(".semiName").html("");$(".semiName").append("白井ゼミ");}
		else if(worksNaviIndex==4){$(".semiName").html("");$(".semiName").append("陣内ゼミ");}
		else if(worksNaviIndex==5){$(".semiName").html("");$(".semiName").append("齋藤ゼミ");}
		else if(worksNaviIndex==6){$(".semiName").html("");$(".semiName").append("後藤ゼミ");}
		else if(worksNaviIndex==7){$(".semiName").html("");$(".semiName").append("大学院");}

		//タブについているクラスselectを消し、該当のタブにクラスselectをつける
		$(".worksnavi li").removeClass("select");
		$(".worksnavi li:eq("+worksNaviIndex+")").addClass("select");
	}

	function worksListRight(){
		//workslistloadローディングを表示
		$(".workslistload").show().css("opacity","1");
		$(".workslist").css("opacity","0");

		$(".workslist").html("");
		//もし今見ているのが序(0)なら
		if(worksNaviIndex == $(".worksnavi li").length-1){
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

		if(worksNaviIndex==0){$(".semiName").html("");$(".semiName").append("新島ゼミ");}
		else if(worksNaviIndex==1){$(".semiName").html("");$(".semiName").append("寺山ゼミ");}
		else if(worksNaviIndex==2){$(".semiName").html("");$(".semiName").append("古堅ゼミ");}
		else if(worksNaviIndex==3){$(".semiName").html("");$(".semiName").append("白井ゼミ");}
		else if(worksNaviIndex==4){$(".semiName").html("");$(".semiName").append("陣内ゼミ");}
		else if(worksNaviIndex==5){$(".semiName").html("");$(".semiName").append("齋藤ゼミ");}
		else if(worksNaviIndex==6){$(".semiName").html("");$(".semiName").append("後藤ゼミ");}
		else if(worksNaviIndex==7){$(".semiName").html("");$(".semiName").append("大学院");}

		//タブについているクラスselectを消し、該当のタブにクラスselectをつける
		$(".worksnavi li").removeClass("select");
		$(".worksnavi li:eq("+worksNaviIndex+")").addClass("select");
	}

	function worksInfoDataLoad(xml){
		//作品リストについているクラスselectを消し、クリックしたリストと同じ順番のリストにクラスselectをつける
		$('.workslist li').removeClass("select");
		$('.workslist li:eq('+worksListIndex+')').addClass("select");

		$(xml).find("data").each(function(){
			if($(this).attr("id") == worksNaviIndex && $(this).attr("no") == worksListIndex){
				$(".workspic").attr("src",(""));
				$(".worksinfo img").attr("src",(""));
				$(".worksinfoname").html("");
				$(".worksinfotitle").html("");
				$(".worksinfogenre").html("");
				$(".worksinfoplace").html("");
				$(".worksinfocom").html("");
				$(".zemiindex").html("");
				$(".workspic").attr("src",($(this).find("pic").text()));
				$(".worksinfo img").attr("src",($(this).find("photo").text()));
				$(".worksinfoname").append($(this).find("nam").text());
				$(".worksinfotitle").append($(this).find("ttl").text());
				$(".worksinfogenre").append($(this).find("gnr").text());
				$(".worksinfoplace").append($(this).find("plc").text());
				$(".worksinfocom").append($(this).find("com").text());
				$(".zemiindex").append(worksListIndexPlus + "/" + worksListLength);

				//画像を読み込んでからのファンクション
					var	 imgpic = new Image();
					var	 imgphoto = new Image();
						imgpic.src = $(this).find("pic").text();
						imgphoto.src = $(this).find("photo").text();
					$	(imgpic	,imgphoto).bind("load",function(){
						$(".worksinfoload").animate({opacity:0},200,function(){$(this).hide();})
						$(".workspic, .worksinfo").animate({opacity:1},200);
					});
			}
		});
	}

	function worksInfoLeft(){
		//worksinfoloadローディングを表示
		$(".worksinfoload").show().css("opacity","1");
		$(".workspic, .worksinfo").css("opacity","0");

		$("zemiindex").html("");
		//もし今見ているのがzemiindex順で最初なら
		if(worksListIndex == 0){
			worksListIndex = worksListLength;
		}else{}
		worksListIndex = worksListIndex-1;
		worksListIndexPlus = worksListIndex+1;

		//xml読み込み
		$.ajax({  
			url:'xml/works.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:worksInfoDataLoad
		});
	}

	function worksInfoRight(){
		//worksinfoloadローディングを表示
		$(".worksinfoload").show().css("opacity","1");
		$(".workspic, .worksinfo").css("opacity","0");

		$("zemiindex").html("");
		//もし今見ているのがzemiindex順で最後なら
		if(worksListIndex == worksListLength-1){
			worksListIndex = -1;
		}else{}
		worksListIndex = worksListIndex+1;
		worksListIndexPlus = worksListIndex+1;

		//xml読み込み
		$.ajax({  
			url:'xml/works.xml',
			type:'get',
			dataType:'xml',
			timeout:1000,
			error:function(){
				//alert("load error");
			},
			success:worksInfoDataLoad
		});
	}

	function worksInfoBack(){
		$('.worksinfobox').css("display","none");
		$('.workslist').removeClass("workslist_on");
		//display:noneの切り替え
		$('.workslistshift').removeClass("workslist_on");
		$('.workslistbox').removeClass("workslist_on");
	}





	
	// $(window).on("load", pageLoad);
	$(window).on("load resize", tenjiTitleSize);
	// $(window).on("load scroll", naviUnderbar);
	$(window).on("load", memoriRandom);
	$(".kyojunavibox").on("click", smNaviSlideIn);
	$(".worksnavibox").on("click", smNaviSlideIn);
	$(window).on("resize",resizeNaviDisplay)
	$(".intronavi li").on("click", introTab);
	$(	"img",".introleft").on("click", introLeft);
	$(	"img",".introright").on("click", introRight);
	$(window).on("load", worksNavi);
	$(".worksnavi li").on("click", worksNavi);
	$(	"img",".workslistleft").on("click", worksListLeft);
	$(	"img",".workslistright").on("click", worksListRight);
	$(	"img",".worksinfoleft").on("click", worksInfoLeft);
	$(	"img",".worksinforight").on("click", worksInfoRight);
	$(".worksinfoback").on("click", worksInfoBack);


});