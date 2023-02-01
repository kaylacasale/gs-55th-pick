
//* grab text areas like title an content 

const updateButtonHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#blog-title').value.trim();
    const content = document.querySelector('#blog-content').value.trim();

    console.log(title, content)
    // if (event.target.hasAttribute('data-id')) {
    //     const id = event.target.getAttribute('data-id');
    const id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];

    //* put request to update blog data from dashboard
    //* send fetch to 'api/blog/:id' in order to send through api route in blogs to update existing blog with same blog_id
    const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(
            {
                blog_id: id,
                title,
                content
            }
        ),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert('Failed to update project')
    }
};

//* 'submit' instead of click because type of button is submit in update form (update-blog.handlebars) since window.location defined above gathers data from any click, so to differentiate click from submit button
document
    .querySelector('.blog-update')
    .addEventListener('submit', updateButtonHandler)
