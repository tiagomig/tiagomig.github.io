'use strict';
console.log('Here\'s a hidden message');

// Global variable containing the word being played
var g_inputName = '';

// Global variable indicating if the correct letter order must be followed
var g_isForceOrder = false;

//Global variable storing the number of correctly filled letters
var g_nbLettersOk = 0;

// Function called when a letter starts being dragged
function dragStart(ev) {
    var letterData = ev.target.getAttribute('data-letter');
    var style = window.getComputedStyle(ev.target, null);
    ev.dataTransfer.setData("id", ev.target.id);
    ev.dataTransfer.setData("letter", letterData);
    ev.dataTransfer.setData("text/plain", (parseInt(style.getPropertyValue("left"), 10) - ev.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY));
}

// Function called when a letter is dragged over an object
function dragOver(ev) {
    ev.preventDefault();
}

// Function called when a letter is dropped
function drop(ev) {
    ev.preventDefault();
    var thisId = ev.target.id;
    var thisLetter = ev.target.getAttribute('data-letter');
    var thisOrder = ev.target.getAttribute('data-order');
    var draggedId = ev.dataTransfer.getData("id");
    var draggedLetter = ev.dataTransfer.getData("letter");
    var offset = ev.dataTransfer.getData("text/plain").split(',');

    var isDropped = false;

    // Check if it is the same letter and it has not yet been filled
    if (draggedLetter == thisLetter &&
        !document.getElementById(thisId).classList.contains('okLetter')) {

        // Check if the order is correct (if the order enforcing is active)
        if (g_nbLettersOk == thisOrder ||
            g_isForceOrder == false) {

            // Mask the source letter
            document.getElementById(draggedId).style.display = 'none';

            // Flag the destination letter as OK
            document.getElementById(thisId).classList.remove('hiddenLetter');
            document.getElementById(thisId).classList.add('okLetter');

            // Increment the correct letters
            g_nbLettersOk += 1;

            // Flag the drop operation as performed
            isDropped = true;

            //Check if all the letters are ok
            if (g_nbLettersOk == g_inputName.length) {

                // Wait 1 second then go to endgame function
                setTimeout(endGame, 1000);
            }

        }

    }

    if (isDropped == false) {

        document.getElementById(draggedId).style.left = (ev.clientX + parseInt(offset[0], 10)) + 'px';
        document.getElementById(draggedId).style.top = (ev.clientY + parseInt(offset[1], 10)) + 'px';
    }
}

// Function called when we click a letter in the game board
function onGameLetterClick(ev) {
    const colours = ['black', 'blue', 'chartreuse', 'darkorange', 'deeppink', 'gold', 'sienna'];
    var thisId = ev.target.id;
    var currentColour = document.getElementById(thisId).style.color;
    var currentColourIdx = colours.indexOf(currentColour);
    var newColourIdx = 0;
    if (currentColourIdx > -1) {
        newColourIdx = currentColourIdx + 1;
        if (newColourIdx >= colours.length) {
            newColourIdx = 0;
        }
        document.getElementById(thisId).style.color = colours[newColourIdx];
    }
}

// Function called when the form is submitted
function createTable() {

    var form = document.getElementById("formConfig");
    g_inputName = document.getElementById("inputName").value;
    var nameLen = g_inputName.length;
    var hiddenNb = parseInt(document.getElementById("inputHiddenNb").value);
    g_isForceOrder = document.getElementById("forceOrder").checked;

    var mainContainer = document.getElementById("divContent");

    // Hide the form
    form.style.display = 'none';

    //Create the destination table and its only row
    var table = document.createElement('table');
    table.id = 'gameTable';
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');

    // Cycle to create each cell
    for (var i = 0; i < nameLen; i++) {

        // Create a new cell
        var td = document.createElement('td');

        //Define its attributes and listeners
        td.id = 'gameLetter' + i.toString();
        td.classList.add('gameLetter');
        td.setAttribute('data-letter', g_inputName.charAt(i));
        td.setAttribute('data-order', i);
        td.addEventListener('dragover', dragOver);
        td.addEventListener('drop', drop);
        td.addEventListener('click', onGameLetterClick);

        // If hidden, mark the letter to be invisible
        if (nameLen - i <= hiddenNb) {
            td.classList.add('hiddenLetter');
        } else {
            td.style.color = 'black';
        }

        // Add text
        td.appendChild(document.createTextNode(g_inputName.charAt(i)));

        // Add cell to row
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
    table.appendChild(tbody);
    mainContainer.appendChild(table);

    //Create the source tables
    var div = document.createElement('div');
    div.id = 'divSourceTables';
    var top = 10;
    var left = 100;
    for (var i = nameLen; i > 0; i--) {
        var table = document.createElement('table');
        table.draggable = true;
        table.classList.add('sourceTable');
        table.id = `sourceTable${i.toString()}`;
        table.style.top = top.toString() + 'px';
        table.style.left = left.toString() + 'px';
        left += 200;
        table.addEventListener('dragstart', dragStart);
        table.setAttribute('data-letter', g_inputName.charAt(i - 1));
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.classList.add('gameLetter');
        td.classList.add('moveLetter');
        td.appendChild(document.createTextNode(g_inputName.charAt(i - 1)));
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);
        div.appendChild(table);
    }
    mainContainer.appendChild(div);

    // Initialise the number of correct letters
    g_nbLettersOk = 0;

    document.body.addEventListener('dragover', dragOver, false);
    document.body.addEventListener('drop', drop, false);

    return false;
}

// Function called when all letters are correctly filled
function endGame() {
    var gameContainer = document.getElementById("divFlex");
    var videoContainer = document.getElementById("divVideoContainer");
    var ytplayer = document.getElementById("ytplayer");

    var videoId = document.getElementById("videoId").value;
    var videoStart = document.getElementById("videoStart").value;
    var videoEnd = document.getElementById("videoEnd").value;

    // Hide the top-level container
    if (gameContainer) {
        gameContainer.style.display = 'none';
    }

    // Show the video container
    if (videoContainer) {
        videoContainer.style.display = 'inline';
    }

    if (ytplayer) {
        if (videoEnd > 0) {
            youtubePlayer.loadVideoById({
                'videoId': videoId,
                'startSeconds': videoStart,
                'endSeconds': videoEnd,
                'suggestedQuality': 'hd720'
            });
        } else {
            youtubePlayer.loadVideoById({
                'videoId': videoId,
                'startSeconds': videoStart,
                'suggestedQuality': 'hd720'
            });
        }
        // youtubePlayer.seekTo(10);
        youtubePlayer.playVideo();
    }
}

// Function called for the "Test video" button
function testVideo() {

    //Simulate end game
    endGame();

    // Add a listener to reset everything at the end
    // youtubePlayer.addEventListener('onStateChange', 'onPlayerStateChange');
}

// Function called when the state of the Youtube video changes
// (mostly used to hide the video at the end)
function onPlayerStateChange(event) {
    // If the video has ended
    if (event.data == YT.PlayerState.ENDED) {

        var gameContainer = document.getElementById("divFlex");
        var videoContainer = document.getElementById("divVideoContainer");
        var ytplayer = document.getElementById("ytplayer");

        // Remove the listener (but the expected removeEventListener didn't work)
        // youtubePlayer.removeEventListener('onStateChange', 'onPlayerStateChange');

        // Workaround from https://stackoverflow.com/questions/25880573/youtube-api-removeeventlistener-not-working
        // onPlayerStateChange = function() {};

        // Show again the form
        if (gameContainer) {
            gameContainer.style.display = 'flex';
        }

        // Hide the video container
        if (videoContainer) {
            videoContainer.style.display = 'none';
        }

        // Stop and clear the video
        if (ytplayer) {
            youtubePlayer.stopVideo();
        }
    }
}