$(document).ready(function() {
	//table name may be different than the filename
	var tableName=sessionStorage.getItem("tablename");
	if(!tableName)
	{
		location.href='/';
		return;
	}
	var url="/stepwise_regression/"+tableName;
	//$('#summaryTable').bootstrapTable({
	//    url: url
	//});
	$('#summaryTable').bootstrapTable("showLoading");
$.getJSON(url,function(data){
	//var columns=[{field:"name",title:"",align:"right",class:"col"}];
	//for(var i=0;i<data.length;i++)
	//{
	//	columns.push({field:data[i].name,title:data[i].name,align:"right"});
	//}
	for(var i=0;i<data.names.length;i++)
		data.names[i]=data.coef[i]['name']=data.names[i].trim();//replace(/"/g,"").
	
	if(data.plot)
	{
		$("#plotimg").prop("src","data:image/gif;base64,"+data.plot);
	}
	//var names=data.call.replace("~","+").split("+");
	//for(var i=0;i<names.length;i++)
	//	data.coef[i]['name']=names[i].trim();
	$("#loader").hide();
	$('#summaryTable').show().bootstrapTable({
	                cache: false,
	                data:data.coef,
	                height: 300,
	                striped: true
	});

	var stats=[{"name":"R Squared","value":data.rsquared},{"name":"Adjusted R Squared","value":data.adjrsquared},{"name":"Standard Error","value":data.stderr},{"name":"F statistic","value":data.fstats.value}];
	$('#statsTable').bootstrapTable({
	                cache: false,
	                data:stats,
	                height: 200,
	                striped: true
	});
	var sum="<b>Formula: </b>" + data.names[0] + " = " + data.coef[0]['Estimate'] ;
	for(var i=1;i<data.coef.length;i++)
		sum += " + " + data.names[i] + " * " + data.coef[i]['Estimate'];
	
	$("#summary").html( sum );

});

	
});
