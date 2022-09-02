module.exports = function(){
    var express = require('express');
    var router = express.Router();
// *******************************************//
// Serverside stuff
    var count = 0;
    function getVideogame(res,mysql,context,complete){
        mysql.pool.query('SELECT vg.id,vg.title,vg.image,genre.gname FROM `vg` inner join genre on vg.genre = genre.id ', function(err,results, fields) {
        if(err){
            res.write(JSON.stringify(err));
            res.end();
        }
            context.vg = results;
            complete();
        });
    }


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
    function getGenre(res,mysql,context,complete){
        mysql.pool.query('SELECT * FROM genre', function(err,results, fields) {
            if(err){
                res.write(JSON.stringify(err));
                res.end();
            }
            context.gen = results;
            complete();
        });

    }

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
    function getVg(res,mysql,context,id,complete){
        var sql = "SELECT * FROM vg WHERE id = ?";
        var inserts = [id];
        console.log(inserts);
        mysql.pool.query(sql, inserts, function(err,results,fields){
            if(err){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.vg = results[0];
            complete();
        })
    }

// Server Code Begins
    //
    //
    //
    //
// Main page : Displays all the information
        router.get('/', function(req,res){
            console.log("Main page envoked");
            console.log(count);
            count = 0;
            var callbackCount = 0;
            var context = {};
         //  context.jsscripts = ["deletedev.js","filterdev.js","searchdev.js","index.js"];
           context.jsscripts = ["deletedev.js","filterdev.js","searchdev.js", "gamepage.js"];
            var mysql = req.app.get('mysql');
            getDeveloper(res,mysql, context, complete);
            getVideogame( res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 2){
                    res.render('game',context);
                }
            }


        });
// This is the filter option that fails

        router.get('/filter/:dnamo', function(req,res){
            console.log("Filter init...");
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
        router.get('/add', function(req,res){
            console.log("Update in progress...");
            count = 3
            callbackCount = 0;
            var context = {};
            context.jsscripts = ["selecteddev.js", "updatedev.js"];
            var mysql = req.app.get('mysql');
            getDeveloper(res, mysql, context, complete);
            getGenre(res,mysql,context,complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 2){
                    res.render('add-games' , context);
                }
            }
        });
        router.get('/:id', function(req,res){
            console.log("Update progress...");
            count = 4
            callbackCount = 0;
            var context = {};
            context.jsscripts = ["selecteddev.js", "updategame.js"];
            var mysql = req.app.get('mysql');
            getVg( res, mysql, context,req.params.id, complete);
      //      getGenre(res,mysql,context,complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('update-games' , context);
                }
            }
        });
//  Redirects back to normal page
// Add a new data

        router.post('/', function(req,res){
            console.log("before adding",count)
            if (count == 3){
            console.log("Adding in progress...");
            var mysql = req.app.get('mysql');
            var sql = "INSERT INTO `vg` (`title`,`genre`,`image`) values (?,?,?)";
            var inserts = [req.body.title, req.body.gen, req.body.image];

            sql = mysql.pool.query(sql,inserts, function( err, results, fields){
                if(err){
                    res.write(JSON.stringify(err));
              //      res.end();
                }
           //     res.redirect('/game');

            });
            var slq = "INSERT INTO `dtv` (`did`,`vid`) values ((SELECT id FROM developer WHERE id=?),(SELECT id FROM vg WHERE title=?))";
            var insert = [req.body.dev,req.body.title];
           slq = mysql.pool.query(slq, insert, function( err, results, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                res.redirect('/game');
            });


            }else{
                res.redirect('/game');
            }
        });

// Update ends
        router.put('/:id', function(req,res){
            console.log("Closing process update");
            count = 4;
            var mysql = req.app.get('mysql');
            var sql = "UPDATE vg SET title=?, releasedate=?,image=?WHERE id =?";
            var inserts = [req.body.title , req.body.releasedate,req.body.image, req.params.id];
            console.log("Log",inserts);
            sql = mysql.pool.query(sql,inserts, function( err, results, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                else{
                    count = 3;
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
