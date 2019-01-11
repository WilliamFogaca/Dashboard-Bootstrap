$(function(){
	
	$('html, body').on('click', function(e){
		if(e.target == document.documentElement){	
			$('html, body').removeClass('open-sidebar');
		}
    });
    
    $('.js-open-sidebar').on('click', function(e){
		$('html').addClass('open-sidebar');
    });
})