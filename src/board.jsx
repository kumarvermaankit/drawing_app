import React, { useEffect, useRef, useState } from "react"

import { SketchPicker } from 'react-color';
import erase from "./erase.png"
import "./board.css"
import io from "socket.io-client"


let socket;
function Board() {


  const ENDPOINT = "https://cyduckdraw.herokuapp.com/"
  var i = 0;
  const Canvasref = useRef(null);
  const Contextref = useRef(null)


  const [currentpoint, setcurrentpoint] = useState({})

  const [isDrawing, setisDrawing] = useState(false)
  const [bgstate, setbgstate] = useState(false)
  const [bgclr, setbgclr] = useState("#ffffff")
  const [strkstate, setstrkstate] = useState(false);
  const [strk, setstrk] = useState("black");
  const [eraser, seteraser] = useState(false)
  var prevstroke = ""
  const [cursor, setcursor] = useState("")




  const [user, setuser] = useState({
    backgroundColor: bgclr,
    strokeColor: strk,
    locX: 0,
    locY: 0,
  })

  useEffect(() => {

    const canvas = Canvasref.current;

    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    const context = canvas.getContext("2d")

    context.scale(2, 2)

    context.lineCap = "round"
    context.strokeStyle = `${strk}`
    context.lineWidth = 7

    Contextref.current = context


  }, [])


  useEffect(() => {

    socket = io(ENDPOINT)
    socket.emit("join", user, () => {


    })

    // socket.on("drawinfo",(val)=>{

    //   console.log(val)
    // setotherusers(val)


    // })

    socket.on("drawuser", (data) => {
      Ondrawing(data)
    })



    return () => {
      // socket.emit("disconnect");
      socket.off();
    }
  }, [ENDPOINT])



  // useEffect(()=>{

  //   socket.on("drawinfo",(val)=>{
  //     console.log(val)
  //     setotherusers(val)
  //   })

  // },[otherusers])


  function drawothers(data) {




    if (data.state === "down") {
      Contextref.current.beginPath();
      Contextref.current.moveTo(data.x, data.y)
    }
    else if (data.state === "up") {
      Contextref.current.closePath();
    }

    else if (data.state === "draw") {
      Contextref.current.lineTo(data.x, data.y);
      Contextref.current.stroke()
    }
    else if (data.state === "clear") {
      Contextref.current.clearRect(0, 0, Canvasref.current.width, Canvasref.current.height);
    }
    else if (data.state === "eraser") {
      Eraser(data.erase, data.prev)
    }

    else if (data.state = "stroke") {
      Strokesetter(data.color)
    }






  }




  function Startdrawing(nativeEvent) {


    const { offsetX, offsetY } = nativeEvent.nativeEvent;
    user.locX = offsetX
    user.locY = offsetY
    Contextref.current.beginPath();
    Contextref.current.moveTo(offsetX, offsetY)
    currentpoint.x = offsetX
    currentpoint.y = offsetY
    setisDrawing(true)

    socket.emit("draw", ({ state: "down", x: offsetX, y: offsetY }))

  }

  function finishdrawing(nativeEvent) {
    Contextref.current.closePath();
    // draw(currentpoint.x,currentpoint.y,nativeEvent.nativeEvent.clentX,nativeEvent.nativeEvent.clentY)

    const { offsetX, offsetY } = nativeEvent.nativeEvent

    // drawothers(currentpoint.x,currentpoint.y,offsetX,offsetY)
    // draw(nativeEvent)

    currentpoint.x = offsetX
    currentpoint.y = offsetY

    socket.emit("draw", ({ state: "up", x: offsetX, y: offsetY }))
    setisDrawing(false)



  }

  function Ondrawing(data) {

    const w = Canvasref.current.width
    const h = Canvasref.current.height

    drawothers(data)

  }


  function draw(nativeEvent) {





    const { offsetX, offsetY } = nativeEvent.nativeEvent;






    //   setuser((prev)=>{
    // return{
    //   ...prev,
    //   locX:offsetX,
    //   locY:offsetY
    // }
    //   })


    Contextref.current.lineTo(offsetX, offsetY);
    Contextref.current.stroke()



    socket.emit("draw", { state: "draw", x: offsetX, y: offsetY })
  }


  function MouseMove(nativeEvent) {
    if (!isDrawing) {
      return;
    }

    draw(nativeEvent)
  }

  function BGC(event) {
    event.preventDefault();

    bgstate ? setbgstate(false) : setbgstate(true)

  }




  function Backgroundsetter(color) {
    setbgclr(color.hex)
    setuser((prev) => {
      return {
        ...prev,
        backgroundColor: color.hex
      }
    })

    Contextref.current.fillRect(0, 0, Canvasref.current.width, Canvasref.current.height);
    Contextref.current.fillStyle = `${color.hex}`
  }

  function Strokeclr(event) {
    event.preventDefault();

    strkstate ? setstrkstate(false) : setstrkstate(true)
  }

  function StrokeChange(color) {
    Strokesetter(color)
    socket.emit("draw", { state: "stroke", color: color })
  }

  function Strokesetter(color) {

    Contextref.current.strokeStyle = `${color.hex}`
    setstrk(color.hex)
    seteraser(true)

    // setuser((prev)=>{
    //   return{
    //     ...prev,
    //     strokeColor:color.hex
    //   }
    // })



  }

  function OnErase(eraser) {
    prevstroke = strk

    Eraser(eraser, prevstroke)

    socket.emit("draw", { state: "eraser", erase: eraser, prev: prevstroke })
  }

  function Eraser(eraser, prev) {

    eraser === false ? setcursor(erase) : setcursor("")


    if (eraser === false) {

      Contextref.current.lineWidth = 20;

      Contextref.current.strokeStyle = `${bgclr}`
    }
    else if (eraser === true) {

      Contextref.current.lineWidth = 7;
      Contextref.current.strokeStyle = `${prev}`
    }




    eraser ? seteraser(false) : seteraser(true)

  }


  function Clear(event, state) {
    event.preventDefault();

    Contextref.current.clearRect(0, 0, Canvasref.current.width, Canvasref.current.height);

    if (state === "all") {
      socket.emit("draw", { state: "clear" })
    }



  }

  return (
    <div>
      <div className="navdiv">

        <p className="logo">Drawer</p>
        <div>

          <button className="btns btn6" onClick={(event) => BGC(event)}>Background Color</button>
          {bgstate ? <SketchPicker id="bgcolor" color={`${bgclr}`} onChange={(color) => Backgroundsetter(color)} /> : null}
        </div>
        <div>
          <button className="btns btn6" onClick={(event) => Strokeclr(event)}>Stroke Color</button>
          {strkstate ? <SketchPicker id="strokecolor" color={`${strk}`} onChange={(clr) => StrokeChange(clr)} /> : null}
        </div>
        <div>
          <button className="btns btn6" onClick={() => OnErase(eraser)}>Eraser</button>

        </div>
        <div>
          <button className="btns btn6" onClick={(event) => Clear(event, "self")}>Clear</button>
          <button className="btns btn6" onClick={(event) => Clear(event, "all")}>Clear for everyone</button>
        </div>

      </div>



      <canvas className="canva" style={{ backgroundColor: `${bgclr}`, cursor: `url(${cursor}),auto` }}
        onMouseDown={Startdrawing}
        onMouseUp={finishdrawing}
        onMouseMove={MouseMove}
        ref={Canvasref}


      />





    </div>
  );
}

export default Board;
