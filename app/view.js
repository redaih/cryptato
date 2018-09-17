var view = (function(window, undefined) {
	let Body = document.querySelector("body");
	let live_prices = [["symbol","FROMSYMBOL","TOSYMBOL"],"PRICE","MKTCAP","VOLUME24HOUR","SUPPLY","CHANGEDAY"];
	let top_prices = ["exchange","fromSymbol","volume24h","toSymbol"];
	let histo_title ={"h":"hour","d":"day","w":"week","m":"month","y":"year","more":"s"};
	function lan_change() {
		// Store
		let lan = JSON.parse(localStorage.getItem("lan"));
		let lan_class = JSON.parse(localStorage.getItem("lan_class"));
		for (let key in lan_class) {
			document.querySelector("#"+key).className = lan_class[key];				
		}
		for (let key in lan) {
			if(key == "title"){
				document.title = lan[key];
				if(lan[key]=="CryptoTato")
					Body.dir = "ltr";
				else
					Body.dir = "rtl";
			}
			else if (key != "title"){
				document.querySelector("#"+key).innerHTML = lan[key];				
			}
		
		}
	}
	
	
	function set_buffers() {
		let buffers = JSON.parse(localStorage.getItem("buffer"));
		for(let key in buffers){
			if(key == "histo_type"){
				let len = Body.querySelector("#histo_type").children.length;
				for(let i=0;i<len;i++){
					Body.querySelector("#histo_type").children[i].className = "btn btn-sm btn-meatbrown";
					Body.querySelector("#histo_type").children[i].setAttribute("aria-pressed", "false");
				}
				Body.querySelector("#"+key+"_"+buffers[key]).className = "btn btn-sm btn-meatbrown active";
				Body.querySelector("#"+key+"_"+buffers[key]).setAttribute("aria-pressed", "true");
			}
			if(key == "com" || key == "cur"){
				Body.querySelector("#"+key).value = buffers[key];
			}
			if(key == "histo_limit")
				Body.querySelector("#"+key).placeholder = buffers[key];
		}
	}
	function custome_pair_histo(){
		let buffers = JSON.parse(localStorage.getItem("buffer"));
		Body.querySelector("#histo_button_stat").innerHTML ='<button id="histo_button" class="btn btn-secondary i-b-s" type="button"></button>';
		Body.querySelector("#histo_button").disabled = true;
		Body.querySelector("#histo_button").innerHTML = Body.querySelector("#histo_limit").placeholder + buffers.histo_type;
	}
	
	function custome_pair_button(ev){
		Body.querySelector("#histo_button").value = ev.target.value;
	}
	function error_check(){
		let buffers = JSON.parse(localStorage.getItem("buffer"));
		let histo_limit = Body.querySelector("#histo_limit");
		let pat = /^\d+$/;
		//if(histo_limit.value == "")
			
		if(pat.test(histo_limit.value)){
			Body.querySelector("#histo_button_stat").innerHTML = '<button id="histo_button" class="btn btn-meatbrown i-b-s" type="button"></button>';
			
			Body.querySelector("#histo_button").innerHTML = "go";
			Body.querySelector("#histo_button").disabled = false;
		}
		//else if(histo_limit.value == "")
		//	histo_button.innerHTML== buffers.histo_type + buffers.histo_limit;
		else{
			Body.querySelector("#histo_button_stat").innerHTML = '<button id="histo_button" class="btn btn-danger i-b-s" type="button"></button>';
			histo_limit.value =  "";
			Body.querySelector("#histo_button").innerHTML = "not valid";
			Body.querySelector("#histo_button").disabled = true;
		}
			
	}
	function live_price_render(){
		let buffer = JSON.parse(localStorage.getItem("buffer"));
		let live_prices_v = JSON.parse(localStorage.getItem("live_prices"));
		for(let key in live_prices){
			if(key == 0){
				Body.querySelector("#l_p_"+live_prices[key][0]+"_v").innerHTML= live_prices_v[1][buffer["com"]][buffer["cur"]][live_prices[key][1]];
				
			}
			else
				Body.querySelector("#l_p_"+live_prices[key]+"_v").innerHTML=live_prices_v[1][buffer["com"]][buffer["cur"]][live_prices[key]];
		}
			
	}
	
	function top_price_render(){
		
		if(Body.querySelector("#top_price_body").innerHTML == "1"){
			let b = ""
			for(let i=0;i<6;i++){
				if(i==0)
					b = b +'<li class="list-group-item-cus main-font-wight text-left">top prices</li>';
				else
					b = b + '<li class="list-group-item-cus d-flex justify-content-between align-items-center"><span id="t'+(i-1)+'_t_info">---:</span><span id="t'+(i-1)+'_b_info">---</span></li>';
			}
			Body.querySelector("#top_price_body").innerHTML = b;
		}
		let buffer = JSON.parse(localStorage.getItem("buffer"));
		let top_prices_v = JSON.parse(localStorage.getItem("top_prices_"+buffer["com"]+"_"+buffer["cur"]));
		top_prices_v = top_prices_v["Data"];
		for(let key in top_prices_v){
			Body.querySelector("#t"+key+"_t_info").innerHTML = top_prices_v[key]['exchange']+"("+top_prices_v[key]['fromSymbol']+"/"+top_prices_v[key]['toSymbol']+"):";
			Body.querySelector("#t"+key+"_b_info").innerHTML = +top_prices_v[key]['volume24h']
		}
		 
	}
	
	function news_render(){
		Body.querySelector("#news").innerHTML="";
		let news = JSON.parse(localStorage.getItem("news"));
		let news_filter;
		if(localStorage.getItem("news_filter") != undefined){
			news_filter =localStorage.getItem("news_filter");
			news = news.filter(word => {
			let re =RegExp(word["source"]);
			return !(re.test(news_filter));});
		}
		
		for(let i=0 ; i<8 ; i++){
			Body.querySelector("#news").innerHTML = Body.querySelector("#news").innerHTML + '<div class="col-12 col-sm-6 col-md-4 col-lg-3"><div class="card ml-auto mr-auto h-100 mb-1 news_con"><img id="news'+i+'_img" class="card-img-top" alt="Card image cap"><div class="card-body"><h6 id="news'+i+'_title" class="card-title text-justify">Card title</h6><p class="card-text text-left"><img id="news'+i+'_sourceimg" width = "15" height="15"><small id="news'+i+'_source" class="text-muted"></small> <small id="news'+i+'_time" class="text-muted"></small></p><p id="news'+i+'_body" class="card-text text-left"></p></div><div class="card-footer btn-group"><small class="col-6 btn btn-sm btn btn-outline-meatbrown" data-value="'+i+'" data-toggle="modal" data-target="#news_model">full articul</small><small class="col-6 btn btn-sm btn btn-outline-meatbrown source_block" data-value="'+i+'">block source</small></div></div></div>';
			let timenow = new Date(Date.now());
			let Time = new Date(parseInt(news[i]["published_on"]*1000));
			if(timenow.getHours() - Time.getHours() > 0)
				Time = timenow.getHours() - Time.getHours() + " hour ago ";
			else 
				Time = " " + timenow.getMinutes() - Time.getMinutes() + " minutes ago";
			Body.querySelector("#news"+i+"_sourceimg").src = news[i]["source_info"]["img"];
			Body.querySelector("#news"+i+"_source").innerHTML =news[i]["source"];
			Body.querySelector("#news"+i+"_time").innerHTML = Time;
			Body.querySelector("#news"+i+"_title").innerHTML =news[i]["title"];
			Body.querySelector("#news"+i+"_img").src =news[i]["imageurl"];
		}
	}
	function news_filter_render(){
		if(localStorage.getItem("news_filter") != undefined){
			let news_sources = localStorage.getItem("news_filter");
			news_sources = news_sources.split(",");
			let element="";
			for(let key in news_sources){
				element = element + '<button class="dropdown-item btn-sm remove filtered_sources">'+news_sources[key]+'</button>';
			}
			Body.querySelector("#news_sources").innerHTML = element;
		}
	}
	function histo_render(){
		let histo_type = Module.histo_full_name()
		let histo_data = JSON.parse(localStorage.getItem(histo_type));
		histo_data = histo_data[1];
		let dataPoints = [];
		for(let key in histo_data){
			dataPoints.push({
				x: new Date(histo_data[key]["time"]*1000),
				y: histo_data[key]["close"]
			});	
		}
		let buffer = JSON.parse(localStorage.getItem("buffer")),histo_title_full;
		if(buffer["histo_limit"] == "1")
			histo_title_full = buffer["histo_limit"]+histo_title[buffer["histo_type"]];
		else
			histo_title_full = buffer["histo_limit"]+histo_title[buffer["histo_type"]]+histo_title["more"] ;
		let data = [];
		let dataSeries = { type: "line" };
		dataSeries.dataPoints = dataPoints;
		data.push(dataSeries);

		var options = {
			zoomEnabled: true,
			animationEnabled: true,
			title: {
				text: histo_title_full
			},
			axisY: {
				includeZero: false,
				lineThickness: 1
			},
			data: data  // random data
		};

		var chart = new CanvasJS.Chart("chartContainer", options);
		var startTime = new Date();
		chart.render();
		var endTime = new Date();
	}
	
	function full_articule_render(arti_num){
		let news,title = Body.querySelector("#news"+arti_num+"_title").innerHTML;
		if(localStorage.getItem("news") != undefined)
			news = JSON.parse(localStorage.getItem("news"));
		for(let key in news){
			
			if(news[key]["title"] == title){
				console.log(news[key]["title"]);
				let timenow = new Date(Date.now());
				let Time = new Date(parseInt(news[key]["published_on"]*1000));
				if(timenow.getHours() - Time.getHours() > 0)
					Time = timenow.getHours() - Time.getHours() + " hour ago ";
				else 
					Time = " " + timenow.getMinutes() - Time.getMinutes() + " minutes ago";

				Body.querySelector("#model_news_title").innerHTML = news[key]["title"];
				Body.querySelector("#model_news_img").innerHTML = news[key]["imageurl"];
				Body.querySelector("#model_news_sourceimg").innerHTML = news[key]["source_info"]["img"];
				Body.querySelector("#model_news_source").innerHTML = news[key]["source"];
				Body.querySelector("#model_news_time").innerHTML = Time;
				Body.querySelector("#model_news_body").innerHTML = news[key]["body"];
			}
		}
	}
	
	function session_length(){
		let start,current,date_l,seconds,minutes,hours,session_len;  
		if(sessionStorage.getItem("open_time") == undefined){
			start = Date.now();
			sessionStorage.setItem("open_time", start);
			seconds = '00';  
			minutes = '00';
			hours = '00';
		}
		else{
			start =moment(parseInt(sessionStorage.getItem("open_time")));
			current = moment(Date.now());
			date_l= current.diff(start);
			Body.querySelector("#session_length").innerHTML= moment.duration(current.diff(start)).format("h:mm:ss");
		}
		setTimeout(session_length,1000);
	}
	function succes_api_req(){
		let session_len = sessionStorage.getItem("succes_api_req");
		Body.querySelector("#succes_api_req").innerHTML = session_len;
	}
	function fail_api_req(){
		let session_len = sessionStorage.getItem("fail_api_req");
		Body.querySelector("#fail_api_req").innerHTML = session_len;
	}
	function api_rate_limit(){
		let rate = JSON.parse(localStorage.getItem("rate_limit"));
		if(Body.querySelector("#ip_rate_body").innerHTML==''){
			let ip_body ='';
			let	time_type;
			let i;
			for(i=0;i<3;i++){
				if(i==0)
					time_type = "Hour";
				if(i==1)
					time_type = "Minute";
				if(i==2)
					time_type = "Second";
				ip_body = ip_body +'<tr><th scope="row" rowspan="3" class="align-middle">'+time_type+'</th><td id="ip_rate_'+time_type+'_Price_type">Price</td><td id="ip_rate_'+time_type+'_Price_CallsMade"></td><td id="ip_rate_'+time_type+'_Price_CallsLeft"></td></tr><tr><td id="ip_rate_'+time_type+'_Histo_type">Histo</td><td id="ip_rate_'+time_type+'_Histo_CallsMade"></td><td id="ip_rate_'+time_type+'_Histo_CallsLeft"></td></tr><tr><td id="ip_rate_'+time_type+'_News_type">News</td><td id="ip_rate_'+time_type+'_News_CallsMade"></td><td id="ip_rate_'+time_type+'_News_CallsLeft"></td></tr>';	
			}
			Body.querySelector("#ip_rate_body").innerHTML = ip_body;
		}
		for(let key in rate){
			if(key != "Message"){
				for(let keyy in rate[key]){	
					for(let keyyy in rate[key][keyy]){
						if(keyyy != "Strict"){
							Body.querySelector("#ip_rate_"+key+"_"+keyyy+"_"+keyy).innerHTML=rate[key][keyy][keyyy];
						}
					}
       			}
			}
		}
		
	}
	function latest_api_calls(){
		let t_body="";
		if(Body.querySelector("#latest_api_calls").innerHTML == "<tr></tr>"){
			let i;
			for(i=0;i<5;i++){
				t_body=t_body+'<tr><th scope="row">'+(i+1)+'</th><td id="api_call_type_'+i+'">---</td><td id="api_call_status_'+i+'">---</td></tr>';
			}
		   Body.querySelector("#latest_api_calls").innerHTML=t_body
		}	
		
		let api_calls = JSON.parse(sessionStorage.getItem("latest_api_calls"));
		for(let key in api_calls){
			Body.querySelector("#api_call_type_"+key).innerHTML=api_calls[key]["type"];
			Body.querySelector("#api_call_status_"+key).innerHTML=api_calls[key]["status"];
		}
		
	}
	function status(stat){
		Body.querySelector("#status").innerHTML = '';
		if(stat == 1)
			Body.querySelector("#status").innerHTML = '<span class="badge badge-success" >online</span>';
		else if(stat == 2)
			Body.querySelector("#status").innerHTML = '<span class="badge badge-danger" >offline</span>';
			
	}
	// explicitly return public methods when this object is instantiated
	return {
		lan_change: lan_change,
		set_buffers:set_buffers,
		custtome_pair_histo:custome_pair_histo,
		custome_pair_button:custome_pair_button,
		error_check:error_check,
		live_prices_render:live_price_render,
		top_price_render:top_price_render,
		news_render:news_render,
		news_filter_render:news_filter_render,
		histo_render:histo_render,
		full_articule_render:full_articule_render,
		session_length:session_length,
		succes_api_req:succes_api_req,
		fail_api_req:fail_api_req,
		api_rate_limit:api_rate_limit,
		latest_api_calls:latest_api_calls,
		status:status
	};
})(window);