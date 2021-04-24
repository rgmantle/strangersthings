const BASE_URL = 'https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT'

async function fetchPosts() {
    const url = `${BASE_URL}/posts`

    try {
        const res = await fetch(url);
        const {data} = await res.json();
        const {posts} = data;
        console.log(posts)
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

fetchPosts()

const fetchToken = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  return token
}

const fetchMe = async () => {
  try {
      const response = await fetch(`${BASE_URL}/users/me`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
      const data = await response.json()
      return data.data
  } catch(error) {
      console.error(error)
  }
}



// const createPostHTML = (post, me) => {
//   return `
//   <div class="card" style="width: 18rem;">
//       <div class="card-body">
//           <h5 class="card-title">${post.title}</h5>
//           <p class="card-text">${post.description}</p>
//           <a href="#" class="btn btn-primary">Go somewhere</a>
//           ${ me._id === post.author._id ?
//           `<svg class="svg-icon" viewBox="0 0 20 20">
//               <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
//           </svg>`: ''} 
//       </div>
//   </div>
//   `
// }

const registerUser = async (usernameValue, passwordValue) => {
  const url = `${BASE_URL}/users/register`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        user: {
          username: usernameValue, 
          password: passwordValue
        },
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const {
      data: { token },
    } = await response.json();
    localStorage.setItem("token", JSON.stringify(token))
    hideRegistration();
    
  } catch (error) {
    console.log(error)
  }
}

$('#registering').on('submit', (event) => {
  event.preventDefault();
  const username = $('#exampleInputUserName').val();
  const password = $('#exampleInputPassword').val();

  loginUser(username, password) 
})


const loginUser = async (usernameValue, passwordValue) => {
  const url = `${BASE_URL}/api/2102-cpu-rm-web-pt/users/login`;
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
