import { getMousePosition } from "../utils/mouseLib";
import { relativePoint } from "../utils/geometryObjects";
import { point } from "../utils/geometryObjects";
import { vector } from "../utils/geometryObjects";

export class hoverMagnet{
  //Element's Attributs
  element : HTMLElement;
  
  animationId : number = 0;
  start : DOMHighResTimeStamp |undefined;
  previousTimeStamp : DOMHighResTimeStamp | undefined;
  mousePos : relativePoint | undefined;

  //magnetCatcher's Attributs
  magnetCatcher : HTMLElement;
  magnetCenter! : point;


  //Parameters
  magnetScale : number; //In Percentage
  force : number;
  inverted: boolean;

  constructor(element:HTMLElement, params : params|undefined = undefined){
    this.element = element;
    this.magnetCatcher = document.createElement("div");

    this.magnetScale = params===undefined ? 50 : (params!.magnetScale ?? 50);
    this.force = params===undefined ? 0.05 : (params!.force ?? 0.05);
    this.inverted = params === undefined ? false : (params!.inverted ?? false);
    
    this.forceElementStyle();
    this.initMagnetCatcher();
  }

  private forceElementStyle(){
    this.element.style.position = "relative";
    this.element.style.isolation = "isolate";
    this.element.style.transformStyle = "preserve-3d";
    this.element.style.transition = "transform 100ms ease";
  }

  private initMagnetCatcher(){
    this.element.appendChild(this.magnetCatcher);


    this.magnetCatcher.style.cssText = `
      position: absolute;
      height: ${100 + this.magnetScale}%;
      width: ${100 + this.magnetScale}%;
      z-index: 1;
    `;
    this;this.magnetCatcher.style.transition = "transform 100ms ease";
    let rect : DOMRect = this.magnetCatcher.getBoundingClientRect();
    this.magnetCenter = {x : (rect.width/2), y : (rect.height/2)};
    
    this.magnetCatcher.addEventListener("mousemove", this.mouseMove.bind(this));
    this.magnetCatcher.addEventListener("mouseleave", this.mouseLeave.bind(this));
  }


  //Event Handler
  private mouseMove(e : MouseEvent){
    this.mousePos = getMousePosition(e); 
    let vec : vector = {x : this.mousePos.x - this.magnetCenter.x, y : this.mousePos.y - this.magnetCenter.y};
    let dist = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y , 2));
    
    let polarity = this.inverted ? -1 : 1; 

    let a = 1/(this.force*dist+1)*polarity;

    this.element.style.transform = `
      translateX(${vec.x*a}px) translateY(${vec.y*a}px)
    `;
    this.magnetCatcher.style.transform = `
      translateX(${-vec.x*a}px) translateY(${-vec.y*a}px)
    `;
  }

  private mouseLeave(e : MouseEvent){
    this.element.style.transform = `
    translateX(0) translateY(0)
  `;
    this.magnetCatcher.style.transform = `
    translateX(0) translateY(0)
    `;
  }
} 


interface params{
  magnetScale?:number;
  force? : number;
  inverted? : boolean;
}
