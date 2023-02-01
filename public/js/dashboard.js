// WHEN I click on the button to create a new blog post

// const { DELETE, UPDATE, POST } = require("sequelize/types/query-types");
//* require update/put method
// THEN the title and contents of my post are saved and I am taken back to an updated dashboard with my new blog post
const newFormHandler = async (event) => {
    event.preventDefault();
    //* grab entries for blog title and content in dashboard
    const title = document.querySelector('#blog-title').value.trim();
    const content = document.querySelector('#blog-content').value.trim();
    // const description = document.querySelector('#project-desc').value.trim();

    if (title && content) {
        const response = await fetch(`/api/blogs`, { //* 'blogs' stated in index.js in controllers/api
            method: 'POST',
            body: JSON.stringify({ title, content }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to create project');
        }
    }
};

// WHEN I click on one of my existing posts in the dashboard
// THEN I am able to delete or update my post and taken back to an updated dashboard
// * make request option to update blog post
// const updateButtonHandler = async (event) => {
//     if (event.target.hasAttribute('data-id')) {
//         const id = event.target.getAttribute('data-id');
//         //* put request to update blog data from dashboard
//         const response = await fetch(`/api/blogs/${id}`, {
//             method: 'PUT',
//         });

//         if (response.ok) {
//             document.location.replace('/dashboard');
//         } else {
//             alert('Failed to update project')
//         }
//     }
// };

const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/blogs/${id}`, {
            method: 'DELETE',
            // body: JSON.stringify({
            //     blog_id: id
            // }),
            // headers: {
            //     'Content-Type': 'application/json'
            // }
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to delete project');
        }
    }
};



//* when use clicks on btn with class '.new-blog-form', call function newFormHandler to make post request with new blog title and content

//* add href to updateBlog.handlebars of same form as blog but places to edit info
document
    .querySelector('.new-blog-form')
    .addEventListener('submit', newFormHandler);

document
    .querySelector('.blog-list')
    .addEventListener('click', delButtonHandler);

// document
//     .querySelector('.blog-list')
//     .addEventListener('click', updateButtonHandler)
//* grab '.blog-update' form to listen for when form is submitted upon clicking update
// document
//     .querySelector('.blog-update')
//     .addEventListener('click', updateButtonHandler)