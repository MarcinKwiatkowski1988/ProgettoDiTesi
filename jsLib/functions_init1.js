var automaticORmanual;
var cameraEye;
var controls;
var divWithInfo;
var unlockWMovement; 
var unlockSMovement; 
var unlockAMovement; 
var unlockDMovement;


function init1 () {
    //initPointerLock();
    init_base();

    getParamsFromHttpAddress ( GET ); 
    path = pathsMap_stringToObj[ GET[ "pathsSelection" ] ];

    //v9.4
    //automaticORmanual = 1; //0->automatic; 1->manual
    automaticORmanual = 0; //0->automatic; 1->manual

    //v9.4
    initCameraAutomatic();
    //initCameraManual();
    initCameraEye();  
    initDivWithConfig ();

    initRenderer();

    initCeiling();
    init_objects();

    //v9.4
    getPathAndRun ();

    render();

    document.addEventListener( 'mousedown', onMouseDown_server, false );
    document.addEventListener( 'mousemove', onMouseMove, false ); 
    window.addEventListener( 'resize', onWindowResize, false );
      
    }


function initCameraAutomatic () {
	camera = new THREE.PerspectiveCamera( 70, windowInnerWidth / windowInnerHeight, 0.1, 3000);
	scene.add( camera );
	}    


function initCameraEye () {
    var cameraEye_geometry = new THREE.CubeGeometry( 0.001, 0.001, 0.001 );  
    var cameraEye_material  = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity : 1, transparent : true, depthWrite : false } );
    cameraEye = new THREE.Mesh( cameraEye_geometry, cameraEye_material );
    cameraEye.position.set( 0,20,0 );
    scene.add( cameraEye );
    }  


function initCameraManual () {
    camera = new THREE.PerspectiveCamera( 45, windowInnerWidth / windowInnerHeight, 0.1, 3000);
    scene.add( camera );
    }      


function initDivWithConfig () {
    getParamsFromHttpAddress ( GET );
	divWithInfo = document.createElement('div');
	divWithInfo.class = 'divWithInfoControls';
    divWithInfo.style.position = 'absolute';
    divWithInfo.style.top = '10px';
    divWithInfo.style.width = '100%';
    divWithInfo.style.textAlign = 'right';
    divWithInfo.innerHTML = '<p>Hai selezionato: </p></br></br>';
        for ( var p in GET ) {
            divWithInfo.innerHTML += p + ': ' + GET[ p ] + '</br>';
            }
        divWithInfo.innerHTML += '</br></br>';
    /*var groupToDisplay = '<p id="pSelectGroup" style="display: block;">Select the user group: ';
    groupToDisplay += '<select id="selectGroup" name="selectGroup">';
    groupToDisplay += '<option selected value="none">Nothing selected</option>';
    for ( var g in userGroups ) 
        groupToDisplay += '<option value="' + g + '">' + g + '</option>';  
    groupToDisplay += '</select></p>';
    divWithInfo.innerHTML += groupToDisplay;
    var accessiblePathsToDisplay = '<p id="pSelectAccessiblePaths" style="display: block;">Select the accessible paths: ';
    accessiblePathsToDisplay += '<select id="selectAccessiblePaths" name="selectAccessiblePaths" onchange="applyAccessiblePathsSelection()">';
    for ( var g in userGroups ) {
        for ( var ap=0; ap<userGroups[ g ].accessiblePaths.length; ap++ ) {
            var pathsForThisGroup = userGroups[ g ].accessiblePaths[ ap ][ "ns0:svg" ][ "groupPathsName" ];
            accessiblePathsToDisplay += '<option value="' + pathsForThisGroup + '" class="' + g + '">' + pathsForThisGroup + '</option>';
            }
        }    
    accessiblePathsToDisplay += '</select></p>';
    divWithInfo.innerHTML += accessiblePathsToDisplay;*/
    /*var pathPoint_start = '<p id="pSelectStartPoint" style="display: none;">Select the start point of the path: ';
    pathPoint_start += '<select id="startPoint">';
    for ( var ap=0; ap<userGroups[ "defaultGroup" ].accessiblePaths.length; ap++ ) {
        var pathsForThisGroup = userGroups[ "defaultGroup" ].accessiblePaths[ ap ][ "ns0:svg" ][ "groupPathsName" ];
        pathSup = pathsMap_stringToObj[ pathsForThisGroup ];
        for ( var s in pathSup ) {    
          	if ( s==="1" )
          		pathPoint_start += '<option selected class="' + pathsForThisGroup + '">' + s + '</option>';
           	else
           		pathPoint_start += '<option class="' + pathsForThisGroup + '">' + s + '</option>';
           	}
        }
	pathPoint_start += '</select></p>';
    divWithInfo.innerHTML += pathPoint_start;
    var pathPoint_end = '<p id="pSelectEndPoint" style="display: none;">Select the end point of the path: ';
    pathPoint_end += '<select id="endPoint">';
    for ( var ap=0; ap<userGroups[ "defaultGroup" ].accessiblePaths.length; ap++ ) {
        var pathsForThisGroup = userGroups[ "defaultGroup" ].accessiblePaths[ ap ][ "ns0:svg" ][ "groupPathsName" ]; 
        pathSup = pathsMap_stringToObj[ pathsForThisGroup ];
        for ( var e in pathSup ) {
        	if ( e==="2" )
        		pathPoint_end += '<option selected class="' + pathsForThisGroup + '">' + e + '</option>';
        	else
        		pathPoint_end += '<option class="' + pathsForThisGroup + '">' + e + '</option>';
        	}
        }    
	pathPoint_end += '</select></p>';
    divWithInfo.innerHTML += pathPoint_end;*/
    //divWithInfo.innerHTML += '<center><input id="buttonForNewPath" type="button" style="display: none;"' + 
    //    'onclick="getNewPath()" value="Run a new path"/></center>';
    divWithInfo.innerHTML += '<center><input id="cameraType" type="button" style="display: none;"' + 
        'onclick="changeCameraType()" value="Switch to manual camera"/></center>';
    divWithInfo.innerHTML += '<center><input id="buttonVisitEnviroment3d" type="button" style="display: block;"' + 
        'onclick="showEnvironment3D()" value="Visit"/></center>';
    document.body.appendChild( divWithInfo );
    //$("#selectAccessiblePaths").chainedTo("#selectGroup");
    //$("#startPoint").chainedTo("#selectAccessiblePaths");
    //$("#endPoint").chainedTo("#selectAccessiblePaths");
	}


/**function initPointerLock_on () {
    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if ( havePointerLock ) {
        var element = document.body;
        var pointerlockchange = function ( event ) {
            if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
                //controls.enabled = true;
                blocker.style.display = 'none';
            } else {
                //controls.enabled = false;
                //blocker.style.display = '-webkit-box';
                //blocker.style.display = '-moz-box';
                blocker.style.display = 'box';
                instructions.style.display = '';
                }
            }
        /*var pointerlockerror = function ( event ) {
            instructions.style.display = '';
            }*/

        // Hook pointer lock state change events
        /*2document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );*/
        /*document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );*/

/**        instructions.addEventListener( 'click', function ( event ) {
            instructions.style.display = 'none';
            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            if ( /Firefox/i.test( navigator.userAgent ) ) {
                /*var fullscreenchange = function ( event ) {
                    if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
                        document.removeEventListener( 'fullscreenchange', fullscreenchange );
                        document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
                        element.requestPointerLock();
                        }

                    } 
                document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                element.requestFullscreen();*/
/**           } else {
                element.requestPointerLock();
                }
            }, false );
        } else {
            instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
        }
    }**/


function initUnlockMovements () {
    unlockWMovement = true;
    unlockSMovement = true;
    unlockAMovement = true;
    unlockDMovement = true;
    }    