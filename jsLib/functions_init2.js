var controls_Orbit;


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

    document.addEventListener( 'mousedown', onMouseDown_path, false );
    }


function initCameraFromTop () {
    camera = new THREE.PerspectiveCamera( 70, windowInnerWidth / windowInnerHeight, 0.1, 3000);
    camera.position.x = 6;
    camera.position.y = 30;
    camera.position.z = -22.25;
    camera.lookAt( new THREE.Vector3( 6,0,-22.5 ) );
    scene.add( camera );
    }


function animate2 () { 
    render();
    requestAnimationFrame( animate2 );
    controls_Orbit.update();
    stats.update(); 
    }   