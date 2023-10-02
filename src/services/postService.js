const getTodos = () => api.get('posts')
const getPost = (id) => api.get(`posts/${id}`)

export default {
    getTodos,
    getPost,
}