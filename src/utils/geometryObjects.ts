export interface relativePoint{ //Point's position relative to an Element in percentage
  x: number, //percentage
  y: number  //percentage
}

export interface point{ //Point's position relative to an Element in pixel
  x: number,
  y: number
}

export interface vector{
  x: number,
  y: number
}

export interface bezierPoints{
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}