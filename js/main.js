$(function(){
	
	var infosMenuOpen = false;
	
	init();
	//animate();
	
	function init() {
		/*var button = document.getElementById( 'infosDeploy' );
		button.addEventListener( 'mouseover', function ( event ) {
			openInfosMenu();
		}, false );*/
		
		//var infosMenu = document.getElementById('infosMenu');
		//infosMenu.style.opacity = 0;
		
		
		var projetButton = document.getElementById( 'infosDeploy' );
		projetButton.addEventListener( 'click', function ( event ) {
			navigateBetweenPage(0);
		}, false );
		
		var projetButton = document.getElementById( 'projet' );
		projetButton.addEventListener( 'click', function ( event ) {
			navigateBetweenPage(1);
		}, false );
		
		var equipeButton = document.getElementById('equipe');
		projetButton.addEventListener('click', function(event){
			navigateBetweenPage(2);
		}, false)
		
		var equipeButton = document.getElementById('partenaire');
		projetButton.addEventListener('click', function(event){
			navigateBetweenPage(3);
		}, false)
	}
	
	function animate(){
        requestAnimationFrame(animate);
	}
	
	function navigateBetweenPage (pageToMoveTo) {
		var projetPage = document.getElementById('projetPage');
		var equipePage = document.getElementById('equipePage');
		var partenairePage = document.getElementById('partenairePage');
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
});
