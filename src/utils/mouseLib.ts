import { relativePoint } from "./geometryObjects";
import { point } from "./geometryObjects";

export function getMouseRelativePosition(e : MouseEvent) : relativePoint{
  let rect : DOMRect = (<HTMLElement>e.target).getBoundingClientRect();
  
  return {   //relative position of the mouse in percentage
    x: ((e.clientX - rect.left)/rect.width*100),
    y: ((e.clientY - rect.top)/rect.height*100)
  }
}

export function getMousePosition(e : MouseEvent) : point{
  let rect : DOMRect = (<HTMLElement>e.target).getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}