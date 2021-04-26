const BASE_URL = "https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT"

async function fetchPosts() {
    const url = `${BASE_URL}/posts`

    try {
        const response = await fetch(url)
        const data = await response.json()
        const posts = data.data.posts
        return posts
    } catch (error) {
        console.log(error)
    }
}

const fetchUserPosts = async () => {
    const posts = await fetchPosts()
    const user = await fetchUser()

    renderPosts(posts, user)
}

const fetchUser = async () => {
    const token = fetchToken();
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
}

function renderPosts(posts) {
    $('.list-group').empty()
    posts.forEach(function (post) {
        const postElement = createPostListHTML(post)
        $('.list-group').append(postElement)
    })
}

function createPostListHTML(post) {
    const element = $(`<button type="button" class="list-group-item list-group-item-action"><strong>${post.title}</strong>, ${post.price}</button>`)
    element.data('post', post)
    return element
}

function createPostCardHTML(post, user) {
    const {title, description, price, location, willDeliver, author: {
        username, _id
    }} = post

    let loggedInUser
    user ? loggedInUser = user : ''

    const cardElement =  $(`
    <div class="card text-center">
        <div class="card-header">
            Featured                   
        </div>
        <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <h6 class="card-subtitle mb-2 text">Price: ${price}</h6>
        <h6 class="card-subtitle mb-2 text">Location: ${location}</h6>
        <h6 class="card-subtitle mb-2 text">Will Deliver?: ${willDeliver}</h6>
        <p class="card-text">${description}</p>
        <p class="card-text">Posted By: ${username}</p>
                ${user.success === true ? `${
                    loggedInUser.data._id === _id
                    ? `<button id="btn-delete" class="btn btn-primary">Delete</button>
                        <button id="btn-edit" class="btn btn-primary">Edit</button>`
                    : '<button id="message-button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#messageModal">Send a Message</button> '
                }` : '<button id="message-button" class="btn btn-primary disabled" aria-disabled="true">Send a Message</button> ' } 
        </div>
    </div>`)
    cardElement.data('post', post)
    return cardElement
}


$('.list-group').on('click', '.list-group-item', async function() {
    $('.posts-larger-description').empty()
    const thisPost = $(this).data()
    const user = await fetchUser()
    $('.posts-larger-description').append(createPostCardHTML(thisPost.post, user))
    renderMessageList(thisPost.post, user)
    $(window).scrollTop(0);
})

const registerUser = async (usernameValue, passwordValue) => {

    const url = `${BASE_URL}/users/register`

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                user: {
                    username: usernameValue,
                    password: passwordValue
                }
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        const { data: { token } } = await response.json()
        localStorage.setItem("token", JSON.stringify(token))
        location.reload()
    } catch (error) {
        console.log(error)
    }
}

$('.register form').on("submit", (event) => {
    event.preventDefault()
    const username = $('#registerInputUsername').val()
    const password = $('#registerInputPassword').val()

    registerUser(username, password)
});

const hideRegistration = () => {
    const token = localStorage.getItem("token")
    if (token) {
        $("#register-button").css("display", "none")
    } else {
        console.log('nothing to hide')
    }
}


const loginUser = async (usernameValue, passwordValue) => {
    const url = `${BASE_URL}/users/login`

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                user: {
                    username: usernameValue,
                    password: passwordValue
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const { data: { token } } = await response.json()
        localStorage.setItem("token", JSON.stringify(token))
        location.reload()
    } catch (error) {
        console.log(error)
    }
}

$('.login form').on("submit", (event) => {
    event.preventDefault()
    const username = $('#exampleInputUsername').val()
    const password = $('#exampleInputPassword').val()

    loginUser(username, password)
});

const hideLogin = () => {
    const token = localStorage.getItem("token")
    if (token) {
        $("#login-button").css("display", "none")
    } else {
        console.log('nothing to hide')
    }
}

const logOutButton = () => {
    const token = localStorage.getItem("token")
    if (token) {
        $('#logout-button').css('display', 'inline')
    } else {
        $('#logout-button').css('display', 'none')
    }
}

$('#logout-button').on('click', () => {
    localStorage.removeItem('token')
    location.reload()
})


const postNewItem = async (requestBody) => {
    const token = fetchToken()
    try {
        const request = await fetch(`${BASE_URL}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
    
            },
            body: JSON.stringify(requestBody),
        })
        return request
    } catch (error) {
        console.error(error)
    }  
}

$('#newPostModalForm form').on('submit', (event) => {

    console.log($('#post-willDeliver').is(':checked'))

    event.preventDefault()
    const itemTitle = $('#post-title').val()
    const itemDescription = $('#post-description').val()
    const itemPrice = $('#post-price').val()
    const itemLocation = $('#item-location').val()
    const itemWillDeliver = $('#post-willDeliver').is(':checked')

    const requestBody = {
        post: {
            title: itemTitle,
            description: itemDescription,
            price: itemPrice,
            location: itemLocation,
            willDeliver: itemWillDeliver
        }
    }

    postNewItem(requestBody)

    $('form').trigger('reset')
})

const seeMyPosts = async () => {
    const posts = await fetchPosts()
    const user = await fetchUser()

    const result = posts.filter(post => post.author._id === user.data._id)

    renderPosts(result)
}

$('#viewMyPosts').on('click', () => {
    seeMyPosts()
})

const deletePost = async (post) => {

    const token = fetchToken()
    const user = await fetchUser()
    const userID = user.data._id
    console.log(userID)
    console.log(post)

    if (userID === post.author._id) {
        alert('Delete this post? Cannot be undone')
        try {
            const response = await fetch(`${BASE_URL}/posts/${post._id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            console.log(result)
            location.reload()
        } catch (error) {
            console.log(error);
        }
        
    } else {
        alert('you are not the author of this post')
    }
}

$('.posts-larger-description').on('click', '#btn-delete', function() {
    // console.log($(this).closest('.card').data('post'))
    const post = $(this).closest('.card').data('post')
    deletePost(post)
})

let currentPost = ''
$('.posts-larger-description').on('click', '#message-button', function() {
    currentPost = ($(this).closest('.card').data('post'))
})

$('#messageModal form').on('submit', async function(event) {
    event.preventDefault()
    const messageData = {
        message: {
          content: $("#sendMessageTextArea").val(),
        },
    }
    try {
        const result = await sendMessage(messageData)
        console.log(result)
        $('.modal').removeClass('open')
    } catch (error) {
        console.log(error)
    }
    console.log(messageData)
    location.reload()
})

const sendMessage = async (messageData) => {
    const token = fetchToken()
    console.log(currentPost)
    try {
        const response = await fetch(
          `${BASE_URL}/posts/${currentPost._id}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(messageData),
          }
        );
        const result = await response.json();
        return result
      } catch (error) {
        console.log(error);
      }
}

const renderMessageList = async (post, user) => {
    const userMessages = user.data.messages

    let postSpecificUserMessages = userMessages.filter(message => message.post._id === post._id)

    let returnElement = postSpecificUserMessages.length > 0 ? 
        postSpecificUserMessages.forEach(function(message) {
            const messageUsername = message.fromUser.username
            $('.posts-larger-description').append(renderMessage(message.content, messageUsername))
        }) :
        $('.posts-larger-description').append(renderMessage('there are no messages yet'))
    
    return returnElement
}

const renderMessage = (postMessage, username) => {
    const cardElement = $(`
        <div class="card text-center">
            <div class="card-header">Message</div>
            <div class="card-body">
                <p class="card-text">${postMessage}</p>
                ${username ? `<p class="card-text">From: ${username}</p>` : ''}
            </div>
        </div>`)
    return cardElement
}

$('#search-form').on('submit', async function (event) {
    event.preventDefault()

    const searchString = $('#search-form input').val().toUpperCase()
    const posts = await fetchPosts()
    const user = await fetchUser()

    const searchPostsArray = posts.filter(post => post.title.toUpperCase().includes(searchString))
    renderPosts(searchPostsArray, user)
});


$('#home-button').on('click', () => {
    location.reload()
})

const authenticationCheck = () => {
    const token = localStorage.getItem("token")
    if (token) {
        ''
    } else {
        $('.dropdown-toggle').attr('aria-disabled', 'true').addClass('disabled')
    }
}

const fetchToken = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    return token ? token : ''
}

$('#myBtn').on("click", function() {
    $(window).scrollTop(0)
})

async function bootstrap() {
    fetchUserPosts()
    hideRegistration()
    hideLogin()
    logOutButton()
    authenticationCheck()
}

bootstrap()
