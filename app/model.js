var Module = (function(window, undefined) {
	const lan = {
		"en":{"title":"CryptoTato","brand1":"Crypto", "brand2":"Tato","l_p_symbol":"symbol","l_p_price":"price","l_p_market_cap":"market cap",
			  "l_p_volume":"volume(24h)","l_p_circulating_supply":"circulating supply","l_p_change":"change(24h)","lan_name":"english"},
		
		"ar":{"title":"كربتوتاتو","brand1":"كربتو", "brand2":"تاتو","l_p_symbol":"الرمز","l_p_price":"السعر","l_p_market_cap":"سقف السوق",
			  "l_p_volume":"المقدار(24)","l_p_circulating_supply":"العرض المتداول","l_p_change":"التغيير(24)","lan_name":"العربية"}
	};
	
	const lan_class = {
		"en":{"nav_bar_dropdown":"navbar-nav ml-auto","dropdown_menu":"dropdown-menu dropdown-menu-right","brn_group_margen":"col-12 text-left","input-group":"input-group input-group-sm"},
		"ar":{"nav_bar_dropdown":"navbar-nav mr-auto","dropdown_menu":"dropdown-menu dropdown-menu-left","brn_group_margen":"col-12 text-right","input-group":"input-group input-group-ar input-group-sm"}
	};
	
	const histo_tap = {"histo_type":"d","limit":"1"};
	
	const api_links = {"base":"https://min-api.cryptocompare.com/data/",
					   "type":{"live_prices":"pricemultifull?fsyms=BTC,ETH,XRP&tsyms=USD,EUR,GBP,CNY,JPY",
							   "news":"v2/news/?lang=EN",
							   "histo_day":"histoday",
							   "histo_hour":"histohour",
							   "histo_minute":"histominute",
							   "top_prices":"top/exchanges"
							  },
					   "fsym":"?fsym=",
					   "tsym":"&tsym=",
					   "cur":["USD","EUR","GBP","CNY","JNY"],
					   "com":["BTC","ETH","XRP"]
					  };
	function link_gen(){
		let buffers = JSON.parse(localStorage.getItem("buffer"));
		
	}
	
	function set_buffers(comm = JSON.parse(localStorage.getItem("buffer")).com,
						 cur = JSON.parse(localStorage.getItem("buffer")).cur,
						 histo_type = JSON.parse(localStorage.getItem("buffer")).histo_type,
						 histo_limit = JSON.parse(localStorage.getItem("buffer")).histo_limit
						 )
	{
		const buffers = {"com":comm,"cur":cur,"histo_type":histo_type,"histo_limit":histo_limit};
		localStorage.setItem("buffer",JSON.stringify(buffers));
	}
	
	function lan_change(lang) {
		// Store
		localStorage.setItem("lan",JSON.stringify(lan[lang]));
		localStorage.setItem("lan_class",JSON.stringify(lan_class[lang]));
	}
	
	function histo_type_tap(type) {
		localStorage.setItem("histo_tap",JSON.stringify(histo_tap[type]));
	}	
	function live_prices(){
		let reg = RegExp("histo");
		for(let key  in api_links.type){
			if(!reg.test(key)){
				if(key == "live_prices"){
					api_call(api_links.base+api_links.type[key],key);
				}
				if(key == "news")
					api_call(api_links.base+api_links.type[key],key);

			}
		}
		
	}
	function histo_name(date_Type){
		let Type,mul;
			if(date_Type == "h"){
				mul = 60;
				Type = api_links.type["histo_minute"];
			}
			else if(date_Type == "d"){
				mul = 24;
				Type = api_links.type["histo_hour"];
			}
			else if(date_Type == "w"){
				mul = 7;
				Type = api_links.type["histo_day"];
			}
			else if(date_Type == "m"){
				mul = 30;
				Type = api_links.type["histo_day"];
			}
			else if(date_Type == "y"){
				mul = 365;
				Type = api_links.type["histo_day"];
			}
		return [Type,mul];
	}
	function histo_full_name(){
		let buffer = JSON.parse(localStorage.getItem("buffer"));
		let histo_type = histo_name(buffer.histo_type);
		return histo_type[0]+"_"+buffer.com+"_"+buffer.cur+"_"+buffer.histo_type+"_"+buffer.histo_limit;
	}
	
	
	function histo_top(mode){
		let buffer = JSON.parse(localStorage.getItem("buffer"));
		if(mode == 1 || mode == 2){
			
			let mul_Type = histo_name(buffer.histo_type);
			api_call(api_links.base+mul_Type[0]+"?fsym="+buffer.com+"&tsym="+buffer.cur+"&limit="+buffer.histo_limit*mul_Type[1],mul_Type[0]+"_"+buffer.com+"_"+buffer.cur+"_"+buffer.histo_type+"_"+buffer.histo_limit);
		}
		if(mode == 2 || mode == 3){
			api_call(api_links.base+api_links.type["top_prices"]+"?fsym="+buffer.com+"&tsym="+buffer.cur,"top_prices_"+buffer.com+"_"+buffer.cur);
		}
	}
	
	
	function api_call(link,type){
		let Time = new Date();
		let tp = /^top_prices/;
		let his =/^histo/;
		fetch(link)
		.then((res) =>  {
			latest_api_calls(type,link,res.status);
			return res.json();
		})
		.then((data) => {
			if(type == "live_prices"){
				localStorage.setItem(type,JSON.stringify([Time.getTime(),data["DISPLAY"]]));
				view.live_prices_render();
			}
			if(type == "news"){
				localStorage.setItem(type,JSON.stringify(data["Data"]));
				view.news_render();
			}
			if(tp.test(type)){
				localStorage.setItem(type,JSON.stringify(data));
				view.top_price_render();
			}
			if(his.test(type)){
				localStorage.setItem(type,JSON.stringify([Time.getDay(),data["Data"]]));
				view.histo_render();
			}
			if(type == "rate_limit"){
				localStorage.setItem(type,JSON.stringify(data));
				view.api_rate_limit();
			}
			succes_api_req();
			view.status(1);
			}
			 )
		.catch(error => {
			fail_api_req();
			view.status(2);
		})
	}
	function fail_api_req(){
		if(sessionStorage.getItem("fail_api_req") == undefined)
			sessionStorage.setItem("fail_api_req",1);
		else{
			let session = parseInt(sessionStorage.getItem("fail_api_req"));
			session++;
			sessionStorage.setItem("fail_api_req",session);
		}
		view.fail_api_req();		
	}
	function succes_api_req(){
		if(sessionStorage.getItem("succes_api_req") == undefined)
			sessionStorage.setItem("succes_api_req",1);
		else{
			let session = parseInt(sessionStorage.getItem("succes_api_req"));
			session++;
			sessionStorage.setItem("succes_api_req",session);
		}
		view.succes_api_req();
	}
	function news_filter_add(ev){
		let news_source = Body.querySelector("#news"+ev.target.getAttribute("data-value")+"_source").innerHTML;
		let filtered_sorces = [];
		if(localStorage.getItem("news_filter") == undefined)
			filtered_sorces.push(news_source);
		else {
			filtered_sorces = localStorage.getItem("news_filter");
			filtered_sorces = filtered_sorces.split(",");
			if(filtered_sorces.find(element => element == news_source) == undefined)
				filtered_sorces.push(news_source);
		}
		filtered_sorces.toString();
		localStorage.setItem("news_filter",filtered_sorces);
		view.news_filter_render();
		view.news_render();
	}
	function news_filter_remove(ev){
		let news_source = localStorage.getItem("news_filter");
		news_source = news_source.split(",");
		news_source = news_source.filter(source => source != ev.target.innerHTML);
		localStorage.setItem("news_filter",news_source);
		view.news_filter_render();
		view.news_render();
	}
	
	function histo_time_format(time_stamp){
		let Time = new Date(time_stamp);
		let histo_day = /^histoday_*/;
		let histo_minute = /^histominute_*/;
		let histo_hour = /^histohour_*/;
		let histo_type = histo_full_name();
		let day = Time.getDate();
		let month = '0'+ (Time.getMonth()+1);
		let year = Time.getFullYear();
		let hours = Time.getHours();
		let minutes = '0'+Time.getMinutes();
		let seconds = '0'+Time.getSeconds();
				
		if(histo_day.test(histo_type)){
			return day + '/' + month.substr(month.length-2) + '/' + year ;
		}
		if(histo_hour.test(histo_type)){
			return day + '/' + month.substr(month.length-2) + '/' + year + ' - ' + hours + ':' + minutes.substr(minutes.length-2) 
		}
		if(histo_minute.test(histo_type)){
			return day + '/' + month.substr(month.length-2) + '/' + year + ' - ' + hours + ':' + minutes.substr(minutes.length-2) 
		}
		
	}
	
	function ip_rate_limit(){
		api_call("https://min-api.cryptocompare.com/stats/rate/limit","rate_limit")
		setTimeout(ip_rate_limit,30000);
	}
	function latest_api_calls(type,link,status){
		let arr 
		if(sessionStorage.getItem("latest_api_calls") == undefined)
			arr = [];
		else
			arr = JSON.parse(sessionStorage.getItem("latest_api_calls"));
		arr.unshift({"type":type,"link":link,"status":status});
		if(arr.length > 5)
			arr.pop();
		sessionStorage.setItem("latest_api_calls",JSON.stringify(arr));
		view.latest_api_calls();
	}
	// explicitly return public methods when this object is instantiated
	return {
		lan_change:lan_change,
		api_call:api_call,
		link_gen:link_gen,
		set_buffers:set_buffers,
		live_prices:live_prices,
		histo_top:histo_top,
		histo_name:histo_name,
		histo_full_name:histo_full_name,
		news_filter_add:news_filter_add,
		news_filter_remove:news_filter_remove,
		ip_rate_limit:ip_rate_limit
	};
})(window);
