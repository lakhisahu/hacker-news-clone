import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [stories, setStories] = useState([])
  const [count, setCount] = useState(0)
  const [prevdate, setPrevdate] = useState(1)
  const [nextdate, setNextdate] = useState(1)
  const [search, setSearch] = useState('')
  const [msg,setMsg] = useState("loading...")
  var counter = 0;

  useEffect(() => {
    setCount(prev => prev + 10)
    fetchData();
  }, [])
  async function fetchData() {
    setMsg("loading...")

    const data = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")


    if (count > 10) {
      var result = data.data.slice(0, count)
    } else {
      var result = data.data.slice(0, 10)
    }



    const story = result.map(async (e) => {
      const newData = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${e}.json`)

      return newData.data

    })
    const allstories = await Promise.all(story)
    for (var i of allstories) {
      i.time = i.time * 1000; //convert in milisecond
    }
    allstories.sort((a, b) => b.time - a.time);
    setStories(allstories)


  }

  function timeAgo(timestamp) {
    const now = Date.now();
    const secondsPast = Math.floor((now - timestamp) / 1000);

    if (secondsPast < 60) {
      return `${secondsPast} seconds ago`;
    }
    if (secondsPast < 3600) {
      const minutes = Math.floor(secondsPast / 60);
      return `${minutes} minutes ago`;
    }
    if (secondsPast < 86400) {
      const hours = Math.floor(secondsPast / 3600);
      return `${hours} hours ago`;
    }
    if (secondsPast < 2592000) {
      const days = Math.floor(secondsPast / 86400);
      return `${days} days ago`;
    }
    if (secondsPast < 31536000) {
      const months = Math.floor(secondsPast / 2592000);
      return `${months} months ago`;
    }
    const years = Math.floor(secondsPast / 31536000);
    return `${years} years ago`;
  }
  async function prevDate() {
    setStories([])
    setMsg("loading...")
    const data = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")

    var result = data.data.slice(0, 100)



    const story = result.map(async (e) => {
      const newData = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${e}.json`)

      return newData.data

    })
    var allstories = await Promise.all(story)
    for (var i of allstories) {
      i.time = i.time * 1000; //convert in milisecond
    }
    const currentDate = new Date().getTime();
    const date = new Date(currentDate);


    const oneDayInMilliseconds = prevdate * 24 * 60 * 60 * 1000;
    const previousDate = new Date(date.getTime() - oneDayInMilliseconds);
    setNextdate(previousDate);

    console.log(previousDate.getTime());
    var filterData = allstories.filter(e => e.time < previousDate)
    filterData.sort((a, b) => b.time - a.time);
    const slicedData = filterData.slice(0, 10);
    setStories(slicedData)
  }
  async function nextDate() {
    setStories([])
    setMsg("loading...")
    setPrevdate(prev=>prev-1);
    const data = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")

    var result = data.data.slice(0, 100)



   var story = result.map(async (e) => {
      var newData = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${e}.json`)

      return newData.data

    })
    var allstories = await Promise.all(story)
    for (var i of allstories) {
      i.time = i.time * 1000; //convert in milisecond
    }

    var filterData = allstories.filter(e => e.time > nextdate)
    if (filterData.length == 0) {
     var result = data.data.slice(0, 10);
     var story = result.map(async (e) => {
       var newData = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${e}.json`)

        return newData.data

      })
     var allstories = await Promise.all(story)
      for (var i of allstories) {
        i.time = i.time * 1000; //convert in milisecond
      }
      allstories.sort((a, b) => b.time - a.time);

      
      setStories(allstories);
      return;
    }
    filterData.sort((a, b) => a.time - b.time);


    var slicedData = filterData.slice(0, 10);
    setStories(slicedData)
  }
  async function handleSearch(e) {
    e.preventDefault()
    setMsg("loading...")
    setStories([])
    const data = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
   var story = data.data.map(async (e) => {
      var newData = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${e}.json`)

      return newData.data
    })
    var allstories = await Promise.all(story)
    for (var i of allstories) {
      i.time = i.time * 1000; //convert in milisecond
    }
   var result = allstories.filter(e =>{
    if(e.title.toLowerCase().includes(search.toLowerCase())){
      return e;
    }else{
      setMsg("No Record Found")

    }
    })
   console.log(result);
   setStories(result)

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
        <form className='search' onSubmit={handleSearch}>
          <input type='text' placeholder='search here'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <i class="fa-solid fa-magnifying-glass"></i>
          <button type="button" class="btn btn-outline-dark" onClick={handleSearch}>Search</button>
        </form>
      </nav>

      {stories.length > 0 ?
        <div>
          {
            stories?.map((e) => (
                <div className='app'>
                  <a href={e.url}>
                    <h3>
                      {++counter}. {e.title}
                    </h3>
                  </a>

                  <p>{e.score} points by {e.by} {timeAgo(e.time)}</p>

                </div>
              ))
          }
           <button type="button" class="btn btn-secondary" onClick={() => {
            setPrevdate(prev => prev + 1);
            prevDate();
          }}>Prev Date</button>
          <button onClick={() => {
            setCount(prev => prev + 10)
            setStories([])
            fetchData()
          }} type="button" class="btn btn-secondary">Load More</button>
         
          <button type="button" class="btn btn-secondary" onClick={() => {
            setNextdate(prev => prev + 1);
            nextDate();
          }}>Next Date</button>
        </div> : <div className='app2'>
          <h2 className='text-center flex'>{msg}</h2>
        </div>}


    </div>
  );
}

export default App;

