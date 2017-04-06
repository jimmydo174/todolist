var express = require("express"),
    mongoose = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    multer = require('multer'), //upload file
    bodyParser = require("body-parser");

var app = express();
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

var upload = multer({storage: storage});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

mongoose.connect("mongodb://localhost/todolist");

var todoSchema = new mongoose.Schema({
    todo: String
});

var Todo = mongoose.model("Todo", todoSchema);

app.get("/", function(req, res){
     function escapeRegex(text){
        // this allows us to escape any special characters with a backslash
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    if(req.query.keyword) { 
        //if there's any query string called keyword
        //set the constant (variable) regex to a new regular expression created from keyword 
        //that web pulled from the query string
        const regex = new RegExp(escapeRegex(req.query.keyword), 'gi');
        //query the database for todos with text property that match the regular expression of the search keyword
        Todo.find({todo: regex}, function(err, todo){
            if(err){
                console.log(err);
            } else {
                //send back todo as JSON
                res.json(todo);
            }
        });
    } else {
        Todo.find({}, function(err, allTodos){
            if(err){
                console.log(err);
            } else {
                if(req.xhr) {
                    res.json(allTodos);
                } else {
                    res.render("index", {todos: allTodos});
                }
            }
        });
    }
});


app.post("/new", function(req, res) {
    var todo = req.sanitize(req.body.todo)
    Todo.create({todo: todo}, function(err, td){
        if(err){
            console.log(err);
        } else {
            res.json(td);
        }
    });
});

app.put("/:id/edit", function(req, res){
    Todo.findByIdAndUpdate(req.params.id, {todo: req.body.todo}, {new: true}, function(err, td){
        if(err){
            console.log(err);
        } else {
            res.json(td);

        }
    });
});

app.delete('/:id/delete', function(req, res){
    Todo.findByIdAndRemove(req.params.id, function(err, td){
        if(err){
            console.log(err);
        } else {
            res.json(td); 
        }
    });
});

app.get('/upload', function(req, res){
    res.render('upload');
});

app.post('/upload', upload.any(), function(req, res){
    req.files.forEach(function(file){
        Todo.create({todo: file.filename}, function(err, todo){
            if(err){
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    });
})

app.listen(3000, function(req, res){
    console.log("server started!");
})