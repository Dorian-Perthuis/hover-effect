import { bezierPoints, relativePoint } from "../utils/geometryObjects";
import bezier from "bezier-easing";

export class hoverBubble{
  //Attributs
  element : HTMLElement;
  bubble : HTMLElement;
  enter:animeVar = {
    done: false,
    isAnim: false
  };
  leave: animeVar = {
    done: false,
    isAnim: false
  };
  timeFunction : bezier.EasingFunction;

  //Parameters
  startDelay: number;
  endDelay: number;
  startPoint: relativePoint;
  endPoint: relativePoint;
  color: string;
  speed: number;
  timeLimit: number;
  zIndex: number;
  bezierPoints : bezierPoints;

  constructor(element : HTMLElement, params:params|undefined = undefined){
    this.element = element;
    this.bubble = document.createElement("div");
    this.startDelay = params === undefined ? 0 : (params!.startDelay ?? 0);
    this.endDelay = params === undefined ? 0 : (params!.endDelay ?? 0);
    this.startPoint = params === undefined ? {x:0,y:0} : (params!.startPoint ?? {x:0,y:0});
    this.endPoint = params === undefined ? {x:100,y:100} : (params!.endPoint ?? {x:100,y:100});
    this.color = params === undefined ? "hsla(354,81%,72%,1)" : (params!.color ?? "hsla(354,81%,72%,1)");
    this.speed = params === undefined ? 0.30 : (params!.speed ?? 0.30);
    this.timeLimit = params === undefined ? 1000 : (params!.timeLimit ?? 1000);
    this.zIndex = params === undefined ? -1 : (params!.zIndex ?? -1);

    this.bezierPoints = params===undefined ? {x1:0,y1:0,x2:1,y2:1} : (params.bezier ?? {x1:0,y1:0,x2:1,y2:1});
    this.timeFunction = bezier(this.bezierPoints.x1, this.bezierPoints.y1, this.bezierPoints.x2, this.bezierPoints.y2);

    this.forceStyle();
    this.initBubble();

    //Event listener
    element.addEventListener("mouseenter",this.mouseEnter.bind(this));
    element.addEventListener("mouseleave",this.mouseLeave.bind(this));
  }

//Methodes

  private forceStyle(){
    this.element.style.position = "relative";
    this.element.style.isolation = "isolate";
  }

  private initBubble(){
    this.bubble.style.position = "absolute";
    this.bubble.style.width = "100%";
    this.bubble.style.height = "100%";
    this.bubble.style.zIndex = ""+this.zIndex;

    this.element.appendChild(this.bubble);
  }


  //--------------Event-Handlers entry Point--------------
  private mouseEnter(){
    if(this.leave.isAnim){
      console.log("stop leave anim");
      window.cancelAnimationFrame(this.leave.animID!);
      this.endLeaveAnim();
    }
    if(!this.enter.isAnim){
      console.log("start enter anim");
      this.initEnterAnim();
      this.enter.animID = window.requestAnimationFrame(this.enterAnim.bind(this));
    } 
  }
  
  private mouseLeave(){
    if(this.enter.isAnim){
      console.log("stop enter anim");
      window.cancelAnimationFrame(this.enter.animID!);
      this.endEnterAnim();
    }
    if(!this.leave.isAnim){
      console.log("start leave anim");
      this.initLeaveAnim();
      this.leave.animID = window.requestAnimationFrame(this.leaveAnim.bind(this));
    } 
  }

  //--------------Enter Animation--------------
  private initEnterAnim(){
    this.enter.isAnim = true;
  }


  private enterAnim(timestamp : DOMHighResTimeStamp){
    if (this.enter.start === undefined) {
      this.enter.start = timestamp;
    }
    const elapsed = timestamp - this.enter.start - this.startDelay;

    if (this.enter.previousTimeStamp !== timestamp) {
      const count = this.timeFunction(Math.max(Math.min(this.speed * elapsed, 100),0)/100)*100;
      this.bubble.style.backgroundImage = `radial-gradient(circle at ${this.startPoint.x}% ${this.startPoint.y}%, ${this.color} 0px, ${this.color} ${count}%, transparent ${count}%)`;
      
      if (count === 100) this.enter.done = true;
    }
  
    if (elapsed < this.timeLimit) { // Stop the animation after the time limite define
      this.enter.previousTimeStamp = timestamp;
      if (!this.enter.done) {
        this.enter.animID = window.requestAnimationFrame(this.enterAnim.bind(this));
      }
      else{
        this.endEnterAnim();
      }
    }else{
      this.endEnterAnim();
    }
  }
  
  private endEnterAnim(){
    this.bubble.style.backgroundImage = `radial-gradient(circle at ${this.startPoint.x}% ${this.startPoint.y}%, ${this.color} 0px, ${this.color} 100%, transparent 100%)`;
    this.enter.done = false;
    this.enter.isAnim = false;
    this.enter.start = undefined;
    this.enter.previousTimeStamp = undefined;
  }
  //------------------------------------

  //--------------Leave Animation--------------
  private initLeaveAnim(){
    this.leave.isAnim = true;
  }

  private leaveAnim(timestamp : DOMHighResTimeStamp){
    if (this.leave.start === undefined) {
      this.leave.start = timestamp;
    }
    const elapsed = timestamp - this.leave.start - this.endDelay;

    if (this.leave.previousTimeStamp !== timestamp) {
      const count = Math.max(Math.min(this.speed*elapsed, 100),0);
      this.bubble.style.backgroundImage = `radial-gradient(circle at ${this.endPoint.x}% ${this.endPoint.y}%, ${this.color} 0px, ${this.color} ${100-count}%, transparent ${100-count}%)`;
      if (count === 100) this.leave.done = true;
    }

    if (elapsed < this.timeLimit) { // Stop the animation after the time limite define
      this.leave.previousTimeStamp = timestamp;
      if (!this.leave.done) {
        this.leave.animID = window.requestAnimationFrame(this.leaveAnim.bind(this));
      }
      else{
        this.endLeaveAnim();
      }
    }else{
      this.endLeaveAnim();
    }
  }

  private endLeaveAnim(){
    this.bubble.style.backgroundImage = `radial-gradient(circle at ${this.endPoint.x}% ${this.endPoint.y}%, ${this.color} 0px, ${this.color} 0%, transparent 0%)`
    this.leave.done = false;
    this.leave.start = undefined;
    this.leave.previousTimeStamp = undefined;
    this.leave.isAnim = false;
  }
}

interface params{
  startDelay?: number,
  endDelay?:number,
  startPoint?: relativePoint,
  endPoint? : relativePoint,
  color?: string,
  speed?: number,
  timeLimit?: number,
  zIndex?: number,
  bezier?: bezierPoints
}

interface animeVar{
  animID?:number,
  start?:DOMHighResTimeStamp,
  done:boolean,
  previousTimeStamp?:DOMHighResTimeStamp,
  isAnim : boolean
}
