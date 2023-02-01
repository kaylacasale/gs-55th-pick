const Blog = require('../models/Blog');
const User = require('../models/User'); //* require User model to get user data for blog post
const Comment = require('../models/Comment') //* require Comment model to get comment associated with blog post

//* to secure login
const withAuth = require('../utils/auth');

//* visitors will see
const router = require('express').Router();

//* when user presses HOME (directs to homepage with blogs if existing)
//* get all blogs for homepage when loading homepage (need authorization from login to access blog homepage)
router.get('/', async (req, res) => {
    try {
        //* get all blogs and JOIN with user data
        const blogData = await Blog.findAll({
            attributes: [
                'id',
                'title',
                'content',
                'date_created',
            ],
            include: [
                {
                    model: User, //* include User data in homepage to note on blog post
                    attributes: [
                        'id',
                        'username',
                    ]

                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment',
                        'blog_id'
                    ],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                    // include: {
                    //     model: User,
                    //     attributes: ['id', 'username']
                    // }
                },
            ]
        });
        //* serialize data so the template can read blog data (map through object elements aka parameters)
        const blogs = blogData.map((blog) =>
            blog.get({ plain: true })
        );
        console.log(blogs, 'in home-routes findAll blogs /')
        //* pass serialied data and session flag into template
        res.render('homepage', {
            blogs,
            logged_in: req.session.logged_in,

        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//* GET one blog post
//* renders the handlebar page
router.get('/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            attributes: [
                'id',
                'title',
                'content',
            ],
            include: [
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment',
                        'blog_id'
                    ],
                    include: {
                        model: User,
                        attributes: ['id', 'username']
                    }
                },
                {
                    model: User,
                    attributes: [
                        'username',
                    ],
                },
            ],
        });

        const blog = blogData.get({ plain: true });
        console.log(blog, 'home-routes line 77')

        res.render('blog', {
            ...blog,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err)
    }

});

//* GET request - route to get one comment associated with blog post by primary key ( may not need in home routes)
//* get comments associated with blog post to display as list after running through array in homepage.handlebars and display body index info in comment.handlebars
// router.get('/blogs-comments', async (req, res) => {
//     const dbBlogData = Blog.findOne({
//         where: {
//             id: req.params.id
//         },
//         attributes: [
//             'id',
//             'title',
//             'content',
//             'date_created',
//             'user_id'
//         ],
//         include: [
//             {
//                 model: Comment,
//                 attributes: [
//                     'id',
//                     'comment',
//                     'blog_id'
//                 ],
//             },
//         ],
//     })
//     const blog = dbBlogData.get({ plain: true })
//     res.render('blogs-comments', { blog, logged_in: req.session.logged_in })
// });

router.get('/comment/:id', async (req, res) => {
    // if (!req.session.logged_in) {
    //     res.redirect('/dashboard');
    // } else {
    try {
        const commentData = await Comment.findByPk(req.params.id, {
            // where: {
            //     id: req.params.id,
            // },
            include: [
                {
                    model: User,
                    attributes: [
                        'id',
                        'username',
                    ]
                }


                // {
                //     model: User,
                //     attributes: ['username'],
                //     through: Blog,
                //     as: 'comment_user'
                // },
                // {
                //     model: Blog,
                // },
            ],
        });

        const comment = commentData.get({ plain: true });

        res.render('comment', {
            ...comment,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

});
//* renders same handlebars view but with an update button
//* check on handlebars if isupdate is true, show update button otherwise show a save button
router.get('/dashboard/edit/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {


            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'content',
                'date_created'
            ],
            include: [
                {
                    model: User,
                    attributes: [
                        'username',
                    ]
                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment',
                        'blog_id',
                        'user_id',
                    ]
                }
            ]
        })
        const blog = blogData.get({ plain: true })
        res.render('update-blog', {
            ...blog,
            logged_in: req.session.logged_in,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})


// router.get('/dashboard', withAuth, async (req, res) => {
//     try {
//         //* Find the logged in user based on the session ID
//         const blogData = await Blog.findAll({
//             where: {
//                 user_id: req.session.user_id,
//             },
//             include: [
//                 {
//                     model: Comment,
//                     attributes: [
//                         'id',
//                         'comment',
//                         'blog_id',
//                         'user_id',
//                     ]
//                 },
//                 {
//                     model: User,
//                     attributes: [
//                         'username',
//                     ]
//                 }
//                 // {
//                 //     model: User,
//                 // },
//             ],
//         });
//         const blogs = blogData.map((blog) =>
//             blog.get({ plain: true })
//         );
//         // const user = userData.get({ plain: true });

//         res.render('blogs', {
//             ...blogs,
//             logged_in: true
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

router.get('/dashboard', withAuth, async (req, res) => {
    try {
        //* Find the logged in user based on the session ID
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Blog }],
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

//* '/dashboard/params


// router.get('/dashboard', withAuth, async (req, res) => {
//     try {
//         //* Find the logged in user based on the session ID
//         const blogData = await Blog.findOne({
//             where: {
//                 id: req.params.id,
//             },
//             attributes: [
//                 'id',
//                 'title',
//                 'content'
//             ],
//             include: [
//                 {
//                     model: User,
//                     attributes: [
//                         'username',
//                     ]
//                 },
//                 {
//                     model: Comment,
//                     attributes: [
//                         'id',
//                         'comment',
//                         'blog_id',
//                         'user_id',
//                     ]
//                 },

//                 // {
//                 //     model: User,
//                 // },
//             ],
//         });
//         // const blogs = blogData.map((blog) =>
//         //     blog.get({ plain: true })
//         // );
//         const blog = blogData.get({ plain: true })
//         // const user = userData.get({ plain: true });

//         res.render('blog', {
//             ...blog,
//             logged_in: true
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

//* Use withAuth middleware to prevent access to route aftrer pressing on SIGN IN option:
// WHEN I revisit the site at a later time and choose to sign in
// THEN I am prompted to enter my username and password
// router.get('/dashboard', withAuth, async (req, res) => {
//     try {
//         //* Find the logged in user based on the session ID
//         const userData = await User.findByPk(req.session.user_id, {
//             attributes: { exclude: ['password'] },
//             include: [
//                 {
//                     model: Blog,
//                 },
//                 {
//                     model: Comment,
//                 },
//             ],
//         });
//         //     const blogs = blogData.map((blog) =>
//         //     blog.get({ plain: true })
//         // );
//         const user = userData.get({ plain: true });

//         res.render('dashboard', {
//             ...user,
//             logged_in: true
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

//* login route (to frontend, handlebars.js)
//* if the user is already logged in, redirect the request to another route (the dashboards to view blog posts)
router.get('/login', (req, res) => {
    //* if the user is logged in, allow them to see comment associated with blog
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
});

//* route to sign in from login page
//* if user pressed SIGN IN from login page, redirect to sign in page (signup form handler in signup.js and signup.handlebars)
router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return
    }
    res.render('signup')
})

module.exports = router;