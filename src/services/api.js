export default fetcher({
    base: 'https://jsonplaceholder.typicode.com/',
    handleResponse(response) {
        console.log({response})
        return response
            .then(data => ({ data }))
            .catch(error => ({ error })) 
    }
})