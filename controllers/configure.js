var express = require('express');
var router = express.Router();
var pg = require("pg");


router.use(function(req, res, next) {
	if (!req.isAuthenticated()) { 
		console.log("redirecting");
		res.redirect('/login');
		return; 
	}
	next();
});

router.get('/',  function(req, res){
	console.log(req.query);
	//return;
	//if(!req.query){
		res.render('configure', {
			user : req.user,
			tableName: req.query.tableName
		});
		return;
	//}
});

router.get('/:tableName',  function(req, res){
	console.log(req.params.tableName);
	//return;
	res.writeHead(200, {"Content-Type": "application/json"});
	res.setTimeout(0); 

  //res.send("respond with a resource");
	var debug=false;
	if(!req.user.shortName)
	{
		req.user.shortName = req.user.emails[0].value;
	}
  
  var tableName = req.params.tableName;
	 if(!tableName){
	 	tableName = req.query.tableName;
	 	if(!tableName){
	  	res.end(JSON.stringify({"err":"Tablename missing in request!"}));
	  	return;
		}
	 }
	 tableName = tableName.replace(/\W/g, '').toLowerCase()+"_vars";
	 if(req.query.field && req.query.name)
	 {
	 		 var vals=null;
	 		 if(req.query.name=='all'){
	 		 		var sql="update " + req.user.shortName + "." + tableName + " set include=" + parseInt(req.query.value)+",cinclude="+parseInt(req.query.value);
	 		 	}
	 		 else if(req.query.field=='include'){
	 		 		var sql="update " + req.user.shortName + "." + tableName + " set include=$1,cinclude=$1 where name=$2";
	 		 		vals=[req.query.value,req.query.name];
	 		 }
	 		 else if(req.query.field=='depvar'){ //can't be numeric
	 		 		//var sql="update " + req.user.shortName + "." + tableName + " set include=$1 where name=$2";
	 		 		var sql="update " + req.user.shortName + "." + tableName + " set depvar=case when name=$1 then 1 else 0 end where depvar!=2";
	 		 		vals=[req.query.name];
	 		 }
	 		 else {
	 		 		var sql="update " + req.user.shortName + "." + tableName + " set id=case when name=$1 then 1 else 0 end";
	 		 		vals=[req.query.name];
	 		 	}

	 		 console.log(sql + ": " + vals);
			 pg.connect(global.conString,function(err, client, release) {
			  if (err){ res.end(JSON.stringify({"err":"No connection to database;"}));throw err;}
			  //strip off extension
			  client.query(sql, vals, function(err, result) {
				  	release();
			  		if(err)console.log(err);
			  		res.end("success");
			  		//res.end(JSON.stringify(result.rows));		
			  });
			});
			return;
	 }

	 //tableName += '_stats';
	 var idName = req.query.idName;
	 if(!idName)idName='ogc_fid';
	 else idName=idName.replace(/\W/g, '');
	 	
	 //does tablename_vars exist?	
	 //var sql=[
	 //"create_table_as('"+tableName+"','select 1 as include,0 as id,0 as depvar,column_name as name from information_schema.columns where table_schema='"+req.user.shortName+"' and table_name = '"+tableName+"' and column_name not in('ogc_fid','wkb_geometry','id','shape_leng','shape_area','_acres_total') and data_type in('numeric','double precision','float','integer','decimal')",'"+req.user.shortName+"')"
	 //"create table if not exists "+req.user.shortName + "." + tableName + "_vars as select 1 as include,0 as id,0 as depvar,column_name as name from information_schema.columns where table_schema='"+req.user.shortName+"' and table_name = '"+tableName+"' and column_name not in('ogc_fid','wkb_geometry','id','shape_leng','shape_area','_acres_total') and data_type in('numeric','double precision','float','integer','decimal')"
	 //,"select include,id,depvar,name from " + req.user.shortName + "." + tableName + "_vars where include=1 order by id desc,depvar desc"

	 //var sql="select * from get_table_vars('"+req.user.shortName+"','"+tableName+"')";
	 var sql="select include,id,depvar,name from " + req.user.shortName + "." + tableName+ " order by depvar desc,id desc,name";

	 //];
/*

               , _qry text
               , _schema text
create table reaisincva.homesites_vars if not exists as select 1 as include,0 as id,0 as depvar,column_name as name 
from information_schema.columns 
where table_schema='reaisincva' and table_name = 'homesites_stats' and column_name not in('ogc_fid','wkb_geometry','id','shape_leng','shape_area','_acres_total') 
and data_type in('numeric','double precision','float','integer','decimal');


select include,id,depvar,name from reaisincva.homesites_stats_vars where include=1 order by id desc,depvar desc' ]
*/

	 console.log(sql);
	 pg.connect(global.conString,function(err, client, release) {
	  if (err){ res.end(JSON.stringify({"err":"No connection to database;"}));throw err;}
	  //strip off extension
	  client.query(sql, function(err, result) {
		  	release();
	  		if(err)console.log(err);
	  		
	  		res.end(JSON.stringify(result.rows));		
	  });
	});

});		  				    
		  		/*
		  		//add the schema to the tablename
					tableName = req.user.shortName+"."+ tableName;
				  var cols=["ogc_id"];
				  var depvar = result.rows[0].name;
				  
				  var out=["name text"];
				  console.log(result.rows);
				  for(var i in result.rows){
				  	if(result.rows[i].name.charAt(0) == result.rows[i].name.charAt(0).toUpperCase())
				  		result.rows[i].name='"' + result.rows[i].name + '"';
				  	else if(result.rows[i].name.indexOf(" ")!=-1)
				  		result.rows[i].name='"' + result.rows[i].name + '"';
				  	cols.push(result.rows[i].name);
				  	out.push(result.rows[i].name + " double precision");
				  }
			
				  //var sql='select '+corr.join(",")+' from '+tableName+"_stats";
				  //var sql = "select replace(column1,'`','') as fieldname,column2 as estimate,column3 as stderr,column4 as tval,column5 as pr from public.r_lm_summary('" + cols.join(",") + "','" + tableName + "')";
				  //var sql = "select * from public.r_table_cor('" + cols.join(",") + "','" + tableName + "') s("+out.join(",")+")";
				  //'id,sale_price,parcel_ac,parcel_lv,parcel_bv,parcel_tv,sale_acres,sale_ppa,elevation,climate_zn,_acres_total as acres_total,"Slope","Elevation","Prod Index","Range Potential","Drought Index","All Crop Prod Index"', 'reaisincva.homesites_stats');
				  
					var sql = "select replace(column1,'`','\"') as name,column2 as coef from public.r_table_stepwise_regression_coefficients('" + cols.join(",") + "','" + tableName + "')";// s("+out.join(",")+")";
					console.log(sql);
				  //pg.connect(global.conString,function(err, client, release) {
					  //if (err){ res.end(JSON.stringify({"err":"No connection to database;"}));throw err;}
					  //strip off extension
					  client.query(sql, function(err, result) {
					  	if(err)console.log(err);
					  	console.log(result.rows);
					  	//?offset=0&limit=10&search=test
					  	var select =[];
					  	var fields=[];
					  	for(var i in result.rows){
					  		if(result.rows[i].name==depvar){
					  			select.push( result.rows[i].coef );
					  		}
					  		else {
					  			select.push( result.rows[i].name+" * " + result.rows[i].coef);					  			
					  		}
					  		fields.push(result.rows[i].name)
					  	}
					  	//,round((val-"+depvar+")::numeric,2) as diff
					  	var sql="select "+ fields.join(",") + ",round((" + select.join("+") + ")::numeric,2) as \"Predicted price\" from " + tableName + "" + " offset " + (req.query.offset?req.query.offset:0) + "  limit " + (req.query.limit?req.query.limit:100);
					  	console.log(sql);
					  	client.query(sql, function(err, result) {
						  	if(err)console.log(err);
						  	console.log(result.rows);
						    release();
						    //res.writeHead(200, {"Content-Type": "application/json"});
						    res.end(JSON.stringify(result.rows));				    
						    //res.writeHead(200, {"Content-Type": "application/json"});
						    //res.end(result.rows[0].r_table_regression_summary);
					  	});
					  });
				  //});		  	
		  });
		  */

//select "sale date",acres,quality,-554360.736253571+"sale date" * 14.1150383515906+acres * 515.094173208256+quality * 162.445376332006 as val from reaisincva.r_stats offset=0  limit = 100;

//select priceac,"sale date",acres,quality,round(-554360.736253571+"sale date" * 14.1150383515906+acres * 515.094173208256+quality * 162.445376332006::numeric,2) as val,round(val-priceac::numeric,2) as diff from reaisincva.r_stats offset 0  limit 100

module.exports = router;