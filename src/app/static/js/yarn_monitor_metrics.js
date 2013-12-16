function drawMetricsHighChart(htmlid,fields,dataPool,beginTime,endTime,split){
	var begin = Math.floor(beginTime/split)*split;
	var end = Math.floor(endTime/split)*split;
	var xAxis = [];
	for(var i = begin;i<=end;i+=split){
		xAxis.push(unix_to_datetimeInHighchart(i*1000))
	}
	var series = [];
	for(var index=0;index<fields.length;index++){
		var field = fields[index]
		var temp = new Array();
		for(var nowTime = begin;nowTime<=end;nowTime+=split){
			if( (nowTime in dataPool) ){
				if( dataPool[nowTime][index] != null){
					temp.push(dataPool[nowTime][index])
					continue;
				}
			}
			temp.push(0)
		}
		series.push({name:field,data:temp})
		
	}
	console.log(series)
	buildLineCharts(htmlid,field,xAxis,getValueFormatter,series)	
}
function showMetricsData(data){
	//分隔数据到各个指标
	var fields = getMetricsFieldParams();
	var recordTimeMin = getMetricsRecordTimeMinParams();
	var recordTimeMax = getMetricsRecordTimeMaxParams();
	var recordTimeSplit = getMetricsRecordTimeSplitParams();
	//转换data的result的记录形式从[time,xx,xx...]转换为[time][xx,xx...]
	var dataPool = {}
	for(var key in data['result']){
		var temp = data['result'][key];
		var time = temp[0]
		for(var i=1;i<temp.length;i++){
			if( !(time in dataPool) ){
				dataPool[time] = {}
			}
			dataPool[time][i-1]=temp[i];
		}
	}
	var htmlid = "metrics-draw-div";
	drawMetricsHighChart(htmlid,fields,dataPool,recordTimeMin,recordTimeMax,recordTimeSplit)
}
function loadMetricsData(){
	var fields = getMetricsFieldParams();
	var recordTimeMin = getMetricsRecordTimeMinParams();
	var recordTimeMax = getMetricsRecordTimeMaxParams();
	var recordTimeSplit = getMetricsRecordTimeSplitParams();
	
	var appQuery;
	appQuery = new XMLHttpRequest();
	appQuery.onreadystatechange=function(){
		if (appQuery.readyState==4 && appQuery.status==200){
			showMetricsData(JSON.parse(appQuery.responseText));
    	}
  	}
	var url = "db/metricsQuery?fields="+fields+"&recordTimeSplit="+recordTimeSplit
			+"&recordTimeMax="+recordTimeMax+"&recordTimeMin="+recordTimeMin
	appQuery.open("GET",url,true);
	appQuery.send();
}
function changeMetricsRecordTimeParams(){
	var value = $("#metrics-params-recordTime-select option:selected").attr("value")
	if( value == -2 ){
		$("#metrics-params-recordTime-divs")[0].style.display = "inline-block";
		$("#metrics-params-recordTime-min")[0].value = unix_to_datetimeNoSecond(get_now_time()-(24*3600*1000));
		$("#metrics-params-recordTime-max")[0].value = unix_to_datetimeNoSecond(get_now_time());
	}
	else{
		$("#metrics-params-recordTime-divs")[0].style.display = "none";
		$("#metrics-params-recordTime-min")[0].value = unix_to_datetimeNoSecond(get_now_time()-(value*60000));
		$("#metrics-params-recordTime-max")[0].value = unix_to_datetimeNoSecond(get_now_time());
	}
}
function getMetricsFieldParams(){
	var pick = $("#metrics-params-type-select option:selected");
	var temp = []
	for(var i=0;i<pick.length;i++){
	    if(  pick[i].value == "app" ){
			temp.push("appsCompleted")
			temp.push("appsPending")
			temp.push("appsRunning")
			temp.push("appsFailed")
			temp.push("appsKilled")
		}
	    else if(  pick[i].value == "resource" ){
			temp.push("totalMB")
			temp.push("availableMB")
			temp.push("allocatedMB")
			temp.push("containersAllocated")
		}
		else if(  pick[i].value == "node" ){
			temp.push("totalNodes")
			temp.push("activeNodes")
		}    
		else{
			temp.push(pick[i].value)
		}
	}
	return temp;
}
function getMetricsRecordTimeSplitParams(){
	var pick = $("#metrics-params-recordTime-split-select option:selected");
	return pick[0].value*60;
}
function getMetricsRecordTimeMinParams(){
	var temp = datetime_to_unix($("#metrics-params-recordTime-min")[0].value);
	if(temp == null){
		temp = get_unix_time()-24*3600;
	}
	//temp = temp - 24*3600*20;
	return temp;
}
function getMetricsRecordTimeMaxParams(){
	var temp = datetime_to_unix($("#metrics-params-recordTime-max")[0].value);
	if(temp == null){
		temp = get_unix_time();
	}
	return temp;
}
function metricsQuery(){
	loadMetricsData()
}
function metricsInit(){
	$("#metrics-params-type-select").chosen({width:"600px"});
	$(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii'});
	metricsQuery()
}