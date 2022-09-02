/*
 *  Used the cs340 example as a starting point
 *  With this format code pertaining to the website has been broken up
 *  Easier to find and edit
 *  Genius
 */
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    var count = 0;
    /*
     *  This function is called to retrieve the vidego game table inner joined wiht genre
     *
     */
    function getVideogame(res,mysql,context,complete){
        mysql.pool.query('SELECT * FROM `vg` inner join genre on vg.genre = genre.id inner join dtv on vg.id = dtv.vid inner join developer on dtv.did = developer.id', function(err,results, fields) {
        if(err){
            res.write(JSON.stringify(err));
            res.end();
        }
            context.vg = results;
            complete();
        });
    }
    /*
     *  This function retrieves developer
     */

    function getDeveloper(res, mysql, context, complete){
        mysql.pool.query('SELECT * FROM developer', function(err,results, fields) {
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            context.developer = results;
            complete();
        });
    }
    /*
     *  function for retrieve a specific developer
     */

    function getDev(res, mysql, context, id ,complete){
        var sql = "SELECT id, dname FROM developer WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function( err, results, fields){
            if(err){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.developer = results[0];
            complete();

        });
    }
    /*
     *  Filter implemented here
     */

    function getVgFilter(req, res,mysql, context, complete){
        var query = 'SELECT  *  FROM `vg` inner join genre on vg.genre = genre.id inner join dtv on vg.id = dtv.vid inner join developer on dtv.did = developer.id where developer.id=?';
        var inserts = [req.params.dnamo]

        mysql.pool.query(query,inserts, function(err, results, fields){
            if(err){
                res.end();
            }
            context.vg = results;
            complete();
        });

    }

// Main page : Displays all the information
        router.get('/', function(req,res){
            console.log("Main page envoked");
            console.log(count);
            count = 0;
            var callbackCount = 0;
            var context = {};
           context.jsscripts = ["deletedev.js","filterdev.js","searchdev.js"];
            var mysql = req.app.get('mysql');
            getDeveloper(res,mysql, context, complete);
            getVideogame( res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 2){
                    res.render('shop',context);
                }
            }


        });
// This is the filter

        router.get('/filter/:dnamo', function(req,res){
            console.log("Filter init...");
            console.log(req.params.dnamo);
            var callbackCount = 0;
            var context = {};
           context.jsscripts = ["deletedev.js","filterdev.js","searchdev.js"];
            var mysql = req.app.get('mysql');
            getDeveloper(res,mysql, context, complete);
            getVgFilter( req, res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 2){
                    res.render('shop',context);
                }
            }

        });
// Not implemented :didn't have to dissect this
        router.get('/search/:s', function(req,res){
            var cbc = 0;
            var context = {};
            context.jsscripts = ["deletedev.js","filterdev.js","searchdev.js"];
            var mysql = req.app.get('mysql');
            getDeveloper(res, mysql, context, complete);
            getVideogame( res, mysql, context, complete);
            function complete(){
                cbc++;
                if(cbc >= 2){
                    res.render('shop' , context);
                }
            }
        });
// Open Page for Update
        router.get('/:id', function(req,res){
            console.log("Update in progress...");
            count = 3
            callbackCount = 0;
            var context = {};
            context.jsscripts = ["selecteddev.js", "updatedev.js"];
            var mysql = req.app.get('mysql');
            getDev(res, mysql, context, req.params.id, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('update-dev' , context);
                }
            }
        });
//  Redirects back to normal page
// Add a new data

        router.post('/', function(req,res){
            console.log("before adding",count)
            if (count != 3){
            console.log("Adding in progress...");
            console.log(callbackCount);
            var mysql = req.app.get('mysql');
            var sql = "INSERT INTO developer (dname) values (?)";
            var inserts = [req.body.dname];
            sql = mysql.pool.query(sql,inserts, function( err, results, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                res.redirect('/shop');
            });
            }else{
                res.redirect('/shop');
            }
        });

// Update ends
        router.put('/:id', function(req,res){
            console.log("Closing process update");
            var mysql = req.app.get('mysql');
            var sql = "UPDATE developer SET dname=? WHERE id =?";
            var inserts = [req.body.dname, req.params.id];
            console.log(inserts);
            sql = mysql.pool.query(sql,inserts, function( err, results, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                else{
                    count = 3;
                    console.log(count);
                    res.status(200);
                    res.end();
                }
            });
        });
//  Deletes
        router.delete('/:id', function(req,res){
            console.log("Delete");
            var mysql = req.app.get('mysql');
            var sql = "DELETE FROM developer WHERE id =?";
            var inserts = [req.params.id];
            console.log(inserts);
            sql = mysql.pool.query(sql,inserts, function( err, results, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                res.status(200);
                res.end();
            });
        });
        return router;
}();
