function addGame(){
    console.log("I hear my name");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        document.getElementById("addform").innerHTML = this.responseText;



    };
    xhttp.open("GET","form_game.txt",true);
    xhttp.send();



}
