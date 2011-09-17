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
		, i = 0, j = 0;
		
		running = true;
		
		if( v.length !== 5 ){
			ipt.fadeOut(155).fadeIn(155);
			return false;
		}
		
		$('<p>').prop('id','c'+v).prependTo( '#console' );
		loaded[v] = { loaded : 0, found : 0, start : +new Date() };
		$('#console p').slice(7).remove();
		
		
		while( i < 32 ){
			str = '';
			for( j = 0; j < 5; j++ ){
				str += v.substr(j,1)[ 'to' + ((i >> j) % 2?'Upper':'Lower') +'Case']()
			}

			$('<img>').data('key',str)
			.load( function(){
				loadHandler( this );
			} ).prop('src','http://i.imgur.com/'+str+'b.jpg');

			i++;
		}
	});
});

function loadHandler( img ){
	
	var lckey = $(img).data('key').toLowerCase();
	loaded[lckey].loaded++;
	
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
	
	if( img.height < 160 ){
		$('#c'+lckey).text(lckey + ': loaded '+loaded[lckey].loaded+'/32, found '+loaded[lckey].found+'/32, elapsed ' + (+new Date() - loaded[lckey].start) + 'ms');
		return false;
	}

	loaded[lckey].found++;
	$('#c'+lckey).text(lckey + ': loaded '+loaded[lckey].loaded+'/32, found '+loaded[lckey].found+'/32, elapsed ' + (+new Date() - loaded[lckey].start) + 'ms');
	
	$('#results > .item, #results .info').slice( 50 ).remove();
	
	var elem = $('<div>')
		.addClass('item')
		.prependTo( $('#results') )
		.fadeOut( 0 );
	
	
	var a = $('<a>')
		.addClass('thumb')
		.prop('href',img.src.replace(/b\.jpg.*$/,'.jpg') )
		.appendTo( elem );
	
	
	
	$(img).appendTo( a );
	
	var span = $('<span>')
		.appendTo( elem );

	$('<a>')
		.prop('href','http://reddit.com/s/'+a.prop('href').replace(/\.jpg$/,'').replace(/i\./,''))
		.prop('target','_blank')
		.text( $(img).data('key') )
		.appendTo( span );

	$('<a>')
		.prop('href','http://reddit.com/s/'+a.prop('href'))
		.prop('target','_blank')
		.html('r<sup>1</sup>')
		.appendTo( span );
	
	$('<a>')
		.prop('href','http://reddit.com/s/'+a.prop('href').replace(/\.jpg$/,'').replace(/i\./,''))
		.prop('target','_blank')
		.html('r<sup>2</sup>')
		.appendTo( span );

	$('<a>')
		.prop('href','http://facebook.com/sharer.php?u='+a.prop('href'))
		.prop('target','_blank')
		.html('f')
		.appendTo( span );

	$('<a>')
		.prop('href','https://m.google.com/app/plus/x/?v=compose&content='+a.prop('href'))
		.prop('target','_blank')
		.html('g+')
		.appendTo( span );

	elem.fadeIn( 255 );
}
