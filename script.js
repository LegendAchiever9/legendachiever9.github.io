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

// Function to get the value of a query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

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

// Add event listeners for tag clicks to filter posts and update the URL
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', (event) => {
        // Prevent default link behavior
        event.preventDefault();
        
        const selectedTag = tag.getAttribute('onclick').match(/'([^']+)'/)[1]; // Extract the tag from onclick attribute
        
        // Update the URL with the selected tag
        window.location.href = `index.html?tag=${selectedTag}`;
    });
});

// Call the filterPosts function on page load if there's a tag parameter in the URL
window.addEventListener('load', () => {
    const selectedTag = getQueryParam('tag');
    if (selectedTag) {
        filterPosts(selectedTag);
    } else {
        // If no tag is selected, show all posts
        const posts = document.querySelectorAll('.post');
        posts.forEach(post => post.style.display = 'block');
    }
});

// Add an event listener to the "Back to Home" link to clear filters
document.querySelectorAll('a[href="index.html"]').forEach(link => {
    link.addEventListener('click', (event) => {
        // Clear the query parameters by navigating to the home page without any filters
        window.history.replaceState(null, '', 'index.html');
    });
});

// Add an event listener to the "Home" link in the navigation to clear the filters
document.querySelectorAll('a[href="#home"]').forEach(link => {
    link.addEventListener('click', (event) => {
        // Prevent default anchor link behavior (scrolling to #home)
        event.preventDefault();

        // Clear the filters by navigating to the home page without any query parameters
        window.history.replaceState(null, '', 'index.html');

        // After clearing the filters, display all posts
        const posts = document.querySelectorAll('.post');
        posts.forEach(post => post.style.display = 'block');
    });
});