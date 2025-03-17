// Toggle the visibility of specific content inside the blog post
document.querySelectorAll('.toggle-content').forEach(button => {
    button.addEventListener('click', () => {
        // Find the specific content to toggle (in this case, an element with class "hidden-content")
        const content = button.nextElementSibling;
        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });
});

// Filter posts based on tags
function filterPosts(tag) {
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        const tags = post.getAttribute('data-tags').split(', ');
        if (tags.includes(tag)) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}