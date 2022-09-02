
module.exports = function(){
    var express = require('express');
    var router = express.Router();
    // count

    function getVg(res,mysql,context,complete){
        mysql.pool.query('SELECT * FROM `vg` inner join genre on vg.genre = genre.id inner join dtv on vg.id = dtv.vid inner join developer on dtv.did = developer.id inner join publisher on pubid = publisher.id inner join mtv on vg.id = mtv.vid inner join modes on mtv.mid = modes.id', function(err,results, fields) {
        if(err){
            res.write(JSON.stringify(err));
            res.end();
        }
            context.vg = results;
            complete();
        });
    }

    function getGenre(res,mysql,context,complete){
        mysql.pool.query('SELECT * FROM genre', function(err,results, fields) {
        if(err){
            res.write(JSON.stringify(err));
            res.end();
        }
            context.genre = results;
            complete();
        });
    }
    function getDeveloper(res, mysql, context, complete){
        mysql.pool.query('SELECT * FROM developer', function(err,results, fields) {
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            context.dev = results;
            complete();
        });
    }
    function getPub(res, mysql, context, complete){
        mysql.pool.query('SELECT * FROM publisher', function(err,results, fields) {
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            context.pub = results;
            complete();
        });
    }

    function getMode(res,mysql,context,complete){
        mysql.pool.query('SELECT * FROM `modes`', function(err,results, fields) {
        if(err){
            res.write(JSON.stringify(err));
            res.end();
        }
            context.mode = results;
            complete();
        });
    }

    // Begin code for server
        router.get('/', function(req,res){
            console.log("Main page envoked");
            var callbackCount = 0;
            var context = {};
           context.jsscripts = ["deletedev.js","filterdev.js","searchdev.js"];
            var mysql = req.app.get('mysql');
            getDeveloper(res,mysql, context, complete);
            getVg( res, mysql, context, complete);
            getGenre(res,mysql,context,complete);
            getPub(res, mysql, context, complete);
            getMode(res,mysql,context,complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 5){
                    res.render('admin',context);
                }
            }


        });

    return router;

}();
