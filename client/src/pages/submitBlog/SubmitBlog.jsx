import { useState } from "react";
import { submitBlog } from '../../api/internal'
import {useSelector} from 'react-redux'
import TextInput from '../../components/TextInput/TextInput'
import styles from "./SubmitBlog.module.css";
import { useNavigate } from "react-router-dom";
function SubmitBlog() {
    const navigate = useNavigate()
    const author = useSelector((state) => state.user._id)
    const [title,setTitle] = useState('')
    const [photo,setPhoto] = useState('')
    const [content,setContent] = useState('')


    const getPhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setPhoto(reader.result);
        };
      };

    const handleSubmit = async() =>{
        const data={
            author,
            content,
            photo,
            title
        }
        const response = await submitBlog(data)

        if(response.status === 201){
          navigate('/')
        }
        else{
        } 
    }

  return (
    <div className={styles.wrapper}>
        <div className={styles.header}>Create a blog!</div>
      <TextInput
        type="text"
        name="title"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "60%" }}
      />
      <textarea
        className={styles.content}
        placeholder="your content goes here..."
        maxLength={400}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={styles.photoPrompt}>
        <p>Choose a photo</p>
        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/jpg, image/jpeg, image/png"
          onChange={getPhoto}
        />
        {photo !== "" ? <img src={photo} width={150} height={150} alt='' /> : ""}
      </div>
      <button
        className={styles.submit}
        onClick={handleSubmit}
        disabled={title === "" || content === "" || photo === ""}
      >
        Submit
      </button>
    </div>
  )
}

export default SubmitBlog