document.addEventListener("DOMContentLoaded", function(event){
	
/********************************************************************************/
/*		Declaring Variables					*/
/********************************************************************************/
	
	//HTML and CSS stuff
	
	var body = document.body;
	
	var basicInterface = document.getElementsByClassName("basicInterface");
	var accueil = document.getElementsByClassName("accueil");
	var interface3D = document.getElementsByClassName("interface3D");
	
	var logo = document.getElementById('logo');	
	
	var infosDeployButton = document.getElementById( 'infosDeploy' );
	var projetButton = document.getElementById( 'projet' );
	var equipeButton = document.getElementById('equipe');
	var partenaireButton = document.getElementById('partenaires');
	
	var fullScreenButton = document.getElementById('fullScreen');
	var muteButton = document.getElementById('mute');
	var audio = new Audio('./data/sound/cathSound.mp3');
	var mute = false;
	var visitButton = document.getElementById('visitModeControl');
	var planButton = document.getElementById('planControls');
	var plan = document.getElementById('plan');
	
	var path = document.getElementById('visit');
	var length = path.getTotalLength();
	
	var startButton = document.getElementById('startButton');
	var watchTheTrailer = document.getElementById('watchTheTrailer');
	var title = document.getElementById('title');
	var projetInfos = document.getElementById('projetInfos');
	var equipeInfos = document.getElementById('equipeInfos');
	var partenaireInfos = document.getElementById('partenairesInfos');
	var background = document.getElementById('background');
	
	var trailer = document.getElementById("trailer");
	var vid = document.getElementById("trailerVid");
	var skipTrailer = document.getElementById ('skipTrailer');
	
	var stats;
	var leftPanel, description, title;
	
	//THREEJS
	var container = document.getElementById("webGL-container");
	var scene, camera, renderer;
	var clock = new THREE.Clock();
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

	//3D Controls
	var controlModes = {"trackball": 0, "fly": 1};
	var controlMode = controlModes.trackball;
	var control;
	
	var visitModes = {"guide": 0, "libre": 1};
	var visitMode = visitModes.guide;
	
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
	//Variable that store the actual targetPoint - Should be a static variable
	var targetInterestPoint = null;

	var visits = {
		"visit0" : [0, 1, 2, 3, 4, 5, 6, 7],
		"visit1" : [1, 3, 5, 7, 0, 2, 4, 6],
	};
	var visitState = -1;
	var currentVisit = -1;
	
	
	//Start by loading the 3D model and launch Init()
	loader.options.convertUpAxis = true;
	loader.load('http://localhost/opus0a/models/cath.dae', function (model) {
		dae = model.scene;
		dae.scale.x = dae.scale.y = dae.scale.z = 3;
		dae.updateMatrix();
		dae.receiveShadow = true;
		dae.castShadow = true;
		
		init();
	}); 
	
	function init() {
		
		/********************************************************************************/
		/*		Adding Events to the HTML elements				*/
		/********************************************************************************/
		
		infosDeployButton.addEventListener( 'click', function ( event ) {
			navigateBetweenPage(0);
		}, false );
		
		projetButton.addEventListener( 'click', function ( event ) {
			navigateBetweenPage(1);
		}, false );
		
		equipeButton.addEventListener('click', function(event){
			navigateBetweenPage(2);
		}, false)
		
		partenaireButton.addEventListener('click', function(event){
			navigateBetweenPage(3);
		}, false)
		
		fullScreenButton.addEventListener('click', function(event){
			requestFullScreen(body);
		}, false)
			
		muteButton.addEventListener('click', function(event){
			manageSound();
		}, false)
		
		startButton.addEventListener('click', function(event){
			startVisit();
		}, false)
		
		logo.addEventListener('mouseover', function(event){
			showPlan();
		}, false)
		
		
		logo.addEventListener('mouseout', function(event){
			unShowPlan();
		}, false)
		
		vid.addEventListener("ended", function(event) {
			manageTrailer(0);
		});
		
		skipTrailer.addEventListener("click", function(event) {
			manageTrailer(0);
		});
		
		watchTheTrailer.addEventListener("click", function(event) {
			manageTrailer(1);
		});
		
		planButton.addEventListener("click", function(event) {
			showPlan();
		});
		planButton.addEventListener("mouseover", function(event) {
			draw();
		});
		visitButton.addEventListener("click", function(event) {
			alert("click");
			
		});
		
		/********************************************************************************/
		/*		Building the THREE.js Scene				*/
		/********************************************************************************/

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
		
		/*Instantiate html elements to be modified by the hover*/
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
	
	function navigateBetweenPage (pageToMoveTo) {
		if (pageToMoveTo == 0) {
			projetInfos.style.opacity = 0;
			equipeInfos.style.opacity = 0;
			partenaireInfos.style.opacity = 0;
			title.style.opacity = 1;
		}
		if (pageToMoveTo == 1) {
			projetInfos.style.opacity = 1;
			equipeInfos.style.opacity = 0;
			partenaireInfos.style.opacity = 0;
			title.style.opacity = 0;
		}
		if (pageToMoveTo == 2) {
			projetInfos.style.opacity = 0;
			equipeInfos.style.opacity = 1;
			partenaireInfos.style.opacity = 0;
			title.style.opacity = 0;
		}
		if (pageToMoveTo == 3) {
			projetInfos.style.opacity = 0;
			equipeInfos.style.opacity = 0;
			partenaireInfos.style.opacity = 1;
			title.style.opacity = 0;
		}
		
	}
	
	function startVisit() {
		background.style.display = 'none';
		trailer.style.display = 'none';
		for (i = 0; i < accueil.length; i++) {
			accueil[i].style.display = 'none';
			accueil[i].style.opacity = 0;
		}
	}
	
	function showPlan () {
		if (plan.style.display == 'inline'){
			plan.style.display = 'none'
		}
		else {
			plan.style.display = 'inline'
		}
	}
	
	function draw() {
		// Clear any previous transition
		path.style.transition = path.style.WebkitTransition = 'none';
		
		// Set up the starting positions
		path.style.strokeDasharray = length + ' ' + length;
		path.style.strokeDashoffset = length;
		
		// Trigger a layout so styles are calculated & the browser
		// picks up the starting position before animating
		path.getBoundingClientRect();
		// Define our transition
		path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 10s ease-in-out';
		
		// Go!
		path.style.strokeDashoffset = '0';
	}
	
	function manageTrailer(toDo) {
		if (toDo == 0) {
			vid.pause();
			audio.play();
			background.style.opacity = 0.9;
			trailer.style.opacity = 0;
			for (i = 0; i < accueil.length; i++) {
				accueil[i].style.display = 'inline';
				accueil[i].style.opacity = 1;
			}
			for (i = 0; i < basicInterface.length; i++) {
				basicInterface[i].style.display = 'inline';
				basicInterface[i].style.opacity = 1;
			}
			startButton.style.opacity = 0.3;
			watchTheTrailer.style.opacity = 0.3;
			projetInfos.style.opacity = 0;
			partenairesInfos.style.opacity = 0;
			equipeInfos.style.opacity = 0;
			planButton.style.opacity = 0.3;
			title.opacity=1;
		}
		if (toDo == 1) {
			audio.pause();
			background.style.opacity = 1;
			trailer.style.opacity = 1;
			for (i = 0; i < accueil.length; i++) {
				accueil[i].style.display = 'none';
				accueil[i].style.opacity = 0;
			}
			for (i = 0; i < basicInterface.length; i++) {
				basicInterface[i].style.display = 'none';
				basicInterface[i].style.opacity = 0;
			}
			startButton.style.opacity = 0;
			watchTheTrailer.style.opacity = 0;
			projetInfos.style.opacity = 0;
			partenairesInfos.style.opacity = 0;
			equipeInfos.style.opacity = 0;
			planButton.style.opacity = 0;
			title.opacity=0;
		}
		
	}
	
	function manageSound() {
		if (mute) {
			audio.play();
			mute = false;
		}
		else {
			audio.pause();
			mute = true;
		}
	}
	
	function requestFullScreen(element) {
		// Supports most browsers and their versions.
		var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

		if (requestMethod) { // Native full screen.
			requestMethod.call(element);
		} 
		else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript !== null) {
				wscript.SendKeys("{F11}");
			}
		}
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
	
});
