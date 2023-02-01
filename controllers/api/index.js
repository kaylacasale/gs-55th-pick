const router = require('express').Router()
const userRoutes = require('./user-routes');
const blogRoutes = require('./blog-routes');
const commentRoutes = require('./comment-routes')
// const dashboardRoutes = require('./dashboard-routes')


router.use('/users', userRoutes);
router.use('/blogs', blogRoutes)
router.use('/comments', commentRoutes);
// router.use('/dashboard', dashboardRoutes);


//* to make work without dashboard routes, comment out dashboard here (2 places)
module.exports = router;