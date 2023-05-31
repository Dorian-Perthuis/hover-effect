import { hoverMagnet } from "./hovers/hoverMagnet";
import { hoverScale } from "./hovers/hoverScales";
import { hoverSpread } from "./hovers/hoverSpread";
import { hoverSquares } from "./hovers/hoverSquares";

const hoverElement:HTMLElement = document.querySelector(".hoverElement")!;

let buttonSpread = document.getElementById("spread")!;
let buttonRectangle = document.getElementById("rectangle")!;
let buttonSquare = document.getElementById("square")!;
let buttonMagnet = document.getElementById("magnet")!;

new hoverSpread(buttonSpread);
new hoverScale(buttonRectangle,{delay :35, spreadOrientation:125,nbLines:4 , nbColumns:7});
new hoverSquares(buttonSquare, {delay:35, spreadOrientation: 0, nbSquaresByLines:15});
new hoverMagnet(buttonMagnet, {magnetScale:200, force:0.08});

const effectBtns:HTMLCollectionOf<Element> = document.getElementsByClassName("effectBtn");

let effectSelected:string = "";

const effectBtnClickHandle = (e:Event) => {
    updateOptions((<HTMLElement>e.target).id);
};

const updateOptions = (effect:string) => {
    document.getElementById(effectSelected)?.classList.remove("selected");
    document.getElementById(effectSelected+"Option")?.classList.remove("selected");
    effectSelected = effect;
    document.getElementById(effectSelected)?.classList.add("selected");
    document.getElementById(effectSelected+"Option")?.classList.add("selected");
};


Array.from(effectBtns).forEach(btn => {
    btn.addEventListener("click", effectBtnClickHandle);
});


//All forms
const spreadForm:HTMLFormElement = document.querySelector('form[name="spreadForm"]')!;
const rectangleForm:HTMLFormElement = document.querySelector('form[name="rectangleForm"]')!;
const squareForm:HTMLFormElement = document.querySelector('form[name="squareForm"]')!;
const magnetForm:HTMLFormElement = document.querySelector('form[name="magnetForm"]')!;

//------------Forms' Logic-------------
//------Spread Form
const spreadHoverBuilder = new hoverSpread();
const spreadCheckox:HTMLInputElement = <HTMLInputElement>spreadForm.elements.namedItem("active")!;

spreadCheckox.addEventListener("change", () => {
    if(spreadCheckox.checked){
        let bezier = {
            x1:(<HTMLInputElement>(<HTMLFieldSetElement>spreadForm.elements.namedItem("bezierPoints")).elements.namedItem("x1")).valueAsNumber,
            y1:(<HTMLInputElement>(<HTMLFieldSetElement>spreadForm.elements.namedItem("bezierPoints")).elements.namedItem("y1")).valueAsNumber,
            x2:(<HTMLInputElement>(<HTMLFieldSetElement>spreadForm.elements.namedItem("bezierPoints")).elements.namedItem("x2")).valueAsNumber,
            y2:(<HTMLInputElement>(<HTMLFieldSetElement>spreadForm.elements.namedItem("bezierPoints")).elements.namedItem("y2")).valueAsNumber
        };
        spreadHoverBuilder
            .setSpeed((<HTMLInputElement>spreadForm.elements.namedItem("speed")).valueAsNumber)
            .setHoverColor((<HTMLInputElement>spreadForm.elements.namedItem("hoverColor")).value)
            .setBezierPoints(bezier)
            .addOn(hoverElement);
    }else{
        spreadHoverBuilder.removeFrom(hoverElement);
    }
});

//------Rectangle Form
const rectangleHoverBuilder = new hoverScale();
const rectangleCheckox:HTMLInputElement = <HTMLInputElement>rectangleForm.elements.namedItem("active")!;

rectangleCheckox.addEventListener("change", () => {
    if(rectangleCheckox.checked){
        let transitions:Array<string> = (<HTMLInputElement>rectangleForm.elements.namedItem("transitions")).value.split('\n');
        rectangleHoverBuilder
            .setNbLines((<HTMLInputElement>rectangleForm.elements.namedItem("nbLines")).valueAsNumber)
            .setNbColumns((<HTMLInputElement>rectangleForm.elements.namedItem("nbColumns")).valueAsNumber)
            .setDelay((<HTMLInputElement>rectangleForm.elements.namedItem("delay")).valueAsNumber)
            .setSpreadOrientation((<HTMLInputElement>rectangleForm.elements.namedItem("orientation")).valueAsNumber)
            .setCssProperties(transitions)
            .linkTo(hoverElement);
    }else{
        rectangleHoverBuilder.removeFrom(hoverElement);
    }
});

//------Square Form
const squareHoverBuilder = new hoverSquares();
const squareCheckox:HTMLInputElement = <HTMLInputElement>squareForm.elements.namedItem("active")!;

squareCheckox.addEventListener("change", () => {
    if(squareCheckox.checked){
        let transitions:Array<string> = (<HTMLInputElement>squareForm.elements.namedItem("transitions")).value.split('\n');

        squareHoverBuilder
            .setNbSquaresByLines((<HTMLInputElement>squareForm.elements.namedItem("nbSquaresByLine")).valueAsNumber)
            .setDelay((<HTMLInputElement>squareForm.elements.namedItem("delay")).valueAsNumber)
            .setSpreadOrientation((<HTMLInputElement>squareForm.elements.namedItem("orientation")).valueAsNumber)
            .setCssProperties(transitions)
            .linkTo(hoverElement);

    }else{
        squareHoverBuilder.removeFrom(hoverElement);
    }
});


/*
Idea :
diamonds shape
triangles : square, dent, diagonale shape
squeeze
add bezier curve animation to square and scale
*/

/* TODO
 - Bug : hoverMagnet + other hover don't work
*/