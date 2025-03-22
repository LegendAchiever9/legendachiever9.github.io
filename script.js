// Toggle the visibility of specific content inside the blog post with a smooth transition
document.querySelectorAll('.toggle-content').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        content.classList.toggle('visible');
    });
});

// Function to get the value of a query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Updated filterPosts function to accept an array of active tags (applying the AND condition)
function filterPosts(selectedTags) {
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        // Get the tags for each post (assuming the format "tag1, tag2, tag3")
        const postTags = post.getAttribute('data-tags').split(', ');
        // Show the post only if it contains every active tag (AND condition)
        const showPost = selectedTags.every(tag => postTags.includes(tag));
        post.style.display = showPost ? 'block' : 'none';
    });
}

// Ensure each post preview displays its tags
function displayPostTags() {
    document.querySelectorAll('.post').forEach(post => {
        const tagsContainer = post.querySelector('.tags-list');
        if (tagsContainer) {
            const tags = post.getAttribute('data-tags').split(', ');
            tagsContainer.innerHTML = '';
            tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.classList.add('post-tag');
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }
    });
}

// Sort tags alphabetically on page load
window.addEventListener('load', () => {
    const tagList = document.querySelector('#tags ul');
    if (tagList) {
        const tags = Array.from(tagList.children);
        tags.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));
        tagList.innerHTML = '';
        tags.forEach(tag => tagList.appendChild(tag));
    }
});

// Multi-select tag click event: toggles tag selection and updates filtering & URL
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', (event) => {
        event.preventDefault();
        // Extract the tag name from the onclick attribute
        // Assumes format like: onclick="filterPosts('tagName')"
        const selectedTag = tag.getAttribute('onclick').match(/'([^']+)'/)[1];

        // Retrieve the current active tags from URL parameter 'tag'
        let activeTagsStr = getQueryParam('tag');
        let activeTags = activeTagsStr ? activeTagsStr.split(',') : [];

        // Toggle: remove the tag if already selected; add it otherwise.
        const index = activeTags.indexOf(selectedTag);
        if (index > -1) {
            activeTags.splice(index, 1);
        } else {
            activeTags.push(selectedTag);
        }

        // Build the new URL using a comma-separated list of active tags.
        let newUrl = 'index.html';
        if (activeTags.length > 0) {
            newUrl += '?tag=' + activeTags.join(',');
        }
        window.location.href = newUrl; // This reload triggers the updated filtering
    });
});

// On page load, apply filtering and active CSS classes based on URL parameter
window.addEventListener('load', () => {
    // Get the active tags from the URL (if any) and convert to an array
    const selectedTagsStr = getQueryParam('tag');
    let activeTags = selectedTagsStr ? selectedTagsStr.split(',') : [];

    if (activeTags.length > 0) {
        filterPosts(activeTags);
        // For every active tag, add the "active" class to the matching tag elements
        activeTags.forEach(singleTag => {
            const matchingTags = document.querySelectorAll(`.tag[href='#'][onclick*="'${singleTag}'"]`);
            matchingTags.forEach(el => el.classList.add('active'));
        });
    } else {
        // If no tags are active, show all posts
        document.querySelectorAll('.post').forEach(post => post.style.display = 'block');
    }
    
    displayPostTags();
});

// Reset filters when clicking the "Home" link (or a link with #home),
// mimicking a full filter reset as seen previously
document.querySelectorAll('a[href="index.html"], a[href="#home"]').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'index.html';
    });
});

// Ensure blog post links work correctly by stopping event propagation.
document.querySelectorAll('.post h4 a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});
