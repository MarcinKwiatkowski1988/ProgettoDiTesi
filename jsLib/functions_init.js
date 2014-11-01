var camera;
var clock;
var GET = {};
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


function init_base () {
    createPathsFromAllSVG ();

    clock = new THREE.Clock();
    scene = new THREE.Scene();
    keyboard = new THREEx.KeyboardState();
    projector = new THREE.Projector();

    initStats ();

    initLights();
    }


function init_objects () {
    initFloor();
    initServers();
    initWalls();      
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


function initServers () {
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
    renderer.setSize( windowInnerWidth, windowInnerHeight );
    document.body.appendChild( renderer.domElement );
	}


function initStats () { 
    statsContainer = document.getElementById( 'divStats' );
    stats = new Stats();
    statsContainer.appendChild( stats.domElement );
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