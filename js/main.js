$(function(){
	
	var body = document.body; // Make the body go full screen.
	
	
	var centralInfo = document.getElementById('centralInfo');
	var projetPage = document.getElementById('projetPage');
	var equipePage = document.getElementById('equipePage');
	var menu = document.getElementById('menu');
	var partenairePage = document.getElementById('partenairesPage');
	var infosDeployButton = document.getElementById( 'infosDeploy' );
	var projetButton = document.getElementById( 'projet' );
	var equipeButton = document.getElementById('equipe');
	var partenaireButton = document.getElementById('partenaires');
	var startButton = document.getElementById('startButton');
	var fullScreenButton = document.getElementById('fullScreen');
	var muteButton = document.getElementById('mute');
	var background = document.getElementById('background');
	var logo = document.getElementById('logoMenu');
	var skipTrailer = document.getElementById ('skipTrailer');
	var vid = document.getElementById("trailerVid");
	var trailerDiv = document.getElementById("trailer");
	var webGL = document.getElementById("webGL-container");
	
	var audio = new Audio('./data/sound/cathSound.mp3');
	var mute = false;
	
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
		
		centralInfo.style.display = 'none';
		projetPage.style.display ='none';
		equipePage.style.display = 'none';
		partenairePage.style.display = 'none';
		startButton.style.display='none';
		menu.style.display='none';
		logo.style.display='none';
		webGL.style.display='none';
			
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
	
	function showPlan () {
		plan.style.display = 'inline';
		plan.style.opacity = 1;
	}
	
	function unShowPlan () {
		plan.style.display = 'none';
	}
	
	function manageTrailer(toDo) {
		if (toDo == 0) {
			vid.pause();
			trailerDiv.style.display = 'none';
			audio.play();
			centralInfo.style.display = 'inline';
			projetPage.style.display ='inline';
			equipePage.style.display = 'inline';
			partenairePage.style.display = 'inline';
			startButton.style.display='inline';
			webGL.style.display='inline';
			menu.style.display='inline';
			logo.style.display='inline';
		}
		if (toDo == 1) {
			vid.start();
			trailerDiv.style.display = 'inline';
			audio.pause();
			centralInfo.style.display = 'none';
			projetPage.style.display ='none';
			equipePage.style.display = 'none';
			partenairePage.style.display = 'none';
			startButton.style.display='none';
			webGL.style.display='none';
			menu.style.display='none';
			logo.style.display='none';
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
