'use strict';
console.log('Here\'s a hidden message');

var g_inputName = '';
var g_nbLettersOk = 0;

function dragStart(ev) {
    var letterData = ev.target.getAttribute('data-letter');
    var style = window.getComputedStyle(ev.target, null);
    ev.dataTransfer.setData("id", ev.target.id);
    ev.dataTransfer.setData("letter", letterData);
    ev.dataTransfer.setData("text/plain", (parseInt(style.getPropertyValue("left"), 10) - ev.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY));
}

function dragOver(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var thisId = ev.target.id;
    var thisLetter = ev.target.getAttribute('data-letter');
    var draggedId = ev.dataTransfer.getData("id");
    var draggedLetter = ev.dataTransfer.getData("letter");
    var offset = ev.dataTransfer.getData("text/plain").split(',');

    // If it is the same letter
    if (draggedLetter == thisLetter &&
        !document.getElementById(thisId).classList.contains('okLetter')) {

        // Mask the source letter
        document.getElementById(draggedId).style.display = 'none';

        // Flag the destination letter as OK
        document.getElementById(thisId).classList.remove('hiddenLetter');
        document.getElementById(thisId).classList.add('okLetter');

        // Increment the correct letters
        g_nbLettersOk += 1;

        //Check if all the letters are ok
        if (g_nbLettersOk == g_inputName.length) {

            // Wait 1 second then go to endgame function
            setTimeout(endGame, 1000);
        }

    } else {

        document.getElementById(draggedId).style.left = (ev.clientX + parseInt(offset[0], 10)) + 'px';
        document.getElementById(draggedId).style.top = (ev.clientY + parseInt(offset[1], 10)) + 'px';
    }
}

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


function createTable() {

    var form = document.getElementById("formConfig");
    g_inputName = document.getElementById("inputName").value;
    var nameLen = g_inputName.length;
    var hiddenNb = parseInt(document.getElementById("inputHiddenNb").value);
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
    div.classList.add('parent');
    for (var i = 0; i < nameLen; i++) {
        var table = document.createElement('table');
        table.draggable = true;
        table.classList.add('sourceTable');
        table.id = `sourceTable${i.toString()}`;
        table.addEventListener('dragstart', dragStart);
        table.setAttribute('data-letter', g_inputName.charAt(i));
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.classList.add('gameLetter');
        td.classList.add('moveLetter');
        td.appendChild(document.createTextNode(g_inputName.charAt(i)));
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);
        div.appendChild(table);
    }
    mainContainer.appendChild(div);

    document.body.addEventListener('dragover', dragOver, false);
    document.body.addEventListener('drop', drop, false);
}

function endGame() {
    var mainContainer = document.getElementById("divContent");

    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
}