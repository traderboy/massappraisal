/*
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/?redirect=/user');
}
*/
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	  console.log(req.user.shortName);
	  //console.log(req.user.emails[0].value);
	  res.end("respond with a resource");
	  
});

module.exports = router;
/*
 * GET users listing.

create table reaisincva.tables ( id serial,name varchar(200),geometrytype varchar(50),filetype varchar(50),date_loaded timestamp);
 */
 
 /*
	emails: [ { value: 'reaisincva@gmail.com' } ] 
  session:
   { cookie:
      { path: '/',
        _expires: null,
        originalMaxAge: null,
        httpOnly: true },
     passport: { user: [Object] } },
  _passport:
   { instance:
      { _key: 'passport',
        _strategies: [Object],
        _serializers: [Object],
        _deserializers: [Object],
        _infoTransformers: [],
        _framework: [Object],
        _userProperty: 'user',
        Authenticator: [Function: Authenticator],
        Passport: [Function: Authenticator],
        Strategy: [Object],
        strategies: [Object] },
     session: { user: [Object] } },
  user:
   { provider: 'google',
     id: '111028451305834352504',
     displayName: 'Steve Hale',
     name: { familyName: 'Hale', givenName: 'Steve' },
     emails: [ [Object] ],
     _raw: '{\n "id": "111028451305834352504",\n "email": "reaisincva@gmail.com",\n "verified_email": true,\n "name": "Steve Hale",\n "given_name": "Steve",\n "
family_name": "Hale",\n "picture": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",\n "gender": "male",\n "locale
": "en"\n}\n',
     _json:
      { id: '111028451305834352504',
        email: 'reaisincva@gmail.com',
        verified_email: true,
        name: 'Steve Hale',
        given_name: 'Steve',
        family_name: 'Hale',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
        gender: 'male',
        locale: 'en' } },
*/         

