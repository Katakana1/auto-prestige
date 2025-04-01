function save(){
	localStorage.setItem('autopres', btoa(JSON.stringify(game)));
}

function wipe(){
  game = new Game();
}

function load(){
  if(localStorage.getItem('autopres') != null){
	  game = JSON.parse(atob(localStorage.getItem('autopres')));
  }
}
