var col_darkBlue = 0x19195E;
var col_darkGreen = 0x193E19;
var col_lightBlue = 0X66FFFF;
var col_lightGreen = 0x00FF00;
var pointChoosen_start = "1";
var pointChoosen_end = "2";
var windowInnerHeight = window.innerHeight;
var windowInnerWidth = window.innerWidth;

var cursorPosX = windowInnerWidth/2;
var cursorPosY = windowInnerHeight/2;

function applyAccessiblePathsSelection () {
	var obj = document.getElementById( "buttonVisitEnviroment3d" );
	obj.style.display = 'block';
	}


//functions for events' listeners
	function onMouseDown_path ( event ) { //path selection
		mouse.x = ( event.clientX / windowInnerWidth ) * 2 - 1;
	  	mouse.y = - ( event.clientY / windowInnerHeight ) * 2 + 1; 
	  	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	  	projector.unprojectVector( vector, camera );
	  	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	  	var intersects = ray.intersectObjects( scene.children );
	  	if ( intersects.length > 0 ) {
	    	var objFounded = false;
	    	for ( var pcf=0; pcf<pathClickableFaces.length; pcf++ ) {
	    		if ( !objFounded && pathClickableFaces[ pcf ][ 0 ] === intersects[ 0 ].object ) {
	    			objFounded = true;
	    			if ( pathClickableFaces[ pcf ][ 2 ] == "startPoint" ) {
	    				cubePointChoosen_start.material.color.setHex( col_darkBlue );
	    				cubePointChoosen_start = pathClickableFaces[ pcf ][ 0 ];
	    				cubePointChoosen_start.material.color.setHex( col_lightBlue );
	    				pointChoosen_start = pathClickableFaces[ pcf ][ 1 ];
	    				document.getElementById( 'startPoint' ).value = pointChoosen_start;
	    			} else {
	    				cubePointChoosen_end.material.color.setHex( col_darkGreen );
	    				cubePointChoosen_end = pathClickableFaces[ pcf ][ 0 ];
	    				cubePointChoosen_end.material.color.setHex( col_lightGreen );
	    				pointChoosen_end = pathClickableFaces[ pcf ][ 1 ];
	    				document.getElementById( 'endPoint' ).value = pointChoosen_end;
	    				}
	    			}
				}
	  		}
		}


	function onMouseDown_server ( event ) { //served clicked
		//mouse.x = ( event.clientX / windowInnerWidth ) * 2 - 1;
	  	//mouse.y = - ( event.clientY / windowInnerHeight ) * 2 + 1;
	  	mouse.x = ( cursorPosX / windowInnerWidth ) * 2 - 1;
	  	mouse.y = - ( cursorPosY / windowInnerHeight ) * 2 + 1;
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


	function onMouseMove ( event ) { //mouse moved during manual navigation
		if (automaticORmanual!=0) {
			var movementX = event.movementX || 0;
			var movementY = event.movementY || 0;
			//var mouseX = ( event.clientX / windowInnerWidth ) * 2 - 1;
			//var multiplier = Math.abs( mouseX );
			//cameraEye.rotation.y -= movementX * multiplier * 0.01; //* 0.002;
			cameraEye.rotation.y -= movementX * 0.007;
			var newCursor = document.getElementById( 'newCursor' );
			cursorPosX += movementX;
			cursorPosY += movementY;
			var cursorSuppX = cursorPosX/windowInnerWidth;
			var cursorSuppY = cursorPosY/windowInnerHeight;
			if ( cursorSuppX>0.97 || cursorSuppX<0 || cursorSuppY>0.95 || cursorSuppY<0 ) {
				cursorPosX = windowInnerWidth/2;
				cursorPosY = windowInnerHeight/2;
				}
			newCursor.style.left = cursorPosX + 'px';
			newCursor.style.top = cursorPosY + 'px';
			}
		}


	function onWindowResize () {
		windowInnerHeight = window.innerHeight;
		windowInnerWidth = window.innerWidth;
	    camera.aspect = windowInnerWidth / windowInnerHeight;
	    camera.updateProjectionMatrix();
	    renderer.setSize( windowInnerWidth, windowInnerHeight );
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
	//hideUnhideObject( "pSelectGroup" );
	//hideUnhideObject( "pSelectAccessiblePaths" );
	hideUnhideObject( "startingConfigMenu" );
	hideUnhideObject( "buttonVisitEnviroment3d" );
	hideUnhideObject( "cameraType" );
	//hideUnhideObject( "buttonForNewPath" );
	}  