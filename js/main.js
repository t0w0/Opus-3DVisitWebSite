$(function(){
	
	var infosMenuOpen = false;
	
	init();
	//animate();
	
	function init() {
		var button = document.getElementById( 'infosDeploy' );
		button.addEventListener( 'mouseover', function ( event ) {
			openInfosMenu();
		}, false );
		
		var infosMenu = document.getElementById('infosMenu');
		infosMenu.style.opacity = 0;
	}
	
	function openInfosMenu() {
		infosMenuOpen = true;
		infosMenu.style.opacity =+ 0.1;
	}
	
	function animate(){
        requestAnimationFrame(animate);
	}
});
