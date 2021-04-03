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

$('#user-list').on('click', '.user-card .load-posts', function () {
    const user = $(this).closest('.user-card').data('user')
    console.log(user)    //render posts for this user
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

