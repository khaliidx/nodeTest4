var express    = require('express');        // call express
var Movie = require('./models/movie');

var router = express.Router();              // get an instance of the express Router



    
    

router.route('/movies/list')
    .get(function(req, res) {
        Movie.find(function(err, results) {
            if (err)
                res.send(err);

            res.render('list.ejs', {movies: results})
        })
    });    


// add
router.route('/movies/add')
    .get(function(req, res) {        
            console.log('redirected to editing page!');
            res.render('add.ejs');
        })
    .post(function(req, res) {        
        var movie = new Movie(req.body);
        // save the movie and check for errors
        movie.save(function(err) {
            if (err)
                res.send(err);

            console.log('Movie created!');
            res.redirect('/');
        });
        
    });
        
   
//delete
router.route('/movies/delete/:id')
    .get(function(req, res) {
        Movie.findById( req.params.id, function ( err, movie ){
            movie.remove( function ( err, movie ){
                res.redirect( '/' );
            });
        });
    });
    




//edit
router.route('/movies/edit/:id')

    .get(function(req, res) {
        Movie.findById(req.params.id, function(err, result) {
            if (err)
                res.send(err);
            res.render('edit_movie.ejs',{movie: result});
        });
    });

router.route('/movies/edit/:id')   
    .post(function(req, res) {
        Movie.findById(req.params.id, function(err, movie) {
            if (err)
                res.send(err);

            for (prop in req.body) {
              movie[prop] = req.body[prop];
            }

            movie.save(function(err) {
                if (err)
                    res.send(err);
                
                console.log('Movie updated!');
                res.redirect( '/movies/list' );
            });

        });
    });



module.exports = router;