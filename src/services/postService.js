export default {
  getPosts() {
    const { result, api } = myApi()
    api.get('posts')
    return result
  },
  getPostsCount() {
    const { result, api } = myApi()
    api.get('posts')
      .then(({ data }) => result.data = data?.length || 0)
    return result
  },
  getPost(id) {
    const { result, api } = myApi()
    api.get(`posts/${id}`)
    return result
  },
}
