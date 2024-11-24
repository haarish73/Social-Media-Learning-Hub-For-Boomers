// Store DOM elements
const elements = {
    postForm: document.querySelector('#createPostModal form'),
    postButton: document.querySelector('#createPostModal .btn-primary'),
    postContent: document.querySelector('#postContent'),
    imageInput: document.querySelector('#createPostModal input[type="file"]'),
    postsContainer: document.querySelector('.row.g-4'),
    chatInput: document.querySelector('#chatModal input[type="text"]'),
    chatSendButton: document.querySelector('#chatModal .btn-primary'),
    chatBox: document.querySelector('.chat-box'),
    tipLinks: document.querySelectorAll('.list-group-item')
};

// Post Management
const posts = [];

function createPost() {
    const content = elements.postContent.value.trim();
    if (!content) return;

    const post = {
        id: Date.now(),
        content,
        author: 'Current User',
        timestamp: new Date(),
        likes: 0,
        comments: []
    };

    // Handle image if present
    const imageFile = elements.imageInput.files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            post.image = e.target.result;
            renderPost(post);
        };
        reader.readAsDataURL(imageFile);
    } else {
        renderPost(post);
    }

    posts.unshift(post);
    
    // Clear form and close modal
    elements.postForm.reset();
    const modal = bootstrap.Modal.getInstance(document.querySelector('#createPostModal'));
    modal.hide();
}

function renderPost(post) {
    const postHTML = `
        <div class="col-md-6" id="post-${post.id}">
            <div class="card post-card custom-shadow">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <img src="/api/placeholder/50/50" class="rounded-circle me-2" alt="User Avatar">
                        <h5 class="card-title mb-0">${post.author}</h5>
                    </div>
                    <p class="card-text">${post.content}</p>
                    ${post.image ? `<img src="${post.image}" class="img-fluid mb-3" alt="Post image">` : ''}
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-outline-primary" onclick="likePost(${post.id})">
                            <i class="fas fa-heart me-1"></i> Like (${post.likes})
                        </button>
                        <button class="btn btn-outline-secondary" onclick="showComments(${post.id})">
                            <i class="fas fa-comment me-1"></i> Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    elements.postsContainer.insertAdjacentHTML('afterbegin', postHTML);
}

function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        const likeButton = document.querySelector(`#post-${postId} .btn-outline-primary`);
        likeButton.innerHTML = `<i class="fas fa-heart me-1"></i> Like (${post.likes})`;
    }
}

// Chat Management
let chatMessages = [];

function sendMessage() {
    const content = elements.chatInput.value.trim();
    if (!content) return;

    const message = {
        content,
        sender: 'Current User',
        timestamp: new Date(),
        isSent: true
    };

    displayMessage(message);
    elements.chatInput.value = '';
}

function displayMessage(message) {
    const messageHTML = `
        <div class="d-flex ${message.isSent ? 'justify-content-end' : ''} mb-3">
            <div class="${message.isSent ? 'bg-primary text-white' : 'bg-light'} rounded p-2">
                ${!message.isSent ? `<strong>${message.sender}:</strong> ` : ''}${message.content}
            </div>
        </div>
    `;

    elements.chatBox.insertAdjacentHTML('beforeend', messageHTML);
    elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
    chatMessages.push(message);
}

// Quick Tips Management
const tips = {
    'How to Post': [
        'Click the "Create New Post" button on the left sidebar',
        'Type your message in the text box',
        'Optionally add a photo by clicking "Add Photo"',
        'Click "Post" to share with the community',
        'Your post will appear at the top of the feed'
    ],
    'Chat Guidelines': [
        'Be respectful and friendly to other members',
        'Avoid sharing personal information in chats',
        'Keep conversations appropriate and family-friendly',
        'Use the chat feature to make new friends and learn together',
        'Report any inappropriate behavior to moderators'
    ],
    'Safety Tips': [
        'Never share your password with anyone',
        'Be careful about sharing personal information',
        'Use a strong, unique password',
        'Log out when using shared computers',
        'Think twice before clicking on links from unknown sources'
    ]
};

function showTipModal(tipType) {
    // Remove existing modal if any
    const existingModal = document.querySelector('#tipModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modalHTML = `
        <div class="modal fade" id="tipModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${tipType}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <ol class="ps-3">
                            ${tips[tipType].map(tip => `<li class="mb-2">${tip}</li>`).join('')}
                        </ol>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Got it!</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.querySelector('#tipModal'));
    modal.show();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Post events
    elements.postButton.addEventListener('click', createPost);

    // Chat events
    elements.chatSendButton.addEventListener('click', sendMessage);
    elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Quick Tips events
    elements.tipLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tipType = e.target.textContent.trim();
            showTipModal(tipType);
        });
    });
});