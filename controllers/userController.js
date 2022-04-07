const User = require('../models/user')
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const router = express.Router();
const bcrypt = require('bcrypt');
const withAuth = require('../middleware/auth');
const withLog = require('../middleware/loggedInCheck');

router.use(cookieParser());

router.get('/checkToken', withAuth, function (req, res) {
    res.sendStatus(200);
});

//SHOW USER LOGIN FORM ROUTE(GET)
router.get('/home', function (req, res) {
    res.send('Welcome!');
});
//router.get('/secret', withLog, function (req, res) {
router.get('/secret', function (req, res) {
    console.log(req.session.isLoggedIn)
    res.send('The password is potato');
});

// POST route to register a NEW user
// router.post('/new', function (req, res) {
//     const { username, password, name } = req.body;
//     const user = new User({ username, password, name });
//     console.log(`user.name: ${user.name}`)
//     user.markModified("username");
//     user.markModified("password");
//     // user.markModified("name");
//     user.save(function (err) {
//         if (err) {
//             res.status(500)
//             console.log()
//             res.send("Error registering new user please try again.");
//         } else {
//             res.status(200).send("Welcome to the club!");
//         }
//     });
// });

router.post('/authenticate', function (req, res) {
    const { username, password } = req.body;
    User.findOne({ username }, function (err, user) {
        if (err) {
            console.error(err);
            res.status(500)
                .json({
                    error: 'Internal error please try again'
                });
        } else if (!user) {
            res.status(401)
                .json({
                    error: 'Incorrect EMAIL or password'
                });
        } else {
            user.isCorrectPassword(password, function (err, same) {
                if (err) {
                    res.status(500)
                        .json({
                            error: 'Internal error please try again'
                        });
                } else if (!same) {
                    res.status(401)
                        .json({
                            error: 'Incorrect email or PASSWORD'
                        });
                } else {
                    req.session.isLoggedIn = true;
                    // console.log(`req.session.isLoggedIn: ${req.session.isLoggedIn}`)
                    // Issue token
                    const payload = { username };
                    const token = jwt.sign(payload, process.env.SESSION_SECRET, {
                        expiresIn: '1h'
                    });
                    res.cookie('token', token, { httpOnly: true })
                        .sendStatus(200);
                    // console.log(` req.cookies.token: ${JSON.stringify(req.cookie)}`)
                }
            });
        }
    });
});

router.get('/', async (req, res) => {
    // NOTE- COMMENT IN BELOW TO RENDER LOGIN FORM
    res.send("hello")
})


//LOG USER IN ROUTE(POST)
router.post("/login", async (req, res) => {
    try {
        //GRABS USERNAME FROM THE BODY OF THE FORM AND QUERIES THE DATABASE
        const possibleUser = await User.findOne({ username: req.body.username })
        if (possibleUser) {
            //IF IT FINDS A USER
            //COMPARES ENCRYPTED PASSWORDS LOOKING FOR A MATCH
            if (bcrypt.compareSync(req.body.password, possibleUser.password)) {
                //IF PASSWORDS MATCH USER IS LOGGED IN
                req.session.isLoggedIn = true;
                console.log(possibleUser)
                //SETS THE USER ID FOR THE SESSION
                req.session.userId = possibleUser._id;
                //REDIRECTS LOGGED-IN USER TO USER SHOW PAGE
                res.redirect(`/users/${possibleUser._id}`)
                console.log("user is logged in")
            }
            else {
                //IF PASSWORDS DONT MATCH REDERICT TO LOG-IN PAGE
                res.redirect("/users")
            }
        }
        else {
            //IF USERNAME DOESNT EXIST IN DB REDIRECT TO LOGIN PAGE
            res.redirect("/users")
            //not working
        }
        //DB FUCK-UPS
    } catch (err) {
        console.log(err);
        res.send(500)
    }
})


//CREATE A NEW USER ROUTE(POST)
router.post('/register', async (req, res) => {
    console.log(req.body)
    try {
        console.log("hello")
        if (await User.findOne({ 'username': req.body.username }) === null) {
            console.log("doesnt already exists")
            const newUser = await User.create(req.body)
            console.log(`NEW trainer name: ${newUser.name}`),
                res.send({
                    success: true,
                    data: newUser
                })
        }
        else {
            console.log("already exists")
            res.send({
                success: false,
                data: err.message
            })
        }
    } catch (err) {
        res.send({
            success: false,
            data: err.message
        })
    }
})


//SHOW FORM TO CREATE NEW USER ROUTE(GET)
router.get('/new', (req, res) => {
    res.render('../views/users/new.ejs')
})


//SHOW FORM TO EDIT USER ROUTE(GET)
router.get('/:id/edit', async (req, res) => {
    //SINCE IT QUERIES THE DATABASE
    try {
        //MAKES SURE LOGGED IN USER MATCHES USER IN DATABASE (LOOSE EQUALITY- TYPE ERROR WITH STRICT)
        if (req.session.userId == req.params.id) {
            //QUERIES THE DATABASE
            const user = await User.findById(req.params.id)
            //NOTE- ADD IN BELOW TO RENDER FORM
            res.render('users/edit.ejs', {
                user: user
            })
        }
        //IF USER IS NOT LOGGED IN AS USER REQUESTED TO EDIT
        else {
            throw new Error("You're NOT THAT USER!")
        }
        //DB FUCK-UPS
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


//EDIT USER ROUTE(PUT)
router.put('/:id', async (req, res) => {
    //TRY BLOCK FOR DB QUERY
    try {
        //QUERIES DB AND UPDATES ENTRY AS PER FORM BODY 
        await User.findByIdAndUpdate(req.params.id, req.body)
        //REDIRECTS USER TO THEIR SPECIFIC SHOW PAGE 
        res.redirect(`/users/${req.params.id}`)
        //DB FUCK-UPS
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


//LOGOUT ROUTE(GET)
router.get('/logout', (req, res) => {
    //KILLS THE SESSION
    req.session.destroy(() => {
        //REDIRECTS TO LOGIN PAGE
        res.redirect("/")
    })
})


//SHOW ROUTE
router.get('/:id', async (req, res) => {
    //TRY BLOCK FOR DB QUERY
    try {
        //QUERIES DB TO FIND SPECIFIC USER BY ID
        const user = await User.findById(req.params.id)
        res.render("users/show.ejs", {
            user: user,
        })
        //DB FUCK-UPS
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


//DELETE ROUTE
router.delete('/:id', async (req, res) => {
    //TRY BLOCK FOR DB QUERY
    try {
        //QUERIES DB TO FIND SPECIFIC USER AND DELETES THEM
        await User.findByIdAndDelete(req.params.id)
        //SENDS USER TO LOGIN PAGE?
        res.redirect('/users')
        //DB FUCK-UPS
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


module.exports = router