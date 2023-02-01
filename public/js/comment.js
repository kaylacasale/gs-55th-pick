//* to add a new comment (grabbing input from blog.handlebars, specifically new-comment-form) for POST request to add new comment
//* to delete existing comment in separate "cooment.handlebars or deleteComment.handlebars"
// const { DELETE, UPDATE, POST } = require("sequelize/types/query-types");
//* this is more or less 'comment.js' b/c handles comment data, from blog.handlebars page
//* cannot add comments if user not logged in
//* add new comment
const newFormHandler = async (event) => {
    event.preventDefault();
    //* grab entries for blog title and content in dashboard

    const comment = document.querySelector('#comment').value.trim();
    const blog_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if (comment) {
        const response = await fetch(`/api/comments`, {
            //* 'comment' stated in index.js in controllers/api
            method: 'POST',
            body: JSON.stringify({ comment, blog_id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(comment, 'in js/blog.js')

        if (response.ok) {
            // document.location.replace('/');
            document.location.reload();

            // was '/dashboard'
        } else {
            alert('Failed to create comment');
        }
    }
};

document
    .querySelector('.new-comment-form')
    .addEventListener('submit', newFormHandler);