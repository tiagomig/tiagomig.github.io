var touchDnDEvents = {
    'dataTransfer': null,
    'draggedItem': null,
    'lastDraggedOver': null,
    'dragOvers': null,
    'store': null
};

var dragOverInterval = 100; // milliseconds to refresh dragOver

function getClosestDraggable(element) {
    for (; element; element = element.parentElement) {
        if (element.hasAttribute('draggable')) {
            return element;
        }
    }
    return null;
};

function simulateEvent(type, touchEvent, dataTransfer, target) {
    var touchDetails = touchEvent.changedTouches[0];
    var event = new Event(type, { 'bubbles': true });

    event.altkey = touchEvent.altkey;
    event.button = 0;
    event.buttons = 1;
    event.cancelBubble = false;
    event.clientX = touchDetails.clientX;
    event.clientY = touchDetails.clientY;
    event.ctrlKey = touchEvent.ctrlKey;
    event.dataTransfer = dataTransfer;
    event.layerX = 0;
    event.layerY = 0;
    event.metaKey = false;
    event.movementX = 0;
    event.movementY = 0;
    event.offsetX = touchDetails.pageX - target.offsetLeft;
    event.offsetY = touchDetails.pageY - target.offsetTop;
    event.pageX = touchDetails.pageX;
    event.pageY = touchDetails.pageY;
    event.relatedTarget = touchEvent.relatedTarget;
    event.returnValue = touchEvent.returnValue;
    event.screenX = touchDetails.screenX;
    event.screenY = touchDetails.screenY;
    event.shiftKey = touchEvent.shiftKey;
    event.sourceCapabilities = touchEvent.sourceCapabilities;
    event.view = touchEvent.view;
    event.which = 1;
    event.x = touchDetails.clientX;
    event.y = touchDetails.clientY;

    target.dispatchEvent(event);
}

function touchStart(touchEv) {

    var target = getClosestDraggable(touchEv.target);

    if (target != null) {

        // prevent the touchstart event from having an effect
        touchEv.preventDefault();

        var x = event.changedTouches[0].clientX;
        var y = event.changedTouches[0].clientY;
        var store = {};
        var dataTransfer = new DataTransfer(store);

        // Save the details so we can reuse them throughout the drag operation
        touchDnDEvents.store = store;
        touchDnDEvents.dataTransfer = dataTransfer;
        touchDnDEvents.draggedItem = target;

        store.mode = 'readwrite';
        simulateEvent('dragstart', event, dataTransfer, target);
    }
}

function touchMove(touchEv) {

    if (touchDnDEvents.draggedItem) {
        touchEv.preventDefault();

        var x = touchEv.changedTouches[0].clientX;
        var y = touchEv.changedTouches[0].clientY;
        var dataTransfer = touchDnDEvents.dataTransfer;
        var draggedItem = touchDnDEvents.draggedItem;

        touchDnDEvents.store.mode = 'readwrite';
        simulateEvent('drag', touchEv, dataTransfer, draggedItem);

        var draggedOver = document.elementFromPoint(x, y);

        var lastDraggedOver = touchDnDEvents.lastDraggedOver;
        if (lastDraggedOver !== draggedOver) {
            if (lastDraggedOver) {
                clearInterval(touchDnDEvents.dragOvers);
                simulateEvent('dragleave', touchEv, dataTransfer, lastDraggedOver);
            }

            simulateEvent('dragenter', touchEv, dataTransfer, draggedOver);

            touchDnDEvents.dragOvers = setInterval(function () {
                simulateEvent('dragover', touchEv, dataTransfer, draggedOver);
            }, dragOverInterval);

            touchDnDEvents.lastDraggedOver = draggedOver;
        }
    }
}

function touchEnd (touchEv) {
    if (touchDnDEvents.draggedItem) {
        touchEv.preventDefault();
  
      var x = touchEv.changedTouches[0].clientX;
      var y = touchEv.changedTouches[0].clientY;
      var target = document.elementFromPoint(x, y);
  
      var dataTransfer = touchDnDEvents.dataTransfer;
  
      // Ensure dragover event generation is terminated
      clearInterval(touchDnDEvents.dragOvers);
  
      touchDnDEvents.store.mode = 'readonly';
      simulateEvent('drop', touchEv, dataTransfer, target);
  
      touchDnDEvents.store.mode = 'protected';
      simulateEvent('dragend', touchEv, dataTransfer, target);
  
      touchDnDEvents.store = null;
      touchDnDEvents.dataTransfer = null;
      touchDnDEvents.lastDraggedOver = null;
      touchDnDEvents.draggedItem = null;
    }
  }

document.addEventListener('touchstart', touchStart, { passive: false });
document.addEventListener('touchmove', touchMove, { passive: false });
document.addEventListener('touchend', touchEnd, { passive: false });