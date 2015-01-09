var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
	if (!req.isAuthenticated()) { 
		console.log("redirecting");
		res.redirect('/login');
		return; 
	}
	next();
});

var options={      
	//tmpDir: __dirname + '/tmp',
	//uploadDir:  __dirname + '/public/files',
	//uploadUrl:  '/files/',
};
var uploader = require('../upload')(options);
router.get('/',  function(req, res) {
	var obj={};
	obj.uploadDir = __dirname + '/../public/files/' + req.user.shortName;
	obj.uploadUrl=  '/files/' + req.user.shortName + '/';
	obj.tmpDir= __dirname + '/../tmp';
	uploader.setPaths(obj,req);
  uploader.get(req, res, function (obj) {
        res.send(JSON.stringify(obj)); 
  });
});

router.post('/', function(req, res) {
	var obj={};
	obj.uploadDir = __dirname + '/../public/files/' + req.user.shortName;
	obj.uploadUrl=  '/files/' + req.user.shortName + '/';
	obj.tmpDir= __dirname + '/../tmp';
	uploader.setPaths(obj,req);
  uploader.post(req, res, function (obj) {
        res.send(JSON.stringify(obj)); 
  });
  
});

router.delete('/delete/:name', function(req, res) {
	var obj={};
	obj.uploadDir = __dirname + '/../public/files/' + req.user.shortName;
	obj.uploadUrl=  '/files/' + req.user.shortName + '/';
	obj.tmpDir= __dirname + '/../tmp';
	uploader.setPaths(obj,req);
  uploader.delete(req, res, function (obj) {
        res.send(JSON.stringify(obj)); 
  });
});

module.exports = router;

/*
module.exports = function (router) {
    router.get('/upload',  function(req, res) {
    	var obj={};
    	obj.uploadDir = __dirname + '/../public/files/' + req.user.shortName;
    	obj.uploadUrl=  '/files/' + req.user.shortName + '/';
    	obj.tmpDir= __dirname + '/../tmp';
    	uploader.setPaths(obj,req);
      uploader.get(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
      
    });

    router.post('/upload', function(req, res) {
    	var obj={};
    	obj.uploadDir = __dirname + '/../public/files/' + req.user.shortName;
    	obj.uploadUrl=  '/files/' + req.user.shortName + '/';
    	obj.tmpDir= __dirname + '/../tmp';
			uploader.setPaths(obj,req);
      uploader.post(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
      
    });

    router.delete('/files/:name', function(req, res) {
    	var obj={};
    	obj.uploadDir = __dirname + '/../public/files/' + req.user.shortName;
    	obj.uploadUrl=  '/files/' + req.user.shortName + '/';
    	obj.tmpDir= __dirname + '/../tmp';
			uploader.setPaths(obj,req);
      uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
    });

    return router;
}
*/