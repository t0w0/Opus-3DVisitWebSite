var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var stats;
	var leftPanel;
    var dae, spotLight, lightHelper;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
	var hoverCubeGeo, hoverCubeMat, hoverCube;
    var loader = new  THREE.ColladaLoader();
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
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render );
                    
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
		domEvents = new THREEx.DomEvents(camera, renderer.domElement);
		
		/*adds a cube that can be hovered*/
		var geometry = new THREE.BoxGeometry( .5, .5, .5 );
		var material = new THREE.MeshBasicMaterial( {color: 0x89A64B} );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.x = 10;
		cube.position.y = -10;
		cube.position.z = 5;
		scene.add( cube );
		
		domEvents.addEventListener(cube, 'mouseover', function(event) {
			new_material = new THREE.MeshBasicMaterial({color:0x317DFA});
			cube.material = new_material;
			leftPanel.style.display = 'inline';
			leftPanel.style.opacity = 1;
			return renderer.render(scene, camera);
		 });
		
      	domEvents.addEventListener(cube, 'mouseout', function(event) {
			cube.material = material;
			leftPanel.style.opacity = 0;
			return renderer.render(scene, camera);
		});
		
        $("#webGL-container").append(renderer.domElement);
		
        /*stats*/
        /*stats = new Stats();        
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';     
        $("#webGL-container").append( stats.domElement );*/       
    }

    function render() {   
    
    }
    
    function animate(){
        requestAnimationFrame(animate);
        //stats.update();     
        renderer.render(scene, camera);
    }

	$(window).resize(function(){
		SCREEN_WIDTH = window.innerWidth;
		SCREEN_HEIGHT = window.innerHeight;

		camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	});