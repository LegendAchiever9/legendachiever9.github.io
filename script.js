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

    // Update active class for tags
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    document.querySelectorAll(`.tag[href='#'][onclick*='${tag}']`).forEach(activeTag => {
        activeTag.classList.add('active');
    });
}

// Ensure each post preview displays its tags
function displayPostTags() {
    document.querySelectorAll('.post').forEach(post => {
        const tagsContainer = post.querySelector('.tags-list');
        const tags = post.getAttribute('data-tags').split(', ');
        tagsContainer.innerHTML = '';
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('post-tag');
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
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

// Add event listeners for tag clicks to filter posts and update the URL
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', (event) => {
        event.preventDefault();
        const selectedTag = tag.getAttribute('onclick').match(/'([^']+)'/)[1];
        window.location.href = `index.html?tag=${selectedTag}`;
    });
});

// Apply active class styling when page loads
window.addEventListener('load', () => {
    const selectedTag = getQueryParam('tag');
    if (selectedTag) {
        filterPosts(selectedTag);
        const activeTag = document.querySelector(`.tag[href='#'][onclick*='${selectedTag}']`);
        if (activeTag) activeTag.classList.add('active');
    } else {
        document.querySelectorAll('.post').forEach(post => post.style.display = 'block');
    }
    displayPostTags();
});

// Reset filters when clicking "Home" link, but allow normal navigation for posts
document.querySelectorAll('a[href="index.html"], a[href="#home"]').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'index.html';
    });
});

// Ensure blog post links work correctly
document.querySelectorAll('.post h4 a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent interference from other event listeners
    });
});
