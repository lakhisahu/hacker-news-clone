import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [stories, setStories] = useState([])
  const [count, setCount] = useState(0)
  var counter = 0;

  useEffect(() => {
    setCount(prev=>prev+10)
    fetchData();
  }, [])
  async function fetchData() {
    
    const data = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
    if(count>10){
      var result = data.data.slice(0, count)
    }else{
      var result = data.data.slice(0, 10)
    }
    

   
    const story = result.map(async (e) => {
      const newData = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${e}.json`)
      
      return newData.data

    })
    const allstories = await Promise.all(story)
    setStories(allstories)
    

  }
  function storiesData() {

  }
  function timeConverter(timestamp) {
    const seconds = Math.floor((new Date() - timestamp * 1000) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (let interval in intervals) {
      const value = Math.floor(seconds / intervals[interval]);
      if (value >= 1) {
        return value + ' ' + interval + (value > 1 ? 's' : '') + ' ago';
      }
    }
    return 'justnow';

  }
  return (
    <div className="App">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Hackers News</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
      {stories.length>0?
      <div>
      {
       
        stories?.map((e) => (
          <div className='app'>
            <a href={e.url}>
            <h3>
              {++counter}. {e.title}
            </h3>
            </a>

            <p>{e.score} points by {e.by} {timeConverter(e.time)}</p>

          </div>
        ))
      }
      <button onClick={()=>{
        setCount(prev=>prev+10)
        setStories([])
        fetchData()
      }} type="button" class="btn btn-secondary">Load More</button>

    </div> : <div className='app2'>
    <h2 className='text-center flex'>Loading...</h2>
    </div> }
      

    </div>
  );
}

export default App;

