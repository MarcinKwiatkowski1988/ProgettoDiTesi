var windowInnerWidth = window.innerWidth*4/5;

function applyAccessiblePathsSelection () {
	var obj = document.getElementById( "buttonVisitEnviroment3d" );
	obj.style.display = 'block';
	}


//functions for events' listeners
	function onDocumentMouseDown( event ) { //served clicked
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1; 
	  	// find intersections - create a Ray with origin at the mouse position and direction into the scene (camera direction)
	  	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	  	projector.unprojectVector( vector, camera );
	  	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	  	var intersects = ray.intersectObjects( scene.children );
	  	if ( intersects.length > 0 ) {
	    	var objFounded = false;
	    	for ( var scf=0; scf<serversClickableFaces.length; scf++ ) {
	      		var objFaceNum = serversClickableFaces[ scf ][ 1 ];
	      		if ( !objFounded && serversClickableFaces[ scf ][ 0 ] === intersects[ 0 ].object && intersects[ 0 ].object.geometry.faces[ objFaceNum ]==intersects[ 0 ].face ) {
	        		objFounded = true;
	        		window.open( serversClickableFaces[ scf ][ 2 ] );  
	      			}
	    		}
	  		}
		}  


	function onWindowResize () {
	    camera.aspect = windowInnerWidth / window.innerHeight;
	    camera.updateProjectionMatrix();
	    renderer.setSize( windowInnerWidth, window.innerHeight );
		}


//end functions for events' listeners


function getParamsFromHttpAddress ( graphToStore ) {
    var queryString = window.location.search.replace(/^\?/, '');
    queryString.split( /\&/ ).forEach( function( keyValuePair ) {
        var paramName = keyValuePair.replace( /=.*$/, "" );
        var paramValue = keyValuePair.replace( /^[^=]*\=/, "" );
        graphToStore[ paramName ] = paramValue;
       	} ); 
   	}


function hideUnhideObject ( id ) {
	var obj = document.getElementById( id );
	if ( obj.style.display == 'block' ) 
    	obj.style.display = 'none';
	else
    	obj.style.display = 'block';
	}


function showEnvironment3D () {
	getPathAndRun ();
	animate ();
	hideUnhideObject( "pSelectGroup" );
	hideUnhideObject( "pSelectAccessiblePaths" );
	hideUnhideObject( "startingConfigMenu" );
	hideUnhideObject( "buttonVisitEnviroment3d" );
	hideUnhideObject( "cameraType" );
	hideUnhideObject( "buttonForNewPath" );
	}  