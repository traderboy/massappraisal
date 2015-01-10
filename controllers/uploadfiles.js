var express = require('express');
var router = express.Router();
var ogr2ogr = require("ogr2ogr");


router.use(function(req, res, next) {
	if (!req.isAuthenticated()) { 
		//console.log("redirecting");
		res.redirect('/login');
		return; 
	}
	next();
});


router.get('/',  function(req, res){
	res.render('uploadfiles', {
			user : req.user
	});
});

router.get('/:fileName',  function(req, res){
	//console.log(req.params.tableName);

	if(!req.user.shortName)
	{
		req.user.shortName = req.user.emails[0].value;
	}
  
  //step one:  get metadata from file

   var fileName = req.params.fileName;
	 if(!fileName){
	 	fileName = req.query.fileName;
	 	if(!fileName){
	  	res.end(JSON.stringify({"err":"Filename missing in request!"}));
	  	return;
		}
	 }
  
	 var filename=__dirname + "/../public/files/" + req.user.shortName + "/" + fileName;
	 var fs = require('fs');
	 //make user upload folder if it doesn't exist
	 if(!fs.existsSync(__dirname + "/../public/files/" + req.user.shortName ))
	 {
	 	fs.mkdirSync(__dirname + "/../public/files/" + req.user.shortName );
	 }
	 var ogr = ogr2ogr( filename);
	 
	
	 if (!fs.existsSync(filename)) {
	  console.log("File doesn't exist");
	  res.end(JSON.stringify({"err":"Filename "+fileName+" not found!"}));
	  res.end("File not found!");
	  return;
	 }
	 
	 ogr.info(function (er, data) {
	   if (er) console.error(er)
	   //console.log(data)
	   console.log(data["Layer name"]);
	   try{
		   data['file']=data['file'].split("'")[1].split("`")[1];
	   }catch(e){}
	   
	   if(data.Geometry=='None'){
		   if(/^win/.test(process.platform))
			   process.env['GDAL_DATA'] = 'C:\\PostgreSQL93\\gdal-data';
		   var layerName = data["Layer name"];
		   //is it not a spatial file?
		   var opts=["-overwrite","-lco", "DROP_TABLE=IF_EXISTS","-nln",layerName];
		   //var f = tableName.toLowerCase().split(".");
		   var isCSV = fileName.substring(fileName.length-3)!='dbf';
		   console.log("isCSV: " +  isCSV);
/*
		   if(f.length>1){
			   if( (f[f.length-1]=='xls'||f[f.length-1]=='csv'||f[f.length-1]=='dbf'||f[f.length-1]=='xlsx')){
				   isCSV=f[f.length-1]!='dbf';
				   tableName = tableName.split(".")[0];
			   }
		   }
*/
		   var ogr = ogr2ogr( filename)
		   .format('PostgreSQL') 
		   .options(opts)//
		   .skipfailures()  
		   .destination('PG:host=localhost user=dbuser dbname=soils password=dbuser active_schema='+req.user.shortName) 	
		   .exec(function (er, ret) {
			   console.log("Done");
			   if (er) console.error(er)
			   //console.log(data.toString())
			   //res.end(data.toString());
			   //var msg={"step":step,"ret":data?JSON.stringify(data):""};
			   //if(er)msg['err']="Unable to load table:  "+er;
			   convertCSV2Numeric(req.user.shortName,layerName,data,res,isCSV);
		   });
	   }
	   else res.end(JSON.stringify(data));
	 });
});
/*
 * Verify file upload.
 */

function convertCSV2Numeric(shortName,tableName,msg,res,isCSV)
{
   var pg = require("pg");
   
	
	var baseTableName=tableName;
	  var sql="select column_name from information_schema.columns where table_schema='"+shortName+"' and table_name = '"+tableName+"' and column_name not in('ogc_fid','wkb_geometry','id','shape_leng','shape_area','_acres_total') and data_type not in('numeric','double precision','float','integer','decimal')";
	  console.log(sql);
	  pg.connect(global.conString,function(err, client, release) {
		  if (err){ res.end(JSON.stringify({"err":"No connection to database;"}));throw err;}
		  //strip off extension
		  client.query(sql, function(err, result) {
		  		//add the schema to the tablename
					tableName = shortName+"."+ tableName;
				  var cols=[];
				  //console.log(result.rows);
				  for(var i in result.rows){
				  	if(result.rows[i].column_name.charAt(0) == result.rows[i].column_name.charAt(0).toUpperCase())
				  		result.rows[i].column_name='"' + result.rows[i].column_name + '"';
				  	else if(result.rows[i].column_name.indexOf(" ")!=-1)
				  		result.rows[i].column_name='"' + result.rows[i].column_name + '"';

				  	cols.push(result.rows[i].column_name);
				  	//cols.push("tonumeric('"+result.rows[i].column_name + ','"+tableName+"'))";
				  }
				  //var sql='select '+corr.join(",")+' from '+tableName+"_stats";
				  var sql = [
				  (isCSV?"select public.tonumeric('" + cols.join("','"+tableName+"'),public.tonumeric('") + "','"+tableName+"')":"select 1")
				  ,'drop table if exists ' + tableName + "_stats"
				  ,"create table " + tableName+"_stats as select * from " + tableName
					,"alter table " + tableName + "_stats drop if exists wkb_geometry"
				  ,"alter table " + tableName + "_stats drop if exists ogc_fid"
				  ,"alter table " + tableName + "_stats add oid serial"
				  
				  ,'drop table if exists ' + tableName + '_vars'
				  //"create table " + tableName + "_vars as select 1 as include,0 as id,0 as depvar,column_name as name from information_schema.columns where table_schema='"+req.user.shortName+"' and table_name = '"+baseTableName+"_stats' and column_name not in('wkb_geometry','shape_leng','shape_area','_acres_total') and data_type in('numeric','double precision','float','integer','decimal')",
					,"create table " + tableName + "_vars as select 1 as include,1 as cinclude,0 as id,0 as uniqueid,0 as depvar,column_name as name,data_type as type from information_schema.columns where table_schema='"+shortName+"' and table_name = '"+baseTableName+"_stats' and column_name not in('wkb_geometry','shape_leng','shape_area','_acres_total')" // and data_type in('numeric','double precision','float','integer','decimal')",
				  //string fields can't be used as dependent variables
				  ,"update " + tableName + "_vars set include=2,depvar=2 where type not in('numeric','double precision','float','integer','decimal')"
					//set the oid as the default unique identifier
					,"update " + tableName + "_vars set include=3,id=1 where name='oid'"
					//set the first numeric field found as the dependent variable
					,"update " + tableName + "_vars set depvar=1 where name=(select name from "+tableName+"_vars where include=1 limit 1)"
					//find all the fields that have all distinct/unique values.  These are the only fields that can be used as unique identifiers
					,"select public.update_unique('"+shortName+"','" + baseTableName + "')"
					//remove the non-numeric fields that don't have all unique values
					,"delete from "+ tableName + "_vars where include=2 and uniqueid=0"
					,"delete from "+shortName+".tables where name='"+baseTableName+"'"
					,"insert into "+shortName+".tables(name,geometrytype,filetype,date_loaded) values('"+baseTableName+"','None','"+msg['file']+"',NOW())"
				  ,'select count(*) as count from '+tableName+'_stats'];
				  
				  //,'drop table if exists ' + tableName + '_vars'	  			
				  //,"create table " + tableName + "_vars as select 1 as include,0 as id,0 as depvar,column_name as name from information_schema.columns where table_schema='"+shortName+"' and table_name = '"+baseTableName+"_stats' and column_name not in('wkb_geometry','shape_leng','shape_area','_acres_total') and data_type in('numeric','double precision','float','integer','decimal')"
				  
				  
				  console.log(sql);
			  	client.query(sql.join(";"), function(err, result) {
				    release()
				    res.end(JSON.stringify(msg));
			  	});
		  })
		})
}

module.exports = router;	