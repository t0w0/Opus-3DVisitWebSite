$(function(){
	var container;
	var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var stats;
	var leftPanel;
    var dae, spotLight, lightHelper;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    var loader = new  THREE.ColladaLoader();
	var domEvents;
	var clock = new THREE.Clock();
	
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

    loader.options.convertUpAxis = true;

    loader.load('http://localhost/opus0a/models/cath.dae', function (collada){
        dae = collada.scene;
        dae.scale.x = dae.scale.y = dae.scale.z = 3;
        dae.updateMatrix();
		
        init();
        animate();
        //console.log(scene);
    });

    function init(){
		
        /*creates empty scene object and renderer*/
        scene = new THREE.Scene();
        camera =  new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 500);
        renderer = new THREE.WebGLRenderer({antialias:true});
        
        renderer.setClearColor(0x1E1E28);
        renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position= 'absolute';
        renderer.shadowMap.enabled= true;
        renderer.shadowMapSoft = true;
        
        /*add controls*/
        //controls = new THREE.OrbitControls( camera, renderer.domElement );
        //controls.addEventListener( 'change', render );
		controls = new THREE.FlyControls( camera );
				controls.movementSpeed = 1000;
				controls.domElement =  container;
				controls.rollSpeed = Math.PI / 24;
				controls.autoForward = false;
				controls.dragToLook = false;
		
		domEvents = new THREEx.DomEvents(camera, renderer.domElement);
                    
        camera.position.x = 45;
        camera.position.y = 0;
        camera.position.z = 0;
        camera.lookAt(scene.position);
		
		dae.position.y = 30;
        scene.add(dae);
		
        /*adds spot light with starting parameters*/
        spotLight = new THREE.SpotLight(0x1E1E28);
        spotLight.castShadow = true;
		spotLight.position.x = -50; 
        spotLight.intensity = 10;        
        spotLight.distance = 373;
        spotLight.angle = 1.6;
        spotLight.exponent = 38;
        spotLight.shadow.camera.near = 34;
        spotLight.shadow.camera.far = 2635;
        spotLight.shadow.camera.fov = 68;
        spotLight.shadow.bias = 0;
        scene.add(spotLight);
		
		leftPanel = document.getElementById('leftPanel');
		
		setUpInterestPoints();
		
        $("#webGL-container").append(renderer.domElement);
		
		window.addEventListener( 'resize', onWindowResize, false );
		
        /*stats*/
        /*stats = new Stats();        
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';     
        $("#webGL-container").append( stats.domElement );*/       
    }

	function setUpInterestPoints() {
		
		var geometry = new THREE.BoxGeometry( .5, .5, .5 );
		var material = new THREE.MeshBasicMaterial( {color: 0x89A64B} );
		var new_material = new THREE.MeshBasicMaterial({color:0x317DFA});
		
		var title = document.createElement( 'h1' );
			title.className = 'interestPointTitle';
			leftPanel.appendChild( title );
		
		var description = document.createElement( 'p' );
			description.className = 'interestPointDescription';
			leftPanel.appendChild( description );
		
		for (var attr in interestPoints) {
			if (interestPoints[attr].hasOwnProperty) {
				var mesh = new THREE.Mesh( geometry, material );
				mesh.position.x = interestPoints[attr].x;
				mesh.position.y = interestPoints[attr].y;
				mesh.position.z = interestPoints[attr].z;
				mesh.metaData = 
					{
						"title": interestPoints[attr].title,
						"description": interestPoints[attr].description
					}
				//alert(interestPoints[attr].description)
				scene.add(mesh);
				
				domEvents.addEventListener(mesh, 'mouseover', function(event) {
					event.target.material = new_material;
					leftPanel.style.display = 'inline';
					leftPanel.style.opacity = 1;
					
					title.textContent = event.target.metaData.title;
					description.textContent = event.target.metaData.description;
					//alert(event.target.metaData.description);
					
					return renderer.render(scene, camera);
				});
				
				domEvents.addEventListener(mesh, 'mouseout', function(event) {
					event.target.material = material;
					return renderer.render(scene, camera);
				});
			}
		}
	}
    
    function animate() {
        requestAnimationFrame(animate);
        //stats.update();
		render ();
    }
	
	function render () {
		
		var delta = clock.getDelta();
		controls.movementSpeed = 0.33;
		//controls.update( delta );
		renderer.render(scene, camera);
	}

	function onWindowResize( event ) {

		SCREEN_HEIGHT = window.innerHeight;
		SCREEN_WIDTH  = window.innerWidth;

		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

		camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
		camera.updateProjectionMatrix();

	}
});