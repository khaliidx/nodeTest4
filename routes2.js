var Movie = require('./models/movie');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');




app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));













var router = express.Router();              // get an instance of the express Router









//GET AND POST
router.route('/')

    .get(function(req, res) {
            res.render('index.ejs')
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
        });
        
   
//delete
router.route('/delete/:id')
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

router.route('/edit/:id')   
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