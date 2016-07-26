$(function(){
	
	var body = document.body; // Make the body go full screen.
	
	var interface = document.getElementById('interface');
	
	var basicInterface = document.getElementById('basicInterface');
	var logo = document.getElementById('logo');	
	
	var infosDeployButton = document.getElementById( 'infosDeploy' );
	var projetButton = document.getElementById( 'projet' );
	var equipeButton = document.getElementById('equipe');
	var partenaireButton = document.getElementById('partenaires');
	
	var fullScreenButton = document.getElementById('fullScreen');
	var muteButton = document.getElementById('mute');
	var audio = new Audio('./data/sound/cathSound.mp3');
	var mute = false;
	
	var accueil = document.getElementById('accueil');
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
			manageTrailer(1);
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
		
	}
	
	function navigateBetweenPage (pageToMoveTo) {
		if (pageToMoveTo == 0) {
			projetInfos.style.opacity = 0;
			equipePage.style.opacity = 0;
			partenairePage.style.opacity = 0;
			centralInfo.style.opacity = 1;
		}
		if (pageToMoveTo == 1) {
			projetPage.style.opacity = 1;
			equipePage.style.opacity = 0;
			partenairePage.style.opacity = 0;
			centralInfo.style.opacity = 0;
		}
		if (pageToMoveTo == 2) {
			projetPage.style.opacity = 0;
			equipePage.style.opacity = 1;
			partenairePage.style.opacity = 0;
			centralInfo.style.opacity = 0;
		}
		if (pageToMoveTo == 3) {
			projetPage.style.opacity = 0;
			equipePage.style.opacity = 0;
			partenairePage.style.opacity = 1;
			centralInfo.style.opacity = 0;
		}
		
	}
	
	function startVisit() {
		
	}
	
	function showPlan () {
		plan.style.opacity = 1;
	}
	
	function unShowPlan () {

	}
	
	function manageTrailer(toDo) {
		if (toDo == 0) {
			vid.pause();
			audio.play();
			background.style.opacity = 0.3;
			trailer.style.opacity = 0;
			interface.style.display = 'inline';
			interface.style.opacity = 1;
			webGL.style.display = 'inline';
			basicInterface.style.display = 'inline';
			accueil.style.display = 'inline';
			equipeInfos.style.disaply = 'none';
			projetInfos.style.disaply = 'none';
			partenaireInfosInfos.style.disaply = 'none';
		}
		if (toDo == 1) {
			audio.pause();
			background.style.opacity = 1;
			trailer.style.opacity = 1;
			interface.style.display = 'none';
			interface.style.opacity = 0;
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
