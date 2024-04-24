import { useContext } from "react";
import { useParams,Link } from "react-router-dom";//parameter la use panni story panna ha the  use param use pandrom
import DataContext from "./context/DataContext";


const PostPage =()=>{
  const {posts, handleDelete}=useContext(DataContext)
  const{id}=useParams();
  const post = posts.find(post => (post.id).toString() === id);

return(
  <div>
    <main className="PostPage">
      <article className="post">
        {post && <>
          <h2>{post.title}</h2>
                        <p className="postDate">{post.datetime}</p>
                        <p className="postBody">{post.body}</p>

                       <Link to ={`/edit/${post.id}`}> 
                       <button className="editButton">Edit Post</button>
                        </Link>

                        <button className="deleteButton" onClick={() => handleDelete(post.id)}>
                            Delete Post
                        </button>
                        </>
        }
        {!post && <>
          <h2>Post Not Found</h2>
          <p>Well That's Disappointing</p>
          <p>
            <Link to='/'>Vist Our HomePage</Link>
          </p>
          </>
        }
        </article>  
          </main>

  </div>
)
}
export default PostPage