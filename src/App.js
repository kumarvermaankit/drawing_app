import React,{useEffect, useRef, useState} from "react"
import { SketchPicker } from 'react-color';
import erase from "./erase.png"

function App() {

const Canvasref=useRef(null);
const Contextref=useRef(null)

const [isDrawing,setisDrawing]=useState(false)
const [bgstate,setbgstate]=useState(false)
const [bgclr,setbgclr]=useState("#3d84b8")
const [strkstate,setstrkstate]=useState(false);
const [strk,setstrk]=useState("black");
const [eraser,seteraser]=useState(false)
const [prevstroke,setprevstroke]=useState("")
const [cursor,setcursor]=useState("")

useEffect(()=>{

const canvas=Canvasref.current;

canvas.width=window.innerWidth*2;
canvas.height=window.innerHeight*2;
canvas.style.width=`${window.innerWidth}px`
canvas.style.height=`${window.innerHeight}px`

const context=canvas.getContext("2d")

context.scale(2,2)

context.lineCap="round"
context.strokeStyle=`${strk}`
context.lineWidth=7

Contextref.current=context


},[])

function Startdrawing(nativeEvent){
 
const {offsetX,offsetY}=nativeEvent.nativeEvent;
Contextref.current.beginPath();
Contextref.current.moveTo(offsetX,offsetY)
setisDrawing(true)
}

function finishdrawing(){
 
Contextref.current.closePath()
setisDrawing(false)

}

function draw(nativeEvent){
if(!isDrawing){
  return;
}
  const {offsetX,offsetY}=nativeEvent.nativeEvent;

  Contextref.current.lineTo(offsetX,offsetY);
  Contextref.current.stroke()


}

function BGC(event){
  event.preventDefault();

  bgstate?setbgstate(false):setbgstate(true)
} 

function Strokeclr(event){
event.preventDefault();

strkstate?setstrkstate(false):setstrkstate(true)
}

function Strokesetter(color){

  Contextref.current.strokeStyle=`${color.hex}`
  setstrk(color.hex)
  seteraser(false)
}

function Eraser(){
eraser?seteraser(false):seteraser(true);
eraser===false?setcursor(erase):setcursor("")

if(eraser===false){
   Contextref.current.lineWidth=20;
}
else if(eraser===true){
  Contextref.current.lineWidth=7;
}


if(eraser===false){
 setprevstroke(strk)
  Contextref.current.strokeStyle=`${bgclr}`
}
else if(eraser===true){
  Contextref.current.strokeStyle=`${prevstroke}`
}
}


function Clear(event){
event.preventDefault();

  Contextref.current.clearRect(0,0,Canvasref.current.width,Canvasref.current.height);
  
}

  return (
 <div>
 <div className="navdiv">
 <div>
 <button className="btns" onClick={(event)=>BGC(event)}>Background Color</button>
{bgstate?<SketchPicker id="bgcolor" color={`${bgclr}`}  onChange={(color)=>setbgclr(color.hex)}/>:null}
</div>
<div>
<button className="btns" onClick={(event)=>Strokeclr(event)}>Stroke Color</button>
{strkstate?<SketchPicker id="strokecolor"  color={`${strk}`}  onChange={(clr)=>Strokesetter(clr)}/>:null}
</div>
<div>
<button className="btns" onClick={(event)=>Eraser(event)}>Eraser</button>

</div>
<button className="btns" onClick={(event)=>Clear(event)}>Clear</button>
</div>
 <canvas className="canva" style={{backgroundColor:`${bgclr}`,cursor:`url(${cursor}),auto`} }
onMouseDown={Startdrawing}
onMouseUp={finishdrawing}
onMouseMove={draw}
ref={Canvasref}


 />
 
 </div>    
  );
}

export default App;
