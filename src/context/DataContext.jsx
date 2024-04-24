import { createContext,useState,useEffect, Children } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'
import api from "../api/posts"
import useWindowSize from '../hooks/useWindowSize'
import useAxiosFetch from '../hooks/useAxiosFetch'

const DataContext = createContext({})

export const DataProvider = ({children})=>{

    const[posts,setPosts] = useState([
        // {
        //   id:1,
        //   title: "My 1st Post",
        //   datetime : "Agu 26,2000 05.26.26 AM",
        //   body : "Cricket is every think go play"
        // },{
        //   id:2,
        //   title: "My 2nd Post",
        //   datetime : "Agu 26,2000 05.26.26 AM",
        //   body : "Cricket is every think go play"}
        // ,{
        //     id:3. title:"My 3rd post",datetime:"May 05,2000"
        //}
      ])
      const[search,setSearch]= useState('')
      const[searchResult , setSearchResult]=useState([])
      const [postTitle, setPostTitle] = useState('');
      const [postBody, setPostBody] = useState('');
      const navigate = useNavigate()
      const [editTitle, setEditTitle] = useState('');
      const [editBody, setEditBody] = useState('');
      const {width}=useWindowSize()
      const {data,fetchError, isLoading}= useAxiosFetch('http://localhost:3500/posts')
    
      useEffect(()=>{
        setPosts(data);
      },[data])
    
    
        useEffect(()=>{
          const filteredResult = posts.filter((post)=>(
            (post.body).toLowerCase()).includes(search.toLowerCase())
            || ((post.title).toLowerCase()).includes(search.toLowerCase()));
            setSearchResult(filteredResult.reverse())
    
        },[posts,search])
    
        // useEffect(() => {
    
        //   const fetchPosts = async () =>{
        //     try{
        //       const respones = await api.get('/posts');
        //       setPosts(respones.data)
    
        //     }catch(err){
        //       if(err.respones){
        //         // respones not in 200
        //         console.log(err.respones.data);
        //         console.log(err.respones.status);
        //         console.log(err.respones.headers); 
    
        //       }else{
        //         console.log(`Error: ${err.message}`);
        //       }
    
        //     }
        //   }
        //   fetchPosts();
        // },[]);
    
        
        const handleSubmit =  async (e) => {
          e.preventDefault();
          const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    
          const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    
          const newPost = { id, title: postTitle, datetime, body: postBody };
          try{
            const respones = await api.post("/posts",newPost)
          const allPosts = [...posts, respones.data];
              setPosts(allPosts);
              setPostTitle('');
              setPostBody('');
              navigate('/');
          }catch(err){
            console.log(`Error: ${err.message}`);
          }
        }
     
      const handleDelete = async(id)=>{
    
        try{
    
        await api.delete(`posts/${id}`)
       
        const postsList = posts.filter(post=>post.id !== id); // match aakura tha vittu mathathula vachittu itha filter
        setPosts(postsList)
        navigate('/')
        }catch(err){
          console.log(`Error: ${err.message}`);
        }
      }
      
     const handleEdit = async(id)=>{
      const datetime = format(new Date(), 'MMMM dd, yyyy pp');
      const updatePost = { id, title: editTitle, datetime, body: editBody };
    
      try{
            const respones = await api.put(`/posts/${id}`,updatePost)
            setPosts(posts.map(post=> post.id === id ? {...respones.data}:post));
              setEditTitle('');
              setEditBody('');
              navigate('/')
    }catch(err){
    
        console.log(`Error: ${err.message}`)
    
      }
    
    
     }

    return(
        <DataContext.Provider value={{
            width,search,setSearch,searchResult,fetchError, isLoading,handleSubmit,postTitle,setPostTitle,postBody,setPostBody,posts,handleEdit,editBody,setEditBody,editTitle,setEditTitle, handleDelete

        }}>
            {children}
        </DataContext.Provider>
    )
}
export default DataContext;