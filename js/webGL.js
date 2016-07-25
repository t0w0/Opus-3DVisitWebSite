var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var stats;
    var dae, spotLight, lightHelper;
    var SCREEN_WIDTH, SCREEN_HEIGHT;
    
    var loader = new  THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('http://localhost/opus0a/models/cath.dae', function (collada){
        dae = collada.scene;
        dae.scale.x = dae.scale.y = dae.scale.z = 3;
        dae.traverse(function (child){
            if (child.colladaId == "Full"){
                child.traverse(function(e){
                    e.castShadow = true;
                    e.receiveShadow = true;
                    if (e.material instanceof THREE.MeshPhongMaterial){
                        e.material.needsUpdate = true;
                    }   
                
                });
            }   
        });
        dae.updateMatrix();
        init();
        animate();
        console.log(scene);
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
		
        scene.add(dae);
        /*datGUI controls object*/
        guiControls = new function(){
            this.rotationX  = 0.0;
            this.rotationY  = 0.0;
            this.rotationZ  = 0.0;
            
            this.intensity = 10;       
            this.distance = 373;
            this.angle = 1.6;
            this.exponent = 38;
            this.shadowCameraNear = 34;
            this.shadowCameraFar = 2635;
            this.shadowCameraFov = 68;
            this.shadowCameraVisible=false;
            this.shadowMapWidth=512;
            this.shadowMapHeight=512;
            this.shadowBias=0.00;   

        }
		
        /*adds spot light with starting parameters*/
        spotLight = new THREE.SpotLight(0x1E1E28);
        spotLight.castShadow = true;
		spotLight.position.x = -100; 
        spotLight.intensity = guiControls.intensity;        
        spotLight.distance = guiControls.distance;
        spotLight.angle = guiControls.angle;
        spotLight.exponent = guiControls.exponent;
        spotLight.shadow.camera.near = guiControls.shadowCameraNear;
        spotLight.shadow.camera.far = guiControls.shadowCameraFar;
        spotLight.shadow.camera.fov = guiControls.shadowCameraFov;
        spotLight.shadow.bias = guiControls.shadowBias;
        spotLight.shadowDarkness = guiControls.shadowDarkness;
        scene.add(spotLight);
		
		/*adds light helper*/
		lightHelper = new THREE.CameraHelper(spotLight.shadow.camera)
		lightHelper.visible = guiControls.shadowCameraVisible;;
		scene.add(lightHelper);
		
		//var axisHelper = new THREE.AxisHelper( 5 );
		//scene.add( axisHelper );
		
        /*adds controls to scene*/
		
		/*var button = document.getElementById( '0' );
				button.addEventListener( 'click', function ( event ) {

					navigateThroughTime( 0 );

				}, false );
		
		var button = document.getElementById( '1' );
				button.addEventListener( 'click', function ( event ) {

					navigateThroughTime( 1 );

				}, false );
		var button = document.getElementById( '2' );
				button.addEventListener( 'click', function ( event ) {

					navigateThroughTime( 2 );

				}, false );
		var button = document.getElementById( '3' );
				button.addEventListener( 'click', function ( event ) {

					navigateThroughTime( 3 );

				}, false );
		var button = document.getElementById( '4' );
				button.addEventListener( 'click', function ( event ) {

					navigateThroughTime( 4 );

				}, false );
		var button = document.getElementById( '5' );
				button.addEventListener( 'click', function ( event ) {

					navigateThroughTime( 5 );

				}, false );
		var button = document.getElementById( '6' );
				button.addEventListener( 'click', function ( event ) {

					navigateThroughTime( 6 );

				}, false );
		var button = document.getElementById( '7' );
				button.addEventListener( 'click', function ( event ) {

					navigateThroughTime( 7 );

				}, false );
		
		var button = document.getElementById( '8' );
				button.addEventListener( 'click', function ( event ) {

					navigateThroughTime( 8 );

				}, false );*/
		
        datGUI = new dat.GUI();
        
        datGUI.add(guiControls, 'intensity',0.01, 5).onChange(function(value){
            spotLight.intensity = value;
			lightHelper.update();
        });     
        datGUI.add(guiControls, 'distance',0, 1000).onChange(function(value){
            spotLight.distance = value;
			lightHelper.update();
        }); 
        datGUI.add(guiControls, 'angle',0.001, 1.570).onChange(function(value){
            spotLight.angle = value;
			lightHelper.update();
        });     
        datGUI.add(guiControls, 'exponent',0 ,50 ).onChange(function(value){
            spotLight.exponent = value;
			lightHelper.update();
        });
        datGUI.add(guiControls, 'shadowCameraNear',0,100).name("Near").onChange(function(value){        
            spotLight.shadow.camera.near = value;
			lightHelper.update();      
        });
        datGUI.add(guiControls, 'shadowCameraFar',0,5000).name("Far").onChange(function(value){
            spotLight.shadow.camera.far = value;
           lightHelper.update();
        });
        datGUI.add(guiControls, 'shadowCameraFov',1,180).name("Fov").onChange(function(value){
            spotLight.shadow.camera.fov = value;
           lightHelper.update();
        });
        datGUI.add(guiControls, 'shadowCameraVisible').onChange(function(value){
            lightHelper.visible = value;
        });
        datGUI.add(guiControls, 'shadowBias',0,1).onChange(function(value){
            spotLight.shadow.bias = value;
           lightHelper.update();
        });
		
        datGUI.close();
        $("#webGL-container").append(renderer.domElement);
		
        /*stats*/
        stats = new Stats();        
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';     
        $("#webGL-container").append( stats.domElement );       
    }
	
	function navigateThroughTime( date ) {
		if (date == 0) {
			dae.visible = false;
		}
		else {
			dae.visible = true;
		}
		
				/*TWEEN.removeAll();

				for ( var i = 0; i < objects.length; i ++ ) {

					var object = objects[ i ];
					var target = targets[ i ];

					new TWEEN.Tween( object.position )
						.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

					new TWEEN.Tween( object.rotation )
						.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

				}

				new TWEEN.Tween( this )
					.to( {}, duration * 2 )
					.onUpdate( render )
					.start();*/
				

			}


    function render() {   

        //spotLight.position.x = guiControls.lightX;
        //spotLight.position.y = guiControls.lightY;
        //spotLight.position.z = guiControls.lightZ;
    
    }
    
    function animate(){
        requestAnimationFrame(animate);
        stats.update();     
        renderer.render(scene, camera);
    }
	$(window).resize(function(){


    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	});