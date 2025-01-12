// Arrays to store blogs and notes
let blogs = []; // Array to hold blog objects
let notes = []; // Array to hold note objects

// DOM Elements
const homePage = document.getElementById('homePage'); // Home page element
const createPage = document.getElementById('createPage'); // Create blog page element
const notesPage = document.getElementById('notesPage'); // Notes page element
const homeLink = document.getElementById('homeLink'); // Home link element
const createLink = document.getElementById('createLink'); // Create link element
const notesLink = document.getElementById('notesLink'); // Notes link element
const createBlogBtn = document.getElementById('createBlogBtn'); // Button to create a new blog
const blogForm = document.getElementById('blogForm'); // Blog form element
const noteForm = document.getElementById('noteForm'); // Note form element
const featuredBlogs = document.getElementById('featuredBlogs'); // Element to display featured blogs
const notesList = document.getElementById('notesList'); // Element to display notes
const darkModeToggle = document.getElementById('darkModeToggle'); // Dark mode toggle switch
const searchInput = document.getElementById('searchInput'); // Search input field

// Pagination variables
let currentPage = 1; // Current page number for pagination
const blogsPerPage = 5; // Number of blogs to display per page

// Blog Module
const BlogModule = {
  // Add a new blog
  addBlog: function (title, content, categories) {
    const blog = {
      id: Date.now(), // Unique ID based on current timestamp
      title: title, // Blog title
      content: content, // Blog content
      categories: categories, // Blog categories
      timestamp: new Date().toLocaleString(), // Timestamp of creation
    };
    blogs.push(blog); // Add the new blog to the blogs array
    saveToLocalStorage(); // Save updated blogs to local storage
  },

  // Delete a blog by index
  deleteBlog: function (index) {
    if (index >= 0 && index < blogs.length) {
      blogs.splice(index, 1); // Remove the blog at the specified index
      saveToLocalStorage(); // Save updated blogs to local storage
    } else {
      console.error('Invalid blog index:', index); // Log error for invalid index
    }
  },

  // Edit a blog by index
  editBlog: function (index, title, content, categories) {
    if (index >= 0 && index < blogs.length) {
      blogs[index] = {
        id: blogs[index].id, // Preserve the original ID
        title: title, // Updated title
        content: content, // Updated content
        categories: categories, // Updated categories
        timestamp: new Date().toLocaleString(), // Update timestamp
      };
      saveToLocalStorage(); // Save updated blogs to local storage
    } else {
      console.error('Invalid blog index:', index); // Log error for invalid index
    }
  },
};

// Notes Module
const NotesModule = {
  // Add a new note
  addNote: function (content, tags, color) {
    const note = {
      id: Date.now(), // Unique ID based on current timestamp
      content: content, // Note content
      tags: tags, // Note tags
      color: color, // Note background color
      timestamp: new Date().toLocaleString(), // Timestamp of creation
    };
    notes.push(note); // Add the new note to the notes array
    saveToLocalStorage(); // Save updated notes to local storage
  },

  // Delete a note by index
  deleteNote: function (index) {
    if (index >= 0 && index < notes.length) {
      notes.splice(index, 1); // Remove the note at the specified index
      saveToLocalStorage(); // Save updated notes to local storage
    } else {
      console.error('Invalid note index:', index); // Log error for invalid index
    }
  },

  // Edit a note by index
  editNote: function (index, content, tags, color) {
    if (index >= 0 && index < notes.length) {
      notes[index] = {
        id: notes[index].id, // Preserve the original ID
        content: content, // Updated content
        tags: tags, // Updated tags
        color: color, // Updated color
        timestamp: new Date().toLocaleString(), // Update timestamp
      };
      saveToLocalStorage(); // Save updated notes to local storage
    } else {
      console.error('Invalid note index:', index); // Log error for invalid index
    }
  },
};

// Local Storage Module
const StorageModule = {
  // Save data to local storage
  save: function (key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data)); // Convert data to JSON and save
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error); // Log error
      alert('Failed to save data. Please try again.'); // Alert user
    }
  },

  // Load data from local storage
  load: function (key) {
    try {
      const data = localStorage.getItem(key); // Get data from local storage
      return data ? JSON.parse(data) : []; // Parse JSON data or return empty array
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error); // Log error
      alert('Failed to load data. Please refresh the page.'); // Alert user
      return []; // Return empty array
    }
  },
};

// Save blogs and notes to localStorage
function saveToLocalStorage() {
  StorageModule.save('blogs', blogs); // Save blogs array
  StorageModule.save('notes', notes); // Save notes array
}

// Load blogs and notes from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
  blogs = StorageModule.load('blogs'); // Load blogs from local storage
  notes = StorageModule.load('notes'); // Load notes from local storage
  displayPaginatedBlogs(); // Display paginated blogs
  displayNotes(); // Display notes

  // Set dark mode if enabled
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode'); // Add dark mode class to body
    darkModeToggle.textContent = '☀️ Light Mode'; // Change toggle text
  }

  // Auto-save draft
  loadDraft(); // Load any saved draft
  startAutoSave(); // Start auto-saving drafts
});

// Dark Mode Toggle
if (darkModeToggle) {
  darkModeToggle.addEventListener('change', function () {
    document.body.classList.toggle('dark-mode'); // Toggle dark mode class
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('darkMode', 'enabled'); // Save dark mode preference
    } else {
      localStorage.setItem('darkMode', 'disabled'); // Save light mode preference
    }
  });

  // Load dark mode preference on page load
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode'); // Add dark mode class to body
    darkModeToggle.checked = true; // Check the toggle
  }
}

// Switch to Home Page
if (homeLink) {
  homeLink.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default link behavior
    homePage.classList.add('active'); // Show home page
    createPage.classList.remove('active'); // Hide create page
    notesPage.classList.remove('active'); // Hide notes page
    displayPaginatedBlogs(); // Display paginated blogs
  });
}

// Switch to Create Page
if (createLink) {
  createLink.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default link behavior
    showPage(createPage); // Show create page
  });
}

// Switch to Notes Page
if (notesLink) {
  notesLink.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default link behavior
    showPage(notesPage); // Show notes page
    displayNotes(); // Display notes
  });
}

// Switch to Create Page from Create Blog Button
if (createBlogBtn) {
  createBlogBtn.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default button behavior
    createPage.classList.add('active'); // Show create page
    homePage.classList.remove('active'); // Hide home page
    notesPage.classList.remove('active'); // Hide notes page
  });
}

// Handle Blog Form Submission
if (blogForm) {
  blogForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission
    const title = document.getElementById('blogTitle').value.trim(); // Get blog title
    const content = document.getElementById('blogContent').innerHTML.trim(); // Get blog content
    const categories = document.getElementById('blogCategories').value.trim(); // Get blog categories

    // Validate form fields
    if (!title || !content || !categories) {
      alert('Please fill in all fields.'); // Alert if fields are empty
      return; // Exit function
    }

    BlogModule.addBlog(title, content, categories.split(',')); // Add blog
    blogForm.reset(); // Reset form fields
    document.getElementById('blogContent').innerHTML = ''; // Clear blog content
    homePage.classList.add('active'); // Show home page
    createPage.classList.remove('active'); // Hide create page
    notesPage.classList.remove('active'); // Hide notes page
    displayPaginatedBlogs(); // Display paginated blogs
  });
}

// Preview Button Functionality
const previewButton = document.getElementById('previewButton'); // Preview button element
const previewSection = document.getElementById('previewSection'); // Preview section element

if (previewButton && previewSection) {
  previewButton.addEventListener('click', function () {
    const title = document.getElementById('blogTitle').value; // Get blog title
    const content = document.getElementById('blogContent').innerHTML; // Get blog content

    // Validate preview fields
    if (!title || !content) {
      alert('Please enter a title and content for the blog.'); // Alert if fields are empty
      return; // Exit function
    }

    // Display the preview
    previewSection.innerHTML = `
      <h2>${title}</h2>
      <div>${content}</div>
    `;
    previewSection.style.display = 'block'; // Show preview section
  });
}

// Handle Note Form Submission
if (noteForm) {
  noteForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission
    const content = document.getElementById('noteContent').innerHTML.trim(); // Get note content
    const tags = document.getElementById('noteTags').value.split(',').map(tag => tag.trim()); // Get note tags
    const color = document.getElementById('noteColor').value; // Get note color

    // Validate note content
    if (!content) {
      alert('Please write a note.'); // Alert if content is empty
      return; // Exit function
    }

    NotesModule.addNote(content, tags, color); // Add note
    noteForm.reset(); // Reset form fields
    document.getElementById('noteContent').innerHTML = ''; // Clear note content
    displayNotes(); // Display notes
  });
}

// Display Featured Blogs with Pagination
function displayPaginatedBlogs() {
  if (featuredBlogs) {
    const start = (currentPage - 1) * blogsPerPage; // Calculate start index
    const end = start + blogsPerPage; // Calculate end index
    const paginatedBlogs = blogs.slice(start, end); // Get paginated blogs
    displayFilteredBlogs(paginatedBlogs); // Display filtered blogs
    renderPagination(); // Render pagination controls
  }
}

// Display Filtered Blogs
function displayFilteredBlogs(filteredBlogs) {
  if (featuredBlogs) {
    featuredBlogs.innerHTML = ''; // Clear existing blogs
    filteredBlogs.forEach((blog, index) => {
      const blogCard = document.createElement('div'); // Create blog card element
      blogCard.classList.add('blog-card'); // Add class to blog card
      blogCard.innerHTML = `
        <h3>${blog.title}</h3>
        <p>${blog.content.substring(0, 100)}...</p>
        <div class="categories">
          ${blog.categories ? blog.categories.map(category => `<span class="category">${category.trim()}</span>`).join('') : ''}
        </div>
        <p class="timestamp">Created on: ${blog.timestamp}</p>
        <a href="#" class="read-more" data-index="${index}">Read More</a>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      featuredBlogs.appendChild(blogCard); // Append blog card to featured blogs
    });

    addBlogEventListeners(); // Add event listeners to blog cards
  }
}

// Add event listeners to blog cards
function addBlogEventListeners() {
  const readMoreLinks = document.querySelectorAll('.read-more'); // Get all read more links
  readMoreLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default link behavior
      const index = this.getAttribute('data-index'); // Get blog index
      const blog = blogs[index]; // Get blog object
      showBlogModal(blog.content); // Show blog content in modal
    });
  });

  const deleteButtons = document.querySelectorAll('.delete-btn'); // Get all delete buttons
  deleteButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default button behavior
      const index = this.getAttribute('data-index'); // Get blog index
      if (confirm('Are you sure you want to delete this blog?')) {
        BlogModule.deleteBlog(index); // Delete blog
        displayPaginatedBlogs(); // Refresh displayed blogs
      }
    });
  });

  const editButtons = document.querySelectorAll('.edit-btn'); // Get all edit buttons
  editButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default button behavior
      const index = this.getAttribute('data-index'); // Get blog index
      const blog = blogs[index]; // Get blog object
      document.getElementById('blogTitle').value = blog.title; // Set title in form
      document.getElementById('blogContent').innerHTML = blog.content; // Set content in form
      document.getElementById('blogCategories').value = blog.categories.join(', '); // Set categories in form
      createPage.classList.add('active'); // Show create page
      homePage.classList.remove('active'); // Hide home page
      notesPage.classList.remove('active'); // Hide notes page
      BlogModule.deleteBlog(index); // Remove the old blog
    });
  });
}

// Display Notes
function displayNotes() {
  if (notesList) {
    notesList.innerHTML = ''; // Clear existing notes
    notes.forEach((note, index) => {
      const noteElement = document.createElement('div'); // Create note element
      noteElement.classList.add('note'); // Add class to note element
      noteElement.style.backgroundColor = note.color || '#ffffff'; // Set background color
      noteElement.innerHTML = `
        <div>${note.content}</div>
        <div class="tags">${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        <div class="timestamp">${note.timestamp}</div>
        <div class="note-actions">
          <button onclick="editNote(${index})">Edit</button>
          <button onclick="deleteNote(${index})">Delete</button>
          <button onclick="togglePinNote(${index})">Pin</button>
        </div>
      `;
      notesList.appendChild(noteElement); // Append note element to notes list
    });
  }
}

// Edit Note
function editNote(index) {
  const note = notes[index]; // Get note object
  document.getElementById('noteContent').innerHTML = note.content; // Set content in form
  document.getElementById('noteTags').value = note.tags.join(', '); // Set tags in form
  document.getElementById('noteColor').value = note.color; // Set color in form
  notesPage.classList.add('active'); // Show notes page
  homePage.classList.remove('active'); // Hide home page
  createPage.classList.remove('active'); // Hide create page
  NotesModule.deleteNote(index); // Remove the old note
}

// Delete Note
function deleteNote(index) {
  if (confirm('Are you sure you want to delete this note?')) {
    NotesModule.deleteNote(index); // Delete note
    displayNotes(); // Refresh displayed notes
  }
}

// Pin/Unpin Note
function togglePinNote(index) {
  if (notes[index]) {
    notes[index].pinned = !notes[index].pinned; // Toggle pinned state
    saveToLocalStorage(); // Save updated notes to local storage
    displayNotes(); // Refresh displayed notes
  }
}

// Render Pagination
function renderPagination() {
  if (featuredBlogs) {
    const totalPages = Math.ceil(blogs.length / blogsPerPage); // Calculate total pages
    const pagination = document.createElement('div'); // Create pagination element
    pagination.classList.add('pagination'); // Add class to pagination
    pagination.innerHTML = `
      <button id="firstPage" ${currentPage === 1 ? 'disabled' : ''}>First</button>
      <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
      <span>Page ${currentPage} of ${totalPages}</span>
      <button id="nextPage" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
      <button id="lastPage" ${currentPage === totalPages ? 'disabled' : ''}>Last</button>
    `;
    featuredBlogs.appendChild(pagination); // Append pagination to featured blogs

    // Event listeners for pagination buttons
    document.getElementById('firstPage').addEventListener('click', function () {
      currentPage = 1; // Set current page to first
      displayPaginatedBlogs(); // Refresh displayed blogs
    });

    document.getElementById('prevPage').addEventListener('click', function () {
      if (currentPage > 1) {
        currentPage--; // Decrement current page
        displayPaginatedBlogs(); // Refresh displayed blogs
      }
    });

    document.getElementById('nextPage').addEventListener('click', function () {
      if (currentPage < totalPages) {
        currentPage++; // Increment current page
        displayPaginatedBlogs(); // Refresh displayed blogs
      }
    });

    document.getElementById('lastPage').addEventListener('click', function () {
      currentPage = totalPages; // Set current page to last
      displayPaginatedBlogs(); // Refresh displayed blogs
    });
  }
}

// Show Blog Modal
function showBlogModal(content) {
  const modal = document.createElement('div'); // Create modal element
  modal.classList.add('modal'); // Add class to modal
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <p>${content}</p>
    </div>
  `;
  document.body.appendChild(modal); // Append modal to body

  const closeModal = modal.querySelector('.close-modal'); // Get close button
  closeModal.addEventListener('click', function () {
    modal.remove(); // Remove modal on close
  });

  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.remove(); // Remove modal if clicked outside
    }
  });
}

// Search Blogs
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase(); // Get search term
    const filteredBlogs = blogs.filter((blog) => {
      return (
        blog.title.toLowerCase().includes(searchTerm) || // Filter by title
        blog.content.toLowerCase().includes(searchTerm) || // Filter by content
        blog.categories.some((category) => category.toLowerCase().includes(searchTerm)) // Filter by categories
      );
    });
    displayFilteredBlogs(filteredBlogs); // Display filtered blogs
  });
}

// Auto-Save Draft
let autoSaveInterval; // Variable for auto-save interval

function startAutoSave() {
  const blogContent = document.getElementById('blogContent'); // Get blog content element
  if (blogContent) {
    autoSaveInterval = setInterval(() => {
      const content = blogContent.innerHTML; // Get current content
      localStorage.setItem('draftBlog', content); // Save draft to local storage
    }, 5000); // Save every 5 seconds
  }
}

function loadDraft() {
  const blogContent = document.getElementById('blogContent'); // Get blog content element
  if (blogContent) {
    const draft = localStorage.getItem('draftBlog'); // Get draft from local storage
    if (draft) {
      blogContent.innerHTML = draft; // Load draft into content area
    }
  }
}

// Clear draft when blog is published
if (blogForm) {
  blogForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission
    try {
      const title = document.getElementById('blogTitle').value.trim(); // Get blog title
      const content = document.getElementById('blogContent').innerHTML.trim(); // Get blog content
      const categories = document.getElementById('blogCategories').value.trim(); // Get blog categories

      // Validate form fields
      if (!title || !content || !categories) {
        throw new Error('Please fill in all fields.'); // Throw error if fields are empty
      }

      BlogModule.addBlog(title, content, categories.split(',')); // Add blog
      blogForm.reset(); // Reset form fields
      document.getElementById('blogContent').innerHTML = ''; // Clear blog content
      homePage.classList.add('active'); // Show home page
      createPage.classList.remove('active'); // Hide create page
      notesPage.classList.remove('active'); // Hide notes page
      displayPaginatedBlogs(); // Display paginated blogs
    } catch (error) {
      console.error('Error submitting blog:', error); // Log error
      alert(error.message); // Alert user with error message
    }
  });
}

// Validate Blog Form
function validateBlogForm(title, content, categories) {
  if (!title || title.length < 5) {
    throw new Error('Title must be at least 5 characters long.'); // Validate title length
  }
  if (!content || content.length < 20) {
    throw new Error('Content must be at least 20 characters long.'); // Validate content length
  }
  if (!categories || categories.split(',').length < 1) {
    throw new Error('Please add at least one category.'); // Validate categories
  }
}

// Validate Note Form
function validateNoteForm(content) {
  if (!content || content.length < 10) {
    throw new Error('Note content must be at least 10 characters long.'); // Validate note content length
  }
}

// Show Page Function
function showPage(page) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active')); // Hide all pages
  page.classList.add('active'); // Show the specified page
  page.style.opacity = 0; // Set initial opacity to 0
  setTimeout(() => {
    page.style.opacity = 1; // Fade in the page
  }, 10);
}

// Button Hover Effects
document.querySelectorAll('.btn').forEach((button) => {
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.05)'; // Scale up button on hover
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)'; // Scale down button on mouse leave
  });
});

// Keyboard Navigation for Blog Cards
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const focusedElement = document.activeElement; // Get currently focused element
    if (focusedElement.classList.contains('blog-card')) {
      const cards = document.querySelectorAll('.blog-card'); // Get all blog cards
      const currentIndex = Array.from(cards).indexOf(focusedElement); // Get index of focused card
      let nextIndex;
      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % cards.length; // Move to next card
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + cards.length) % cards.length; // Move to previous card
      }
      cards[nextIndex].focus(); // Focus the next card
    }
  }
});

// Lazy Load Images
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]'); // Get all images with data-src attribute
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target; // Get the intersecting image
        img.src = img.getAttribute('data-src'); // Set the src attribute
        img.removeAttribute('data-src'); // Remove data-src attribute
        observer.unobserve(img); // Stop observing the image
      }
    });
  });

  images.forEach((img) => observer.observe(img)); // Observe each image
}

// Call this function after rendering blogs
lazyLoadImages(); // Initialize lazy loading for images

// Blog cards ko fade-in animation se load karein
function displayFilteredBlogs(filteredBlogs) {
  if (featuredBlogs) {
    featuredBlogs.innerHTML = ''; // Clear existing blogs
    filteredBlogs.forEach((blog, index) => {
      const blogCard = document.createElement('div'); // Create blog card element
      blogCard.classList.add('blog-card'); // Add class to blog card
      blogCard.style.opacity = 0; // Set initial opacity to 0
      blogCard.style.transform = 'translateY(20px)'; // Set initial transform

      blogCard.innerHTML = `
        <h3>${blog.title}</h3>
        <p>${blog.content.substring(0, 100)}...</p>
        <div class="categories">
          ${blog.categories ? blog.categories.map(category => `<span class="category">${category.trim()}</span>`).join('') : ''}
        </div>
        <p class="timestamp">Created on: ${blog.timestamp}</p>
        <a href="#" class="read-more" data-index="${index}">Read More</a>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      featuredBlogs.appendChild(blogCard); // Append blog card to featured blogs

      // Fade-in animation
      setTimeout(() => {
        blogCard.style.opacity = 1; // Fade in the blog card
        blogCard.style.transform = 'translateY(0)'; // Reset transform
      }, index * 100); // Stagger the animation
    });

    addBlogEventListeners(); // Add event listeners to blog cards
  }
}

// Save Draft on Ctrl + S
document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault(); // Prevent default save behavior
    saveToLocalStorage(); // Save to local storage
    alert('Draft saved successfully!'); // Alert user
  }
});

// Show Toast Function
function showToast(message, type = 'success') {
  const toast = document.createElement('div'); // Create toast element
  toast.classList.add('toast', type); // Add class to toast
  toast.textContent = message; // Set toast message
  document.body.appendChild(toast); // Append toast to body

  setTimeout(() => {
    toast.remove(); // Remove toast after 3 seconds
  }, 3000);
}

// Usage of showToast
showToast('Blog published successfully!'); // Show success toast

// Header Scroll Animation
function displayPaginatedBlogs() {
  if (featuredBlogs) {
    const start = (currentPage - 1) * blogsPerPage; // Calculate start index
    const end = start + blogsPerPage; // Calculate end index
    const paginatedBlogs = blogs.slice(start, end); // Get paginated blogs
    displayFilteredBlogs(paginatedBlogs); // Display filtered blogs
    renderPagination(); // Render pagination controls
  }
}

// Display Filtered Blogs
function displayFilteredBlogs(filteredBlogs) {
  if (featuredBlogs) {
    featuredBlogs.innerHTML = ''; // Clear existing blogs
    filteredBlogs.forEach((blog, index) => {
      const blogCard = document.createElement('div'); // Create blog card element
      blogCard.classList.add('blog-card'); // Add class to blog card
      blogCard.style.opacity = 0; // Set initial opacity to 0
      blogCard.style.transform = 'translateY(20px)'; // Set initial transform

      // Set background color based on dark mode
      if (document.body.classList.contains('dark-mode')) {
        blogCard.style.background = 'var(--hero-dark-bg)'; // Dark mode background
      } else {
        blogCard.style.background = 'var(--hero-light-bg)'; // Light mode background
      }

      blogCard.innerHTML = `
        <h3>${blog.title}</h3>
        <p>${blog.content.substring(0, 100)}...</p>
        <div class="categories">
          ${blog.categories ? blog.categories.map(category => `<span class="category">${category.trim()}</span>`).join('') : ''}
        </div>
        <p class="timestamp">Created on: ${blog.timestamp}</p>
        <a href="#" class="read-more" data-index="${index}">Read More</a>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      featuredBlogs.appendChild(blogCard); // Append blog card to featured blogs

      // Fade-in animation
      setTimeout(() => {
        blogCard.style.opacity = 1; // Fade in the blog card
        blogCard.style.transform = 'translateY(0)'; // Reset transform
      }, index * 100); // Stagger the animation
    });

    addBlogEventListeners(); // Add event listeners to blog cards
  }
}