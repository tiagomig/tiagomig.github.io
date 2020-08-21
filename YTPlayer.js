/* Code taken from
https://developers.google.com/youtube/iframe_api_reference
*/

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var youtubePlayer;
var isPlayerLoaded = false;
function onYouTubePlayerAPIReady() {
    youtubePlayer = new YT.Player('ytplayer', {
        width: '100%',
        height: '100%',
        videoId: 'P7ipjEOdceM',
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
            'start': 0,
            'autoplay': 0,
            'showinfo': 0,
            'autohide': 1,
            'loop': 0,
            'controls': 0,
            'modestbranding': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    // event.target.playVideo();
    // youtubePlayer.mute();
    isPlayerLoaded = true;
}

// The API calls this function when the player's state changes.
/* var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 10000);
        done = true;
    }
    else if (event.data == YT.PlayerState.ENDED) {
        // youtubePlayer.seekTo(0);
        // youtubePlayer.playVideo();
    }
}

function stopVideo() {
    youtubePlayer.stopVideo();
} */

function onPlayerError(event) {
    console.log("YTPlayer error with code" + event.data);
    }