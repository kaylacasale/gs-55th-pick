const router = require('express').Router();
const { Comment, Blog, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const blogData = await Blog.findAll({
            attributes: [
                'id',
                'title',
                'content',
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment'],
                    include: {
                        model: User,
                        attributes: ['id', 'username']
                    }
                },
                {
                    model: User,
                    attributes: [
                        'id',
                        'username'
                    ],
                }
            ]
        });
        console.log('BLOG find all response line 34 blog-routes.js', commentData)
        const blogs = blogData.map((blog) =>
            blog.get({ plain: true })
        );
        console.log(blogs, 'in dashboard-routes')

        res.render('dashboard', {
            blogs,
            logged_in: req.session.logged_in,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
//* withAuth - can only access route WITH user authentication (after being logged in successfully)
//* POST request - route to add a new blog post
router.post('/', withAuth, async (req, res) => {
    try {
        const newBlog = await Blog.create({
            ...req.body,
            user_id: req.session.user_id,//* include username associated
        });

        res.status(200).json(newBlog);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try {

        const blogData = await Blog.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'content',
                'date_created',
            ],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment',
                        'blog_id',
                        'user_id',
                    ],
                    include: {
                        model: User,
                        attributes: ['username'],
                    }
                }
            ]
        });
        console.log(blogData, 'in dashboard-routes')
        const blog = blogData.get({ plain: true });
        res.render('update-blog', {
            blog,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})


//* put to update in api route
//* if press update, then comes to this route
// router.put('/edit/:id', withAuth, async (req, res) => {
//     try {
//         const blogData = await Blog.update({
//             title: req.body.title,
//             content: req.body.content,

//         },
//             {
//                 where: {
//                     id: req.params.id,
//                 },
//             });
//         if (!blogData) {
//             res.status(404).json({ message: 'blog unable to update' })
//             return;
//         }
//         res.status(200).json(blogData);
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })