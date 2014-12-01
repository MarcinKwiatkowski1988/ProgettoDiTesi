var automaticORmanual;
var cameraEye;
var controls;
var divWithInfo;
var unlockWMovement; 
var unlockSMovement; 
var unlockAMovement; 
var unlockDMovement;


function init1 () {
    init_base();

    getParamsFromHttpAddress ( GET ); 
    path = pathsMap_stringToObj[ GET[ "pathsSelection" ] ];
    automaticORmanual = 0; //0->automatic; 1->manual

    initCameraAutomatic();
    initCameraEye();  
    initDivWithConfig ();
    initRenderer();
    initCeiling();
    init_objects();
    loadingUpdate();
    initLamps();

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
    divWithInfo.id = 'divWithInfo';
	divWithInfo.class = 'divWithInfo';
    divWithInfo.style.display = "block";
    divWithInfo.style.background = '#FFFFFF';
    divWithInfo.style.fontSize = '150%';
    divWithInfo.style.position = 'absolute';
    divWithInfo.style.left = '20%';
    divWithInfo.style.top = '5px';
    divWithInfo.style.width = '70%';
    //divWithInfo.style.textAlign = 'center';
    divWithInfo.innerHTML = '<p>Il percorso che hai selezionato (' + GET.pathsSelection + ') va dal punto ' + GET.startPoint + ' a ' + GET.endPoint + '.</p></br></br>';
    divWithInfo.innerHTML += 'Prima di iniziare la visita &eacute consigliabile leggere i consigli riportati qui sotto su come muoversi ';
    divWithInfo.innerHTML += 'all\'interno del modello: </br> - Durante la navigazione automatica puoi usare il mouse per guardare anche ai lati';
    divWithInfo.innerHTML += '</br> - Durante la navigazione manuale, il sito richieder&agrave automaticamente di bloccare il cursore del tuo mouse; ';
    divWithInfo.innerHTML += '&eacute possibile sbloccarlo premendo il tasto ESC o riattiavarne il suo blocco premendo il tasto "m"; per muoversi ';
    divWithInfo.innerHTML += 'all\'interno del modello usa invece i seguenti tasti: "w" (per muoversi in avanti), "a" (per muoversi in laterale ';
    divWithInfo.innerHTML += 'verso sinistra), "d" (per muoversi in laterale verso destra), "s" (per andare indietro). Per ruotare invece si pu&ograve ';
    divWithInfo.innerHTML += 'usare il movimento del mouse (come si usa solitamente nei giochi) o usare i tasti "q" o "e", per chi fosse provvisto ';
    divWithInfo.innerHTML += 'solo di tastiera. Cliccando con il puntatore su un server, sulla faccia mostrante un QrCode ver&aacute aperta una nuova ';
    divWithInfo.innerHTML += 'finestra riguardante il link del QrCode stesso.';
    divWithInfo.innerHTML += '</br></br>';
    divWithInfo.innerHTML += 'Modello caricato al:<span id="modelLoading">0</span></br>';
    divWithInfo.innerHTML += '<center><input id="buttonVisitEnviroment3d" type="button" style="display: none;"' + 
        'onclick="showEnvironment3D()" value="Inizia la visita"/></center>';
    document.body.appendChild( divWithInfo );
    divCameraType = document.createElement('div');
    divCameraType.style.position = 'absolute';
    divCameraType.style.left = '48%';
    divCameraType.style.top = '5px';
    divCameraType.innerHTML = '<input id="cameraType" type="button" style="display: none;" ' + 'onclick="changeCameraType()" value="Switch to manual camera"/>';
    document.body.appendChild( divCameraType );
	}


function initLamp ( j ) {
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load( 'models/lamp.dae', function ( collada ) {   
        var lampInfo = lights[ lights.info.lightsList[ j ] ];
        var lamp = collada.scene.children[ 0 ];
        lamp.name = "lamp";
        lamp.material.needsUpdate = true;
        lamp.material.wireframe = false;
        lamp.rotation.x = Math.PI/2;
        lamp.position.set( lampInfo.pos[ 0 ], 2.15, lampInfo.pos[ 2 ] );
        lamp.scale.set( 0.01, 0.01, 0.005 );
        scene.add( lamp ); 
        loading += 6;
        loadingUpdate ();
        } );
    } 


function initLamps () {
    for ( var i=0; i<lights.info.numLights; i++ )
        initLamp ( i );
    }  


function initUnlockMovements () {
    unlockWMovement = true;
    unlockSMovement = true;
    unlockAMovement = true;
    unlockDMovement = true;
    }   


function loadingUpdate () {
    var loadingValue = parseInt ( ( loading / loadingTotObjs ) * 100 ); 
    document.getElementById( 'modelLoading' ).innerHTML = ' ' + loadingValue + '%';
    if ( loadingValue == 100 )
        hideUnhideObject( 'buttonVisitEnviroment3d' );
    }   