import { useState, useEffect } from "react"
import { getAllBlog } from "../../api/internal"
import Loader from '../../components/Loader/Loader'
import styles from './Blog.module.css'
import { useNavigate } from 'react-router-dom'


function Blog() {
    const navigate = useNavigate()
    const [blogs,setBlogs] = useState([])

    useEffect(()=>{
        (async function blogApiCall(){
            const response = await getAllBlog();
            if(response.status === 200){
                setBlogs(response.data.blog)
            }
        })();

        setBlogs([])
    },[])

    if(blogs.length === 0){
        return <Loader text='Blogs' />
    }

  return (
    <div className={styles.blogsWrapper}>
      {blogs.map((blog) => (
        <div
          className={styles.blog}
          key={blog.id}
          onClick={() => navigate(`/blog/${blog.id}`)}
        >
          <h1>{blog.title}</h1>
          <img src={blog.photo} alt="" />
          <p> {blog.content} </p>
        </div>
      ))}
    </div>
  );
}

export default Blog