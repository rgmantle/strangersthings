const BASE_URL = 'https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT'

async function fetchPosts() {
    const url = `${BASE_URL}/posts`

    try {
        const res = await fetch(url);
        const {data} = await res.json();
        const {posts} = data;
        return renderPosts(posts);
    } catch (error) {
        console.error(error);
    }
}

function renderPosts(posts) {
  posts.forEach(post => {
      const postElement = createPostHTML(post)
      $('#post-class').append(postElement)
  })
}

function createPostHTML(post) {
  const {title,
      description,
      author: {
          username
      },
      price,
      location} = post

  return `
  <ol class="list-group list-group-numbered">
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">${title}, Location: ${location} </div>
        ${description} <br>Posted by: ${username}
      </div>
      <span class="badge bg-primary rounded-pill">${price}</span>
    </li>
  </ol>
  `
}



const fetchToken = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  return token
}

// const fetchMe = async () => {
//   try {
//       const response = await fetch(`${BASE_URL}/users/me`, {
//           headers: {
//               'Authorization': `Bearer ${token}`
//           }
//       })
//       const data = await response.json()
//       return data.data
//   } catch(error) {
//       console.error(error)
//   }
// }

const registerUser = async (userName, password) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      body: JSON.stringify({
        user: {
          username: userName,
          password: password,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const {
      data: { token },
    } = await response.json();
    localStorage.setItem("token", JSON.stringify(token));
    hideRegistration();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// $('#registering').on('submit', (event) => {
//   event.preventDefault();
//   const username = $('#registerInputUsername').val();
//   const password = $('#registerInputPassword').val();

//   registerUser(username, password) 
// })

$("#register-user").on("submit", (event) => {
  event.preventDefault();
  const username = $("#registerInputUsername").val();
  const password = $("#registerInputPassword").val();
  registerUser(username, password);
  fetchPosts();
});

$(".login form").on("submit", (event) => {
  event.preventDefault();
  const username = $("#loginInputUsername").val();
  const password = $("#loginInputPassword").val();
  loginUser(username, password);
  fetchPosts();
});



const loginUser = async (usernameValue, passwordValue) => {
  const url = `${BASE_URL}/users/login`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        user: {
          username: usernameValue, 
          password: passwordValue
        }
      }),
      headers: {
        "Content-Type": 'application/json'
      }
    });
    const data = await res.json();
    localStorage.setItem('token', JSON.stringify(data))
    hideRegistration();
    
  } catch (error) {
    console.log(error)
  }
}


// $('#login').on('click', (event) => {
//   event.preventDefault();
//   const username = $('#exampleInputUserName').val();
//   const password = $('#exampleInputPassword').val();

//   loginUser(username, password) 
// })

const hideRegistration = () => {
  const token = localStorage.getItem('token');
  if (token) {
      $('.register').hide();
      $('#sell-item').show();
      // $('.container').css('display', 'inline')
  } else {
      console.log('nothing to hide')
  }
}

const postBlogEntry = async (requestBody) => {
  const token = localStorage.getItem('token')  ;
  if(token) {
    try {
        const response = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${token}`, 
            } ,
            body: JSON.stringify(requestBody),
        });
        const newPost = await response.json();
        return newPost;
    } catch (error) {
        console.error(error)
        alert(`Please log in or register first`)
    }
  }
}

$('#item-info').on('submit', (event) => {
  event.preventDefault()
  
  const postTitle = $('#basic-url').val();
  const postDescription = $('#basic-text').val();
  const postPrice = $('#post-price').val();
  const postLocation = $('#item-location').val();
  const postDelivery = $('#blog-post').val();
  const requestBody = {
      post: {
        title: postTitle,
        description: postDescription,
        price: postPrice,

      }
  }

  postBlogEntry(requestBody)
  $('form').trigger('reset')
})


/*edit blog entry*/
// const editBlogEntry = async (requestBody, postId) => {
// 	try {
// 		const request = await fetch(`${BASE_URL}/posts/${postId}`, {
// 			method: "PATCH", 
// 			headers: {
// 				"Content-Type": "application/json",
// 				"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token"))
// 			},
// 			body: JSON.stringify(requestBody),
// 		})
// 	} catch(e) {
// 		console.error(e)
// 	}
// }

/*delete blog entry*/
// const deleteBlogEntry = async (postId) => {
// 	try {
// 		const request = await fetch(`${BASE_URL}/posts/${postId}`, {
// 			method: "DELETE", 
// 			headers: {
// 				"Content-Type": "application/json",
// 				"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token"))
// 			}
// 		})
// 	} catch(e) {
// 		console.error(e)
// 	}
// }
