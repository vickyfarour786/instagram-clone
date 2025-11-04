// Instagram Clone Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const reelsSection = document.getElementById('reels-section');
    const postSection = document.querySelector('.post');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the page identifier
            const page = this.getAttribute('data-page');
            
            // Handle different pages
            if (page === 'search') {
                searchContainer.style.display = 'block';
                reelsSection.style.display = 'none';
                showNotification('Search');
            } else if (page === 'reels') {
                // Show reels section and hide post section
                reelsSection.style.display = 'block';
                searchContainer.style.display = 'none';
                showNotification('Reels');
                
                // Initialize reels functionality
                initializeReels();
            } else {
                // Show post section and hide reels section
                reelsSection.style.display = 'none';
                searchContainer.style.display = 'none';
                // In a real app, you would load the corresponding page content here
                // For this demo, we'll just show which page was selected
                showNotification(`Navigated to ${page.charAt(0).toUpperCase() + page.slice(1)}`);
            }
        });
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    showNotification(`Searching for: ${query}`);
                    // In a real app, you would perform the search here
                    this.value = '';
                }
            }
        });
    }

    // Like functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    const postImages = document.querySelectorAll('.main_post .img');
    const commentButtons = document.querySelectorAll('.engagement .material-symbols-outlined:nth-child(2)');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleLike(this);
        });
    });
    
    // Double tap to like functionality
    postImages.forEach(image => {
        let tapped = false;
        
        image.addEventListener('dblclick', function() {
            // Find the like button in the same post
            const post = this.closest('.main_post');
            const likeButton = post.querySelector('.like-btn');
            
            toggleLike(likeButton);
            
            // Show visual feedback for double tap
            showDoubleTapEffect(this);
        });
    });
    
    // Comment functionality
    commentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const post = this.closest('.main_post');
            const username = post.querySelector('.profile h3').textContent;
            showNotification(`Comment on ${username}'s post`);
            
            // In a real app, you would open a comment modal or input field
            // For demo, we'll just show a prompt
            const comment = prompt('Add a comment...');
            if (comment !== null && comment.trim() !== '') {
                showNotification('Comment added!');
            }
        });
    });
    
    // Share functionality
    const shareButtons = document.querySelectorAll('.engagement .material-symbols-outlined:nth-child(3)');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const post = this.closest('.main_post');
            const username = post.querySelector('.profile h3').textContent;
            
            // Copy post link to clipboard (simulated)
            showNotification(`Shared ${username}'s post! Link copied to clipboard.`);
        });
    });
    
    function toggleLike(button) {
        const isLiked = button.getAttribute('data-liked') === 'true';
        
        if (isLiked) {
            // Unlike
            button.style.color = '';
            button.setAttribute('data-liked', 'false');
            showNotification('Unliked post');
        } else {
            // Like
            button.style.color = 'red';
            button.setAttribute('data-liked', 'true');
            showNotification('Liked post');
        }
    }
    
    function showDoubleTapEffect(element) {
        // Create a temporary heart icon for visual feedback
        const heart = document.createElement('span');
        heart.className = 'material-symbols-outlined';
        heart.textContent = 'favorite';
        heart.style.position = 'absolute';
        heart.style.fontSize = '5rem';
        heart.style.color = 'red';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '100';
        heart.style.animation = 'pop 0.5s forwards';
        
        // Position the heart at the center of the image
        const rect = element.getBoundingClientRect();
        heart.style.left = (rect.left + rect.width / 2 - 40) + 'px';
        heart.style.top = (rect.top + rect.height / 2 - 40) + 'px';
        
        // Add CSS for animation if not exists
        if (!document.getElementById('double-tap-style')) {
            const style = document.createElement('style');
            style.id = 'double-tap-style';
            style.textContent = `
                @keyframes pop {
                    0% { transform: scale(0.5); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(heart);
        
        // Remove after animation completes
        setTimeout(() => {
            heart.remove();
        }, 500);
    }

    // Bookmark functionality
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isBookmarked = this.getAttribute('data-bookmarked') === 'true';
            
            if (isBookmarked) {
                // Unbookmark
                this.style.fontVariationSettings = 'FILL 0';
                this.setAttribute('data-bookmarked', 'false');
                showNotification('Removed bookmark');
            } else {
                // Bookmark
                this.style.fontVariationSettings = 'FILL 1';
                this.setAttribute('data-bookmarked', 'true');
                showNotification('Bookmarked post');
            }
        });
    });

    // Follow buttons functionality
    const followButtons = document.querySelectorAll('.follow');
    
    followButtons.forEach(button => {
        if (!button.classList.contains('see')) { // Skip the "see all" button
            button.addEventListener('click', function() {
                const currentText = this.textContent.toLowerCase();
                
                if (currentText === 'follow') {
                    this.textContent = 'Following';
                    this.classList.add('following');
                    showNotification('Followed user');
                } else if (currentText === 'following') {
                    this.textContent = 'Follow';
                    this.classList.remove('following');
                    showNotification('Unfollowed user');
                } else if (currentText === 'switch') {
                    showNotification('Switch account functionality would go here');
                }
            });
        }
    });

    // Story navigation
    const storyItems = document.querySelectorAll('.story .items');
    const modal = document.getElementById('story-modal');
    const modalImg = document.getElementById('story-image');
    const modalUsername = document.getElementById('story-username');
    const closeModal = document.querySelector('.close');
    
    storyItems.forEach(item => {
        item.addEventListener('click', function() {
            const username = this.querySelector('p').textContent;
            const imgSrc = this.querySelector('img').src;
            
            // Update modal content
            modalImg.src = imgSrc;
            modalUsername.textContent = username;
            
            // Show modal
            modal.style.display = 'block';
            
            // Add visual feedback for viewed story
            const imgContainer = this.querySelector('.img');
            imgContainer.classList.add('viewed');
        });
    });
    
    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Profile picture click
    const profilePictures = document.querySelectorAll('.main_post .profile img');
    
    profilePictures.forEach(pic => {
        pic.addEventListener('click', function() {
            const username = this.closest('.profile').querySelector('h3').textContent;
            showNotification(`Viewing ${username}'s profile`);
        });
    });
    
    // Logo click - go to home
    const logo = document.getElementById('logo');
    
    if (logo) {
        logo.addEventListener('click', function() {
            // Reset active nav item to home
            navItems.forEach(item => item.classList.remove('active'));
            document.querySelector('[data-page="home"]').classList.add('active');
            showNotification('Returned to home');
        });
    }
    
    // Messages functionality
    const messagesNav = document.querySelector('[data-page="messages"]');
    const messagesModal = document.getElementById('messages-modal');
    const messagesClose = document.querySelector('.messages-close');
    const sendMessageBtn = document.querySelector('.send-message-btn');
    const messageInput = document.querySelector('.messages-input input');
    
    if (messagesNav) {
        messagesNav.addEventListener('click', function(e) {
            // Prevent navigation if clicking on notification badge
            if (!e.target.classList.contains('notification-badge')) {
                messagesModal.style.display = 'block';
            }
        });
    }
    
    if (messagesClose) {
        messagesClose.addEventListener('click', function() {
            messagesModal.style.display = 'none';
        });
    }
    
    // Close messages modal when clicking outside
    if (messagesModal) {
        messagesModal.addEventListener('click', function(event) {
            if (event.target === messagesModal) {
                messagesModal.style.display = 'none';
            }
        });
    }
    
    // Send message functionality
    if (sendMessageBtn && messageInput) {
        sendMessageBtn.addEventListener('click', function() {
            const message = messageInput.value.trim();
            if (message) {
                showNotification(`Message sent: ${message}`);
                messageInput.value = '';
            }
        });
        
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessageBtn.click();
            }
        });
    }
    
    // Message item click
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', function() {
            const username = this.querySelector('h3').textContent;
            showNotification(`Opening chat with ${username}`);
            messagesModal.style.display = 'none';
        });
    });
    
    // Create post functionality
    const createNav = document.querySelector('[data-page="create"]');
    const createPostModal = document.getElementById('create-post-modal');
    const createPostClose = document.querySelector('.create-post-close');
    const postImageUpload = document.getElementById('post-image-upload');
    const postPreviewImg = document.getElementById('post-preview-img');
    const sharePostBtn = document.querySelector('.share-post-btn');
    const postCaption = document.querySelector('.post-form textarea');
    
    if (createNav) {
        createNav.addEventListener('click', function() {
            createPostModal.style.display = 'block';
        });
    }
    
    if (createPostClose) {
        createPostClose.addEventListener('click', function() {
            createPostModal.style.display = 'none';
        });
    }
    
    // Close create post modal when clicking outside
    if (createPostModal) {
        createPostModal.addEventListener('click', function(event) {
            if (event.target === createPostModal) {
                createPostModal.style.display = 'none';
            }
        });
    }
    
    // Image upload preview
    if (postImageUpload) {
        postImageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    postPreviewImg.src = event.target.result;
                    postPreviewImg.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Share post functionality
    if (sharePostBtn) {
        sharePostBtn.addEventListener('click', function() {
            const caption = postCaption.value.trim();
            const hasImage = postPreviewImg.style.display !== 'none';
            
            if (hasImage) {
                showNotification('Post shared successfully!');
                createPostModal.style.display = 'none';
                postPreviewImg.style.display = 'none';
                postPreviewImg.src = '';
                postCaption.value = '';
                postImageUpload.value = '';
            } else {
                showNotification('Please upload an image first');
            }
        });
    }
    
    // Profile dropdown functionality
    const profileNav = document.getElementById('profile-nav');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (profileNav) {
        profileNav.addEventListener('click', function(e) {
            // Prevent navigation if clicking on dropdown items
            if (e.target.closest('.profile-dropdown-item')) return;
            
            // Toggle dropdown visibility
            if (profileDropdown.style.display === 'block') {
                profileDropdown.style.display = 'none';
            } else {
                profileDropdown.style.display = 'block';
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileNav.contains(e.target)) {
                profileDropdown.style.display = 'none';
            }
        });
    }
    
    // Profile dropdown items
    const viewProfile = document.getElementById('view-profile');
    const savedPosts = document.getElementById('saved-posts');
    const settings = document.getElementById('settings');
    const logout = document.getElementById('logout');
    
    if (viewProfile) {
        viewProfile.addEventListener('click', function() {
            showNotification('Viewing profile');
            profileDropdown.style.display = 'none';
        });
    }
    
    if (savedPosts) {
        savedPosts.addEventListener('click', function() {
            showNotification('Viewing saved posts');
            profileDropdown.style.display = 'none';
        });
    }
    
    if (settings) {
        settings.addEventListener('click', function() {
            showNotification('Opening settings');
            profileDropdown.style.display = 'none';
        });
    }
    
    if (logout) {
        logout.addEventListener('click', function() {
            showNotification('Logging out...');
            profileDropdown.style.display = 'none';
        });
    }
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                showNotification('Light mode enabled');
                
                // Update icon
                const icon = this.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = 'light_mode';
                }
            } else {
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                showNotification('Dark mode enabled');
                
                // Update icon
                const icon = this.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = 'dark_mode';
                }
            }
        });
    }
    
    // Set initial theme
    if (!document.body.classList.contains('dark-mode') && !document.body.classList.contains('light-mode')) {
        document.body.classList.add('dark-mode');
    }

    // Show notification function
    function showNotification(message) {
        // Remove any existing notifications
        const existingNotification = document.getElementById('notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#333';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        
        // Add to body
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    // Simulate loading new posts when scrolling
    let isLoading = false;
    
    window.addEventListener('scroll', function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
            if (!isLoading) {
                isLoading = true;
                showNotification('Loading more posts...');
                
                // Simulate loading delay
                setTimeout(() => {
                    isLoading = false;
                    showNotification('New posts loaded!');
                }, 1500);
            }
        }
    });
    
    // Reels functionality
    function initializeReels() {
        const reels = document.querySelectorAll('.reel');
        const likeButtons = document.querySelectorAll('.like-reel');
        const commentButtons = document.querySelectorAll('.comment-reel');
        const shareButtons = document.querySelectorAll('.share-reel');
        const prevButton = document.querySelector('.prev-reel');
        const nextButton = document.querySelector('.next-reel');
        const progressBar = document.getElementById('reel-progress');
        
        let currentReelIndex = 0;
        let progressInterval;
        
        // Show first reel
        if (reels.length > 0) {
            reels[0].classList.add('active');
            startProgress();
        }
        
        // Like functionality for reels
        likeButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                const isLiked = this.getAttribute('data-liked') === 'true';
                const countElement = this.querySelector('.count');
                let count = parseInt(countElement.textContent);
                
                if (isLiked) {
                    // Unlike
                    this.setAttribute('data-liked', 'false');
                    this.classList.remove('liked');
                    count--;
                    showNotification('Unliked reel');
                } else {
                    // Like
                    this.setAttribute('data-liked', 'true');
                    this.classList.add('liked');
                    count++;
                    showNotification('Liked reel');
                }
                
                countElement.textContent = count;
            });
        });
        
        // Comment functionality for reels
        commentButtons.forEach(button => {
            button.addEventListener('click', function() {
                showNotification('Comment on reel');
                
                // In a real app, you would open a comment modal or input field
                // For demo, we'll just show a prompt
                const comment = prompt('Add a comment...');
                if (comment !== null && comment.trim() !== '') {
                    showNotification('Comment added!');
                }
            });
        });
        
        // Share functionality for reels
        shareButtons.forEach(button => {
            button.addEventListener('click', function() {
                showNotification('Shared reel! Link copied to clipboard.');
            });
        });
        
        // Navigation buttons
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                showReel(currentReelIndex - 1);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                showReel(currentReelIndex + 1);
            });
        }
        
        // Swipe functionality
        let startY = 0;
        
        document.getElementById('reels-section').addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
        });
        
        document.getElementById('reels-section').addEventListener('touchend', function(e) {
            const endY = e.changedTouches[0].clientY;
            const diff = startY - endY;
            
            // Swipe up
            if (diff > 50) {
                showReel(currentReelIndex + 1);
            }
            // Swipe down
            else if (diff < -50) {
                showReel(currentReelIndex - 1);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (reelsSection.style.display !== 'none') {
                if (e.key === 'ArrowUp') {
                    showReel(currentReelIndex - 1);
                } else if (e.key === 'ArrowDown') {
                    showReel(currentReelIndex + 1);
                }
            }
        });
        
        function showReel(index) {
            // Clear progress bar
            clearInterval(progressInterval);
            if (progressBar) {
                progressBar.style.width = '0%';
            }
            
            // Validate index
            if (index < 0) {
                index = reels.length - 1;
            } else if (index >= reels.length) {
                index = 0;
            }
            
            // Hide current reel
            reels[currentReelIndex].classList.remove('active');
            
            // Show new reel
            currentReelIndex = index;
            reels[currentReelIndex].classList.add('active');
            
            // Start progress for new reel
            startProgress();
        }
        
        function startProgress() {
            if (!progressBar) return;
            
            let progress = 0;
            const duration = 10000; // 10 seconds
            const increment = 100 / (duration / 100);
            
            progressInterval = setInterval(() => {
                progress += increment;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                    // Auto-advance to next reel
                    setTimeout(() => {
                        showReel(currentReelIndex + 1);
                    }, 500);
                }
                progressBar.style.width = progress + '%';
            }, 100);
        }
    }
});
