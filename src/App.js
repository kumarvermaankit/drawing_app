import React,{useEffect, useRef, useState} from "react"

function App() {

const Canvasref=useRef(null);
const Contextref=useRef(null)

const [isDrawing,setisDrawing]=useState(false)


useEffect(()=>{

const canvas=Canvasref.current;

canvas.width=window.innerWidth*2;
canvas.height=window.innerHeight*2;
canvas.style.width=`${window.innerWidth}px`
canvas.style.height=`${window.innerHeight}px`

const context=canvas.getContext("2d")
context.scale(2,2)

context.lineCap="round"
context.strokeStyle="black"
context.lineWidth=5
Contextref.current=context


},[])

function Startdrawing(nativeEvent){
 
const {offsetX,offsetY}=nativeEvent.nativeEvent;
Contextref.current.beginPath();
Contextref.current.moveTo(offsetX,offsetY)
setisDrawing(true)
}

function finishdrawing(nativeEvent){
 
Contextref.current.closePath()
setisDrawing(false)

}

function draw(nativeEvent){
if(!isDrawing){
  return;
}
  const {offsetX,offsetY}=nativeEvent.nativeEvent;
console.log(offsetX)
  Contextref.current.lineTo(offsetX,offsetY);
  Contextref.current.stroke()


}

  return (
  
 <canvas 
onMouseDown={Startdrawing}
onMouseUp={finishdrawing}
onMouseMove={draw}
ref={Canvasref}


 />
   
  );
}

export default App;
