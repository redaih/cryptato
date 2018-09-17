const Body = document.querySelector("body");
window.onload = () => {
	let buffer,live_Time,Time = new Date(),deff,histo_type;
	if(localStorage.getItem("lan") == undefined){
		Module.lan_change("en");
	}
	view.lan_change();
	
	if(localStorage.getItem("buffer") == undefined){
		Module.set_buffers("BTC","USD","h",1);
	}
	buffer = JSON.parse(localStorage.getItem("buffer"));
	view.set_buffers();
	view.custtome_pair_histo();
	if(localStorage.getItem("live_prices") == undefined){
		refresh();
	}
	else{
		live_Time = JSON.parse(localStorage.getItem("live_prices"));
		deff = Time.getTime() - live_Time[0];
		if(deff > 60000){
			refresh();
		}
		else if(deff < 60000){
			setTimeout(refresh,60000 - deff);
		}
	}
	histo_type = Module.histo_full_name();
	view.news_filter_render();
	if(localStorage.getItem(histo_type) != undefined)
		view.histo_render();
	if(localStorage.getItem("top_prices_"+buffer["com"]+"_"+buffer["cur"]) != undefined){
		view.live_prices_render();
		view.top_price_render();
		view.news_render();		
	}
	view.session_length();
	Module.ip_rate_limit();
}
function refresh(){
	Module.live_prices();
	histo_ref();
	setTimeout(refresh,60000);
}

function histo_ref(){
	let Time = new Date(),histo_type = Module.histo_full_name();
	if(localStorage.getItem(histo_type) == undefined)
		Module.histo_top(2);
	else if(JSON.parse(localStorage.getItem(histo_type))[0] != Time.getDay())
		Module.histo_top(1);	
}
	
Body.addEventListener("click",clicked);
Body.addEventListener("change",changed);
Body.addEventListener("input",onchangee);
Body.addEventListener("focusout", blurr);


function clicked(ev){
	let Time = new Date(),histo_type = Module.histo_full_name();
	let evi=ev.target.id;
	let evc=ev.target.className;
	evi=evi.replace("histo_type_","");
	evi=evi.replace("span_","");
	if(evi == "en" || evi == "ar"){
		Module.lan_change(evi);
		view.lan_change();
	}
	if(evi == "h" || evi == "d" || evi == "w" || evi == "m" || evi == "y"){
		Module.set_buffers(undefined,undefined,evi,1);
		view.set_buffers();
		view.custtome_pair_histo();
		
		if(localStorage.getItem(histo_type) == undefined)
			Module.histo_top(1);
		else if(JSON.parse(localStorage.getItem(histo_type))[0] != Time.getDay())
			Module.histo_top(1);
		else{
			view.histo_render();
		}
	}
	if(evi == "histo_button"){
		Module.set_buffers(undefined,undefined,undefined,Body.querySelector("#histo_limit").value);
		view.set_buffers();
		view.custtome_pair_histo();
		Body.querySelector("#histo_limit").value="";
		if(localStorage.getItem(histo_type) == undefined){
			Module.histo_top(1);
			console.log("herm");
		}
		else if(JSON.parse(localStorage.getItem(histo_type))[0] != Time.getDay()){
			Module.histo_top(1);
			console.log("hert");
		}
		else
			view.histo_render();
	}
	if(evc == "col-6 btn btn-sm btn btn-outline-meatbrown source_block")
		Module.news_filter_add(ev);
	if(evc == "dropdown-item btn-sm remove filtered_sources"){
		Module.news_filter_remove(ev);
	}
	if(evc == "col-6 btn btn-sm btn btn-outline-meatbrown"){
		console.log(ev.target.getAttribute("data-value"));
		view.full_articule_render(ev.target.getAttribute("data-value"));
	}
}

function changed(ev){
	let evi= ev.target.id,buffer; 
	
	if(evi == "com"){
		Module.set_buffers(ev.target.value,undefined,undefined);
		buffer = JSON.parse(localStorage.getItem("buffer"));
		histo_ref();
		if(localStorage.getItem("live_prices") != undefined )
			view.live_prices_render();
		if(localStorage.getItem("top_prices_"+buffer["com"]+"_"+buffer["cur"]) != undefined )
			view.top_price_render();
		if(localStorage.getItem(Module.histo_full_name()) != undefined)
			view.histo_render();
	}
	if(evi == "cur"){
		Module.set_buffers(undefined,ev.target.value,undefined);
		buffer = JSON.parse(localStorage.getItem("buffer"));
		histo_ref();
		if(localStorage.getItem("live_prices") != undefined )
			view.live_prices_render();
		if(localStorage.getItem("top_prices_"+buffer["com"]+"_"+buffer["cur"]) != undefined)
			view.top_price_render();
		if(localStorage.getItem(Module.histo_full_name()) != undefined)
			view.histo_render();
		
	}
	console.log("change");
}
function onchangee(ev){
	let evi = ev.target.id;
	if(evi == "histo_limit")
		view.error_check();
}
function blurr(ev) {
	let evi = ev.target.id;
	if(evi == "histo_limit" && ev.target.value == "")
	view.custtome_pair_histo();
}
