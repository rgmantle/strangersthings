const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';

function fetchData(url) {
    return fetch(url)
    .then(function(res){
        return res.json();
    })       
    .catch(function(error) {
        console.log(error)
    })
}

function fetchUsers() {
    return fetchData(`${ BASE_URL }/users`)
}

function fetchUserPosts(userId) {
    return fetchData(`${ BASE_URL }/users/${ userId }/posts?_expand=user`);
  }
  
  function fetchPostComments(postId) {
    return fetchData(`${ BASE_URL }/posts/${ postId }/comments`);
  }

function setCommentsOnPost(post) {
    if (post.comments) {
        return Promise.reject(null)
    }
    return fetchPostComments(post.id)
        .then(function(comments) {
            post.comments = comments
            return post;
    })
    .catch(function(error){
        console.log(error)
    })

}

function renderPost(post) {
    return $(`
        <div class="post-card">
            <header>
                <h3>${post.title}</h3>
                <h3>--- ${post.username}</h3>
            </header>
            <p>${post.body}</p>
            <footer>
                <div class="comment-list"></div>
                <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
            </footer>
        </div>
    `).data('post', post)
}

function renderPostList(postList) {
    $('#app section.active').removeClass('active')
    const postListElement = $('#post-list');
    postListElement.empty().addClass('active')
    
    postList.forEach(function (post) {
      postListElement.append( renderPost(post) );
    });
  }

function fetchUserAlbumList(userId) {
    return fetchData(`${ BASE_URL }/users/${userId}/albums?_expand=user&_embed=photos`)
}

function renderUser(user) {
    return $(`
    <div class="user-card">
        <header>
            <h2>${user.name}</h2>
        </header>
    <section class="company-info">
        <p><b>Contact:</b> ${user.email}</p>
        <p><b>Works for:</b> ${user.company.name}</p>
        <p><b>Company creed:</b> "${user.company.catchPhrase}"</p>
    </section>
    <footer>
        <button class="load-posts" data-userid="${user.id}">POSTS BY ${user.username}</button>
        <button class="load-albums" data-userid="${user.id}">ALBUMS BY ${user.username}</button>
    </footer>
    </div>
    `).data('user', user)
}

function renderUserList(userList) {
    const userListElement = $('#user-list');
    userListElement.empty();
    
    userList.forEach(function (user) {
      userListElement.append( renderUser(user) );
    });
  }

// function fetchUserList() {
//     return fetch(BASE_URL)
//         .then(function(res){
//             return res.json();
//         })       
//         .catch(function(error) {
//             console.log(error)
//     })
// }

/* render a single album */
function renderAlbum(album) {
    const albumElement =  $(`
    <div class="album-card">
    <header>
        <h3>${ album.title }, by ${ album.user.username } </h3>
    </header>
    <section class="photo-list">
    </section>
    </div>
    `)

    const photoListElement = albumElement.find('.photo-list')

    album.photos.forEach(function (photo) {
        photoListElement.append( renderPhoto(photo))
    })

    return albumElement;

}

/* render a single photo */
function renderPhoto(photo) {
    return $(`<div class="photo-card">
      <a href="${ photo.url }" target="_blank">
        <img src="${ photo.thumbnailUrl }" />
        <figure>${ photo.title }</figure>
      </a>
    </div>`);
  }

/* render an array of albums */
function renderAlbumList(albumList) {
    $('#app section.active').removeClass('active')

    const albumListElement = $('#album-list')
    albumListElement.empty().addClass('active')

    albumList.forEach(function(album) {
        albumListElement.append(renderAlbum(album))
    })
}  

function toggleComments(postCardElement) {
    const footerElement = postCardElement.find('footer');
  
    if (footerElement.hasClass('comments-open')) {
      footerElement.removeClass('comments-open');
      footerElement.find('.verb').text('show');
    } else {
      footerElement.addClass('comments-open');
      footerElement.find('.verb').text('hide');
    }
  }

$('#post-list').on('click', '.post-card .toggle-comments', function () {
    const postCardElement = $(this).closest('.post-card');
    const post = postCardElement.data('post');
    const commentListElement = postCardElement.find('.comment-list');
  
    setCommentsOnPost(post)
      .then(function (post) {
        console.log('building comments for the first time...', post);
        commentListElement.empty()
        post.comments.forEach(function(comment) {
            commentListElement.append($(`
            <h3><p>${ comment.body }</p> --- ${ comment.email }</h3>
          `));
        });

        toggleComments(postCardElement);
        })
      
      .catch(function () {
        console.log('comments previously existed, only toggling...', post);
        toggleComments(postCardElement)
      });
  });  

$('#user-list').on('click', '.user-card .load-posts', function () {
    const user = $(this).closest('.user-card').data('user')
    console.log(user)  
    
    fetchPostComments(user.id)
        .then(renderPostList)//render posts for this user
  });

$('#user-list').on('click', '.user-card .load-albums', function () {
    const user = $(this).closest('.user-card').data('user')
    console.log(user)
    
    fetchUserAlbumList(user.id)
        .then(renderAlbumList)
    // render albums for this user
  });

function bootstrap() {
    fetchUsers().then(renderUserList)
  }
  
  bootstrap();

