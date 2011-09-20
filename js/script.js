var stream = false, running = false, loaded = {}, total = 0;

$(function(){
	
	$.colorbox({width:800, height:600, inline:true, speed : 0,  href:"#nsfw_notice"});
		
	
	$('input').keydown( function(e){
		if( e.keyCode === 13 )$('#chk').click();
	});
	
	$('#results').delegate('.item > a', 'click', function( e ){
		if( e.button !== 0 )return;
		e.preventDefault();
		$.colorbox({
			href : $(this).prop('href'),
			maxWidth : '90%',
			maxHeight : '90%'
		});
	});
	
	updateHeart();
	
	$('h1 a').click( function( e ){
		e.preventDefault();
		$('#clr').click();
		try{
			var h = localStorage.getItem('hearts');
			if( h ){
				h = h.split(',').reverse();
				for( var i = 0; i < h.length; i++ ){
					ich.item( { key : h[i] }).appendTo( '#results' );
				}
			}
		}catch(e){};
		
	});
	
	$('#results').delegate('.heart', 'click', function( e ){
		e.preventDefault();
		var code = /.+\/(\w+)b\.jpg$/.exec( $( this ).parents('.item').find('img').prop('src') );
		var hearts = localStorage.getItem('hearts');
		hearts = hearts?hearts.split(','):[];
		
		if( $.inArray( code[1], hearts) < 0 ){
			hearts.push( code[1] );
			$(this).fadeOut(155).fadeIn(155);
			$('h1 a').fadeOut(155).fadeIn(155);
			
		}
		updateHeart( hearts.length );
		console.log( hearts.length );
		localStorage.setItem('hearts', hearts.join(',') );
	});
	
	$('#gen').click( function(){
		for( var i = 0,s =''; i < 5; i++ ){ 
			//numbers wont give good results
			s += Math.random() > 0?String.fromCharCode( Math.round( Math.random() * 25 ) + 97 ):Math.round(Math.random() * 10); 
		}
		$('input').val( s );
		$('#chk').click();
	});
	
	$('#abt').click( function(){
		$('#results > .info').remove();
		$('body > .info').clone().prependTo( '#results' );
	});
	
	$('#clr').click( function(){
		$('#results').empty();
	});
	
	$('#stm').click( function(){
		
		if( stream ){
			$(this).text( '\u25BAstream' );
			stream = false;
		}
		else{
			$('#gen').click().fadeOut( 155 ).fadeIn( 155 );
			$(this).text( '\u25A0stop' );
			stream = true;
		}
	});
	
	$('#chk').click( function(){
		if( running ){
			$('#console p:eq(0)').fadeOut().fadeIn();
			return;
		}
		var ipt = $('input')
		, v = ipt.val()
		, str = ''
		, i = 0, j = 0, img;
		
		running = true;
		
		if( v.length === 0 ){
			ipt.fadeOut(155).fadeIn(155);
			return false;
		}
		
		$('<p>').prop('id','c'+v).prependTo( '#console' );
		loaded[v] = { loaded : 0, found : 0, start : +new Date(), timeout : 0 };
		$('#console p').slice(7).remove();
		
		
		while( i < 32 ){
			str = '';
			for( j = 0; j < 5; j++ ){
				str += v.substr(j,1)[ 'to' + ((i >> j) % 2?'Upper':'Lower') +'Case']()
			}

			img = $('<img>').data('key',str)
			.load( function(){
				loadHandler( this );
			} ).prop('src','http://i.imgur.com/'+str+'b.jpg')
			.data('timeout', setTimeout(( function( me ){
				return function(){
					console.log('timeout', $(me).data('key'));

					loadHandler( me, true );
				}
			})( img ), 5000 ));

			i++;
		}
	});
	
	var hasUrl = /[\?|#].+\.com\/(\w{5,})?/.exec( window.location.toString() ),
	hasHash = /[\?|#](\w{5,})/.exec( window.location.toString() ),
	input;
	if( input = (hasUrl && 1 in hasUrl?hasUrl[1]:false)||(hasHash && 1 in hasHash?hasHash[1]:false) ){
		$('input').val( input );
		$('#chk').click();
	}

	
});

function loadHandler( img, isTimeout ){
	
	var lckey = $(img).data('key').toLowerCase();
	loaded[lckey].loaded++;
	
	clearTimeout( $(img).data('timeout') );
	
	if( loaded[lckey].loaded == 32 ){
		running = false;
		if( stream ){
			if( total % 1000 == 0){
				alert('loading was paused for sanity reasons after 1000 images where loaded.');
			}
			$('#gen').click().fadeOut( 155 ).fadeIn( 155 );
		}
	}
	total++;
	
	if( img.height < 160 || isTimeout ){
		
		if( isTimeout ){
			$(img).unbind('load');
			delete( img );
			loaded[lckey].timeout++;
		}
		$('#c'+lckey).text( ich.log({
			key : lckey,
			loaded : loaded[lckey].loaded,
			found: loaded[lckey].found,
			timeout: loaded[lckey].timeout,
			elapsed: (+new Date() - loaded[lckey].start) + 'ms'
		},true));
		
		return false;
	}

	loaded[lckey].found++;
	$('#c'+lckey).text( ich.log({
		key : lckey,
		loaded : loaded[lckey].loaded,
		found: loaded[lckey].found,
		timeout: loaded[lckey].timeout,
		elapsed: (+new Date() - loaded[lckey].start) + 'ms'
	},true));
	
	$('#results > .item, #results .info').slice( 50 ).remove();
	
	ich.item( { key : $(img).data('key') } ).prependTo( '#results' ).fadeIn( 255 );
	
}

function updateHeart( amount ){
	
	if( amount ){
		$('h1 a span').text( amount );
		return;
	}
	
	try{
		var h = localStorage.getItem('hearts');
		if( h ){
			$('h1 a span').text( h.split(',').length );
			
		}
	}
	catch(e){}	
}
