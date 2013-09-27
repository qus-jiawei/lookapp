function setCookie(c_name,value){
	document.cookie=c_name+ "=" +escape(value)
}
function getCookie(c_name){
	if (document.cookie.length>0){
	  c_start=document.cookie.indexOf(c_name + "=")
	  if (c_start!=-1){ 
	    c_start=c_start + c_name.length+1 
	    c_end=document.cookie.indexOf(";",c_start)
	    if (c_end==-1) c_end=document.cookie.length
	    return unescape(document.cookie.substring(c_start,c_end))
	    } 
	  }
	return ""
}
//***********
function datetime_to_unix(datetime){
    var tmp_datetime = datetime.replace(/:/g,'-');
    tmp_datetime = tmp_datetime.replace(/ /g,'-');
    var arr = tmp_datetime.split("-");
    var now = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
    return parseInt(now.getTime()/1000);
}
function unix_to_datetime(unix) {
    var now = new Date(parseInt(unix));
    return now.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ")
}
//***********
function getNodeFromAddress(address){
	length = address.indexOf(":");
	return address.substring(0,length);
}
//***********
function contain(str,want){
	l = str.indexOf(want)
	if(l == -1) return false;
	else return true;
}
//***********
function getTrTd(list){
	var re = "";
	for (var id in list){
		re += "<td id="+id+">"+list[id]+"</td>"
	}
	return "<tr>"+re+"</tr>"
}
//恶心的代码根据Map和Reduce开头判断横跨的列
function getTrTh(list){
	var re = "";
	for (var key in list){
		var temp = list[key]
		if(contain(temp,"Map")){
			re += "<th colspan=6 >"+list[key]+"</th>"
		}
		else if(contain(temp,"Reduce")){
			re += "<th colspan=6 >"+list[key]+"</th>"
		}
		else{
			re += "<th >"+list[key]+"</th>"
		}
	}
	return "<tr>"+re+"</tr>"
}
function getTable(id,title,contentList){
	var body = "";
	for (var key in contentList){
		body += getTrTd(contentList[key])
	}
	return '<table class="table table-bordered table-striped table-hover" id="'+id+'">'+
				'<thead>'+getTrTh(title)+'</thead>'+
				'<tbody>'+body+'</tbody></table>';
}