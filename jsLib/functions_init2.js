var controls_Orbit;


function init2 () {
    init_base();

    getParamsFromHttpAddress ( GET ); 
    pathSup = pathsMap_stringToObj[ GET[ "pathsSelection" ] ]; 

    initCameraFromTop();
    initRenderer();
    init_objects();
    createSEPoints (); 

    render();

    controls_Orbit = new THREE.OrbitControls( camera, renderer.domElement );
    controls_Orbit.noRotate = true;
    controls_Orbit.target = new THREE.Vector3( 6, 0, -22.25 );

    document.addEventListener( 'mousedown', onMouseDown_path, false );
    }


function initCameraFromTop () {
    camera = new THREE.PerspectiveCamera( 70, windowInnerWidth / windowInnerHeight, 0.1, 3000);
    camera.position.x = 6;
    camera.position.y = 35;
    camera.position.z = -22.25;
    scene.add( camera );
    }


function animate2 () { 
    render();
    requestAnimationFrame( animate2 );
    controls_Orbit.update();
    stats.update(); 
    }   