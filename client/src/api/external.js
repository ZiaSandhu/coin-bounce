import axios from 'axios'

// const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY

// const NEWS_API_ENDPOINT = 'https://newsapi.org/v2/everything?q=bitcoin&language=en&apiKey=77e1677eadb74d9db56ac88b279e18bd'
const NEWS_API_ENDPOINT ="https://saurav.tech/NewsAPI/top-headlines/category/business/us.json";
const CRYPTO_API_ENDPOINT = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

export const getNews = async () =>{
    let response;
    try {
        response = await axios.get(NEWS_API_ENDPOINT)
        response = response.data.articles.slice(0,15)
        console.log("🚀 ~ file: external.js:14 ~ getNews ~ response:", response)
        
    } catch (error) {
        return error
    }
    return response
}
export const getCrypto = async () =>{
    let response;
    try {
        response = await axios.get(CRYPTO_API_ENDPOINT)
        response = response.data
    } catch (error) {
        return error
    }
    return response
}