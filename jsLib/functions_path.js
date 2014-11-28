var cubePointChoosen_start;
var cubePointChoosen_end; 
var pathClickableFaces = [];
var PCFsupp = [];
var pathWCPFS = {}; //pathWithControlPointsForSpline


function clonePath ( pathToClone ) {
    for ( var p in pathToClone ) {
        pathWCPFS[ p ] = {};
        pathWCPFS[ p ].adj = {};
        pathWCPFS[ p ].pos = [];
        pathWCPFS[ p ].pos[0] = pathToClone[ p ].pos[0];
        pathWCPFS[ p ].pos[1] = pathToClone[ p ].pos[1];
        pathWCPFS[ p ].pos[2] = pathToClone[ p ].pos[2];
        for ( var a in pathToClone[ p ].adj )
            pathWCPFS[ p ].adj[ a ] = pathToClone[ p ].adj[ a ];
        }
    }


function createSEPoints () {
    for ( var pointCuboid in pathSup ) {
        var cubeGeometry = new THREE.CubeGeometry( 0.5, 0.5, 0.5 );
        var cubeSMaterial = new THREE.MeshBasicMaterial( { color: col_darkBlue } ); 
        var cubeEMaterial = new THREE.MeshBasicMaterial( { color: col_darkGreen } ); 
        var cubeS = new THREE.Mesh( cubeGeometry, cubeSMaterial );
        var cubeE = new THREE.Mesh( cubeGeometry, cubeEMaterial );
        cubeS.position.set( pathSup[ pointCuboid ].pos[ 0 ]-0.25, pathSup[ pointCuboid ].pos[ 1 ], pathSup[ pointCuboid ].pos[ 2 ] );
        cubeE.position.set( pathSup[ pointCuboid ].pos[ 0 ]+0.25, pathSup[ pointCuboid ].pos[ 1 ], pathSup[ pointCuboid ].pos[ 2 ] );
        scene.add( cubeS );
        scene.add( cubeE );
        SCFsupp = [ cubeS, pointCuboid, "startPoint" ];
        pathClickableFaces.push( SCFsupp ) ;
        SCFsupp = [ cubeE, pointCuboid, "endPoint" ];
        pathClickableFaces.push( SCFsupp ) ;
        }
    cubePointChoosen_start = pathClickableFaces[ 0 ][ 0 ];
    cubePointChoosen_end = pathClickableFaces[ 1 ][ 0 ];    
    }


function getNewPath () {
    scene.remove( pathControls.animationParent );
    pathControls.waypoints = [];
    getPathAndRun ();
    render();
    }


function getPathAndRun () {
    clonePath( path ); // need to clone the obj, otherwise pathWCPFS will reference path
    // smooth the curve over this many points
    var smothing = 400;
    var splinePath = new THREE.SplineCurve3( getPointsFromGraph() );
    controls.points = splinePath.getPoints( smothing );
    pathControlsRun();
    scene.add( pathControls.animationParent );   
    pathControls.animation.play( false, 0 ); //true-> infinite animation - false -> stops at the end
    }


function getPointsFromGraph () {
    var g = new Graph( path );
    var startPoint = GET[ "startPoint" ] || "1";
    var endPoint = GET[ "endPoint" ] || "2";
    var min_path = g.findShortestPath( startPoint, endPoint );
    var points = [];
    minPath_Lenght = 0;
    for ( var i=0; i<min_path.length; i++ ) {
        points.push( new THREE.Vector3( pathWCPFS[min_path[i]].pos[0], pathWCPFS[min_path[i]].pos[1], pathWCPFS[min_path[i]].pos[2] ) );
        if ( (i+1)<min_path.length )
            minPath_Lenght += pathWCPFS[ min_path[i] ].adj[ min_path[i+1] ];
        }
    return points;
    }


function insertSplineControlPoints ( choosenPath ) {
    var choosenPathLength = Object.keys(choosenPath).length + 1;    
    for ( var pString in choosenPath ) {
        var numAdj = 0;
        var pInt = parseInt( pString );
        for ( var a in choosenPath[ pString ].adj ) {
            numAdj ++;
            aInt = parseInt( a );
            if ( aInt>pInt ) {
                // new controls points 
                var newControlPoint1 = (500 + pInt*20 + numAdj*2).toString();
                var newControlPoint2 = (500 + pInt*20 + numAdj*2 + 1).toString();
                pathWCPFS[ newControlPoint1 ] = {};
                pathWCPFS[ newControlPoint1 ].adj = {};
                pathWCPFS[ newControlPoint1 ].adj[ pString ] = 0.25;
                pathWCPFS[ newControlPoint1 ].adj[ newControlPoint2 ] = choosenPath[ pString ].adj[ a ] - 0.5;
                pathWCPFS[ newControlPoint2 ] = {};
                pathWCPFS[ newControlPoint2 ].adj = {};
                pathWCPFS[ newControlPoint2 ].adj[ a ] = 0.25;
                pathWCPFS[ newControlPoint2 ].adj[ newControlPoint1 ] = choosenPath[ pString ].adj[ a ] - 0.5;
                // position of the new point
                pathWCPFS[ newControlPoint1 ].pos = [];
                pathWCPFS[ newControlPoint1 ].pos[0] = choosenPath[ pString ].pos[0];
                pathWCPFS[ newControlPoint1 ].pos[1] = choosenPath[ pString ].pos[1];
                pathWCPFS[ newControlPoint1 ].pos[2] = choosenPath[ pString ].pos[2];
                pathWCPFS[ newControlPoint2 ].pos = [];
                pathWCPFS[ newControlPoint2 ].pos[0] = choosenPath[ a ].pos[0];
                pathWCPFS[ newControlPoint2 ].pos[1] = choosenPath[ a ].pos[1];
                pathWCPFS[ newControlPoint2 ].pos[2] = choosenPath[ a ].pos[2];
                if ( choosenPath[ pString ].pos[0] > choosenPath[ a ].pos[0] ) {
                    pathWCPFS[ newControlPoint1 ].pos[0] = pathWCPFS[ newControlPoint1 ].pos[0] - 0.25;
                    pathWCPFS[ newControlPoint2 ].pos[0] = pathWCPFS[ newControlPoint2 ].pos[0] + 0.25;
                    }
                if ( choosenPath[ pString ].pos[0] < choosenPath[ a ].pos[0] ) {
                    pathWCPFS[ newControlPoint1 ].pos[0] = pathWCPFS[ newControlPoint1 ].pos[0] + 0.25;
                    pathWCPFS[ newControlPoint2 ].pos[0] = pathWCPFS[ newControlPoint2 ].pos[0] - 0.25;
                    }
                if ( choosenPath[ pString ].pos[2] > choosenPath[ a ].pos[2] ) {
                    pathWCPFS[ newControlPoint1 ].pos[2] = pathWCPFS[ newControlPoint1 ].pos[2] - 0.25;
                    pathWCPFS[ newControlPoint2 ].pos[2] = pathWCPFS[ newControlPoint2 ].pos[2] + 0.25;
                    }
                if ( choosenPath[ pString ].pos[2] < choosenPath[ a ].pos[2] ) {
                    pathWCPFS[ newControlPoint1 ].pos[2] = pathWCPFS[ newControlPoint1 ].pos[2] + 0.25;
                    pathWCPFS[ newControlPoint2 ].pos[2] = pathWCPFS[ newControlPoint2 ].pos[2] - 0.25;
                    }
                // edit the p point adding the newControlPoint1 to his adj and remove the a point from his adj
                pathWCPFS[ pString ].adj[ newControlPoint1 ] = 0.25;
                delete pathWCPFS[ pString ].adj[ a ];
                // edit the a point adding the newControlPoint2 to his adj and remove the p point from his adj
                pathWCPFS[ a ].adj[ newControlPoint2 ] = 0.25;
                delete pathWCPFS[ a ].adj[ pString ];
                }
            }
        }
    }