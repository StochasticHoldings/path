 // Example Chapter
 var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [{
         title: 'Blue',
         duration: '4:26'
     }, {
         title: 'Green',
         duration: '3:14'
     }, {
         title: 'Red',
         duration: '5:01'
     }, {
         title: 'Pink',
         duration: '3:21'
     }, {
         title: 'Magenta',
         duration: '2:15'
     }]
 };

 

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
         '<tr class="album-view-song-item"><td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td><td class="song-item-title">' + songName + '</td><td class="song-item-duration">' + songLength + '</td></tr>'
     return template;

 };
 albumImage = null;
 albumArtist = null;
 albumTitle = null;
 albumReleaseInfo = null;
 albumSongList = null;

 var setCurrentAlbum = function(album) {
     // #1
     albumTitle = document.getElementsByClassName('album-view-title')[0];
     albumArtist = document.getElementsByClassName('album-view-artist')[0];
     albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     albumImage = document.getElementsByClassName('album-cover-art')[0];
     albumSongList = document.getElementsByClassName('album-view-song-list')[0];

     // #2
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);

     // #3
     albumSongList.innerHTML = '';

     // #4
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);

     }

     setTimeout(function() {
         var songRows = document.getElementsByClassName('album-view-song-item');
         console.log(songRows.length);

         for (var i = 0; i < songRows.length; i++) {
             console.log('registering event for', i)
             songRows[i].addEventListener('mouseleave', function(event) {
                 var songItem = getSongItem(event.target);
                 console.log('mouse left from', i)
                 var songItemNumber = songItem.getAttribute('data-song-number');

                 // #2
                 if (songItemNumber !== currentlyPlayingSong) {
                     songItem.innerHTML = songItemNumber;
                 }
             });

             songRows[i].addEventListener('click', function(event) {
                 clickHandler(event.target);
             });

         };
     }, 0);
 }
     var songListContainer = document.getElementsByClassName('album-view-song-list')[0];


 

 // Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

 // Store state of playing songs
 var currentlyPlayingSong = null;

 window.onload = function() {
     setCurrentAlbum(albumPicasso);

     songListContainer.addEventListener('mouseover', function(event) {
         // Only target individual song rows during event delegation
         if (event.target.parentElement.className === 'album-view-song-item') {
             var songItem = getSongItem(event.target);
             if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
               console.log(songItem.parentElement.getAttribute('data-song-state'));
                 if(songItem.parentElement.getAttribute('data-song-state') !== 'paused') {
                   songItem.innerHTML = playButtonTemplate;
                 } else {
                   songItem.innerHTML = pauseButtonTemplate;
                 }
             }
         }
     });

     songListContainer.addEventListener('mouseover', function(event) {
         // #1

         if (event.target.parentElement.className === 'album-view-song-item') {
             event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
         }
     });

     var albums = [albumPicasso, albumMarconi, albumFishing];
     var index = 0;
     albumImage.addEventListener('click', function(event) {
         setCurrentAlbum(albums[index]);
         index++;
         //console.log('Current Index' + index)
         //console.log('Album Length:' + albums.length);
         if (index == albums.length) {
             index = 0;
         }
     });


     var findParentByClassName = function(element, targetClass) {
         if (element) {
           //if the first element doesn't have a parent we throw an alert
             var currentParent = element.parentElement;
             if(!currentParent) {
               alert("No parent found");
             }
             // we also go up when we don't have class name
             while (currentParent.className != targetClass && currentParent) {
                 currentParent = currentParent.parentElement;
             }
             // We show alert if no element with the class name was found
             if(!currentParent) {
               alert("No parent found with that class name");
             }
             return currentParent;
         }
     };

     window.getSongItem = function(element) {
         switch (element.className) {
             case 'album-song-button':
             case 'ion-play':
             case 'ion-pause':
                 return findParentByClassName(element, 'song-item-number');
             case 'album-view-song-item':
                 return element.querySelector('.song-item-number');
             case 'song-item-title':
             case 'song-item-duration':
                 return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
             case 'song-item-number':
                 return element;
             default:
                 return;
         }
     };

 };

 var clickHandler = function(targetElement) {
     var songItem = getSongItem(targetElement);
     if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
         songItem.parentElement.setAttribute('data-song-state', 'paused');
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
         songItem.parentElement.setAttribute('data-song-state', 'play');
     }
 };