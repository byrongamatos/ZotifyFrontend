import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const URL = process.env.BACKEND_URL;
  const [image, setImage] = useState("");
  const [artist, setArtist] = useState("");
  const [numtracks, setNumtracks] = useState(0);
  const [albumyear, setAlbumyear] = useState(0);
  const [album, setAlbum] = useState("");
  const [currentTask, setCurrentTask] = useState({});
  const [history, setHistory] = useState([]);
  const [queueStats, setQueueStats] = useState([]);

  useEffect(() => {
    if (currentTask.data != undefined) {
      setImage(currentTask.data.image);
      setAlbumyear(currentTask.data.release_year);
      setArtist(currentTask.data.artist);
      setNumtracks(currentTask.data.total_tracks);
      setAlbum(currentTask.data.album);
    }
  }, [currentTask]);

  useEffect(() => {
    initialData();
    const increment = async () => {
      const res = await axios.get(URL + "/currentTask");
      setCurrentTask(res);
      const hist = await axios.get(URL + "/history");
      setHistory(hist);
      const stats = await axios.get(URL + "/queuestats");
      setQueueStats(stats);
    };
    const intervalId = setInterval(increment, 30000);
    return () => {
      // Clear interval using intervalId
      // This function run when component unmount
      clearInterval(intervalId);
    };
  }, []);

  async function initialData() {
    const res = await axios.get(URL + "/currentTask");
    setCurrentTask(res);
    const hist = await axios.get(URL + "/history");
    setHistory(hist);
    const stats = await axios.get(URL + "/queuestats");
    setQueueStats(stats);
  }

  async function postData(event) {
    try {
      if (document.getElementById("url").value.includes("album")) {
        const response = await axios.post(URL + "/queue", {
          type: "album",
          url: document.getElementById("url").value,
        });
        console.log(response);
      }
      if (document.getElementById("url").value.includes("artist")) {
        const response = await axios.post(URL + "/queue", {
          type: "artist",
          url: document.getElementById("url").value,
        });
        console.log(response);
      }
      document.getElementById("url").value = "";
    } catch (error) {
      console.error(error);
    }
  }

  function timeSince(dateadded, datecompleted) {

    var seconds = -Math.floor((new Date(dateadded) - new Date(datecompleted).setHours(new Date(datecompleted).getHours() +1)) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

  return (
    <>
      <div className="w-full h-full bg-black">
        <div className="flex h-full items-center justify-center">
          <div className="flex-col  ">
            <div className="relative group">
            <div className="absolute top-0 left-0 right-0 px-4 py-2 bg-gray-800 opacity-70 invisible group-hover:visible">
                <h3 className="text-xl text-white font-bold">
                  {queueStats.data && queueStats.data[0].numalbums}&nbsp; albums in queue
                </h3>
                <p className="mt-2 text-sm text-gray-300">
                {queueStats.data && queueStats.data[0].numsongs}&nbsp; songs in queue
                </p>
              </div>
              <img src={image} alt="alternate text" className="mx-auto" />
              <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-800 opacity-70 invisible group-hover:visible">
                <h3 className="text-xl text-white font-bold">
                  {artist} - {album}
                </h3>
                <h5 className="text-white font-bold">({albumyear})</h5>
                <p className="mt-2 text-sm text-gray-300">
                  {numtracks} &nbsp; tracks.
                </p>
              </div>
            </div>

            <input
              type="text"
              id="url"
              className="bg-gray-50 border  my-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Spotify artist or album url"
              required
            />
            <button
              type="button"
              onClick={(event) => {
                postData(event);
              }}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Add to Queue
            </button>
            <h2 className="text-white text-xl">History</h2>
            <div className="overflow-y-scroll focus-within:overflow-visible">
              <div className="max-h-96">
              <ul className="p-4 space-y-4">
                {history.data &&
                  history.data.length > 0 &&
                  history.data.map(function (data) {
                    return (
                      <li key={data.id} >
                        <div className="flex items-center group">
                          <img
                            src={data.image}
                            className="h-24 w-24 mr-4 object-cover transition group-hover:scale-[3] group-hover:ml-24"
                          />
                          <div className="flex-col grow justify-center">
                          <h5 className="text-white">{data.artist}&nbsp;-&nbsp;{data.album}&nbsp;-&nbsp;{data.release_year}</h5>
                          <h5 className="text-white">{data.total_tracks} songs</h5>
                          <h5 className="text-white">Time taken to download {timeSince(data.dateadded, data.datecompleted)}</h5>
                          </div>
                          
                        </div>
                      </li>
                    );
                  })}
              </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
