$(function(){
	
	var elem = document.body; // Make the body go full screen.
	
	init();
	
	function init() {
		
		var infosDeployButton = document.getElementById( 'infosDeploy' );
		infosDeployButton.addEventListener( 'click', function ( event ) {
			navigateBetweenPage(0);
		}, false );
		
		var projetButton = document.getElementById( 'projet' );
		projetButton.addEventListener( 'click', function ( event ) {
			navigateBetweenPage(1);
		}, false );
		
		var equipeButton = document.getElementById('equipe');
		equipeButton.addEventListener('click', function(event){
			navigateBetweenPage(2);
		}, false)
		
		var partenaireButton = document.getElementById('partenaires');
			partenaireButton.addEventListener('click', function(event){
			navigateBetweenPage(3);
		}, false)
		
		var fullScreenButton = document.getElementById('fullScreenPict');
			fullScreenButton.addEventListener('click', function(event){
			requestFullScreen(elem);
		}, false)
			
	}
	
	function navigateBetweenPage (pageToMoveTo) {
		var projetPage = document.getElementById('projetPage');
		var equipePage = document.getElementById('equipePage');
		var partenairePage = document.getElementById('partenairesPage');
		var centralInfo = document.getElementById('centralInfo');
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
