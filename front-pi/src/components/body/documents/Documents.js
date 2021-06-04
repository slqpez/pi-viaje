import React, {useState, useEffect}from 'react'
import "./documents.css"



function Documents() {


    const [name, setName] = useState("")
    const [selectedFile, setSelectedFile] = useState(null);

    const handleName =(e)=>{
        setName(e.target.value)
    }
    const handleFile=(e)=>{
        setSelectedFile(e.target.files[0])
    }

    const addDocument=(e)=>{
        e.preventDefault();
        /* try { */
          ;
          console.log(selectedFile)
          /* if (!file)
            return setData({
              ...data,
              err: "No se subió el archivo.",
              success: "",
            });
    
          if (file.size > 1024 * 1024) {
            return setData({
              ...data,
              err: "El archivo es demasiado grande.",
              success: "",
            });
          }
    
          if (file.type !== "image/jpeg" && file.type !== "image/png")
            return setData({
              ...data,
              err: "El formato del archivo es inválido.",
              success: "",
            });
     */
          /* let formData = new FormData();
          formData.append("file", file); */
    
          /* setLoading(true);
          const res = await axios.post(
            "https://pi-gest-viaje.herokuapp.com/api/upload_avatar",
            formData,
            {
              headers: {
                "content-type": "multipart/form-data",
                Authorization: token,
              },
            }
          );
    
          setLoading(false);
          setAvatar(res.data.url);
        } catch (err) {
          setData({ ...data, err: err.response.data.msg, success: "" });
        } */
       
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
                        onChange={handleFile}
                        
                    ></input>
                    <input type="text"  onChange={(e)=> handleName(e)} value={name} className="document-name"></input>
                 </div>
           

            </div>
           
              <button onClick={addDocument}>Agregar documento</button>
        </div>
    )
}

export default Documents
