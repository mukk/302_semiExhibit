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
				// $(this).parent('a.thumbs').on('touchstart',
				// 	function(){ 
				// 		$(this).children('.poly').animate( {opacity: 1}, {duration: fadeSpeed, queue: false}); 
				// 		$(this).children('.caption').animate( {opacity: .4}, {duration: fadeSpeed, queue: false}); 
				// 	},
				// 	function(){ 
				// 		$(this).children('.poly').animate( {opacity: 0}, {duration: fadeSpeed, queue: false});
				// 		$(this).children('.caption').animate( {opacity: 1}, {duration: fadeSpeed, queue: false}); 

				// 	}
				// ); 
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
