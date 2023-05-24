import { hoverBubble } from "./hovers/hoverBubble";
import { hoverMagnet } from "./hovers/hoverMagnet";
import { hoverScale } from "./hovers/hoverScales";
import { hoverSpread } from "./hovers/hoverSpread";
import { hoverSquares } from "./hovers/hoverSquares";

let buttonSpread = document.getElementById("hoverSpread")!;
let buttonScale = document.getElementById("hoverScales")!;
let buttonSquare = document.getElementById("hoverSquares")!;
let buttonMagnet = document.getElementById("hoverMagnet")!;
let buttonBubble = document.getElementById("hoverbubble")!;
let buttonSqueeze = document.getElementById("hoverSqueeze")!;

new hoverSpread(buttonSpread);
new hoverScale(buttonScale, {delay :35, spreadOrientation:125,nbLines:4 , nbColumns:7});
new hoverSquares(buttonSquare, {delay:35, spreadOrientation: 0, nbSquaresByLines:15});
new hoverMagnet(buttonMagnet, {magnetScale:200, force:0.08});
new hoverMagnet(buttonBubble, {magnetScale:200, force:0.08});
new hoverBubble(buttonBubble, {startPoint:{x:-25,y:50}, endPoint:{x:125,y:50}, speed:0.4,  startDelay:50});
new hoverBubble(buttonBubble, {startPoint:{x:-25,y:50}, endPoint:{x:125,y:50}, speed:0.4, color:"rgba(0,0,0,0.25)", zIndex:-2,  endDelay:50});



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