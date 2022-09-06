const ger = document.getElementById("ger");
const kam = document.getElementById("kam");
crr = 0
document.addEventListener("keydown", function (event){
    jump();
});

function jump (){
    if(ger.classList!="jump"){
        ger.classList.add("jump")
        crr = crr+1
    }
    setTimeout(function (){
        ger.classList.remove("jump")

    },300)
}

let  isAlive = setInterval(function (){
    let getTop = parseInt(window.getComputedStyle(ger).getPropertyValue("top"));
    let kamleft = parseInt(window.getComputedStyle(kam).getPropertyValue("left"));
    if(kamleft<50 && kamleft>0 && getTop>=140 && crr<15){
        alert("Game Over!!!"+" Деревьев пройдено:  "+crr)
        crr = 0
    }

},10)