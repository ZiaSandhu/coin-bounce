import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_INTERNAL_API_PATH,
    // baseURL: 'http://localhost:3001',
    withCredentials: true ,
    headers:{
        'Content-Type': 'application/json',
    }
})

export const login = async (data) => {
    let response;

    try {
        response = await api.post('/login',data)
    } catch (error) {
        return error
    }

    return response;
}
export const signup = async (data) => {
    let response;

    try {
        response = await api.post('/register',data)
    } catch (error) {
        return error
    }
    return response
}
export const signout = async () => {
    let response;

    try {
        response = await api.post('/logout')
    } catch (error) {
        return error
    }
    return response
}
export const getAllBlog = async () => {
    let response;

    try {
        response = await api.get('/blog/show')
    } catch (error) {
        return error
    }
    return response
}
export const submitBlog = async(data) =>{
    let response;

    try {
        response = await api.post('/blog',data)
    } catch (error) {
        console.log(error)
        return error
    }
    return response
}
export const getBlogById = async (id) => {
    let response;

    try {
        response = await api.get(`/blog/${id}`)
        response = response.data.data
    } catch (error) {
        return error
    }
    return response
}
export const deleteBlog = async (id) => {
    let response;

    try {
        response = await api.delete(`/blog/${id}`)
    } catch (error) {
        return error
    }
    return response
}
export const updateBlog = async () => {
    let response;

    try {
        response = await api.put('/blog/update')
    } catch (error) {
        return error
    }
    return response
}
export const getCommentById = async(id) =>{
    let response;

    try {
        response = await api.get(`/comment/${id}`,{
            validateStatus: false
        })
    } catch (error) {
        return error
    }
    // console.log(response.data)
    return response.data.data
}
export const postComment = async(data) =>{
    let response;

    try {
        response = await api.get('/comment',data,)
    } catch (error) {
        return error
    }
    return response
}
