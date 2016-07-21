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
		
		var button = document.getElementById( 'projet' );
		button.addEventListener( 'click', function ( event ) {
			navigateBetweenPage(1);
		}, false );
	}
	
	function openInfosMenu() {
		infosMenuOpen = true;
		infosMenu.style.opacity =+ 0.1;
	}
	
	function animate(){
        requestAnimationFrame(animate);
	}
	
	function navigateBetweenPage (pageToMoveTo) {
		var projetPage = document.getElementById('projetPage');
		var equipePage = document.getElementById('projetPage');
		var partenairePage = document.getElementById('projetPage');
		var centralInfo = document.getElementById('centralInfo');
		if (pageToMoveTo == 1) {
			projetPage.style.opacity = 1;
			//equipePage.style.opacity = 1;
			//partenairePage.style.opacity = 1;
			centralInfo.style.opacity = 0;
		}
	}
});
