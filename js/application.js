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
	
	var interface3D = document.getElementsByClassName("interface3D");
	
	var visitButton = document.getElementById('visitModeControl');
	var visitModeIndicator = document.getElementById('visitModeIndicator');
	var wheelButton = document.getElementById('wheelControl');
	var wheel = document.getElementById('radialSliderContainer');
	var leftPanel = document.getElementById('leftPanel');
	
	var background = document.getElementById('background');
	
	var stats;
	
	//THREEJS
	var container = document.getElementById("webGL-container");
	var scene, camera, renderer;
	var clock = new THREE.Clock();
	var loader = new  THREE.ColladaLoader();
	var domEvents;
	var SCREEN_WIDTH, SCREEN_HEIGHT;

	//What we're gonna use in Three scene
	var cathModel;
	var cathModelStep;
	var	spotLight;
	//Table that store the THREE.JS object interestpoints after instantiation.
	var interestPoints3D = [];
	//Variable that store the actual targetPoint - Should be a static variable
	var targetInterestPoint = null;
	
	//var that we need to create the interest points.
	var interestPointMat = new THREE.MeshBasicMaterial( {color: 0x89A64B} );
		interestPointMat.transparent = true;
		interestPointMat.opacity = 0.3;
		interestPointMat.blending = THREE.AdditiveBlending;
	var interestPointMatHover = new THREE.MeshBasicMaterial({color:0x317DFA});
		interestPointMatHover.transparent = true;
		interestPointMatHover.opacity = 0.7;
		interestPointMatHover.blending = THREE.AdditiveBlending;

	//3D Controls
	var controlModes = {"trackball": 0, "fly": 1};
	var controlMode = controlModes.trackball;
	var control;
	
	//Here is an object which got JSONObject as parameters that store all the interest points.
	var interestPoints;
	var interestPointsJSON = loadJSON("./data/interestPoints.json", function (response) {interestPoints = JSON.parse(response);});
	
	//Visits
	var visitModes = {"guide": 0, "free": 1};
	var visitMode = visitModes.guide;

	var visits = [
			[0, 1, 2, 0, 3, 4, 5, 7, 0, 5, 4, 6, 7, 2, 0, 1, 3],
			[1, 3, 5, 7, 0, 2, 4, 6],
	];
	var visitSpeed = .01;
	var currentVisit;

	var visitStatePos;

	var visitTween = new TWEEN.Tween(0,0,0);
	
	var cathMat = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
		cathMat.transparent = true;
		cathMat.blending = THREE.AdditiveBlending;
	var partsMat = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
		partsMat.transparent = true;
		partsMat.opacity = 0.3;
	var partsMatHover = new THREE.MeshBasicMaterial({color: 0x0DAAFF});
		partsMatHover.transparent = true;
		partsMatHover.blending = THREE.AdditiveBlending;
	
	var parts = [];
	
	var wheelMode = false;
	
	//Start by loading the 3D model and launch Init()
	loader.options.convertUpAxis = true;
	loader.load ('http://localhost/opus0b/models/cath.dae', function (model) {
		cathModel = model.scene;
		
		cathModel.updateMatrix();
		cathModel.receiveShadow = true;
		cathModel.castShadow = true;
		init();
		
	}); 
	loader.load('http://localhost/opus0b/models/cathStepbyStep.dae', function (model) {
		cathModelStep = model.scene;
		
		cathModelStep.updateMatrix();
		cathModelStep.receiveShadow = true;
		cathModelStep.castShadow = true;
		
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
		
		domEvents = new THREEx.DomEvents(camera, renderer.domElement);
		window.addEventListener( 'resize', onWindowResize, false );
		window.scene = scene;
		
		/*adds the cathModel model*/
			//cathModelMat = new THREE.MeshPhongMaterial ({transparent:true, blending:'alpha'});
			//cathModel.material = cathModelMat;
			cathModel.position.y = 30;
			cathModel.scale.x = cathModel.scale.y = cathModel.scale.z = 3;
			cathModel.name = "cathedrale";
		scene.add(cathModel);

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
		
		setUpInterestPoints();
		
		container.appendChild( renderer.domElement );
		
		/********************************************************************************/
		/*		Building paths for visits			*/
		/********************************************************************************/
		
		switchControlsTo(controlModes.fly);
		
		//Initialize visit value
		
		currentVisit = visits[0];
		visitState = 0;
		visitStatePos = new THREE.Vector3(45, 0, 0);
		pathTweensForward = [];
		pathTweensBackward = [];
		
		domEvents.addEventListener(cathModel, 'mousedown', function(event) {
			
			switch (visitMode) {
					
				case visitModes.free:
					break;
					
				case visitModes.guide:
					switch (event.origDomEvent.button) {
							
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
								   
		domEvents.addEventListener(cathModel, 'mouseup', function(event) {
			
			switch (event.origDomEvent.button) {
				case 0:
					//console.log('left button stop');
					visitTween.stop();
					visiting = false;
					
					break;
				case 1:
					//console.log('middle button stop');
					break;
				case 2:
					//console.log('right button stop');
					visitTween.stop();
					visiting = false;
					break;
        	}
		});
		
		domEvents.addEventListener(cathModel, 'mouseout', function(event) {
			console.log('left button stop');
			visitTween.stop();
			visiting = false;
		});
		
		cathModel.traverse( function(node) {
			if (node instanceof THREE.Mesh) {
				node.material = cathMat;
			}
		});
		
		cathModelStep.traverse( function(node) {
			if (node instanceof THREE.Mesh) {
				node.material = partsMat;
				domEvents.addEventListener(node, 'mouseover', function(event) {
					event.target.material = partsMatHover;
				});

				//Event when mouseOut an interestPoint
				domEvents.addEventListener(node, 'mouseout', function(event) {
					event.target.material = partsMat;
				});
			}
		});
		
		/*stats*/
		/*stats = new Stats();        
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';     
		container.appendChild( stats.domElement ); */

		animate();
		
	}
	
	/********************************************************************************/
	/*		HTML Display Function				*/
	/********************************************************************************/
	
	
	function navigateBetweenPage (pageToMoveTo) {
		switch (pageToMoveTo) {
			case 0 : {
				projetInfos.style.opacity = 0;
				equipeInfos.style.opacity = 0;
				partenaireInfos.style.opacity = 0;
				title.style.opacity = 1;
				break;
			}
			case 1 : {
				projetInfos.style.opacity = 1;
				equipeInfos.style.opacity = 0;
				partenaireInfos.style.opacity = 0;
				title.style.opacity = 0;
				break;
			}
			case 2 : {
				projetInfos.style.opacity = 0;
				equipeInfos.style.opacity = 1;
				partenaireInfos.style.opacity = 0;
				title.style.opacity = 0;
				break;
			}
			case 3 : {
				projetInfos.style.opacity = 0;
				equipeInfos.style.opacity = 0;
				partenaireInfos.style.opacity = 1;
				title.style.opacity = 0;
				break;
			}
		}
		
	}
	
	function startVisit() {
		background.style.display = 'none';
		trailer.style.display = 'none';
		for (i = 0 ; i < openningInterface.length ; i++) {
			openningInterface[i].style.display = 'none';
			openningInterface[i].style.opacity = 0;
		}
		for (i=0 ; i < interface3D.length ; i ++) {
			interface3D[i].style.display = 'inline';
			interface3D[i].style.opacity = 1;
		}
		console.log(interface3D);
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
				scene.add(mesh);
				interestPoints3D.push(mesh);
				//console.log(interestPoints3D);

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
					targetInterestPointIs (event.target);
				});
			}
		}
	}

	function targetInterestPointIs (targetPoint) {
		//If last interestPoint wasn't null so if we weren't in fly control
		if  (targetInterestPoint != null) {
			targetInterestPoint.geometry.scale(2/3, 2/3, 2/3);
			targetInterestPoint.material = interestPointMat;
		}

		if (targetPoint != null) {
			interestPointTitle.textContent = targetPoint.metaData.title;
			interestPointDescription.textContent = targetPoint.metaData.description;
			targetPoint.geometry.scale(3/2, 3/2, 3/2);
			targetPoint.material = interestPointMatHover;
			targetInterestPoint = targetPoint;
			switchControlsTo(controlModes.trackball)
			control.target = targetPoint.position;
			camera.lookAt(targetPoint);

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
				visitStatePos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
		
				if (visitState != 0) {
					var goingPoint = interestPoints3D[currentVisit[visitState-1]].position;
					var animDist = visitStatePos.distanceTo(interestPoints3D[currentVisit[visitState-1]].position);
				}
				else {
					var goingPoint = interestPoints3D[currentVisit[currentVisit.length-1]].position;
					var animDist = visitStatePos.distanceTo(interestPoints3D[currentVisit[currentVisit.length-1]].position);
				}

				var animTime = animDist/visitSpeed;
				console.log(visitState);

				visitTween = new TWEEN.Tween(visitStatePos).to(goingPoint, animTime)
					.easing (TWEEN.Easing.Quadratic.InOut)
					.onComplete(function() {
						if (visitState != 0) {visitState--;}
						else {visitState=currentVisit.length-1};
						//console.log(visitState);
					})
					.onUpdate(function() {
						camera.position.set(visitStatePos.x, visitStatePos.y, visitStatePos.z);
					})
					.start();
				break;
			}
			case -1 : {
				visitStatePos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
		
				var goingPoint = interestPoints3D[currentVisit[visitState]].position;
				var animDist = visitStatePos.distanceTo(interestPoints3D[currentVisit[visitState]].position);

				var animTime = animDist/visitSpeed;
				console.log(visitState);

				visitTween = new TWEEN.Tween(visitStatePos).to(goingPoint, animTime)
					.easing (TWEEN.Easing.Quadratic.InOut)
					.onComplete(function() {
						if (visitState != currentVisit.length-1) {visitState++;}
						else {visitState=0};
						//console.log(visitState);
					})
					.onUpdate(function() {
						camera.position.set(visitStatePos.x, visitStatePos.y, visitStatePos.z);
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
				wheel.style.display = "none";
				break;
			case false:
				wheelMode = true;
				wheel.style.display = "inline";
				for( var i = scene.children.length - 1; i >= 0; i--) { scene.remove(scene.children[i])}
				cathModelStep.position.y = -70;
				cathModelStep.scale.x = cathModelStep.scale.y = cathModelStep.scale.z = 1;
				cathModelStep.name = "cathedraleStep";
				targetPoint = scene;
				switchControlsTo(controlModes.trackball);
				control.minDistance = 300;
				scene.add(cathModelStep);
				break;
		}
	}

	function switchControlsTo (m) {
		switch (m) {
			case controlModes.fly :
				control = new THREE.FlyControls( camera, renderer.domElement);
				control.handleEvent( 'change', animate );
				
				
				control.movementSpeed = (visitMode == visitModes.free) ? 10 : 0;
				control.rollSpeed = .5;

				control.dragToLook = false;
				control.autoForward = false;
				
				//console.log(visitMode);
				//console.log(control.canMove);
				
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

				control.staticMoving = true;
				control.dynamicDampingFactor = 0.2;

				control.minDistance = 5;
				control.maxDistance = 30;
				if (targetInterestPoint) {
					control.target = targetInterestPoint.position;
				}
				else {
					console.warn(targetInterestPoint);
					console.warn("trackballControl need a target to be use");
				}
				controlMode = controlModes.trackball;
				break;
				
			default :
				console.info ("This control mode doesn't exist");
		}
	}
	
	function animate () {
		if (mode = controlModes.fly) {
			var dt = clock.getDelta();
			control.update(dt);
		}
		
		//stats.update();
		TWEEN.update();
		
		requestAnimationFrame(animate);
		renderer.render(scene,camera);
	}
	
	/********************************************************************************/
	/*		Media controls			*/
	/********************************************************************************/
	
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
		console.log(requestMethod);
		
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
				title.opacity=1;
				break;
			case 1 :
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
	/*		Radial Slider			*/
	/********************************************************************************/
	
	var radialSliderContainer = document.getElementById("radialSliderContainer");
	var	radialSliderSlider  = document.getElementById("slider");
	var	radialSliderFill = document.getElementById("radialSliderFill");

	var mPos;

	var ctx = radialSliderFill.getContext('2d');
	var fillImg = document.getElementById('fillImg');
	fillImg.src = "data/img/radialFill.png";

	var sliderWidth = radialSliderSlider.offsetWidth;
	var sliderHeight = radialSliderSlider.offsetHeight;
	var radius = radialSliderContainer.offsetWidth/2;
	var deg = 0;

	var X = Math.round(radius * Math.sin(deg*Math.PI/180));
	var Y = Math.round(radius *  - Math.cos(deg*Math.PI/180));

	var sliderCSS = { left: X+radius-sliderWidth/2, top: Y+radius-sliderHeight/2 };

	var mdown = false;

	radialSliderSlider.addEventListener('mouseover',function (e) {
		radialSliderSlider.style.transform = 'scale(1.5)';
	});
	radialSliderSlider.addEventListener('mouseout',function (e) {
		radialSliderSlider.style.transform = 'scale(1)';
	});

	window.addEventListener('mousedown',function (e) {
			mdown = true;
			console.log(mdown);
		});
	window.addEventListener('mouseup',function (e) { mdown = false; });
	window.addEventListener('mousemove',function (e) { 
		if(mdown)
		{
			
			console.log(e);
			// firefox compatibility
			if(typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
			   var targetOffset = e.target.offset();
			   e.offsetX = e.pageX - targetOffset.left;
			   e.offsetY = e.pageY - targetOffset.top;
			}

			if(e.target == radialSliderContainer)
				mPos = {x: e.offsetX, y: e.offsetY};
			if (e.target == radialSliderSlider)
				mPos = {x: e.target.offsetLeft + e.offsetX, y: e.target.offsetTop + e.offsetY};
			else
				mPos = {x: e.offsetX, y: e.offsetY};

			var atan = Math.atan2(mPos.x-radius, mPos.y-radius);
			deg = -atan/(Math.PI/180) + 180; // final (0-360 positive) degrees from mouse position 

			console.log(mPos);

			if(deg == 360)
				deg = 0;

			X = Math.round(radius* Math.sin(deg*Math.PI/180));
			Y = Math.round(radius*  -Math.cos(deg*Math.PI/180));

			console.log(X);
			
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
		console.log("Draw");
		ctx.clearRect(0, 0, radialSliderFill.width, radialSliderFill.height);

	// Save the state, so we can undo the clipping
		ctx.save();

	// Create a shape, of some sort
		ctx.beginPath();
		ctx.moveTo(105, 105);
		ctx.lineTo(210,105);
		ctx.arc(105, 105, radius, 0, (deg-90) * Math.PI / 180, true);
		//ctx.fill();
		ctx.closePath();
	// Clip to the current path
		ctx.clip();

		ctx.drawImage(fillImg, 0, 0);

	// Undo the clipping
		ctx.restore();
	};
	
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
	
}
