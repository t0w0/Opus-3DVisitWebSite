$(function(){
	
	var body = document.body; // Make the body go full screen.
	
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
	
	var webGL = document.getElementById("webGL-container");
	
	
	init();
	
	function init() {
		
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
	
});
