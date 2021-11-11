//canvas layers

//layer0 whiteboard
let canvas0;
let context0;
//layer1 notes
let canvas1;
let context1;
//layer2 images
let canvas2;
let context2;
//array to keep track of notes!
let noteObjects = new Array();
//array to keep track of images!
let imageObjects = new Array();

//initalize 
function init(){
    //layer0 whiteboard
    canvas0 = document.querySelector("#canvas0");
    context0 = canvas0.getContext("2d");
    canvas0.height = window.innerHeight;
    canvas0.width = window.innerWidth;
    //layer1 notes
    canvas1 = document.querySelector("#canvas1");
    context1 = canvas1.getContext("2d");
    canvas1.height = window.innerHeight;
    canvas1.width = window.innerWidth;
    //layer2 images
    //layer1 notes
    canvas2 = document.querySelector("#canvas2");
    context2 = canvas1.getContext("2d");
    canvas2.height = window.innerHeight;
    canvas2.width = window.innerWidth;
    //hide buttons that arent meant to show up, show buttons that are
    brushSlider.style.display = "none";
    deleteButton.style.display = "block";
    colorButton.style.display = "block";
    //deactivate buttons
    deleteButton.disabled = true;
    colorButton.disabled = true;
}

//text
const featuresText = document.getElementById("featuresText");

//buttons functions
//drag, draw, and erase button
const drawButton = document.getElementById('draw');
drawButton.addEventListener('click', clickDrawButton);
function clickDrawButton(){
    //whichever flag is currently true, change text to next option and set flags accordingly
    if(dragFlag){
        drawButton.innerText = 'Erase';
        drawFlag = true;
        dragFlag = false;
        eraseFlag = false;
        brushSlider.style.display = "block";
        deleteButton.style.display = "none";
        colorButton.style.display = "none";
        featuresText.textContent = "Brush Size:"
    }
    else if(drawFlag){ 
        drawButton.innerText = 'Drag';
        drawFlag = false;
        dragFlag = false;
        eraseFlag = true;
    }
    else{
        drawButton.innerText = 'Draw';
        drawFlag = false;
        dragFlag = true;
        eraseFlag = false;
        brushSlider.style.display = "none";
        deleteButton.style.display = "block";
        colorButton.style.display = "block";
        featuresText.textContent = "Note Controls:"
    }
}

//note text
const noteText = document.getElementById('noteText_txt');
//note button
const noteButton = document.getElementById('note');
noteButton.addEventListener('click',clickNoteButton);
function clickNoteButton(){
    //create a new note and throw it into the array
    let stickyNote = new StickyNote(200, 275, 300, 300, noteText.value);
    noteObjects.push(stickyNote);
}

//clear button
const clearButton = document.getElementById('clear');
clearButton.addEventListener('click',clickEraseButton);
function clickEraseButton(){
    eraseCanvas(context0);
    eraseCanvas(context1);
    eraseCanvas(context2);
    noteObjects.length = 0;
    clickedNote = null;
}
//erase canvas function
function eraseCanvas(context){
    context.clearRect(0,0,window.innerWidth, window.innerHeight);
}

//hidden buttons (show up when their actions are being used)

//slider function, brush size for drawing and erasing
const brushSlider = document.getElementById('brushSize');
let brushSize = 15;
brushSlider.oninput = function(){
    brushSize = this.value;
}

//delete note button
const deleteButton = document.getElementById('delete');
deleteButton.addEventListener('click',clickDeleteButton);
function clickDeleteButton(){
    for(let i = 0; i < noteObjects.length; i++){
        if(noteObjects[i] == clickedNote){
            noteObjects.splice(i,1);
            context1.clearRect(0,0, window.innerWidth, window.innerHeight);
        }
    }
    clickedNote = null;
}

//change note color
const colorButton = document.getElementById('color');
colorButton.addEventListener('click',clickColorButton);
function clickColorButton(){
    for(let i = 0; i < noteObjects.length; i++){
        if(noteObjects[i] == clickedNote){
            noteObjects[i].changeColor();
        }
    }
}

//file upload button
const uploadButton = document.getElementById('submit');
const uploadFile = document.getElementById('fileToUpload');
uploadButton.addEventListener('click',clickUploadButton)
function clickUploadButton(){
    let image = new Image();
    image.src = uploadFile.value;
    let uploadedImage = new UploadedImage(window.innerWidth / 2, window.innerHeight / 2, 300, 300, image);
    imageObjects.push(uploadedImage);
}



//drawing and erasing
//create drag,draw,and erase flags to keep track of current action
let drawFlag = false;
let dragFlag = true;
let eraseFlag = false;
let drawing = false;
let erasing = false;
//variables to help with coordinates
let startX = 0;
let startY = 0;
//variable to find last clicked note
let clickedNote;
function startPos(e){
    if(!dragFlag){
        if(drawFlag)
            drawing = true;
        else
            erasing = true;
    }
    else{
        startX = e.clientX;
        startY = e.clientY;
        //for loop to check if grabbing any note
        for(let note of noteObjects){
            if(collision(note,e.clientX,e.clientY)){
                note.isDragging = true;
                clickedNote = note;
                context1.clearRect(0,0, window.innerWidth, window.innerHeight);
            }
        }
    }
}
function endPos(){
    if(!dragFlag){
        if(drawFlag)
            drawing = false;
        else
            erasing = false;
        context0.beginPath();
    }
    else{
        //for loop to make all note objects stop dragging
        for(let note of noteObjects){
            note.isDragging = false;
        }
    }
}
function draw(e){
    if(!dragFlag){
        document.body.style.cursor = "crosshair";
        if(drawFlag){
            if(!drawing) return;
            context0.lineCap = "round";
            context0.strokeStyle = "black";
            context0.lineWidth = brushSize;
        }
        else{
            if(!erasing) return;
            context0.lineCap = "square";
            context0.strokeStyle = "darkgrey";
            context0.lineWidth = brushSize;
        }
        context0.lineTo(e.clientX, e.clientY);
        context0.stroke();
        context0.beginPath();
        context0.moveTo(e.clientX, e.clientY);
    }
    else{
        document.body.style.cursor = "grab";
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;

        //for loop to check if dragging any note
        for(let note of noteObjects){
            if(note.isDragging){
                context1.clearRect(0,0, window.innerWidth, window.innerHeight);
                note.x += dx;
                note.y += dy;
                document.body.style.cursor = "grabbing";
            }
        }
    }

}

//mouse
document.addEventListener( 'mousemove', draw, false);
document.addEventListener( 'mousedown', startPos, false);
document.addEventListener( 'mouseup', endPos, false);
//window resize event
function onWindowResize() {
    canvas0.height = window.innerHeight;
    canvas0.width = window.innerWidth;
    canvas1.height = window.innerHeight;
    canvas1.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    canvas2.width = window.innerWidth;
}
window.addEventListener( 'resize', onWindowResize, false );

//object collision function
function collision(note, x, y){
    if(x > note.x - note.getWidth() * 0.5 && y > note.y - note.getHeight() * 0.5 && x < note.x + note.getWidth() - 
        note.getWidth() * 0.5 && y < note.y + note.getHeight() - note.getHeight() * 0.5)
        return true
    else
        return false
}


//(game loop kind of)
//animate to allow dragging and dropping to be seemless looking
const animate = function(){
    requestAnimationFrame(animate);
    //render notes and images always for that awesome seankess look
    for(let note of noteObjects){
        note.render(context1);
    }
    for(let image of imageObjects){
        image.render(context2);
    }
    //check if there are any notes to delete and if any note was clicked
    if(noteObjects.length > 0 && clickedNote != null){
        //enable buttons for notes
        deleteButton.disabled = false;
        colorButton.disabled = false;
    }
    else{
        //disable buttons for notes
        deleteButton.disabled = true;
        colorButton.disabled = true;
    }
}

//blast off
init();
animate();


//sticky note class
class StickyNote{
    constructor(x, y, height, width, text){
        this.setHeight(height);
        this.setWidth(width);
        this.x = x;
        this.y = y;
        this.isDragging = false;
        this.setText(text);
        this.setColor("yellow");

        this.render(context1);
        
    }
    changeColor(){
        switch(this.getColor()){
            case "yellow":
                this.setColor("red");
                break;
            case "red":
                this.setColor("blue");
                break;
            case "blue":
                this.setColor("purple");
                break;
            default:
                this.setColor("yellow");
        }
    }
    render(context){
        context.save();
        context.beginPath();
        context.rect(this.x - this.getWidth() * 0.5, this.y - this.getHeight() * 0.5, this.getWidth(), this.getHeight());
        context.fillStyle = this.getColor();
        context.fill();
        context.fillStyle = "black";
        context.fillText(this.text,this.x - 100,this.y - 100,this.getWidth());
        context.restore();
    }
    getHeight(){
        return this.height;
    }
    getWidth(){
        return this.width;
    }
    getText(){
        return this.text;
    }
    setText(a){
        this.text = a;
    }
    setWidth(width){
        this.width = width;
    }
    setHeight(height){
        this.height = height;
    }
    getColor(){
        return this.color;
    }
    setColor(color){
        this.color = color;
        context1.fillStyle = this.color;
    }
}

//sticky note class
class UploadedImage{
    constructor(x, y, height, width, img){
        this.setHeight(height);
        this.setWidth(width);
        this.img = img;
        this.x = x;
        this.y = y;
        this.isDragging = false;

        this.render(context2);
        
    }
    render(context){
        context.save();
        context.beginPath();
        context.drawImage(this.img,this.x - this.getWidth() * 0.5, this.y - this.getHeight() * 0.5);
        context.restore();
    }
    getHeight(){
        return this.height;
    }
    getWidth(){
        return this.width;
    }
    setWidth(width){
        this.width = width;
    }
    setHeight(height){
        this.height = height;
    }
}