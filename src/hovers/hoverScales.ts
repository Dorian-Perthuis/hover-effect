/*
  Property :
   - Resizable


  If customs css' transition is use, defaults transitions are no more used. 
  If you want to use them you need write them down in the parameters.
*/




export class hoverScale{
  //attributs 
  element : HTMLElement;
  strTransition:string;

  //Settings
  nbColumns:number;
  nbLines:number;
  spreadOrientation: number;
  delay:number;
  cssProperties: Array<String>;
  defaultCssPorperties = ["scale 350ms ease", "opacity 350ms ease", "border-radius 350ms ease"];
  

  constructor(element:HTMLElement, params : params|undefined = undefined){
    this.element = element;

    this.nbLines = params===undefined ? 5 : (params!.nbLines ?? 5);
    this.nbColumns = params===undefined ? 5 : (params!.nbColumns ?? 5);
    this.spreadOrientation = params===undefined ? 0 : (params!.spreadOrientation ?? 0);
    this.delay = params===undefined ? 50 : (params!.delay ?? 50);
    this.cssProperties = params==undefined ? this.defaultCssPorperties : (params!.cssPropertiesAnimated ?? this.defaultCssPorperties);

    this.spreadOrientation = this.spreadOrientation%360;

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
    let scaleHeight = 100/this.nbLines;           //In percentage to adjust if element is resize
    let scaleWidth = 100/this.nbColumns;          //In percentage
    let rad = (this.spreadOrientation%90)/360*6.28;    //deg to rad for the sin and cos 

    for(let i = 0; i<=this.nbLines; i++){
      for(let j = 0; j<=this.nbColumns; j++){
        const newScale = document.createElement("div");
        
        let delay;
        
        //Use the right delay's function depends on the spreadRotation's value.  
        //Possible value : [0,360]
        //0deg : Top -> Bottom | 90deg : Left -> Right | 180deg : Bottom -> Top | 270deg : Right -> Left
        if(this.spreadOrientation<90){
          delay = this.delay*(i*Math.cos(rad)+j*Math.sin(rad))
        }else if(this.spreadOrientation<180){
          delay = this.delay*((this.nbLines - i)*Math.sin(rad)+j*Math.cos(rad))   
        }else if(this.spreadOrientation<270){
          delay = this.delay*((this.nbLines - i)*Math.cos(rad)+(this.nbColumns - j)*Math.sin(rad))
        }else{
          delay = this.delay*(i*Math.sin(rad)+(this.nbColumns - j)*Math.cos(rad))
        }
        newScale.className += 'scale';
        
        newScale.style.cssText = `
          top: ${scaleHeight*i}%;
          left: ${scaleWidth*j}%;
          height: ${scaleHeight}%;
          width: ${scaleWidth}%;
          transform-origin: 0 0;
          transform: translateX(-50%) translateY(-50%);
          transition: ${this.strTransition.replaceAll("%delay", "" + delay)};
        `;
        this.element.appendChild(newScale);
      }
    }
  }

}

interface params{
  nbLines? : number;
  nbColumns? : number;
  delay? : number;
  spreadOrientation? : number;
  cssPropertiesAnimated? : Array<String>; 
}