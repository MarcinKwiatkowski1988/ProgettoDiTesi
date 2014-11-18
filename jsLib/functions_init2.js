var controls_Orbit;
//var controls_Track;

//v10
function init2 () {
    init_base();

    getParamsFromHttpAddress ( GET ); 
    pathSup = pathsMap_stringToObj[ GET[ "pathsSelection" ] ]; 

    //initStats (); // useless, but it prevents the error on functions_animate : 11

    initCameraFromTop();
    //initCameraEye(); //useless, but it prevents the error on function_animatae.js : 62

    initRenderer();

    init_objects();

    createSEPoints (); 

    render();

    controls_Orbit = new THREE.OrbitControls( camera, renderer.domElement );
    controls_Orbit.noRotate = true;
    controls_Orbit.target = new THREE.Vector3( 6, 0, -22.25 );
    /*controls_Track = new THREE.TrackballControls( camera );
    controls_Track.rotateSpeed = 1.0;
    controls_Track.zoomSpeed = 1.2;
    controls_Track.panSpeed = 0.8;
    controls_Track.noZoom = false;
    controls_Track.noPan = false;
    controls_Track.staticMoving = true;
    controls_Track.dynamicDampingFactor = 0.3;
    controls_Track.keys = [ 65, 83, 68 ];*/
    //controls_Track.target = new THREE.Vector3( 6, 0, -22.25 ); //instead of lookAt that is not working
    //controls_Track.addEventListener( 'change', render );

    document.addEventListener( 'mousedown', onMouseDown_path, false );
    }


function initCameraFromTop () {
    camera = new THREE.PerspectiveCamera( 70, windowInnerWidth / windowInnerHeight, 0.1, 3000);
    camera.position.x = 6;
    camera.position.y = 35;
    camera.position.z = -22.25;
    //camera.lookAt( new THREE.Vector3( 6,0,-22.5 ) );
    //camera.lookAt( new THREE.Vector3( ) );
    scene.add( camera );
    }


function animate2 () { 
    render();
    requestAnimationFrame( animate2 );
    controls_Orbit.update();
    //controls_Track.update();
    stats.update(); 
    }   