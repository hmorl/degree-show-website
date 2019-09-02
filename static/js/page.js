var frameNum = 0; //used for changing animation
var bgDiv; //div used as a canvas
var bgSource //element which contains the background;
var borderLeft, borderRight;
//3x 'That', so greater chance of picking 'That'
var themes = ["Intelligence","Phenomenon", "Narration", "Network", "Matter", "Embodiment", "Surveillance"];
var colours = ["#ff6398",  "#00cc85", "#ff6c17", "#b700f2", "#ffdb00", "#00a4ff", "#fc1200"];
var lineHeight, lineHeightEM;
var fontSize;
var screenW, screenH;
var scrollTop;
var scrollLeft;

var linesScrolled;
var colsScrolled;

var charColumns, charRows;
var divs;
var originalDivs = [];
var showASCIIbackground;
var isDesktop = false;

var menuDiv;
var footerDiv;
var headerTextDiv;


var singleDiv;

//scroll to top on load
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

window.onload = function(){
    if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        isDesktop = true;
    }

    if(isDesktop){
        //get background div to put the ascii art in
        bgDiv = document.getElementById('bg');
        if(bgDiv != null){
            showASCIIbackground = true;
        }

        //load first frame of animation
        bgSource = document.getElementById('face-1'); 

        //page border divs
        borderLeft = document.getElementById('border-left');
        borderRight = document.getElementById('border-right');

        //get all divs for grid formatting
        divs = document.getElementsByClassName('ascii');
        menuDiv = document.getElementById('header-menu');
        footerDiv = document.getElementById('footer');
        headerTextDiv = document.getElementById('header-text');
        singleDiv = document.getElementById('single-content');
        if(singleDiv != null){
            singleDiv.style.marginTop="-1.2em";
        }

        document.getElementsByClassName('ascii header')[0].style.display="block";

        headerTextDiv.style.position = "absolute";

        footerDiv.style.left="0ch";
        footerDiv.style.whiteSpace="pre";
        menuDiv.style.position = "absolute";

        originalDivs.push(document.getElementById('header').innerHTML);
        originalDivs.push(footerDiv.innerHTML);

        //get page dimensions and character info
        getDims();
        positions();
        divBorders();
        pageBorder();

        //animation timers
        if(showASCIIbackground) {
            setInterval(changeFrame, 180);
            bgDiv.innerHTML = bgSource.innerHTML;
        }

        document.getElementById('mob-break').style.display = "none";
        //set visible after loading
        document.body.style.display = "block";
    }else {
        document.body.style.margin = -2 + "ch";
    }

    changeTheme();
    setInterval(changeTheme, 1200);
}

function getDims() {
    screenW = document.documentElement.clientWidth;
    screenH = document.documentElement.clientHeight;

    //documentElement doesn't work in Safari so checking document.body as well
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

    scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
    //line height in pixels
    lineHeight = parseFloat(getComputedStyle(document.body).lineHeight);

    //number of character rows currently on screen
    charRows = Math.floor(screenH / lineHeight);
    //number of character rows scrolled
    linesScrolled = Math.floor(scrollTop / lineHeight);
    fontSize = parseFloat(getComputedStyle(document.body).fontSize);

    colsScrolled = Math.floor(scrollLeft/(fontSize/1.25));

    //line height in EM units
    lineHeightEM = lineHeight / fontSize;

    //no idea why /1.25 but it seems to work with any size (letter spacing?)
    charColumns = Math.floor(screenW / (fontSize/1.25));
}
window.onresize = function(){
    if(isDesktop){
        getDims();
        positions();
        divBorders();
        // if(showASCIIbackground){
            pageBorder();
        // } 


    }
}

window.onscroll = function() {
    if(isDesktop){
        getDims();
        positions();
        divBorders();
        // if(showASCIIbackground){
            pageBorder();
        // }


    }
}

function pageBorder() {
    let border = "";

    let borderHeight;

    if(showASCIIbackground){
        borderHeight = linesScrolled+charRows;
    }else {
        borderHeight = (footerDiv.offsetTop/lineHeight) + 4;
    }
    for(let i = 0; i < borderHeight; i++){
        if(i%2==0) border += "/<br>";
        else border += "\\<br>";
    }
    borderLeft.innerHTML = border;
    borderRight.innerHTML = border;
}

function positions(){
    //move right hand border if page scrolled right
    borderRight.style.left = colsScrolled + (charColumns-1) + "ch";

    //float footer, quantising to the line height
    if(showASCIIbackground){
        footerDiv.style.top = (linesScrolled*lineHeightEM) + (lineHeightEM * (charRows - 6)) + "em";
    }
    //move menu down if screen width small
    if(charColumns<49){
        menuDiv.style.top = (4*lineHeightEM)+"em";
        menuDiv.style.left = 2+"ch";
    }else{
        menuDiv.style.left = charColumns - 30 + "ch";
        menuDiv.style.top = (2*lineHeightEM)+ "em";
    }
}

function divBorders() {
    //now the fun part
    for(let i = 0; i < divs.length; i++) {
        var text = originalDivs[i].trim();
        var lines = text.split(/\n/);
        let classes = divs[i].classList;
        var textChars = []; //stores chars WITHOUT the HTML
        var maxLen = 0;
        var pipe;

        //find the max line length for the div,
        //and for each line, store how many characters of html
        //to ignore (e.g. don't want <a> counting towards line length)

        for(let j = 0; j < lines.length; j++){
            lines[j] = lines[j].trim();
            var htmlChars = lines[j].match(/\<(.*?)\>/g);
            var htmlCharsLen = 0;
            if(htmlChars !== null) htmlCharsLen = htmlChars.join("").length;
            textChars.push(lines[j].length - htmlCharsLen);
            if(textChars[j] > maxLen) maxLen = textChars[j];   //find maximum width
        }

        // for future stuff
        if(classes.contains("header")||classes.contains("footer")) {
             maxLen = charColumns - 4;
        }

        //add pipes and padding either side of every line
        for(let j = 0; j < lines.length; j++) {

            var pad = 0;
            //calculate amount of padding between text and the end pipe
            if(textChars[j] < maxLen) pad = maxLen - textChars[j];
            if(classes.contains("footer")){
                lines[j] = "  " + " ".repeat(pad) + lines[j] + "  ";
            }else if (classes.contains("header")){
                lines[j] = "  " + lines[j] + " ".repeat(pad) + "  ";
            }
        }


        if(classes.contains("header")){
            lines.push(" " + " ".repeat(colsScrolled+maxLen+2) + " ");
            if(charColumns < 49){
                lines.push(" " + " ".repeat(colsScrolled+maxLen+2) + " ");
                lines.push(" " + " ".repeat(colsScrolled+maxLen+2) + " ");
            }
        }

        if(classes.contains("header")||classes.contains("footer")){
        //add top and bottom border 
            lines.unshift(" " + "—".repeat(colsScrolled+maxLen+2) + " ");
            lines.push(" " + "—".repeat(colsScrolled+maxLen+2) + " ");
        }

        divs[i].innerHTML = lines.join("\n");
    }
}

//changing the 'thread' text, picks from array of words (at top)
function changeTheme() {
    let threadEl = document.getElementById('thread');
    let themeIdx = Math.floor(Math.random()*themes.length);
    let theme = themes[themeIdx];
    threadEl.style.color = colours[themeIdx]; 
    threadEl.innerHTML = theme;
}

//for animating the background
function changeFrame() {
    // bgSource = document.getElementById('neurons');
    bgSource = document.getElementById('face-' + (frameNum+1));
    // bgSource = document.getElementById('pattern');
    bgDiv.innerHTML = bgSource.innerHTML;
    frameNum = (frameNum+1) % 73;
}