import { useEffect, useState } from 'react'
import axios from 'axios'

export function useAgregations() {
    const [agregations, setAgregations] = useState(null)

    
    useEffect(() => {
        const options = {
            method: 'GET',
            url: 'http://localhost:8000/agregations/get',
            headers: {
                'Content-Type': 'application/json'
            }
          }          
          axios.request(options).then((response) => {
              console.log(response.data)
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              setAgregations(response.data)
          }).catch(function (error) {
              console.error(error)
          })
    }, [])

    const sendAgregations = (data: object) => {
        console.log('in sendAgregations: ', JSON.stringify(data))

        axios.post('http://localhost:8000/agregations/send', data)
        .then(response => {
            console.log(response.data)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            //   setAgregations([...agregations, response.data])
        })
        .catch(error => console.log('in sendAgregations:', error) )
    }

    return({agregations, sendAgregations})
}