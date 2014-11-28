function pointerLock_listeners_add () {
    document.addEventListener( 'keydown', pointerLock_keyListenerM, false );
    document.addEventListener( 'pointerlockchange', pointerLock_onChange, false );
    document.addEventListener( 'mozpointerlockchange', pointerLock_onChange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerLock_onChange, false );
    }


function pointerLock_listeners_remove () {
    document.removeEventListener( 'keydown', pointerLock_keyListenerM );
    document.removeEventListener( 'pointerlockchange', pointerLock_onChange );
    document.removeEventListener( 'mozpointerlockchange', pointerLock_onChange );
    document.removeEventListener( 'webkitpointerlockchange', pointerLock_onChange );
    }    


function pointerLock_on () {
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if ( havePointerLock ) {
        pointerLock_listeners_add();
        var element = document.body;
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        if ( !/Firefox/i.test( navigator.userAgent ) )
            element.requestPointerLock();
        pointerLock_onChange();
    } else
        blocker.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }


function pointerLock_onChange () {
    var blocker = document.getElementById( 'blocker' );
    var element = document.body;
    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
        var newCursor = document.getElementById( 'newCursor' );
        newCursor.style.display = 'block';
        blocker.style.display = 'none';
    } else {
        var newCursor = document.getElementById( 'newCursor' );
        newCursor.style.display = 'none';
        blocker.style.display = '-webkit-box';
        blocker.style.display = '-moz-box';
        blocker.style.display = 'box';
        }
    }    


function pointerLock_off () {
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if ( havePointerLock ) {
        pointerLock_listeners_remove();
        var newCursor = document.getElementById( 'newCursor' );
        newCursor.style.display = 'none';
        var blocker = document.getElementById( 'blocker' );
        blocker.style.display = 'none';
    } else
        blocker.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }


function pointerLock_keyListenerM ( event ) { 
    var unicode = event.charCode? event.charCode : event.keyCode;
    var actualKeyPressed = String.fromCharCode( unicode ).toLowerCase();
    if ( actualKeyPressed == "m" ) {
        var element = document.body;
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        if ( !/Firefox/i.test( navigator.userAgent ) )
            element.requestPointerLock();
        }
    }