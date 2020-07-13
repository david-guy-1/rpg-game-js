function set_data(location, data){
	if(document.getElementById(location).innerHTML != data){
		document.getElementById(location).innerHTML = data;
	}
}
function append_data(location, data){
		document.getElementById(location).innerHTML += data;
}
function get_data(location){
		return document.getElementById(location).innerHTML;
}
function set_style(location, attribute, data){
	if(document.getElementById(location).style[attribute] != data){
		document.getElementById(location).style[attribute] = data;
	}
}
function get_style(location ,attribute){
	return document.getElementById(location).style[attribute];
}


function update_icon(obj, thing){ // puts a single icon, obj is 
//an html element for the box, and thing is null or an object with a name attribute..
	if(thing == null){
		set_data(obj,"");
	} else{
		set_data(obj,"<img src=\"" + images[thing.name]+ "\" width=60 height=60/>");
	}
}