$('head').append(
	'#generalveil, #generalload { display: block; }</style>'
);
 
jQuery.event.add(window,"load",function() { // 全ての読み込み完了後に呼ばれる関数
	$("#generalveil").delay(900).fadeOut(800).remove();
	// $("#generalload").delay(600).fadeOut(300);
	$("#container").css("display", "block");
});
