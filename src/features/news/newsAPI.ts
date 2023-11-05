import axios from 'axios'
import { Agregation } from '../../app/types/redux'
import { base } from '../../base'


export type Article = {
    id: number;
    url: string;
    source: string;
    title:string;
}

const newsAPI = {
  async fetchAll(agregation: Agregation) {

    const options = {
      method: 'get',
      url: base
      + '/api/news/'
      + `?title=${agregation.title}`
      + '&' + `url=${agregation.url}`
      + '&' + `baseUrl=${agregation.baseUrl}`
      + '&' + `selector=${agregation.selector}`
      + '&' + `keywords=${JSON.stringify(agregation.keywords)}`
      ,
  }
  const response: {data: Article[]} =  await axios.request(options)
  const articles = response.data
  return articles
  }
}

export default newsAPI
