window.onload = function() {
	
/********************************************************************************/
/*		Declaring Variables					*/
/********************************************************************************/
	
	//HTML and CSS stuff
	
	var body = document.body;
	
	var trailer = document.getElementById("trailer");
	var vid = document.getElementById("trailerVid");
	var skipTrailer = document.getElementById ('skipTrailer');
	
	var logo = document.getElementById('logo');	
	var fullScreenButton = document.getElementById('fullScreen');
	var fullScreen = false;
	var muteButton = document.getElementById('mute');
	var audio = new Audio('../data/sound/cathSound.mp3');
	var mute = false;
	
	var openningInterface = document.getElementsByClassName("openningInterface");
	
	var infosMenu = document.getElementById('infosMenu');
	var infosDeployButton = document.getElementById( 'infosDeploy' );
	var projetButton = document.getElementById( 'projet' );
	var equipeButton = document.getElementById('equipe');
	var partenaireButton = document.getElementById('partenaires');
	var startButton = document.getElementById('startButton');
	var watchTheTrailer = document.getElementById('watchTheTrailer');
	var title = document.getElementById('title');
	var projetInfos = document.getElementById('projetInfos');
	var equipeInfos = document.getElementById('equipeInfos');
	var partenaireInfos = document.getElementById('partenairesInfos');
	var hoverPartNameContainer = document.getElementById('hoverPartNameContainer')
	var hoverScrollZones = document.getElementById('hoverScrollZones');
	var projetHoverScrollUp = document.getElementById('projetHoverScrollUp');
	var projetHoverScrollDown = document.getElementById('projetHoverScrollDown');
	var projetHoverScrollRight = document.getElementById('projetHoverScrollRight');
	var projetHoverScrollLeft = document.getElementById('projetHoverScrollLeft');
	
	var interface3D = document.getElementsByClassName("interface3D");
	
	var visitButton = document.getElementById('visitModeControl');
	var visitModeIndicator = document.getElementById('visitModeIndicator');
	var wheelButton = document.getElementById('wheelControl');
	var wheel = document.getElementById('radialSliderContainer');
	var wheelMode = false;
	var leftPanel = document.getElementById('leftPanel');
	
	var background = document.getElementById('background');
	
	var stats = null;
	
	//THREEJS
	var container = document.getElementById("webGL-container");
	var scene, camera, renderer;
	var clock = new THREE.Clock();
	var loader = new  THREE.ColladaLoader();
	var domEvents;
	var SCREEN_WIDTH, SCREEN_HEIGHT;

	var sceneVisit;
	var sceneSteps;
	
	//What we're gonna use in Three scene
	var cathModel;
	var cathModelStep;
	//Table that store the THREE.JS object interestpoints after instantiation.
	var interestPoints3D = [];
	//Variable that store the actual targetPoint - Should be a static variable
	var targetInterestPoint = null;

	//3D Controls
	var controlModes = {"trackball": 0, "fly": 1};
	var controlMode = controlModes.fly;
	var control;
	
	//Here is an object which got JSONObject as parameters that store all the interest points.
	var interestPoints;
	var interestPointsJSON = loadJSON("./data/interestPoints.json", function (response) {interestPoints = JSON.parse(response);});
	
	var interestPointMat = new THREE.MeshBasicMaterial( {color: 0x89A64B} );
		interestPointMat.transparent = true;
		interestPointMat.opacity = 0.3;
		interestPointMat.blending = THREE.AdditiveBlending;
	var interestPointMatHover = new THREE.MeshBasicMaterial({color:0x317DFA});
		interestPointMatHover.transparent = true;
		interestPointMatHover.opacity = 0.7;
		interestPointMatHover.blending = THREE.AdditiveBlending;
	
	//Visits
	var visitModes = {"guide": 0, "free": 1};
	var visitMode = visitModes.guide;
	var visitSpeed = .01;

	var visits = [
			[0, 1, 2, 0, 3, 4, 5, 7, 0, 5, 4, 6, 7, 2, 0, 1, 3],
			[1, 3, 5, 7, 0, 2, 4, 6],
	];
	
	var currentVisit = visits[0];;
	var visitState = 0;
	var visitStatePos =  new THREE.Vector3(45, 0, 0);

	var visitTween = new TWEEN.Tween(0,0,0);
	
	var interestDates;
	var interestDatesJSON = loadJSON("./data/interestDates.json", function (response) {interestDates = JSON.parse(response);});
	
	var parts = [];
	var partsName = ["Fondations", "Transept Sud", "Croisée du transept", "Nef", "Porche", "Tour Nord", "Choeur", "Tour Sud", "Transept Nord", "Collatéral Nord", "Collateral Sud", "Abside", "Déambulatoire", "Absidiole", "Chapelle Absidiale", "Toît", "Flêche"];
	
	//Start by loading the two 3D models and launch Init()
	loader.options.convertUpAxis = true;
	loader.load ('./models/cath.dae', function (model) {
		cathModel = model.scene;
		
		cathModel.updateMatrix();
		cathModel.receiveShadow = true;
		cathModel.castShadow = true;
		
		loader.load('./models/cathStepbyStep.dae', function (model) {
			cathModelStep = model.scene;

			cathModelStep.updateMatrix();
			cathModelStep.receiveShadow = true;
			cathModelStep.castShadow = true;
			Setup();
		}); 
	}); 
	
	
	function Setup() {

		addEventsToHTMLElements();
		setUpThreeJSBasics();
		createMyScenes();
		setUpRadialSlider();
		
		switchControlsTo(controlModes.fly);
		
		//stats();
		Update();
		
	}
	
	function Update () {
		//console.log(camera.position);
		if (mode = controlModes.fly) {
			var dt = clock.getDelta();
			control.update(dt);
		}
		/*camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 0;*/
		if (stats != null )
			stats.update();
		TWEEN.update();
		
		requestAnimationFrame(Update);
		renderer.render(scene,camera);
	}
	
	/********************************************************************************/
	/*		HTML Display Function & Media Controls			*/
	/********************************************************************************/
	
	function addEventsToHTMLElements() {
		
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
			manageFullScreen(body);
		}, false)
			
		muteButton.addEventListener('click', function(event){
			manageSound();
		}, false)
		
		startButton.addEventListener('click', function(event){
			startVisit();
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
		
		visitModeIndicator.textContent = 'Visite guidée';
		visitButton.addEventListener("click", function(event) {
			manageVisitMode ();
		});
		
		wheelButton.addEventListener("click", function(event) {
			manageWheel();
		});
		
		var count;
		
		projetHoverScrollUp.addEventListener('mouseover', function() {
        	var div = document.getElementById("projetToBeScroll");

			interval = setInterval(function(){
				count = count || 1;
				var pos = div.scrollTop;
				div.scrollTop = pos - count;
			}, 10);
		});
		
		projetHoverScrollUp.addEventListener('mouseout', function() {

				clearInterval(interval);
		});
		
		projetHoverScrollDown.addEventListener('mouseover', function() {
        	var div = document.getElementById("projetToBeScroll");
			interval = setInterval(function(){
				count = count || 1;
				var pos = div.scrollTop;
				div.scrollTop = pos + count;
			}, 10);
		});
		
		projetHoverScrollDown.addEventListener('mouseout', function() {
				// Uncomment this line if you want to reset the speed on out
				// count = 0;
				clearInterval(interval);
		});
		
		projetHoverScrollLeft.addEventListener('mouseover', function() {
        	var div = document.getElementById("partenairesToBeScroll");
			interval = setInterval(function(){
				count = count || 1;
				var pos = div.scrollLeft;
				div.scrollLeft = pos - count;
			}, 5);
		});
		
		projetHoverScrollLeft.addEventListener('mouseout', function() {
				// Uncomment this line if you want to reset the speed on out
				// count = 0;
				clearInterval(interval);
		});
		projetHoverScrollRight.addEventListener('mouseover', function() {
        	var div = document.getElementById("partenairesToBeScroll");
			interval = setInterval(function(){
				count = count || 1;
				var pos = div.scrollLeft;
				div.scrollLeft = pos + count;
			}, 5);
		});
		
		projetHoverScrollRight.addEventListener('mouseout', function() {
				// Uncomment this line if you want to reset the speed on out
				// count = 0;
				clearInterval(interval);
		});
	}
	
	function navigateBetweenPage (pageToMoveTo) {
		switch (pageToMoveTo) {
			case 0 : {
				projetInfos.style.opacity = 0;
				projetInfos.style.display = 'none';
				equipeInfos.style.opacity = 0;
				equipeInfos.style.display = 'none';
				partenaireInfos.style.opacity = 0;
				partenaireInfos.style.display = 'none';
				title.style.opacity = 1;
				title.style.display = 'inline';
				hoverScrollZones.style.display = 'none';
				break;
			}
			case 1 : {
				projetInfos.style.opacity = 1;
				projetInfos.style.display = 'inline';
				equipeInfos.style.opacity = 0;
				equipeInfos.style.display = 'none';
				partenaireInfos.style.opacity = 0;
				partenaireInfos.style.display = 'none';
				title.style.opacity = 0;
				title.style.display = 'none';
				hoverScrollZones.style.display = 'inline';
				break;
			}
			case 2 : {
				projetInfos.style.opacity = 0;
				projetInfos.style.display = 'none';
				equipeInfos.style.opacity = 1;
				equipeInfos.style.display = 'inline';
				partenaireInfos.style.opacity = 0;
				partenaireInfos.style.display = 'none';
				title.style.opacity = 0;
				title.style.display = 'none';
				hoverScrollZones.style.display = 'none';
				break;
			}
			case 3 : {
				projetInfos.style.opacity = 0;
				projetInfos.style.display = 'none';
				equipeInfos.style.opacity = 0;
				equipeInfos.style.display = 'none';
				partenaireInfos.style.opacity = 1;
				partenaireInfos.style.display = 'inline';
				title.style.opacity = 0;
				title.style.display = 'none';
				hoverScrollZones.style.display = 'inline';
				break;
			}
		}
		
	}
	
	function startVisit() {
		background.style.display = 'none';
		trailer.style.display = 'none';
		hoverScrollZones.style.display = 'none';
		for (i = 0 ; i < openningInterface.length ; i++) {
			openningInterface[i].style.display = 'none';
			openningInterface[i].style.opacity = 0;
		}
		for (i=0 ; i < interface3D.length ; i ++) {
			interface3D[i].style.display = 'inline';
			interface3D[i].style.opacity = 1;
		}
	}
	
	function manageSound() {
		switch (mute) {
			case true :
				audio.play();
				mute = false;
				break;
			case false :
				audio.pause();
				mute = true;
				break;
			default :
				console.warn ("mute should be true or false");
		}
	}
	
	function manageFullScreen(element) {
		var requestMethod;
		switch (fullScreen) {
			case false :
				requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
				fullScreen = true;
				break;
			case true :
				requestMethod = element.exitFullScreen || element.webkitExitFullscreen || element.mozCancelFullScreen || element.msExitFullScreen;
				fullScreen = false;
				break;
			default :
				console.warn ("fullScreen should be true or false");
		}
		
		if (requestMethod) { // Native full screen.
			if (fullScreen) {
				requestMethod.call(element);
			}
			else {
				requestMethod.call(element);
			}
		} 
		else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript !== null) {
				wscript.SendKeys("{F11}");
			}
		}
		// Supports most browsers and their versions.
			
	}
	
	function manageTrailer(toDo) {
		switch (toDo) {
			case 0 :
				vid.pause();
				audio.play();
				background.style.opacity = 0.9;
				trailer.style.opacity = 0;
				for (i = 0; i < openningInterface.length; i++) {
					openningInterface[i].style.display = 'inline';
					openningInterface[i].style.opacity = 1;
				}
				for (i = 0; i < openningInterface.length; i++) {
					openningInterface[i].style.display = 'inline';
					openningInterface[i].style.opacity = 1;
				}
				startButton.style.opacity = 0.3;
				watchTheTrailer.style.opacity = 0.3;
				projetInfos.style.opacity = 0;
				partenairesInfos.style.opacity = 0;
				equipeInfos.style.opacity = 0;
				projetInfos.style.display = "inline";
				title.opacity=1;
				break;
			case 1 :
				vid.currentTime = 0;
				vid.play();
				audio.pause();
				background.style.opacity = 1;
				trailer.style.opacity = 1;
				for (i = 0; i < openningInterface.length; i++) {
					openningInterface[i].style.display = 'none';
					openningInterface[i].style.opacity = 0;
				}
				for (i = 0; i < openningInterface.length; i++) {
					openningInterface[i].style.display = 'none';
					openningInterface[i].style.opacity = 0;
				}
				startButton.style.opacity = 0;
				watchTheTrailer.style.opacity = 0;
				projetInfos.style.opacity = 0;
				partenairesInfos.style.opacity = 0;
				equipeInfos.style.opacity = 0;
				title.opacity=0;
				projetInfos.style.display = "none";
				break;
			default :
				console.warn ("The function manageTrailer() takes 1 argument : 0 : stop, 1 : play");
		}
		
	}
	
	function onWindowResize( event ) {

		SCREEN_HEIGHT = window.innerHeight;
		SCREEN_WIDTH  = window.innerWidth;

		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

		camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
		camera.updateProjectionMatrix();

	}
	
	/********************************************************************************/
	/*		3D Stuff				*/
	/********************************************************************************/
	
	function setUpThreeJSBasics () {
		scene = new THREE.Scene();
		//scene.fog = new THREE.FogExp2( 0x1E1E28, 0.001);
		
		buddy = new THREE.Group();
			buddy.position.x = 0;
			buddy.position.y = 0;
			buddy.position.z = 0;
			buddy.rotation.y = Math.PI/2; 
			buddy.name = "buddy";
		
		camera =  new THREE.PerspectiveCamera(45, 	window.innerWidth/window.innerHeight, .1, 500);
			camera.position.x = 45;
			camera.position.y = 0;
			camera.position.z = 0;
			camera.lookAt(scene.position);
		
		scene.add(camera);
		scene.add(buddy);

		renderer = new THREE.WebGLRenderer({antialias:true});
			renderer.setClearColor(0x1E1E28);
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.domElement.style.position = 'absolute';
			renderer.shadowMap.enabled = true;
			// to antialias the shadow
			renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			renderer.shadowMapSoft = true;
		
		domEvents = new THREEx.DomEvents(camera, renderer.domElement);
		
		window.addEventListener( 'resize', onWindowResize, false );
		window.scene = scene;
		
		var ambientLight = new THREE.AmbientLight(0x1E1E28);
		ambientLight.castShadow = false;
		ambientLight.intensity = 0.5;
		scene.add(ambientLight);
		
		container.appendChild( renderer.domElement );
	}
	
	function createMyScenes () {
		
		sceneVisit = new THREE.Group();
		sceneSteps = new THREE.Group();
		
		/********************************************************************************/
		/*		SCENE VISIT				*/
		/********************************************************************************/
		
		var planeGeometry = new THREE.PlaneGeometry( 1000, 1000 );
		planeGeometry.receiveShadow = true;
		planeGeometry.castShadow = false;
		
		var planeMaterial	= new THREE.MeshPhongMaterial({
		color		: 0xFFFFFF,
		shading		: THREE.SmoothShading
		});
		
		var floor1 = new THREE.Mesh( planeGeometry, planeMaterial );
		floor1.name = "Floor1";
		floor1.receiveShadow = true;
		floor1.castShadow = false;
		floor1.rotation.x = 3 * Math.PI/2;
		floor1.position.y = -15;
		//scene.add(floor);
		sceneVisit.add(floor1);
		
		var cathMat = new THREE.MeshLambertMaterial({
		color		: 0xFFFFFF,
		shading		: THREE.SmoothShading});
		cathMat.transparent = true;
		cathMat.blending = THREE.AdditiveBlending;
		
		/*adds the cathModel model*/
		cathModel.traverse( function(node) {
			if (node instanceof THREE.Mesh) {
				node.material = cathMat;
			}
		});
		cathModel.position.y = 30;
		cathModel.scale.x = cathModel.scale.y = cathModel.scale.z = 3;
		cathModel.name = "Cathedrale";
		//scene.add(cathModel);
		sceneVisit.add(cathModel);

		/*adds spotlight with starting parameters*/
		spotLight1 = new THREE.SpotLight(0x1E1E28);
			spotLight1.name = "Spot1";
			spotLight1.castShadow = true;
			spotLight1.position.x = -100; 
			spotLight1.intensity = 10;        
			spotLight1.distance = 373;
			spotLight1.angle = 1.6;
			spotLight1.exponent = 38;
			spotLight1.shadow.camera.near = 0;
			spotLight1.shadow.camera.far = 2635;
			spotLight1.shadow.camera.fov = 68;
			spotLight1.shadow.bias = 0;
		sceneVisit.add(spotLight1);
		
		/********************************************************************************/
		/*		SCENE STEPS			*/
		/********************************************************************************/
		
		var floor2 = new THREE.Mesh (planeGeometry, planeMaterial);
		floor2.receiveShadow = true;
		floor2.castShadow = false;
		floor2.rotation.x = 3 * Math.PI/2;
		floor2.position.y = -4;
		sceneSteps.add(floor2);
		
		var partsMat = new THREE.MeshLambertMaterial({
			color		: 0xFFFFFF,
			shading		: THREE.SmoothShading});
			partsMat.opacity = 0.3;
		var partsMatHover = new THREE.MeshBasicMaterial({color: 0x89A64B});
			partsMatHover.transparent = true;
			partsMatHover.blending = THREE.AdditiveBlending;
		
		var hoverPartName = document.createElement( 'h1' );
			hoverPartName.className = 'hoverPartName';
			hoverPartNameContainer.appendChild( hoverPartName );
		console.log(cathModelStep);
		for (var i = 0 ; i < cathModelStep.children.length ; i ++) {
			cathModelStep.children[i].children[0].name = partsName[i];
			//console.log(cathModelStep);
		}
		cathModelStep.traverse( function(part) {
			if (part instanceof THREE.Mesh) {
				//console.log(part);
				part.material = partsMat;
				part.castShadow = true;
				part.receiveShadow = true;
				domEvents.addEventListener(part, 'mouseover', function(event) {
					event.target.material = partsMatHover;
					hoverPartName.textContent = event.target.name;
					hoverPartNameContainer.style.display = 'inline';
					console.log(event.target);
				});
				part.visible = false;

				//Event when mouseOut an interestPoint
				domEvents.addEventListener(part, 'mouseout', function(event) {
					event.target.material = partsMat;
					hoverPartNameContainer.style.display = 'none'; 
				});
				parts.push(part);
			}
			//console.log(parts);
		});
		
		cathModelStep.position.y = -4;
		cathModelStep.position.z = 2;
		cathModelStep.rotation.y = -1;
		cathModelStep.scale.x = cathModelStep.scale.y = cathModelStep.scale.z = 1/16;
		cathModelStep.name = "cathedraleStep";
		sceneSteps.add(cathModelStep);
		
		var spotLight2 = new THREE.SpotLight(0x1E1E28);
			spotLight2.name = "Spot2";
			spotLight2.castShadow = true;
			spotLight2.position.x = -10; 
			spotLight2.position.y = 10; 
			spotLight2.position.z = -5; 
			spotLight2.intensity = 1;        
			spotLight2.distance = 40;
			spotLight2.angle = 2.6;
		sceneSteps.add(spotLight2);
		
		var spotLight3 = new THREE.SpotLight(0x1E1E28);
			spotLight3.name = "Spot3";
			spotLight3.castShadow = false;
			spotLight3.position.x = 0; 
			spotLight3.position.y = 10; 
			spotLight3.position.z = 10; 
			spotLight3.intensity = 1;        
			spotLight3.distance = 40;
			spotLight3.angle = 2.6;
		sceneSteps.add(spotLight3);
		
		var pointLight1 = new THREE.PointLight(0x1E1E28);
			pointLight1.name = "Point1";
			pointLight1.decay = 2;
			pointLight1.position.x = 10; 
			pointLight1.position.y = 5; 
			pointLight1.position.z = -10; 
			pointLight1.intensity = 1;        
			pointLight1.distance = 100;
			pointLight1.angle = 2.6;
		sceneSteps.add(pointLight1);
		
		setUpInterestPoints();
		addEventsToRenderer ();
		
		scene.add(sceneSteps);
		scene.add(sceneVisit);
		
		sceneVisit.visible = true;
		sceneSteps.visible = false;
	}
	
	function addEventsToRenderer () {
		
		var rendermdown = false;
		var renderdrag = true;
		
		renderer.domElement.addEventListener('mousedown', function(event) {
			rendermdown = true;
			switch (visitMode) {	
				case visitModes.free:
					break;
					
				case visitModes.guide:
					switch (event.button) {		
						case 0:
							//console.log('left button start');
							visitTween.stop();
							manageVisitProgress(1);
							break;
						case 1:
							//console.log('middle button start');
							break;
						case 2:
							//console.log('right button start');
							visitTween.stop();
							manageVisitProgress(-1);
							break;
					break;
				}
			}
		});
		
		renderer.domElement.addEventListener('mousemove', function(event){
			if (rendermdown) {
				renderdrag = true;
			}
		});
								   
		renderer.domElement.addEventListener('mouseup', function(event) {
			if (!renderdrag && controlMode == controlModes.trackball && !wheelMode) {
				switchControlsTo(controlModes.fly);
				targetInterestPointIs(null);
				console.log("do");
			}
			
			visitTween.stop();
			visiting = false;
			
			console.log(renderdrag);
			console.log(rendermdown);
			console.log(controlMode);
			renderdrag = false;
			rendermdown = false;
		});
		
		renderer.domElement.addEventListener('mouseout', function(event) {
			rendermdown = false;
			renderdrag = false;
			visitTween.stop();
			visiting = false;
			if (controlMode = controlModes.fly) {
				control.rollSpeed = 0;
			}
		});
		
		renderer.domElement.addEventListener('mouseover', function(event) {
			if (controlMode == controlModes.fly) {
				control.rollSpeed = .5;
			}
		});
	}
	
	function setUpInterestPoints() {
		
		/*Instantiate html elements to be modified by the hover*/

		interestPointTitle = document.createElement( 'h1' );
			interestPointTitle.className = 'interestPointTitle';
			leftPanel.appendChild( interestPointTitle );

		interestPointDescription = document.createElement( 'p' );
			interestPointDescription.className = 'interestPointDescription';
			leftPanel.appendChild( interestPointDescription );
		
		//creating a 3D object for each parameter and override metaData to add title & description to the THREE.Mesh object.
		for (var attr in interestPoints) {
			if (interestPoints[attr].hasOwnProperty) {
				var geometry = new THREE.BoxGeometry( .5, .5, .5 );
				var mesh = new THREE.Mesh( geometry, interestPointMat );
				mesh.position.x = interestPoints[attr].x;
				mesh.position.y = interestPoints[attr].y;
				mesh.position.z = interestPoints[attr].z;
				mesh.name = "interestPoint"+attr;
				mesh.metaData = 
					{
						"title": interestPoints[attr].title,
						"description": interestPoints[attr].description
					}
				sceneVisit.add(mesh);
				interestPoints3D.push(mesh);

				//Event when mouseover an interestPoint
				domEvents.addEventListener(mesh, 'mouseover', function(event) {
					event.target.material = interestPointMatHover;
					interestPointTitle.textContent = event.target.metaData.title;
					leftPanel.style.display = 'inline';
					leftPanel.style.opacity = 1;
				});

				//Event when mouseOut an interestPoint
				domEvents.addEventListener(mesh, 'mouseout', function(event) {
					if (targetInterestPoint != null) {
						interestPointTitle.textContent = targetInterestPoint.metaData.title;
						interestPointDescription.textContent = targetInterestPoint.metaData.description;
						if (event.target != targetInterestPoint){
							event.target.material = interestPointMat;
						}
					}
					else {
						event.target.material = interestPointMat;
						leftPanel.style.opacity = 0;
					}

				});

				//Event when click on an interestPoint
				domEvents.addEventListener(mesh, 'click', function(event) {
					targetInterestPointIs (event.target, true);
					console.log(event.target);
				});
			}
		}
	}

	function targetInterestPointIs (targetPoint, isClicked) {
		//If last interestPoint wasn't null so if we weren't in fly control
		if  (targetInterestPoint != null) {
			targetInterestPoint.geometry.scale(2/3, 2/3, 2/3);
			targetInterestPoint.material = interestPointMat;
		}

		if (targetPoint != null) {
			leftPanel.style.opacity = 1;
			interestPointTitle.textContent = targetPoint.metaData.title;
			interestPointDescription.textContent = targetPoint.metaData.description;
			targetPoint.geometry.scale(3/2, 3/2, 3/2);
			targetPoint.material = interestPointMatHover;
			targetInterestPoint = targetPoint;
			if (isClicked) {
				switchControlsTo(controlModes.trackball);
				control.target = targetPoint.position;
				camera.lookAt(targetPoint);
			}
		}
		else if (targetPoint == null && targetInterestPoint!= null) {
			targetInterestPoint.material = interestPointMat;
			leftPanel.style.opacity = 0;
			switchControlsTo(controlModes.fly);
		}
		targetInterestPoint = targetPoint;
	}
	
	function manageVisitProgress (dir) {
		
		switch (dir) {
			case 1 : {
				visitStatePos = new THREE.Vector3(buddy.position.x, buddy.position.y, buddy.position.z);
		
				if (visitState != 0) {
					var goingPoint = interestPoints3D[currentVisit[visitState-1]].position;
					var animDist = visitStatePos.distanceTo(interestPoints3D[currentVisit[visitState-1]].position);
				}
				else {
					var goingPoint = interestPoints3D[currentVisit[currentVisit.length-1]].position;
					var animDist = visitStatePos.distanceTo(interestPoints3D[currentVisit[currentVisit.length-1]].position);
				}

				var animTime = animDist/visitSpeed;

				visitTween = new TWEEN.Tween(visitStatePos).to(goingPoint, animTime)
					.easing (TWEEN.Easing.Quadratic.InOut)
					.onComplete(function() {
						if (visitState != 0) {visitState--;}
						else {visitState=currentVisit.length-1};
						//console.log(visitState);
					})
					.onStart( function () {
						targetInterestPointIs(interestPoints3D[currentVisit[visitState-1]]);
					})
					.onUpdate(function() {
						buddy.position.set(visitStatePos.x, visitStatePos.y, visitStatePos.z);
					})
					.start();
				break;
			}
			case -1 : {
				visitStatePos = new THREE.Vector3(buddy.position.x, buddy.position.y, buddy.position.z);
		
				var goingPoint = interestPoints3D[currentVisit[visitState]].position;
				var animDist = visitStatePos.distanceTo(interestPoints3D[currentVisit[visitState]].position);

				var animTime = animDist/visitSpeed;

				visitTween = new TWEEN.Tween(visitStatePos).to(goingPoint, animTime)
					.easing (TWEEN.Easing.Quadratic.InOut)
					.onComplete(function() {
						if (visitState != currentVisit.length-1) {visitState++;}
						else {visitState=0};
						//console.log(visitState);
					})
					.onStart( function () {
						targetInterestPointIs(interestPoints3D[currentVisit[visitState]]);
					})
					.onUpdate(function() {
						buddy.position.set(visitStatePos.x, visitStatePos.y, visitStatePos.z);
					})
					.start();
				break;
			}
			default : {
				console.warn ("direction of the visit incorrect. dir needs to be 1 or -1");
			}
		}
	}
	
	function manageVisitMode() {
		visitTween.stop();
		switch (visitMode) {
			case visitModes.guide :
				visitModeIndicator.textContent = 'Visite libre';
				visitMode = visitModes.free;
				switchControlsTo(controlModes.fly);
				targetInterestPointIs(null);
				break;
			case visitModes.free :
				visitModeIndicator.textContent = 'Visite guidée';
				visitMode = visitModes.guide;
				
				switchControlsTo(controlModes.fly);
				break;
		}
	}
	
	function manageWheel () {
		switch (wheelMode) {
			case true: 
				wheelMode = false;
				leftPanel.style.opacity = 0;
				wheel.style.display = "none";
				visitButton.style.display = "inline";
				sceneVisit.visible = true;
				sceneSteps.visible = false;
				targetInterestPointIs(interestPoints3D[currentVisit[visitState]]);
				switchControlsTo(controlModes.fly);
				visitMode = visitModes.guide;
				
				break;
			case false:
				wheelMode = true;
				leftPanel.style.opacity = 0;
				visitButton.style.display = "none";
				wheel.style.display = "inline";
				sceneVisit.visible = false;
				sceneSteps.visible = true;
				//actualizeDate(0);
				console.log("lol");
				switchControlsTo(controlModes.trackball);
				camera.position.set(50, 0, 0);
				control.target = scene.position;
				camera.lookAt(scene.position);
				visitMode = visitModes.free;
				break;
		}
	}

	function switchControlsTo (m) {
		switch (m) {
			case controlModes.fly :
				
				var camPosWorld = new THREE.Vector3();
				camPosWorld.setFromMatrixPosition(camera.matrixWorld);
				buddy.position.set (camPosWorld.x, camPosWorld.y, camPosWorld.z);
				
				var camRot = camera.getWorldQuaternion();
				
				THREE.SceneUtils.attach( camera, scene, buddy );
				camera.position.set(0,0,0);
				camera.rotation.set (0, 0, 0);
				//buddy.rotation.set (camRot.x, 0, 0);
				//buddy.rotation.set(0,camera.rotation.y,0);
				
				control = new THREE.FlyControls( camera, buddy, renderer.domElement);
				
				control.movementSpeed = (visitMode == visitModes.free) ? 10 : 0;
				control.rollSpeed = .5;

				control.dragToLook = false;
				control.autoForward = false;
				
				controlMode = controlModes.fly;
				break;

			case controlModes.trackball :
				
				THREE.SceneUtils.detach( camera, buddy, scene);
				
				control = new THREE.TrackballControls(camera, renderer.domElement);
				
				control.rotateSpeed = 1.0;
				control.zoomSpeed = 1.2;
				control.panSpeed = 0.3;

				control.noRotate = false;
				control.noZoom = false;
				control.noPan = true;

				control.staticMoving = true;
				control.dynamicDampingFactor = 0.2;

				control.minDistance = 10;
				control.maxDistance = 50;
				if (targetInterestPoint != null) {
					control.target = targetInterestPoint.position;
				}
				else {
					control.target = new THREE.Vector3(0, 0, 0);
					console.warn(targetInterestPoint);
					console.warn("trackballControl need a target to be use");
				}
				controlMode = controlModes.trackball;
				//console.log(camera.position);
				console.log(control);
				break;
				
			default :
				console.info ("This control mode doesn't exist");
		}
	}
	
	/********************************************************************************/
	/*		Radial Slider			*/
	/********************************************************************************/
	
	function setUpRadialSlider () {
		var radialSliderContainer = document.getElementById("radialSliderContainer");
		var	radialSliderSlider  = document.getElementById("slider");
		var	radialSliderFill = document.getElementById("radialSliderFill");

		var mPos;

		var ctx = radialSliderFill.getContext('2d');
		var fillImg = document.getElementById('fillImg');
		fillImg.src = "data/img/radialFill.png";

		var sliderWidth = radialSliderSlider.offsetWidth;
		var sliderHeight = radialSliderSlider.offsetHeight;
		var radius = 320/2;
		var deg = 270;

		var X = Math.round(radius * Math.sin(deg*Math.PI/180));
		var Y = Math.round(radius *  - Math.cos(deg*Math.PI/180));

		radialSliderSlider.style.left =  X+radius-sliderWidth/2;
		radialSliderSlider.style.top =  Y+radius-sliderHeight/2;

		var mdown = false;

		radialSliderSlider.addEventListener('mouseover',function (e) {
			radialSliderSlider.style.transform = 'scale(1.5)';
		});
		radialSliderSlider.addEventListener('mouseout',function (e) {
			radialSliderSlider.style.transform = 'scale(1)';
		});

		radialSliderContainer.addEventListener('mousedown',function (e) {
				mdown = true;
				//console.log(mdown);
			});
		radialSliderContainer.addEventListener('mouseup',function (e) { mdown = false; });
		radialSliderContainer.addEventListener('mousemove',function (e) { 
			if(mdown)
			{
				// firefox compatibility
				if(typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
				   var targetOffset = e.target.offset();
				   e.offsetX = e.pageX - targetOffset.left;
				   e.offsetY = e.pageY - targetOffset.top;
				}

				if(e.target == radialSliderContainer) {
					mPos = {x: e.offsetX, y: e.offsetY};
				}
				else if(e.target == radialSliderFill) {
					mPos = {x: e.offsetX + e.target.offsetLeft, y: e.offsetY + e.target.offsetTop};
				}
				else {
					mPos = {x: e.target.offsetLeft + e.offsetX, y: e.target.offsetTop + e.offsetY};
				}

				var atan = Math.atan2(mPos.x-radius, mPos.y-radius);
				deg = -atan/(Math.PI/180)+180; // final (0-360 positive) degrees from mouse position 
				//console.log(e.target);
				//console.log(mPos);

				if(deg == 360)
					deg = 0;

				var halfDeg = 0;
				if (deg >= 270 && deg < 360) {
					halfDeg = deg - 270;
				}
				else if (deg >= 0 && deg <= 90) {
					halfDeg = deg + 90;
				}
				console.log(halfDeg);

				X = Math.round(radius * Math.sin(deg*Math.PI/180));
				Y = Math.round(radius *  -Math.cos(deg*Math.PI/180));

				actualizeDate(halfDeg);

				radialSliderSlider.style.left =  X+radius-sliderWidth/2;
				radialSliderSlider.style.top =  Y+radius-sliderHeight/2;
				drawMask();
			}
		});

		// When the image is loaded, draw it
		fillImg.onload = function () {
			drawMask();
		};

		function drawMask () {
			ctx.clearRect(0, 0, radialSliderFill.width, radialSliderFill.height);

		// Save the state, so we can undo the clipping
			ctx.save();

		// Create a shape, of some sort
			ctx.beginPath();
			ctx.moveTo(105, 105);
			ctx.lineTo(0,105);
			ctx.arc(105, 105, radius, Math.PI, (deg-90) * Math.PI / 180, false);
			//ctx.fill();
			ctx.closePath();
		// Clip to the current path
			ctx.clip();

			ctx.drawImage(fillImg, 0, 0);
		// Undo the clipping
			ctx.restore();
		};

		function actualizeDate (deg) {
			//Mappig degrees to extremes dates.
			var minDate = interestDates[0].startDate;
			var maxDate = interestDates[interestDates.length-1].startDate;

			var date = (deg * ((maxDate - minDate)/180)) + minDate;

			for (var attr in interestDates) {
				if (interestDates[attr].hasOwnProperty) {
					//console.log(interestDates[attr].startDate);
					if (date >= interestDates[attr].startDate) {
						leftPanel.style.opacity = 1;
						interestPointTitle.textContent = interestDates[attr].title;
						interestPointDescription.textContent = interestDates[attr].description;
						interestPointDescription.style.display = "inline";

						//On efface tout les blocks affichés
						for (var i = 0 ; i < parts.length ; i ++) {
							parts[i].visible = false;
						} 
						if (interestDates[attr].blocksToAdd != null) {
							//On parcours le tableau et on affiche tout les blocks correspondant à cette date
							for (var i = 0 ; i < interestDates[attr].blocksToAdd.length ; i ++){
								parts[interestDates[attr].blocksToAdd[i]].visible = true;
								console.log(i);
							}
						}
					}
				}
			}
		}
	}
	
	/********************************************************************************/
	/*		Utils			*/
	/********************************************************************************/
	
	function loadJSON(file, callback) {   

		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
		xobj.onreadystatechange = function () {
			  if (xobj.readyState == 4 && xobj.status == "200") {
				// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
				callback(xobj.responseText);
			  }
		};
		xobj.send(null);  
 	}
	
	function stats() {
		stats = new Stats();        
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';     
		container.appendChild( stats.domElement );
	}
	
}
