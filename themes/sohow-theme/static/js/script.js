var themes = ["Intelligence","Phenomenon", "Narration", "Network", "Matter", "Embodiment", "Surveillance"];
var colours = ["#A803F6", "#989898", "#7EFE81", "#FBAA0B", "#FB3F3F", "#0182FA", "#FBAEBC"];
var switcher = 0;
var themeEl;
var i;

window.onload = function(){
    splitLines();
    themeEl = document.getElementById('that');
    setInterval(textSwitcher, 230);
}

function splitLines() {
    var p = document.getElementById("title");

    p.innerHTML = p.innerText.split(/\s/).map(function(word) {
        if(word=="that"){
            return '<span class = "word" id = "that">' + word + '</span>'
        }else {
            return '<span class = "word">' + word + '</span>'
        }
    }).join(' ');
  }

function textSwitcher() {
    var themeText;
    if(switcher < 12){
        let rand = Math.floor(Math.random() * themes.length);
        while(rand==i){
            rand = Math.floor(Math.random() * themes.length);
        }
        i = rand;
        themeText = themes[i].toUpperCase();
        // themeEl.style.color = getRandomColor();
        themeEl.style.color = colours[i];
    }else{
        themeEl.style.color = "#000000";
        themeText = "that";
    }

    themeEl.innerHTML = themeText;
    switcher = (switcher+1) % 16;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}