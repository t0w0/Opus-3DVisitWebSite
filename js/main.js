$(function(){
	
	var body = document.body; // Make the body go full screen.
	
	var centralInfo = document.getElementById('centralInfo');
	var projetPage = document.getElementById('projetPage');
	var equipePage = document.getElementById('equipePage');
	var partenairePage = document.getElementById('partenairesPage');
	var infosDeployButton = document.getElementById( 'infosDeploy' );
	var projetButton = document.getElementById( 'projet' );
	var equipeButton = document.getElementById('equipe');
	var partenaireButton = document.getElementById('partenaires');
	var lateralInfosR = document.getElementById('lateralInfosR');
	var startButton = document.getElementById('startButton');
	var fullScreenButton = document.getElementById('fullScreen');
	var muteButton = document.getElementById('mute');
	var background = document.getElementById('background');
	
	var audio = new Audio('./data/sound/cathSound.mp3');
	var mute = false;
	
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
			
		audio.play();
			
	}
	
	function navigateBetweenPage (pageToMoveTo) {
		if (pageToMoveTo == 0) {
			projetPage.style.opacity = 0;
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
		centralInfo.style.display = 'none';
		projetPage.style.display ='none';
		equipePage.style.display = 'none';
		partenairePage.style.display = 'none';
		startButton.style.display='none';
		background.style.display = 'none';
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
