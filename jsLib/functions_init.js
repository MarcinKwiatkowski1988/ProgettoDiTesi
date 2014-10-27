var automaticORmanual;
var camera;
var cameraEye;
var clock;
var light1;
var divWithInfo;
var groupSelected;
var keyboard;
var mouse = { x: 0, y: 0 };
var path = {};
var pathSup = {};
var projector;
var renderer;
var scene;
var serversClickableFaces = [];
var SCFsupp = [];
var stats;
var statsContainer;
var unlockWMovement; 
var unlockSMovement; 
var unlockAMovement; 
var unlockDMovement;


function init () {
      createPathsFromAllSVG ();

      //v9.4
      //automaticORmanual = 1; //0->automatic; 1->manual
      automaticORmanual = 0; //0->automatic; 1->manual
      clock = new THREE.Clock();
      scene = new THREE.Scene();

      initStats ();

      //v9.4
      initCameraAutomatic();
      //initCameraManual();
      initCameraEye();  
      initLights();
      initRenderer();
      initDivWithConfig ();

      initCeiling();
      initFloor();
      initObjects();
      initWalls();

      //v9.4
      getPathAndRun ();

      keyboard = new THREEx.KeyboardState();
      projector = new THREE.Projector();

      render();

      document.addEventListener( 'mousedown', onDocumentMouseDown, false );
      window.addEventListener( 'resize', onWindowResize, false );
      
      }


//v10
function init_2 () {
    createPathsFromAllSVG ();

    clock = new THREE.Clock();
    scene = new THREE.Scene();

    initCameraFromTop();
    initLights();
    initRenderer();

    initFloor();
    initObjects();
    initWalls();

    render();
    }


function initCameraAutomatic () {
	camera = new THREE.PerspectiveCamera( 70, windowInnerWidth / window.innerHeight, 0.1, 3000);
	scene.add( camera );
	}    


function initCameraEye () {
    var cameraEye_geometry = new THREE.CubeGeometry( 0.001, 0.001, 0.001 );  
    var cameraEye_material  = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity : 1, transparent : true, depthWrite : false } );
    cameraEye = new THREE.Mesh( cameraEye_geometry, cameraEye_material );
    cameraEye.position.set( 0,20,0 );
    scene.add( cameraEye );
    }  


function initCameraFromTop () {
    camera = new THREE.PerspectiveCamera( 70, ( window.innerWidth ) / window.innerHeight, 0.1, 3000);
    camera.position.x = 6;
    camera.position.y = 30;
    camera.position.z = -22.25;
    camera.lookAt( new THREE.Vector3( 6,0,-22.5 ) );
    scene.add( camera );
    }


function initCameraManual () {
    camera = new THREE.PerspectiveCamera( 45, windowInnerWidth / window.innerHeight, 0.1, 3000);
    scene.add( camera );
    }      


function initCeiling () {
    /*var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load( 'models/ceiling.dae', function ( collada ) {
        var colladaCeiling = collada.scene.children[0]
        colladaCeiling.name = "ceiling";
        colladaCeiling.material.needsUpdate = true;
        colladaCeiling.material.side = THREE.DoubleSide;
        colladaCeiling.material.wireframe = false;
        colladaCeiling.position.set(0,2.5,0);//x,z,y- if you think in blender dimensions ;)
        colladaCeiling.scale.set(2,2,2);
        scene.add( colladaCeiling );
        } ); */

    /*var colladaCeiling;
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load( 'models/ceiling.dae', function ( collada ) {
        colladaCeiling = collada.scene;
        colladaCeiling.scale.x = colladaCeiling.scale.y = colladaCeiling.scale.z = 2;
        colladaCeiling.updateMatrix();
        } ); */

    var ceilingTexture = new THREE.ImageUtils.loadTexture( 'textures/ceiling.jpg' );
    ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping; 
    ceilingTexture.repeat.set( 14, 14 );
    var ceilingMaterial = new THREE.MeshPhongMaterial( { map: ceilingTexture, side: THREE.DoubleSide } );
    var ceilingGeometry = new THREE.PlaneGeometry( 45, 44.5 );
    var ceiling = new THREE.Mesh( ceilingGeometry, ceilingMaterial );
    ceiling.position.x = 6;
    ceiling.position.y = 2.5;
    ceiling.position.z = -22.25;
    ceiling.rotation.x = Math.PI / 2;
    scene.add( ceiling );
    }


function initDivWithConfig () {
	divWithInfo = document.createElement('div');
	divWithInfo.class = 'divWithInfoControls';
    divWithInfo.style.position = 'absolute';
    divWithInfo.style.top = '10px';
    divWithInfo.style.width = '100%';
    divWithInfo.style.textAlign = 'center';
    var groupToDisplay = '<p id="pSelectGroup" style="display: block;">Select the user group: ';
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
    divWithInfo.innerHTML += accessiblePathsToDisplay;
    var pathPoint_start = '<p id="pSelectStartPoint" style="display: block;">Select the start point of the path: ';
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
    var pathPoint_end = '<p id="pSelectEndPoint" style="display: block;">Select the end point of the path: ';
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
    divWithInfo.innerHTML += pathPoint_end;
    divWithInfo.innerHTML += '<center><input id="buttonForNewPath" type="button" style="display: none;"' + 
        'onclick="getNewPath()" value="Run a new path"/></center>';
    divWithInfo.innerHTML += '<center><input id="cameraType" type="button" style="display: none;"' + 
        'onclick="changeCameraType()" value="Switch to manual camera"/></center>';
    divWithInfo.innerHTML += '<center><input id="buttonVisitEnviroment3d" type="button" style="display: none;"' + 
        'onclick="showEnvironment3D()" value="Visit"/></center>';
    document.body.appendChild( divWithInfo );
    $("#selectAccessiblePaths").chainedTo("#selectGroup");
    $("#startPoint").chainedTo("#selectAccessiblePaths");
    $("#endPoint").chainedTo("#selectAccessiblePaths");
	}


function initFloor () {
    var floorTexture = new THREE.ImageUtils.loadTexture( 'textures/floor.jpg' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 7, 2 );
    var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry( 45, 44.5 );
    var floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.position.x = 6;
    floor.position.y = -2;
    floor.position.z = -22.25;
    floor.rotation.x = Math.PI / 2;
    scene.add( floor );
    }


function initLight_Ambient() {
    var ambientLight = new THREE.AmbientLight( 0x333333 ); //gray dark
    scene.add( ambientLight );
    }


function initLights () {
    initLight_Ambient();
    //var ambientLight = new THREE.AmbientLight( 0x333333 ); //gray dark
    //scene.add( ambientLight );
    for ( var i=0; i<lights.info.numLights; i++ ) {
        if ( lights[lights.info.lightsList[i]].type=='point' ) {
            var light = lights[lights.info.lightsList[i]];
            var pointLight = new THREE.PointLight( light.hex, light.intensity, light.distance );
            pointLight.position.set( light.pos[0], light.pos[1], light.pos[2] );
            scene.add( pointLight );
            }
        }
	}


function initObjects () {
    for ( var i=0; i<objects.info.numObjects; i++ ) {
        if ( objects[objects.info.objectsList[i]].type=='cuboid' ) {
            var object = objects[objects.info.objectsList[i]];
            var cuboidGeometry = new THREE.CubeGeometry( object.dim[0], object.dim[1], object.dim[2] );
            var cuboidMaterialArray = [];
            var cuboidTextureFace1 = THREE.ImageUtils.loadTexture( 'textures/' + object.textureFace1 + '.jpg');
            cuboidTextureFace1.needsUpdate = true;
            cuboidMaterialArray.push( new THREE.MeshLambertMaterial( { map: cuboidTextureFace1 } ) ); 
            var cuboidTextureFace2 = THREE.ImageUtils.loadTexture( 'textures/' + object.textureFace2 + '.jpg');
            cuboidTextureFace2.needsUpdate = true;
            cuboidMaterialArray.push( new THREE.MeshLambertMaterial( { map: cuboidTextureFace2 } ) ); 
            var cuboidTextureFace3 = THREE.ImageUtils.loadTexture( 'textures/' + object.textureFace3 + '.jpg');
            cuboidTextureFace3.needsUpdate = true;
            cuboidMaterialArray.push( new THREE.MeshLambertMaterial( { map: cuboidTextureFace3 } ) ); 
            var cuboidTextureFace4 = THREE.ImageUtils.loadTexture( 'textures/' + object.textureFace4 + '.jpg');
            cuboidTextureFace4.needsUpdate = true;
            cuboidMaterialArray.push( new THREE.MeshLambertMaterial( { map: cuboidTextureFace4 } ) ); 
            var cuboidTextureFace5 = THREE.ImageUtils.loadTexture( 'textures/' + object.textureFace5 + '.jpg');
            cuboidTextureFace5.needsUpdate = true;
            cuboidMaterialArray.push( new THREE.MeshLambertMaterial( { map: cuboidTextureFace5 } ) ); 
            var cuboidTextureFace6 = THREE.ImageUtils.loadTexture( 'textures/' + object.textureFace6 + '.jpg');
            cuboidTextureFace6.needsUpdate = true;
            cuboidMaterialArray.push( new THREE.MeshLambertMaterial( { map: cuboidTextureFace6 } ) ); 
            var cuboidMaterials = new THREE.MeshFaceMaterial( cuboidMaterialArray );     
            var cuboid = new THREE.Mesh( cuboidGeometry, cuboidMaterials );
            cuboid.position.set ( object.pos[0], object.pos[1], object.pos[2] );
            scene.add ( cuboid );
            SCFsupp = [ cuboid, object.linkableFace-1, object.link ];
            serversClickableFaces.push( SCFsupp ) ;
            }
        }
    }


function initRenderer () {
	renderer = new THREE.WebGLRenderer();
    renderer.setSize( windowInnerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
	}


function initStats () { 
    statsContainer = document.getElementById( 'divStats' );
    stats = new Stats();
    statsContainer.appendChild( stats.domElement );
    }


function initUnlockMovements () {
    unlockWMovement = true;
    unlockSMovement = true;
    unlockAMovement = true;
    unlockDMovement = true;
    }    


function initWalls () {
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load( 'models/walls.dae', function ( collada ) {
        var colladaWalls = collada.scene.children[0]
        colladaWalls.name = "walls";
        //var wallsTexture = new THREE.ImageUtils.loadTexture( 'textures/walls.jpg' );
        //wallsTexture.wrapS = wallsTexture.wrapT = THREE.RepeatWrapping; 
       //wallsTexture.repeat.set( 2, 2 );
        //colladaWalls.material = new THREE.MeshBasicMaterial( { map: wallsTexture, side: THREE.DoubleSide } );
        colladaWalls.material.needsUpdate = true;
        colladaWalls.material.wireframe = false;
        colladaWalls.position.set(0,-2,0);//x,z,y- if you think in blender dimensions
        colladaWalls.scale.set(2,2,2);
        scene.add( colladaWalls ); 

    console.log ( colladaWalls );
        } );
    /*var colladaWalls;
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load( 'models/walls.dae', function ( collada ) {
        colladaWalls = collada.scene;
        colladaWalls.scale.x = colladaWalls.scale.y = colladaWalls.scale.z = 2;
        colladaWalls.updateMatrix();
        } ); */
    }    


function render () {
    renderer.render( scene, camera );
    }    