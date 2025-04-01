
// document.getElementById("1c").addEventListener("click", window.location.href="video.html");


const car = document.getElementsByClassName("card");

car.addEventListener("click", (event) =>{
    window.location.href="video.html";
});

function subscribeNewsletter() {
    let email = document.getElementById("email").value;
    if(email) {
        alert("Thank you for subscribing! Stay tuned for delicious recipes.");
        document.getElementById("email").value = "";
    } else {
        alert("Please enter a valid email.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const commentInput = document.getElementById('commentInput');
    const postCommentBtn = document.getElementById('postCommentBtn');
    const commentsContainer = document.getElementById('commentsContainer');

    postCommentBtn.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        if (commentText !== '') {
            addCommentToUI(commentText);
            commentInput.value = ''; // Clear the input
        }
    });

    commentInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) { // Check for Enter key without Shift
            event.preventDefault(); // Prevent default line break
            postCommentBtn.click(); // Trigger the post button click
        }
    });

    // Function to add a comment to the UI
    function addCommentToUI(text) {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        // You can replace this with actual user data and timestamps
        const author = 'User';
        const avatarUrl = 'https://via.placeholder.com/40'; // Placeholder avatar
        const date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();

        commentDiv.innerHTML = `
            <div class="comment-avatar">
                <img src="${avatarUrl}" alt="User Avatar">
            </div>
            <div class="comment-text">
                <div class="comment-author">${author}</div>
                <div class="comment-date">${date}</div>
                <p>${text}</p>
            </div>
        `;

        commentsContainer.prepend(commentDiv); // Add new comment at the top
    }

    // Example of loading initial comments (replace with your actual data)
    const initialComments = [
        { author: 'Alice', text: 'Great recipe! I tried it and it was delicious.', date: '2025-03-29 10:00 AM', avatar: 'https://via.placeholder.com/40/FF0000' },
        { author: 'Bob', text: 'I have a question about one of the ingredients...', date: '2025-03-29 11:30 AM', avatar: 'https://via.placeholder.com/40/00FF00' }
    ];

    initialComments.forEach(commentData => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `
            <div class="comment-avatar">
                <img src="${commentData.avatar}" alt="${commentData.author} Avatar">
            </div>
            <div class="comment-text">
                <div class="comment-author">${commentData.author}</div>
                <div class="comment-date">${commentData.date}</div>
                <p>${commentData.text}</p>
            </div>
        `;
        commentsContainer.appendChild(commentDiv);
    });
});

// script.js
document.addEventListener("DOMContentLoaded", () => {
    const heartIcon = document.querySelector(".heart");
    const likeCount = document.querySelector(".like-count");
  
    heartIcon.addEventListener("click", () => {
      let count = parseInt(likeCount.textContent, 10);
      likeCount.textContent = count + 1;
    });
  });

  const API_BASE_URL = "http://localhost:5000/api";

  async function fetchRecipes() {
      const response = await fetch(${API_BASE_URL}/recipes);
      const recipes = await response.json();
      console.log(recipes);
  }
  fetchRecipes();