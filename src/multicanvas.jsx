import React from "react"
import Single from "./singlecanvas"
function Multicanvas(){
    return(
        <div>
<Single bg="#66DE93" className="single1" id="div1"/>
<Single className="single2" bg="#F6C6EA" id="div2"/>
<Single className="single3" bg="#CDF0EA"  id="div3"/>
<Single className="single4" bg="#C490E4"  id="div4"/>
        </div>
    )
}

export default Multicanvas