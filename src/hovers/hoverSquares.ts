/*

  If customs css' transition is use, defaults transitions are no more used. 
  If you want to use them you need write them down in the parameters.
*/




export class hoverSquares{
  //attributs 
  element : HTMLElement;
  strTransition:string;
  squareLenght : number;
  nbSquareByColumns : number;

  //Settings
  nbSquareByLines:number;
  spreadOrientation: number;
  delay:number;
  cssProperties: Array<String>;
  defaultCssPorperties = ["scale 350ms ease", "opacity 350ms ease", "border-radius 350ms ease"];
  

  constructor(element:HTMLElement, params : params|undefined = undefined){
    this.element = element;

    this.nbSquareByLines = params===undefined ? 5 : (params!.nbSquaresByLines ?? 5);
    this.spreadOrientation = params===undefined ? 0 : (params!.spreadOrientation ?? 0);
    this.delay = params===undefined ? 50 : (params!.delay ?? 50);
    this.cssProperties = params==undefined ? this.defaultCssPorperties : (params!.cssPropertiesAnimated ?? this.defaultCssPorperties);

    this.spreadOrientation = this.spreadOrientation%360;

    this.squareLenght = 100/this.nbSquareByLines;           
    this.nbSquareByColumns = this.element.clientHeight/(this.element.clientWidth*(this.squareLenght*0.01));


    this.forceStyle();
    this.strTransition = this.createStrTransition();
    this.createScales();
  }

  private forceStyle(){
    this.element.style.position = "relative";
    this.element.style.overflow = "hidden";
    this.element.style.display = "flex";
  }

  //Return a string with all css transition properties and a place for the delay parameter.
  private createStrTransition() : string{
    var str = "";
    this.cssProperties.forEach((e, index) => {
      str += e + " %delayms";
      if(index !== this.cssProperties.length-1){
        str += ", ";
      }
    });
    return str
  }

  private createScales(){
    let xRelativePos = this.squareLenght;
    let yRelativePos = 100/this.nbSquareByColumns;
    let yDecalage = Math.floor((1-(this.nbSquareByColumns - Math.floor(this.nbSquareByColumns)))/2*100);


    let rad = (this.spreadOrientation%90)/360*6.28;    //deg to rad for the sin and cos 

    for(let i = 0; i<= this.nbSquareByColumns; i++){
      for(let j = 0; j<= this.nbSquareByLines; j++){
        const newSquare = document.createElement("div");
        
        let delay;
        
        //Use the right delay's function depends on the spreadRotation's value.  
        //Possible value : [0,360]
        //0deg : Top -> Bottom | 90deg : Left -> Right | 180deg : Bottom -> Top | 270deg : Right -> Left
        if(this.spreadOrientation<90){
          delay = this.delay*(i*Math.cos(rad)+j*Math.sin(rad))
        }else if(this.spreadOrientation<180){
          delay = this.delay*((this.nbSquareByColumns - i)*Math.sin(rad)+j*Math.cos(rad))   
        }else if(this.spreadOrientation<270){
          delay = this.delay*((this.nbSquareByColumns - i)*Math.cos(rad)+(this.nbSquareByLines - j)*Math.sin(rad))
        }else{
          delay = this.delay*(i*Math.sin(rad)+(this.nbSquareByLines - j)*Math.cos(rad))
        }
        newSquare.className += 'square';
        
        newSquare.style.cssText = `
          top: ${yRelativePos*i}%;
          left: ${xRelativePos*j}%;
          width: ${this.squareLenght}%;
          aspect-ratio : 1;
          transform-origin: 50% ${50-yDecalage}%;
          transform: translateY(-${yDecalage}%);
          transition: ${this.strTransition.replaceAll("%delay", "" + delay)};
        `;
        this.element.appendChild(newSquare);
      }
    }
  }

}

interface params{
  nbSquaresByLines? : number;
  delay? : number;
  spreadOrientation? : number;
  cssPropertiesAnimated? : Array<String>; 
}