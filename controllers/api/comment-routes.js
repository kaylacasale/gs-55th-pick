const router = require('express').Router();
const { Comment, Blog, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll({})

        const comments = commentData.map((comment) =>
            comment.get({ plain: true })) //* eliminates unneccessary sequelize return values

        res.render('comment', {
            comments,
            logged_in: req.session.logged_in,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

//* find comment by primary key and include user data through blog to display the user associated with the blog (user can view blogs with comments from other users)
router.get('/:id', async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: [
                        'id',
                        'username'
                    ],
                },
            ]
        });
        // const comment = commentData.get({ plain: true })
        //* do not need to map through
        const comment = commentData.map((comments) =>
            comments.get({ plain: true })
        );
        console.log(comment, 'in comment-routes')
        res.render('comment', {
            comment,
            logged_in: req.session.logged_in,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// const withAuth = require('../utils/auth');
//* auth required to manipulate comments
//* POST request / route to add new comment to blog post
router.post('/', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body,
            comment: req.body.comment,
            blog_id: req.body.blog_id,
        });
        res.status(200).json(newComment);
    } catch (err) {
        res.status(400).json(err);
    }
});
//* update
router.put('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Blog.update({
            comment: req.body.comment,

            where: {
                comment: req.body.comment,
                blog_id: req.body.blog_id,
            },
        });

        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' })
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err)
    }
})
//* DELETE request / route to delete a comment from the blog post
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
                blog_id: req.params.blog_id,//* will have info about blog (time created, date, etc.?)
            },
        });
        if (!commentData) {
            res.status(404).json({ message: 'No comments associated with this id!' });
            return;
        }

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;