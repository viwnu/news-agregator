import { useEffect, useState } from 'react'
import axios from 'axios'

export function useNews() {
    const [articles, setArticles] = useState(null)

    
    useEffect(() => {
        const options = {
            method: 'GET',
            url: 'http://localhost:8000/news'
          }          
          axios.request(options).then((response) => {
              console.log(response.data)
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              setArticles(response.data)
          }).catch(function (error) {
              console.error(error)
          })
    }, [])

    return(articles)
}