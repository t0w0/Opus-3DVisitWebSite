$(function() {
	 //What we need to set up a THREE.JS
	var container;
	var scene, camera, renderer;
	var clock;
	var SCREEN_WIDTH, SCREEN_HEIGHT;
	
	//Xhat we're gonna use in Three scene
	var dae, daeMat, loader = new  THREE.ColladaLoader(); 
	var	spotLight;
    var orbitControl, flyControl, firstPersonControl;
	var domEvents;
		//var that we need to create the interest points.
		var material = new THREE.MeshBasicMaterial( {color: 0x89A64B} );
		var new_material = new THREE.MeshBasicMaterial({color:0x317DFA});
	
	//Controls and interface.
    var stats;
	var leftPane, description, title;
	
	//Here is an object which got JSONObject as parameters that store all the interest points.
	var interestPoints = 
		{
		"ID01": {"x":0, 	"y":0, 		"z":0, 		
				 "title":"This is a Cube", 				
				 "description": "Lorem Ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID01": {"x":1, 	"y":-5, 	"z":2, 		
				 "title":"This Is another Cube", 		
				 "description": "Lroem Ipusm Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID02": {"x":-1, 	"y":5, 		"z":7, 		
				 "title":"This Is a Cube, again", 		
				 "description": "Morel Ispum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID03": {"x":2, 	"y":6, 		"z":9, 		
				 "title":"This Is a ... Cube !", 		
				 "description": "Romel Sipum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID04": {"x":-2, 	"y":-6, 	"z":5, 		
				 "title":"You know what it is", 			
				 "description": "Losum Iprem Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID05": {"x":3, 	"y":3, 		"z":-4, 	
				 "title":"C.U.B.E", 					
				 "description": "Lorei Upsim Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID06": {"x":-3, 	"y":-3, 	"z":-2, 	
				 "title":"Another One", 					
				 "description": "Orem Lipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."},
		"ID07": {"x":4,	 	"y":2, 		"z":-6, 	
				 "title":"Interesting... a CUBE !", 		
				 "description": "Ormel Pumis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dolor ex, dictum vitae justo maximus, dictum posuere purus. Ut placerat risus urna, quis elementum magna porta dictum. Aliquam sed dui lorem. Ut bibendum gravida urna sed pulvinar. Phasellus ullamcorper semper fermentum. Pellentesque id posuere sapien. Cras faucibus ante nisl, in fringilla sapien faucibus sit amet. In hac habitasse platea dictumst. Etiam non molestie enim, vel elementum arcu."}
		};
	
	var interestPoints3D = {};
	var targetInterestPoint = null;

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
					renderer.domElement.style.position= 'absolute';
					renderer.shadowMap.enabled= true;
					renderer.shadowMapSoft = true;
			daeMat = new THREE.MeshPhongMaterial ({transparent:true, blending:'alpha'});
			dae.material = daeMat;
			dae.position.y = 30;
        scene.add(dae);
		
        /*adds spot light with starting parameters*/
        spotLight = new THREE.SpotLight(0x1E1E28);
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
		
		//Instantiate the html elements to be modified by the hover.
		leftPanel = document.getElementById('leftPanel');
		
		title = document.createElement( 'h1' );
			title.className = 'interestPointTitle';
			leftPanel.appendChild( title );
		
		description = document.createElement( 'p' );
			description.className = 'interestPointDescription';
			leftPanel.appendChild( description );
		
		domEvents = new THREEx.DomEvents(camera, renderer.domElement);
			domEvents.addEventListener(dae, 'click', function(event) {
				targetInterestPointIs(null);
			});
		
		setUpInterestPoints();
		
        container.appendChild( renderer.domElement );
		
		window.addEventListener( 'resize', onWindowResize, false );
		window.scene = scene;
		
		/*add controls*/
        orbitControl = new THREE.OrbitControls( camera, renderer.domElement );
        orbitControl.addEventListener( 'change', render );
		//controls = new THREE.FlyControls( camera, container );
			//controls.movementSpeed = 1;
			//controls.domElement =  container;
			//controls.rollSpeed = Math.PI / 24;
			//controls.autoForward = false;
			//controls.dragToLook = false;       
		
		animate();
		requestAnimationFrame(animate);
		
        /*stats*/
        /*stats = new Stats();        
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';     
        $("#webGL-container").append( stats.domElement );*/       
    }
	
	function animate () {
		var dt = clock.getDelta();
		renderer.render(scene,camera);
		requestAnimationFrame(animate);
		console.log(scene);
  	}
	
	function render () {
		renderer.render(scene, camera);
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
				mesh.metaData = 
					{
						"title": interestPoints[attr].title,
						"description": interestPoints[attr].description
					}
				scene.add(mesh);
				
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
				
				//Event when mouseOut an interestPoint
				domEvents.addEventListener(mesh, 'click', function(event) {
					targetInterestPointIs (event.target);
				});
			}
		}
		//console.log (controls);
	}
	
	function targetInterestPointIs (targetPoint) {
		if  (targetInterestPoint != null) {
			targetInterestPoint.geometry.scale(2/3, 2/3, 2/3);
			targetInterestPoint.material = material;
		}
		
		if (targetPoint != null){
			title.textContent = targetPoint.metaData.title;
			description.textContent = targetPoint.metaData.description;
			targetPoint.geometry.scale(3/2, 3/2, 3/2);
			targetPoint.material = new_material;
			orbitControl.target = targetPoint.position;
			orbitControl.update();
		}
		else if (targetPoint == null && targetInterestPoint!= null) {
			targetInterestPoint.material = material;
			leftPanel.style.opacity = 0;
		}
		targetInterestPoint = targetPoint;
		
	}
	
	loader.options.convertUpAxis = true;
	loader.load('http://localhost/opus0a/models/cath.dae', function (model) {
		dae = model.scene;
		dae.scale.x = dae.scale.y = dae.scale.z = 3;
		dae.updateMatrix();
		dae.receiveShadow = true;
		dae.castShadow = true;
		init();
	}); 

	function onWindowResize( event ) {

		SCREEN_HEIGHT = window.innerHeight;
		SCREEN_WIDTH  = window.innerWidth;

		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

		camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
		camera.updateProjectionMatrix();

	}
});