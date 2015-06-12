function run(){
	var flag = 1;    //第一次播放的标志
	var song,artist = "";
	var lyric_area = '<div id="lyric_area"><pre></pre></div>';
	$("body").append(lyric_area);
	$("#lyric_area").css({width:"600px",height:"200px",position:"relative",top:"45%",left:"20%",overflow:"auto"});
	setInterval(get_lyrics,1000);

	function get_lyrics(){
		if(song != JSON.parse(localStorage['bubbler_song_info']).song_name||flag==1){
			flag = 0;
			song = JSON.parse(localStorage['bubbler_song_info']).song_name;
			artist = JSON.parse(localStorage['bubbler_song_info']).artist;		
			if(!get_baidu_lyrics(song,artist)){
				if(!get_gecime_lyrics(song,artist))
					$("#lyric_area pre").html("查找不到相关歌词");
			}
		}	
	}
	function get_gecime_lyrics(song,artist){
			var gecime_song_url = "http://geci.me/api/lyric/"+song+"/"+artist;
			var gecime_lrc_url;
			var exist = true;
			$.ajax({
				url:gecime_song_url,
				type:"GET",
				async:false,
				success:function(obj){
					$("#lyric_area pre").html("查找歌词中...");
					if(obj.result.length!=0){
						gecime_lrc_url = obj.result[0].lrc;
						$.ajax({	
							url:gecime_lrc_url,
							type:"GET",
							success:function(data){
								$("#lyric_area pre").html(data);
							}
						});
					}
					else{
						exist = false;
					}
				}
			});
			return exist;
	}
	function get_baidu_lyrics(song,artist){
		var exist = true;
		var baidu_song_url = "http://mp3.baidu.com/dev/api/?tn=getinfo&ct=0&word="+encodeURIComponent(song)+"&ie=utf-8&format=json";
		var baidu_lrc_url;
		var baidu_id_url;
		$.ajax({
			url:baidu_song_url,
			type:"GET",
			async:false,
			success:function(obj){console.log(obj);
				$("#lyric_area pre").html("查找baidu歌词中...");
				if(obj.length!= 0){
					var song_id = obj[0].song_id;
					baidu_id_url = "http://ting.baidu.com/data/music/links?songIds="+song_id;//"http://ting.baidu.com/data2/lrc/"+song_id+"/"+song_id+".lrc"
					$.ajax({
						url:baidu_id_url,
						type:"GET",
						error:function(xhr){
							baidu_lrc_url = "http://ting.baidu.com"+JSON.parse(xhr.responseText).data.songList[0].lrcLink;
							$.ajax({
								url:baidu_lrc_url,
								type:"GET",
								success:function(obj){
									$("#lyric_area pre").html(obj);
								}
							});
						}

					});
				}
				else{
					exist = false;
				}
			}
		});
		return exist;
	}
}

run();
