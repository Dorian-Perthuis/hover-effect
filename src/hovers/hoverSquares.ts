/*

  If customs css' transition is use, defaults transitions are no more used. 
  If you want to use them you need write them down in the parameters.
*/


export class hoverSquares{
  //attributs 
  element! : HTMLElement;
  strTransition!:string;
  squareLenght! : number;
  nbSquareByColumns! : number;

  //Settings
  nbSquareByLines:number = 5;
  spreadOrientation: number = 5;
  delay:number = 50;
  cssProperties: Array<String> = ["scale 350ms ease", "opacity 350ms ease", "border-radius 350ms ease"];
  

  constructor(element?:HTMLElement|undefined, params : params|undefined = undefined){
    if(params){
      this.nbSquareByLines = params.nbSquaresByLines || this.nbSquareByLines;
      this.spreadOrientation = params.spreadOrientation || this.spreadOrientation;
      this.spreadOrientation %= 360;
      this.delay = params.delay || this.delay;
      this.cssProperties = params.cssPropertiesAnimated || this.cssProperties;
    }

    
    if(element){
      this.linkTo(element);
    }

  }

  private forceStyle(){
    this.element.classList.add("hoverSquare");
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
  //Buiding methods

  setNbSquaresByLines(nb:number){
    this.nbSquareByLines = nb || this.nbSquareByLines;
    return this;
  }

  setSpreadOrientation(degre:number){
    this.spreadOrientation = degre%360 || this.spreadOrientation;
    return this;
  }

  setDelay(delay:number){
    this.delay = delay || this.delay;
    return this;
  }

  setCssProperties(transitions:Array<string>){
    this.cssProperties = transitions[0] === '' ? this.cssProperties : transitions ;
    return this;
  }

  linkTo(element:HTMLElement){
    this.element = element;
    this.squareLenght = 100/this.nbSquareByLines;           
    this.nbSquareByColumns = this.element.clientHeight/(this.element.clientWidth*(this.squareLenght*0.01));
    this.forceStyle();
    this.strTransition = this.createStrTransition();
    this.createScales();
    return this;
  }

  removeFrom(element:HTMLElement){
    if(this.element == element){
      Array.from(element.getElementsByClassName("square")).forEach((e) => {
        e.remove();
      });
      element.classList.remove("hoverSquare"); 
    }
    return this;
  }
}

interface params{
  nbSquaresByLines? : number;
  delay? : number;
  spreadOrientation? : number;
  cssPropertiesAnimated? : Array<String>; 
}