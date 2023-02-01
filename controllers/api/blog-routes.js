const router = require('express').Router();
const { Blog, User, Comment } = require('../../models'); //* require by destructing Blog model object
const withAuth = require('../../utils/auth');

//* get all of comment data and display on individual blog page
router.get('/', async (req, res) => {
    try {
        const commentData = await Blog.findAll({
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
        const comments = commentData.map((comment) =>
            comment.get({ plain: true })
        );
        console.log(comments, 'in blog-routes')

        res.render('blog', {
            comments,
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
//* update blog data (title and content) with PUT request
//* after pressing UPDATE button referenced in updateBlog.handlebars and handled in public/js/dashboard.js
// router.put('/:id', withAuth, async (req, res) => {
//     try {
//         const blogData = await Blog.update({
//             title: req.body.title,
//             content: req.body.content,


//             where: {
//                 id: req.params.id,
//                 user_id: req.session.user_id,
//             },
//         });
//         if (!blogData) {
//             res.status(404).json({ message: 'No blog was found with id!' })
//             return;
//         }
//         res.status(200).json(blogData);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

//* DELETE request - route to delete an existing blog post (by id)
//* after pressing DELETE button referenced in deleteBlog.handlebars and handled in public/js/dashboard.js
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        if (!blogData) {
            res.status(404).json({ message: 'No blog found with this id!' });
            return;
        }
        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//* update blog route from dashboard/edit
router.put('/:id', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.update({
            title: req.body.title,
            content: req.body.content,

        },
            {
                where: {
                    id: req.params.id,
                },
            });
        if (!blogData) {
            res.status(404).json({ message: 'blog unable to update' })
            return;
        }
        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router;