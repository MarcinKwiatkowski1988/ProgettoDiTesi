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
        //3var blocker = document.getElementById( 'blocker' );
        //2var instructions = document.getElementById( 'instructions' );
        //2var element = document.body;   
        /*3blocker.style.display = '-webkit-box';
        blocker.style.display = '-moz-box';
        blocker.style.display = 'box';*/
        //2instructions.style.display = '';    
        //instructions.addEventListener( 'onkeydown', function ( event ) {
        /*document.addEventListener( 'keydown', function ( event ) {    
            var unicode = event.charCode? event.charCode : event.keyCode;
            var actualKeyPressed = String.fromCharCode( unicode ).toLowerCase();
            if ( actualKeyPressed == "m" ) {
                instructions.style.display = 'none';
                // Ask the browser to lock the pointer
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                if ( !/Firefox/i.test( navigator.userAgent ) )
                    element.requestPointerLock();
                }
            }, false );*/
        //document.addEventListener( 'keydown', pointerLock_keyListenerM, false );
        var element = document.body;
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        if ( !/Firefox/i.test( navigator.userAgent ) )
            element.requestPointerLock();
        pointerLock_onChange();
    } else
        //2instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
        blocker.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }


function pointerLock_onChange () {
    var blocker = document.getElementById( 'blocker' );
    //2var instructions = document.getElementById( 'instructions' );
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
        //2instructions.style.display = '';
        }
    }    


function pointerLock_off () {
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if ( havePointerLock ) {
        pointerLock_listeners_remove();
        var newCursor = document.getElementById( 'newCursor' );
        newCursor.style.display = 'none';
        var blocker = document.getElementById( 'blocker' );
        //2var instructions = document.getElementById( 'instructions' );
        blocker.style.display = 'none';
    } else
        //2instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
        blocker.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }


function pointerLock_keyListenerM ( event ) { 
    var unicode = event.charCode? event.charCode : event.keyCode;
    var actualKeyPressed = String.fromCharCode( unicode ).toLowerCase();
    if ( actualKeyPressed == "m" ) {
        //var instructions = document.getElementById( 'instructions' );
        var element = document.body;
        //instructions.style.display = 'none';
        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        if ( !/Firefox/i.test( navigator.userAgent ) )
            element.requestPointerLock();
        }
    }