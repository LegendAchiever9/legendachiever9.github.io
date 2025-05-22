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
        const postTags = post.getAttribute('data-tags').split(', ');
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
        const selectedTag = tag.getAttribute('onclick').match(/'([^']+)'/)[1];

        let activeTagsStr = getQueryParam('tag');
        let activeTags = activeTagsStr ? activeTagsStr.split(',') : [];

        const index = activeTags.indexOf(selectedTag);
        if (index > -1) {
            activeTags.splice(index, 1);
        } else {
            activeTags.push(selectedTag);
        }

        let newUrl = 'index.html';
        if (activeTags.length > 0) {
            newUrl += '?tag=' + activeTags.join(',');
        }
        window.location.href = newUrl; 
    });
});

// On page load, apply filtering and active CSS classes based on URL parameter
window.addEventListener('load', () => {
    const selectedTagsStr = getQueryParam('tag');
    let activeTags = selectedTagsStr ? selectedTagsStr.split(',') : [];

    if (activeTags.length > 0) {
        filterPosts(activeTags);
        activeTags.forEach(singleTag => {
            const matchingTags = document.querySelectorAll(`.tag[href='#'][onclick*="'${singleTag}'"]`);
            matchingTags.forEach(el => el.classList.add('active'));
        });
    } else {
        document.querySelectorAll('.post').forEach(post => post.style.display = 'block');
    }

    displayPostTags();
});

// Reset filters when clicking the "Home" link
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

// --- Random Button Functionality ---
document.addEventListener("DOMContentLoaded", () => {
    const randomButton = document.querySelector('a[href="#random"]');

    function selectRandomPost() {
        const posts = Array.from(document.querySelectorAll("#blog-posts .post a"));

        if (posts.length === 0) {
            alert("No blog posts found.");
            return;
        }

        // Exclude "Home" and "About" links
        const blogPosts = posts.filter(post => !["#home", "#about"].includes(post.getAttribute("href") ));

        // Pick a random blog post
        const randomPost = blogPosts[Math.floor(Math.random() * blogPosts.length)];

        // Redirect to the selected post
        window.location.href = randomPost.getAttribute("href");
    }

    randomButton.addEventListener("click", (event) => {
        event.preventDefault();

        // Redirect to index.html first if user is on about.html
        if (window.location.pathname.includes("about.html")) {
            window.location.href = "index.html#random";
            return;
        }

        // Directly pick a random post
        selectRandomPost();
    });

    // **Trigger random post selection on page load if URL contains #random**
    if (window.location.hash === "#random") {
        selectRandomPost();
    }
});

// --- "Show More" Button Functionality ---
document.addEventListener("DOMContentLoaded", () => {
    const tagsContainer = document.getElementById("tags-container");
    const toggleButton = document.getElementById("tags-toggle");

    if (tagsContainer && toggleButton) {
        // Restore button state from localStorage
        const savedState = localStorage.getItem("tagsExpanded") === "true";
        tagsContainer.classList.toggle("expanded", savedState);
        toggleButton.textContent = savedState ? "Show Less" : "Show More";
        toggleButton.setAttribute("aria-expanded", savedState);

        toggleButton.addEventListener("click", () => {
            const isExpanded = tagsContainer.classList.toggle("expanded");

            localStorage.setItem("tagsExpanded", isExpanded);

            toggleButton.textContent = isExpanded ? "Show Less" : "Show More";
            toggleButton.setAttribute("aria-expanded", isExpanded);
        });

        // Preserve state after redirect
        if (window.location.hash === "#random") {
            localStorage.setItem("tagsExpanded", savedState);
        }
    }
});