import React from 'react'
import "./documents.css"
function Documents() {


    const uploadDocument =()=>{

    }

    const addDocument=()=>{
        const documentsDiv = document.querySelector(".documents")
        documentsDiv.innerHTML += `
        <div className="document-to-upload">
        <input
            type="file"
            name="file"
            id="doc_up"
            onChange={uploadDocument}
        ></input>
        <input type="text" className="document-name"></input>
     </div>
        `
    }
    return (
        <div className="documents-page">
            <h1>Acá están todos los documentos del peludo.</h1>
            <div className="documents">
                <div className="document-to-upload">
                    <input
                        type="file"
                        name="file"
                        id="doc_up"
                        onChange={uploadDocument}
                    ></input>
                    <input type="text" className="document-name"></input>
                 </div>
           

            </div>
           
              <button onClick={addDocument}>Agregar otro documento ➕</button>
        </div>
    )
}

export default Documents
