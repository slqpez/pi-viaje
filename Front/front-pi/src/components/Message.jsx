import React from 'react'
import "./Message.css"

function Message({msg, type}) {
    return (
        <div>
        {type==="succes"? <p className="succes">{msg}</p>:<p className="error">{msg}</p>}
           
        </div>
    )
}

export default Message
