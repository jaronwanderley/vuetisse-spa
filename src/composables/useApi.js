export default config => () => {
  const { base } = config
  const result = reactive({
    loading: false,
    data: null,
    error: null,
  })
  const api = fetcher({
    base,
    transformRequest(request) {
      result.loading = true
      return request
    },
    async handleResponse(response) {
      const errors = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        429: 'Too Many Requests',
        444: 'Connection Closed Without Response',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
      }

      const { url, status, statusText } = response
      const data = await response.json()
      const isError = errors[status] || status > 400

      if (isError) {
        const errorMessage = statusText || errors[status] || ((status) > 500 ? 'Server Error' : 'Client Error')
        const error = {
          url,
          status,
          message: errorMessage,
          body: data,
        }
        throwError({ id: status, message: errorMessage })
        console.error(`ERROR ${url}:`, error)
        result.error = error
      }
      else {
        console.warn(`<<< RESPONSE ${url}:`, { url, body: data, response, headers: [...response.headers.entries()] })
        result.data = data
      }
      result.loading = false
      return result
    },
  })
  return { result, api }
}
