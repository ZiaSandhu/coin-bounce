import { getBlogById, deleteBlog, updateBlog, getCommentById, postComment } from "../../api/internal"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux/es/hooks/useSelector"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import styles from './BlogDetails.module.css'
import CommentList from '../../components/CommentsList/CommentList'
import Loader from '../../components/Loader/Loader'
function BlogDetails() {

    const params = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState([])
    const [comments, setComments] = useState([])
    const [ownsBlog, setOwnsBlog] = useState(false)
    const [reload, setReload] = useState(false)
    const [newComment,setNewComment] = useState('')

    const blogId = params.id
    const userId = useSelector(state => state.user._id)
    const username = useSelector(state => state.user.username)
    
    useEffect(()=>{
        (async function blogDetailsApiCall(){
            const response = await getBlogById(blogId)
                setBlog(response)
                setOwnsBlog(username === response.authorUserName)
        })();

    },[])
    useEffect(()=>{
        (async function blogCommentCall(){
            const response = await getCommentById(blogId)
            setComments(response)
        })();
    },[reload])
    const deleteBlogHandler = async() => {
        const response = await deleteBlog(blogId)
        if(response.status === 200){
            navigate('/blogs')
        }
    }
    const postCommentHandler = async() => {
        const data ={
            blog: blogId,
            author: userId,
            content: newComment,
        }
        const response = await postComment(data);
        if(response.status === 201){
            setNewComment('')
            setReload(!reload)
        }
    }
    if(blog.length === 0){
        return <Loader text="Blog Details" />
    }
  return (
    <div className={styles.detailsWrapper}>
      <div className={styles.left}>
        <h1 className={styles.title}>{blog.title}</h1>
        <div className={styles.meta}>
          <p>
            @
            {blog.authorName +
              " on " +
              new Date(blog.createdAt).toDateString()}
          </p>
        </div>
        <div className={styles.photo}>
          <img src={blog.photo} width={250} height={250} />
        </div>
        <p className={styles.content}>{blog.content}</p>
        {ownsBlog && (
          <div className={styles.controls}>
            <button
              className={styles.editButton}
              onClick={() => {
                navigate(`/blogUpdate/${blog._id}`);
              }}
            >
              Edit
            </button>
            <button className={styles.deleteButton} onClick={deleteBlogHandler}>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.commentsWrapper}>
          <CommentList comments={comments} />
          <div className={styles.postComment}>
            <input
              className={styles.input}
              placeholder="comment goes here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className={styles.postCommentButton}
              onClick={postCommentHandler}
              disabled={!comments}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails