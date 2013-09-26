//获取要展示的队列的html内容
function formatElapsedTime(elapsedTime){
	var sec = Math.floor(elapsedTime/1000);
	var min = Math.floor(sec/60);
	sec = sec - min*60;
	return min+"m"+sec+"s";
}
function formatTableTd(key,value){
	if( title == "startedTime"){
		return unix_to_datetime(value);
	}
	else if( title == "progress"){
		return value.toFixed(1)+"%";
	}
	else if( title == "elapsedTime"){
		return formatElapsedTime(value)
	}
	else if(title =="amHostHttpAddress"){
		return getNodeFromAddress(value)
	}
	else if(title =="id"){
		last = value.lastIndexOf("_")
		return "<a href=http://"+rmhost+":"+rmport+"/proxy/"+value+">"+value.substring(last+1)+"</a>"
	}
	return value
}
function getQueuePanelHtml(queueName,queue){
	var displayTitleList = new Array("应用id","名称","AM机器","提交至今时间","进度","Am运行时间","Map(待运行,正运行,失败,杀死,成功)","Reduce(待运行,正运行,失败,杀死,成功)")
	var titleList = new Array("id","name","amHostHttpAddress","elapsedTime","progress")
	var contentList = new Array();
	for(var id in queue){
		app = queue[id]
		runningAppList.push(id)
		var tds = new Array();
		for(var key in titleList){
			title = titleList[key];
			tds[id+"-"+title]=formatTableTd(title,app[title])
		}
		//添加异步回调的td
		tds[id+"-amTime"] = "-"
		var idList = ["mapsPending","mapsRunning","failedMapAttempts","killedMapAttempts","successfulMapAttempts",
		               "reducesPending","reducesRunning","failedReduceAttempts","killedReduceAttempts","successfulReduceAttempts"];
		for(var key in idList){
			tds[id+"-"+idList[key]]="--"
		}
		contentList.push(tds)
	}
	var tableHtml = getTable("queueName",displayTitleList,contentList);
	return tableHtml;
}
function addQueuePanel(accordionId,collapseTitle,accordionBody,collapseId){
	var panelTitle ='<div class="panel-heading"><h4 class="panel-title">'+
	        '<a data-toggle="collapse" data-toggle="collapse" data-parent="#'+accordionId+'" href="#'+collapseId+'">'+
	        collapseTitle+'</a></h4></div>';
	var open = " in "
	var panelBody = '<div id="'+collapseId+'" class="panel-collapse collapse '+open+'"><div class="panel-body">'+
			accordionBody+'</div></div>'
	$("#running-accordion").append('<div class="panel panel-default">'+panelTitle+panelBody+'</div>');
}

function showRunningApp(runningApp){
	rmhost = runningApp['rmhost']
	rmport = runningApp['rmport']
	$("#running-accordion").empty();
	var index = 1;
	var appidList = [];
	for(var queueName in runningApp["queues"]){
		console.log(queueName);
		var queue = runningApp["queues"][queueName];
		addQueuePanel("running-accordion","队列:["+queueName+"]",getQueuePanelHtml(queueName,queue),"panel"+index);
		index++;
	}
}
function loadRunningAppInfo(appid){
	var appQuery;
	appQuery = new XMLHttpRequest();
	appQuery.onreadystatechange=function(){
		if (appQuery.readyState==4 && appQuery.status==200){
			jobinfo = JSON.parse(appQuery.responseText)
			$("#"+appid+"-amTime").text(formatElapsedTime(jobinfo['amTime']))
			var keyList = ["mapsPending","mapsRunning","failedMapAttempts","killedMapAttempts","successfulMapAttempts",
			               "reducesPending","reducesRunning","failedReduceAttempts","killedReduceAttempts","successfulReduceAttempts"];
			for(var k in keyList){
				var key = keyList[k]
				$("#"+appid+"-"+key).text(jobinfo[key])
			}
			console.log("#"+appid+"-reduce")
			console.log(jobinfo['reduce'])
			console.log(appQuery.responseText)
    	}
  	}
	var url = "/db/appProxy?appid="+appid;
	appQuery.open("GET",url,true);
	appQuery.send();
}
function loadRunningApp(){
	var appQuery;
	appQuery = new XMLHttpRequest();
	appQuery.onreadystatechange=function(){
		if (appQuery.readyState==4 && appQuery.status==200){
			runningAppList = []
			showRunningApp(JSON.parse(appQuery.responseText));
			for(var key in runningAppList){
				appid = runningAppList[key]
				loadRunningAppInfo(appid)
			}
			console.log(runningAppList)
    	}
  	}
	var url = "db/appRunning";
	console.log(url)
	appQuery.open("GET",url,true);
	appQuery.send();
}
function runningQuery(){
	loadRunningApp()
}
window.onload=function(){
	runningQuery();
}