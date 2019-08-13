var frameNum = 0; //used for changing animation
var bgDiv; //div used as a canvas
var bgSource //element which contains the background;
//3x 'That', so greater chance of picking 'That'
var themes = ["That", "That", "That", "Intelligence","Phenomenon", "Narration", "Network", "Matter", "Embodiment", "Surveillance"];
var lineHeight, lineHeightEM;
var fontSize;
var screenW, screenH;
var scrollTop;
var linesScrolled;
var charColumns, charRows;
var divs;
var originalDivs = [];

//scroll to top on load
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

window.onload = function(){
    //get background div to put the ascii art in
    bgDiv = document.getElementById('bg'); 
    bgSource = document.getElementById('neurons');
    //for animation (future)
    //bgSource = document.getElementById('bg-1'); 

    document.getElementById('thread').innerHTML="";

    //get all divs for grid formatting
    divs = document.getElementsByClassName('floating');

    //prevents text from filling recursively
    for(var i = 0; i < divs.length; i++) {
        originalDivs.push(divs[i].innerHTML);
    }

    getDims();
    positions();
    borders();

    //le fix
    document.getElementById('thread').innerHTML="That";

    //for future animations
    // setInterval(changeFrame, 500);
    setInterval(changeTheme, 1200);

    //set bg div to the ascii source div
    bgDiv.innerHTML = bgSource.innerHTML;
}

function getDims() {
    screenW = document.documentElement.clientWidth;
    screenH = document.documentElement.clientHeight;
    //documentElement doesn't work in Safari so checking document.body as well
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

    //line height in pixels
    lineHeight = parseFloat(getComputedStyle(document.body).lineHeight);

    //number of character rows currently on screen
    charRows = Math.floor(screenH / lineHeight);
    //number of character rows scrolled
    linesScrolled = Math.floor(scrollTop / lineHeight);
    fontSize = parseFloat(getComputedStyle(document.body).fontSize);

    //line height in EM units
    lineHeightEM = lineHeight / fontSize;

    //no idea why /1.25 but it seems to work with any size (letter spacing?)
    charColumns = Math.floor(screenW / (fontSize/1.25));
}
window.onresize = function(){
    getDims();
    positions();
    borders();
    //stops glitching
    document.getElementById('thread').innerHTML="That";
}

window.onscroll = function() {
    getDims();
    positions();
}

function positions(){
    //a lovely js media query. if on desktop:
    if(screenW > fontSize * 35) {
        for(let i = 0; i < divs.length; i++) {
            var classes = divs[i].classList;
            divs[i].style.position = "absolute";

            // header/footer for future designs
            if(classes.contains("footer")){
                divs[i].style.left = 0;
                divs[i].style.top = (linesScrolled*lineHeightEM) + (lineHeightEM * (charRows - 3)) + "em";
            } else if (classes.contains("header")){
                divs[i].style.left = 0;
                divs[i].style.top = (linesScrolled*lineHeightEM)+ "em";

            // central sets x and y relative to the center of the screen
            } else if (classes.contains("central")){
                let metrics = classes[1];
                let x = Number(metrics.split(",")[0]);
                let y = Number(metrics.split(",")[1]);
                divs[i].style.left = Math.floor(charColumns/2)+x + "ch";
                divs[i].style.top = (lineHeightEM*(Math.floor(charRows/2)+y) + linesScrolled*lineHeightEM)+ "em";
            } else {
                let metrics = classes[1];
                let x = Number(metrics.split(",")[0]);
                let y = Number(metrics.split(",")[1]);
                divs[i].style.left = x + "ch";
                divs[i].style.top = (y*lineHeightEM + linesScrolled*lineHeightEM)+ "em";
            }
        }
    } else {   //else, set divs to static blocks (let css handle it)
        for(let i = 0; i < divs.length; i++) {
            divs[i].style.position = "static";
            divs[i].style.display = "block";
            divs[i].style.marginLeft = "2ch";
            divs[i].style.marginTop = lineHeightEM +"em";
        }
    }
}

function borders() {
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

        //This has to be performed on innerHTML
        //rather than innerText, to allow for things like links to make it through

        for(let j = 0; j < lines.length; j++){
            lines[j] = lines[j].trim();
            var htmlChars = lines[j].match(/\<(.*?)\>/g);
            var htmlCharsLen = 0;
            if(htmlChars !== null) htmlCharsLen = htmlChars.join("").length;
            textChars.push(lines[j].length - htmlCharsLen);
            if(textChars[j] > maxLen) maxLen = textChars[j];   //find maximum width
        }

        // for future stuff
        if(maxLen < charColumns-8 && (classes.contains("header")||classes.contains("footer") )) {
             maxLen = charColumns - 5;
        }

        //add pipes and padding either side of every line
        for(let j = 0; j < lines.length; j++) {
            //if j odd, pipe forward slash, otherwise backslash
            (j%2==1) ? pipe = "/" : pipe = "\\";
            var pad = 0;
            //calculate amount of padding between text and the end pipe
            if(textChars[j] < maxLen) pad = maxLen - textChars[j];

            if(classes.contains("footer")){
                lines[j] = pipe + " " + " ".repeat(pad) + lines[j] + " " + pipe;
            }else{
                lines[j] = pipe + " " + lines[j] + " ".repeat(pad) + " " + pipe;
            }
        }

        //add top border 
        lines.unshift("/" + "—".repeat(maxLen+2) + "/");
        if((lines.length%2)==0) pipe = "/"; else pipe = "\\";

        //add bottom border (and alternate pipe depending whether odd or even number of lines!)
        lines.push(pipe + "—".repeat(maxLen+2) + pipe);
        divs[i].innerHTML = lines.join("\n");
    }
}

//changing the 'thread' text, picks from array of words (at top)
function changeTheme() {
    let threadEl = document.getElementById('thread');
    let theme = themes[Math.floor(Math.random()*themes.length)];
    threadEl.innerHTML = theme;
}

//for animating the background
function changeFrame() {
    bgSource = document.getElementById('neurons');
    // bgSource = document.getElementById('bg-' + (frameNum+1));
    // bgSource = document.getElementById('pattern');
    bgDiv.innerHTML = bgSource.innerHTML;
    frameNum = (frameNum+1) % 12;
}