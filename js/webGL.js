window.onload = function() {
	//What we need to set up a THREE.JS scene
	var container;
	var scene, camera, renderer;
	var clock;
	var SCREEN_WIDTH, SCREEN_HEIGHT;

	//What we're gonna use in Three scene
	var loader = new  THREE.ColladaLoader(); 
	var dae, daeMat;
	var	spotLight;

	//The THREEx library needs to make hoverable a cube in space.
	var domEvents;
		//var that we need to create the interest points.
		var material = new THREE.MeshBasicMaterial( {color: 0x89A64B} );
		var new_material = new THREE.MeshBasicMaterial({color:0x317DFA});

	//Controls and interface.
	var stats;
	var leftPanel, description, title;

	//3D Controls
	var visitModes = {"guide": 0, "libre": 1};
	var visitMode = visitModes.guide;
	var controlModes = {"trackball": 0, "fly": 1};
	var controlMode = controlModes.trackball;
	var control;
	
	//Here is an object which got JSONObject as parameters that store all the interest points.
	var interestPoints = 
		{
		"ID00": {"x":-60, 	"y":22, 		"z":0, 		
				 "title":"This is a Cube", 				
				 "description": "Lorem Ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID01": {"x":22, 	"y":-5, 	"z":0, 		
				 "title":"This Is another Cube", 		
				 "description": "Lroem Ipusm Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID02": {"x":22, 	"y":-2, 		"z":17, 		
				 "title":"This Is a Cube, again", 		
				 "description": "Morel Ispum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID03": {"x":22, 	"y":-2, 		"z":-17, 		
				 "title":"This Is a ... Cube !", 		
				 "description": "Romel Sipum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID04": {"x":50, 	"y":-5, 	"z":0, 		
				 "title":"You know what it is", 			
				 "description": "Losum Iprem Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID05": {"x":-30, 	"y":-10, 		"z":-15, 	
				 "title":"C.U.B.E", 					
				 "description": "Lorei Upsim Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID06": {"x":-30, 	"y":-10, 	"z":15, 	
				 "title":"Another One", 					
				 "description": "Orem Lipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID07": {"x":22.5,	 	"y":70, 		"z":0, 	
				 "title":"Interesting... a CUBE !", 		
				 "description": "Ormel Pumis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."}
		};

	//Table that store the THREE.JS object interestpoints after instantiation.
	var interestPoints3D = {};
	//Variable that store the actual targetPoint -Should be static variable
	var targetInterestPoint = null;

	var visits = {
		"visit0" : [0, 1, 2, 3, 4, 5, 6, 7],
		"visit1" : [1, 3, 5, 7, 0, 2, 4, 6],
	};
	var visitState = -1;
	var currentVisit = -1;
	
	loader.options.convertUpAxis = true;
	loader.load('http://localhost/opus0a/models/cath.dae', function (model) {
		dae = model.scene;
		dae.scale.x = dae.scale.y = dae.scale.z = 3;
		dae.updateMatrix();
		dae.receiveShadow = true;
		dae.castShadow = true;
		
		init();
	}); 

	function init(){

		container = document.getElementById("webGL-container");
		clock = new THREE.Clock();

		/*creates empty scene object and renderer*/
		scene = new THREE.Scene();
		camera =  new THREE.PerspectiveCamera(45, 	window.innerWidth/window.innerHeight, .1, 500);
			camera.position.x = 45;
			camera.position.y = 0;
			camera.position.z = 0;
			camera.lookAt(scene.position);

		renderer = new THREE.WebGLRenderer({antialias:true});
					renderer.setClearColor(0x1E1E28);
					renderer.setSize(window.innerWidth, window.innerHeight);
					renderer.setPixelRatio( window.devicePixelRatio );
					renderer.domElement.style.position = 'absolute';
					renderer.shadowMap.enabled = true;
					renderer.shadowMapSoft = true;

		/*adds the dae model*/
			//daeMat = new THREE.MeshPhongMaterial ({transparent:true, blending:'alpha'});
			//dae.material = daeMat;
			dae.position.y = 30;
			dae.name = "Cathédrale";
		scene.add(dae);

		/*adds spot light with starting parameters*/
		spotLight = new THREE.SpotLight(0x1E1E28);
			spotLight.name = "Spot1";
			spotLight.castShadow = true;
			spotLight.position.x = -100; 
			spotLight.intensity = 10;        
			spotLight.distance = 373;
			spotLight.angle = 1.6;
			spotLight.exponent = 38;
			spotLight.shadow.camera.near = 0;
			spotLight.shadow.camera.far = 2635;
			spotLight.shadow.camera.fov = 68;
			spotLight.shadow.bias = 0;
		scene.add(spotLight);

		//Instantiate html elements to be modified by the hover.
		leftPanel = document.getElementById('leftPanel');

		title = document.createElement( 'h1' );
			title.className = 'interestPointTitle';
			leftPanel.appendChild( title );

		description = document.createElement( 'p' );
			description.className = 'interestPointDescription';
			leftPanel.appendChild( description );

		domEvents = new THREEx.DomEvents(camera, renderer.domElement);
			domEvents.addEventListener(dae, 'click', function(event) {
				//manageVisitProgress(1);
				//targetInterestPointIs(null);
			});

		setUpInterestPoints();

		container.appendChild( renderer.domElement );

		window.addEventListener( 'resize', onWindowResize, false );
		window.scene = scene;

		/*init controls*/
		currentVisit = 0;
		visitState = 0;
		targetInterestPoint = interestPoints3D[visits[currentVisit[0]]];
		switchControlsTo(controlModes.trackball);
		manageVisitProgress(1);
			
		/*stats*/
		stats = new Stats();        
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';     
		container.appendChild( stats.domElement );  

		animate();
	}

	function setUpInterestPoints() {

		//creating a 3D object for each parameter and override metaData to add title & description to the THREE.Mesh object.
		for (var attr in interestPoints) {
			if (interestPoints[attr].hasOwnProperty) {
				var geometry = new THREE.BoxGeometry( .5, .5, .5 );
				var mesh = new THREE.Mesh( geometry, material );
				mesh.position.x = interestPoints[attr].x;
				mesh.position.y = interestPoints[attr].y;
				mesh.position.z = interestPoints[attr].z;
				mesh.name = "interestPoint"+attr;
				mesh.metaData = 
					{
						"title": interestPoints[attr].title,
						"description": interestPoints[attr].description
					}
				scene.add(mesh);
				interestPoints3D.attr = mesh;
				console.log(interestPoints3D);

				//Event when mouseOver an interestPoint
				domEvents.addEventListener(mesh, 'mouseover', function(event) {
					event.target.material = new_material;
					title.textContent = event.target.metaData.title;
					leftPanel.style.display = 'inline';
					leftPanel.style.opacity = 1;
				});

				//Event when mouseOut an interestPoint
				domEvents.addEventListener(mesh, 'mouseout', function(event) {
					if (targetInterestPoint != null) {
						title.textContent = targetInterestPoint.metaData.title;
						description.textContent = targetInterestPoint.metaData.description;
						if (event.target != targetInterestPoint){
							event.target.material = material;
						}
					}
					else {
						event.target.material = material;
						leftPanel.style.opacity = 0;
					}

				});

				//Event when click on an interestPoint
				domEvents.addEventListener(mesh, 'click', function(event) {
					targetInterestPointIs (event.target);
				});
			}
		}
	}

	function targetInterestPointIs (targetPoint) {
		//If last interestPoint wasn't null so if we weren't in fly control
		if  (targetInterestPoint != null) {
			targetInterestPoint.geometry.scale(2/3, 2/3, 2/3);
			targetInterestPoint.material = material;
		}

		if (targetPoint != null){
			title.textContent = targetPoint.metaData.title;
			description.textContent = targetPoint.metaData.description;
			targetPoint.geometry.scale(3/2, 3/2, 3/2);
			targetPoint.material = new_material;
			switchControlsTo(controlModes.trackball)
			control.target = targetPoint.position;
			camera.lookAt(targetPoint);

		}
		else if (targetPoint == null && targetInterestPoint!= null) {
			targetInterestPoint.material = material;
			leftPanel.style.opacity = 0;
			switchControlsTo(controlModes.fly);
		}
		targetInterestPoint = targetPoint;

	}

	function manageVisitProgress (dir) {

		if (dir == -1) {
			visitState--;
		}
		else if (dir == 1) {
			visitState++;
		}
		else {
			console.log ("direction of the visit incorrect. dir needs to be 1 or -1")
			return;
		}

		var nextTargetVisitPoint = interestPoints3D[visits[currentVisit[visitState]]]
		//console.Log(nextTargetVisitPoint);
		targetInterestPointIs (nextTargetVisitPoint);
		//camera.lookAt(nextTargetVisitPoint);
	}
	
	function actualizeVisitMode() {
		alert("modeChanged");
	}

	function switchControlsTo (m) {
		switch (m) {
			case controlModes.fly :
				control = new THREE.FlyControls( camera, renderer.domElement);
				control.handleEvent( 'change', animate );
				control.movementSpeed = 2;
				control.rollSpeed = .05;
				controlMode = controlModes.fly;
				break;

			case controlModes.trackball :
				control = new THREE.TrackballControls(camera, renderer.domElement);
				control.handleEvent( 'change', animate );

				control.rotateSpeed = 1.0;
				control.zoomSpeed = 1.2;
				control.panSpeed = 0.3;

				control.noRotate = false;
				control.noZoom = false;
				control.noPan = false;

				control.staticMoving = false;
				control.dynamicDampingFactor = 0.2;

				control.minDistance = 5;
				control.maxDistance = 30;
				//control.target = targetInterestPoint.position;
				controlMode = controlModes.trackball;
				break;
		}
	}
	
	function animate () {
		if (mode = controlModes.fly) {
			var dt = clock.getDelta();
			control.update(dt);
		}

		stats.update();

		requestAnimationFrame(animate);
		renderer.render(scene,camera);
		//console.log(scene);
	}
	
	function onWindowResize( event ) {

		SCREEN_HEIGHT = window.innerHeight;
		SCREEN_WIDTH  = window.innerWidth;

		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

		camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
		camera.updateProjectionMatrix();

	}
}