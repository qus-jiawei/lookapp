function getParams(){
	//获取where
	var likeParams=["appid","user","name","queue","state","finalStatus"]
	var where = " 1 "
	for(var key in likeParams){
		var varName = likeParams[key];
		var idName = "#app-params-"+varName
		var temp = $(idName)[0].value;
		if( temp.length > 0 ){
			//由于%不能进行http编码，使用o|o代替
			where = where + ' and '+varName+' like "o|o'+temp+'o|o" '
		}
	}
	//结束时间
	$("#app-params-finishTime").
	//获取offset
	var nowpage = getCookie("nowpage");
	var offset = (nowpage-1)*50;
	return "where="+where+"&offset="+offset+"&limit=50";
}
function em(text){
	return "<em> "+text+" </em>"
}
function toGSize(bytes){
	return (bytes/(1024*1024*1024)).toFixed(2); 
}
function showAppSum(appSum){
	var resultRecord = appSum["resultRecord"];
	//汇总信息
	$('#app-total-tps').empty();
	$('#app-total-tps').append("<p>一共有 "+em(resultRecord["appidCount"])+" 个Appid符合筛选。</p>")
	var rate,attemptSum
	//map
	rate = (resultRecord["mapsCompletedSum"]*100/resultRecord["mapsTotalSum"]).toFixed(1)
	attemptSum = resultRecord["successfulMapAttemptsSum"] + resultRecord["killedMapAttemptsSum"]
			+ resultRecord["failedMapAttemptsSum"];
	$('#app-total-tps').append("<p>产生 "+em(resultRecord["mapsTotalSum"])+" 个map任务 ,完成了"+
			em(resultRecord["mapsCompletedSum"])+"个，完成率"+ em(rate)+"%。"+
			"进行了"+em(attemptSum)+" 次map的尝试，成功了"+em(resultRecord["successfulMapAttemptsSum"])+" 次，"+
			"失败了"+em(resultRecord["failedMapAttemptsSum"])+" 次, 终止了 "+em(resultRecord["killedMapAttemptsSum"])+" 次。"
			)
	//本地读写
	var localRate = (resultRecord["localMapSum"]*100/resultRecord["mapsTotalSum"]).toFixed(1)
	var rackRate = (resultRecord["rackMapSum"]*100/resultRecord["mapsTotalSum"]).toFixed(1)
	$('#app-total-tps').append("<p>本地map调度 "+em(resultRecord["localMapSum"])+" 次，调度率占 "+em(localRate)+" %。 "+
			"机架map调度 "+em(resultRecord["rackMapSum"])+" 次，调度率占 "+em(rackRate)+" %</p>")
	//reduce
	rate = (resultRecord["reducesCompletedSum"]*100/resultRecord["reducesTotalSum"]).toFixed(1)
	attemptSum = resultRecord["successfulReduceAttemptsSum"] + resultRecord["killedReduceAttemptsSum"]
			+ resultRecord["failedReduceAttemptsSum"];
	$('#app-total-tps').append("<p>产生 "+em(resultRecord["reducesTotalSum"])+" 个reduce任务 ,完成了"+
			em(resultRecord["reducesCompletedSum"])+"个，完成率"+ em(rate)+"%。"+
			"进行了"+em(attemptSum)+" 次reduce的尝试，成功了"+em(resultRecord["successfulReduceAttemptsSum"])+" 次，"+
			"失败了"+em(resultRecord["failedReduceAttemptsSum"])+" 次, 终止了 "+em(resultRecord["killedReduceAttemptsSum"])+" 次。"
			)
	//hdfs
	$('#app-total-tps').append("<p> 读了"+em(toGSize(resultRecord["hdfsReadSum"]))+"G,"+
			"写了"+em(toGSize(resultRecord["hdfsWriteSum"]))+"G HDFS的文件, "+
			"读了"+em(toGSize(resultRecord["fileReadSum"]))+"G,"+
			"写了"+em(toGSize(resultRecord["fileWriteSum"]))+"G 的本地中间文件。</p>")
	//写入总页数和当前页数
	var maxcount = resultRecord["appidCount"];
	var maxpage = Math.floor(maxcount/50)+1;
	setCookie("maxcount",maxcount);
	setCookie("maxpage",maxpage);
	setCookie("nowpage",1);
}
function loadAppSum(){
	var params = getParams();
	var appQuery;
	appQuery = new XMLHttpRequest();
	appQuery.onreadystatechange=function(){
		if (appQuery.readyState==4 && appQuery.status==200){
			
			showAppSum(JSON.parse(appQuery.responseText));
    	}
  	}
	var url = "db/appSum?"+params;
	console.log(url)
	appQuery.open("GET",url,true);
	appQuery.send();
}
function showAppList(appList){
	$('#apptable-body').empty()
	for(var key in appList){
		var app = appList[key]
		var tds="";
		for(var i=0;i<8;i++){
			tds+="<td class='apptd'>"+app[i]+"</td>"
		}
		var tr = "<tr>"+tds+"</tr>"
		$('#apptable-body').append(tr)
	}
	//翻页提示
	var maxcount = parseInt(getCookie("maxcount"));
	var maxpage = parseInt(getCookie("maxpage"));
	var nowpage = parseInt(getCookie("nowpage"));
	$('#apptable-tips').text("一共"+maxcount+"个符合的Application,共"+maxpage+"页，当前第"+nowpage+"页。");
}
function loadAppList()
{
	var params = getParams();
	var appQuery;
	appQuery = new XMLHttpRequest();
	appQuery.onreadystatechange=function()
  	{
		if (appQuery.readyState==4 && appQuery.status==200)
		{
			showAppList(JSON.parse(appQuery.responseText))
    	}
  	}
	var url = "db/appList?"+params;
	console.log(url)
	appQuery.open("GET",url,true);
	appQuery.send();
}
function firstPage(){
	var nowpage = parseInt(getCookie("nowpage"));
	if( nowpage != 0 ){
		setCookie("nowpage",0);
		alert("first")
		loadAppList();
	}
}
function prePage(){
	var nowpage = parseInt(getCookie("nowpage"));
	var maxpage = parseInt(getCookie("maxpage"));
	if( nowpage - 1 >= 0 ) {
		nowpage--;
		setCookie("nowpage",nowpage);
		loadAppList();
	}
}
function nextPage(){
	var nowpage = parseInt(getCookie("nowpage"));
	var maxpage = parseInt(getCookie("maxpage"));
	if( nowpage + 1 <= maxpage) {
		nowpage++;
		setCookie("nowpage",nowpage);
		loadAppList();
	}
}
function lastPage(){
	var nowpage = parseInt(getCookie("nowpage"));
	var maxpage = parseInt(getCookie("maxpage"));
	if( nowpage != maxpage ){
		setCookie("nowpage",maxpage);
		loadAppList();
	}
}

function appQuery(){
	loadAppSum()
	loadAppList()
}
