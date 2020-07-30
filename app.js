'use strict';
console.log('Here\'s a hidden message');

let today = new Date();
let formatDate = today.toDateString();
let selectElement = document.getElementById('date');
selectElement.innerHTML = formatDate;

function drag(ev) {
    var letterData = ev.target.getAttribute('data-letter');
    ev.dataTransfer.setData("id", ev.target.id);
    ev.dataTransfer.setData("letter", letterData);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var thisId = ev.target.id;
    var thisLetter = ev.target.getAttribute('data-letter');
    var draggedId = ev.dataTransfer.getData("id");
    var draggedLetter = ev.dataTransfer.getData("letter");
    if (draggedLetter == thisLetter) {
        document.getElementById(draggedId).style.display = 'none';
        document.getElementById(thisId).classList.add('okLetter');
        
    }
  }

function createTable() {

    var form = document.getElementById("formConfig");
    var inputName = document.getElementById("inputName").value;
    var nameLen = inputName.length;
    var width = (100 / nameLen).toString() + '%';
    var hiddenNb = parseInt(document.getElementById("inputHiddenNb").value);
    var body = document.getElementsByTagName('body')[0];

    // Hide the form
    form.style.display = 'none';

    //Create the destination table
    var table = document.createElement('table');
    table.id = 'gameTable';
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    for (var i = 0; i < nameLen; i++) {
        var td = document.createElement('td');
        td.id = 'gameLetter' + i.toString();
        td.classList.add('gameLetter');
        td.setAttribute('data-letter', inputName.charAt(i));
        td.addEventListener('dragover', allowDrop);
        td.addEventListener('drop', drop);
        td.appendChild(document.createTextNode(inputName.charAt(i)));
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
    table.appendChild(tbody);
    body.appendChild(table);

    //Create the source tables
    var div = document.createElement('div');
    div.classList.add('parent');
    for (var i = 0; i < nameLen; i++) {
        var table = document.createElement('table');
        table.draggable = true;
        table.classList.add('sourceTable');
        table.id = 'sourceTable' + i.toString();
        table.addEventListener('dragstart', drag);
        table.setAttribute('data-letter', inputName.charAt(i));
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.classList.add('gameLetter');
        td.appendChild(document.createTextNode(inputName.charAt(i)));
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);
        div.appendChild(table);
    }
    body.appendChild(div);
}
