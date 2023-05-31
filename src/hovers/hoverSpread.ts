import bezier from "bezier-easing";
import { bezierPoints, relativePoint } from "../utils/geometryObjects";
import { getMouseRelativePosition } from "../utils/mouseLib";


export class hoverSpread{
  //Attributs
  element! : HTMLElement;
  start : DOMHighResTimeStamp |undefined;
  previousTimeStamp : DOMHighResTimeStamp | undefined;
  done = false;
  enterPoint : relativePoint = {x:0, y:0};
  leavePoint : relativePoint = {x:0, y:0};
  isEnterAnim :boolean = false;
  isLeaveAnim :boolean = false;
  timeFunction! : bezier.EasingFunction;
  mouseEnterBinding: ((e:MouseEvent) => void) | undefined;
  mouseLeaveBinding: ((e:MouseEvent) => void) | undefined;

  //Params
  speed: number = 0.30;
  color : string = "hsla(354,81%,72%,1)";
  bezierPoints : bezierPoints = {x1:0,y1:0,x2:1,y2:1};

  
  //Constructor
  constructor(element:HTMLElement|undefined = undefined,params:params|undefined = undefined){
    if(params){
      this.speed = params.speed || this.speed;
      this.color = params.color || this.color;
      
      if(params.bezier){
        this.bezierPoints.x1 = params.bezier.x1 || this.bezierPoints.x1;
        this.bezierPoints.x2 = params.bezier.x2 || this.bezierPoints.x2;
        this.bezierPoints.y1 = params.bezier.y1 || this.bezierPoints.y1;
        this.bezierPoints.y2 = params.bezier.y2 || this.bezierPoints.y2;
      }
    }

    if(element){
      this.addOn(element);
    }
  }

  //Methodes
  //--------------Event-Handlers entry Point--------------
  private mouseEnter(e : MouseEvent){
    if(!this.isEnterAnim){
      this.initEnterAnim(e);
      window.requestAnimationFrame(this.enterAnim.bind(this));
    }
  }
  
  private mouseLeave(e : MouseEvent){
    if(!this.isLeaveAnim){
      this.initLeaveAnim(e);
      window.requestAnimationFrame(this.leaveAnim.bind(this));
    }
  }

  //--------------Enter Animation--------------
  private initEnterAnim(e : MouseEvent){
    this.enterPoint = getMouseRelativePosition(e);
    this.isEnterAnim = true;
  }


  private enterAnim(timestamp : DOMHighResTimeStamp){
    if (this.start === undefined) {
      this.start = timestamp;
    }
    const elapsed = timestamp -this.start;
    if (this.previousTimeStamp !== timestamp) {
      const count = this.timeFunction(Math.min(this.speed * elapsed, 100)/100)*100;
      this.element.style.backgroundImage = `radial-gradient(circle at ${this.enterPoint.x}% ${this.enterPoint.y}%, ${this.color} 0px, ${this.color} ${count}%, transparent ${count}%)`;
      if (count === 100) this.done = true;
    }
  
    if (elapsed < 1000) { // Stop the animation after 1 seconds
      this.previousTimeStamp = timestamp;
      if (!this.done) {
        window.requestAnimationFrame(this.enterAnim.bind(this));
      }
      else{
        this.endEnterAnim();
      }
    }else{
      this.endEnterAnim();
    }
  }
  
  private endEnterAnim(){
    this.done = false;
    this.isEnterAnim = false;
    this.start = undefined;
    this.previousTimeStamp = undefined;
  }
  //------------------------------------

  //--------------Leave Animation--------------
  private initLeaveAnim(e : MouseEvent){
    this.leavePoint = getMouseRelativePosition(e);
    this.isLeaveAnim = true;
  }

  private leaveAnim(timestamp : DOMHighResTimeStamp){
    if (this.start === undefined) {
      this.start = timestamp;
    }
    const elapsed = timestamp - this.start;

    if (this.previousTimeStamp !== timestamp) {
      const count = this.timeFunction(Math.min(this.speed * elapsed, 100)/100)*100;
      this.element.style.backgroundImage = `radial-gradient(circle at ${this.leavePoint.x}% ${this.leavePoint.y}%, ${this.color} 0px, ${this.color} ${100-count}%, transparent ${100-count}%)`;
      if (count === 100) this.done = true;
    }

    if (elapsed < 1000) { // Stop the animation after 1 seconds
      this.previousTimeStamp = timestamp;
      if (!this.done) {
        window.requestAnimationFrame(this.leaveAnim.bind(this));
      }
      else{
        this.endLeaveAnim();
      }
    }else{
      this.endLeaveAnim();
    }
  }

  private endLeaveAnim(){
    this.done = false;
    this.start = undefined;
    this.previousTimeStamp = undefined;
    this.isLeaveAnim = false;
  }
  //------------------------------------
  //Buiding function
  setSpeed(speed:number){
    this.speed = speed || this.speed;
    return this;
  }
  setHoverColor(color:string){
    this.color = color || this.color;
    return this;
  }
  setBezierPoints(points:bezierPoints){
    if(points){
      this.bezierPoints.x1 = points.x1 || this.bezierPoints.x1;
      this.bezierPoints.x2 = points.x2 || this.bezierPoints.x2;
      this.bezierPoints.y1 = points.y1 || this.bezierPoints.y1;
      this.bezierPoints.y2 = points.y2 || this.bezierPoints.y2;
    }
    return this;
  }

  addOn(element:HTMLElement){
      this.element = element;
      this.timeFunction = bezier(this.bezierPoints.x1, this.bezierPoints.y1, this.bezierPoints.x2, this.bezierPoints.y2);
      this.mouseEnterBinding = this.mouseEnter.bind(this);
      this.mouseLeaveBinding = this.mouseLeave.bind(this);
      element.addEventListener("mouseenter",this.mouseEnterBinding);
      element.addEventListener("mouseleave",this.mouseLeaveBinding);
      return this;
  }

  removeFrom(element:HTMLElement){
    if(this.element == element){
      element.removeEventListener("mouseenter", this.mouseEnterBinding!);
      element.removeEventListener("mouseleave", this.mouseLeaveBinding!);
    }
    return this;
  }
}

interface params{
  speed? : number;
  color? : string;
  bezier? : bezierPoints;
}