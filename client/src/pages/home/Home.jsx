import { useState, useEffect } from "react"
import { getNews } from "../../api/external"
import styles from './Home.module.css'
import Loader from "../../components/Loader/Loader";
function Home() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    (async function newApiCall() {
      const response = await getNews();
      setArticles(response);

    })();
    //clean up function
    setArticles([]);
  }, []);
  const handleClickCard = (url) => {
    window.open(url, "_blank");
  }

  if(articles.length === 0){
    return <Loader text='Homepage' />
  }
  return (
    <>
      <div className={styles.header}>Articles</div>
      <div className={styles.grid}>
        {articles.map((article,index) => (
          <div 
          className={styles.card} 
          key={index}
          onClick={()=>handleClickCard(article.url)}
          >
            <img src={article.urlToImage} alt='' />
            <h3>{article.title}</h3>
          </div>
        ))}
        
      </div>
    </>
  );
}

export default Home