
var options={      
	//tmpDir: __dirname + '/tmp',
	//uploadDir:  __dirname + '/public/files',
	//uploadUrl:  '/files/',
};
var uploader = require('../upload')(options);

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