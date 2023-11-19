import Express from "express";
import { spawn } from "child_process";
import {
  createQueueElement,
  deleteQueueElement,
  getNextQueueElement,
  getNexTask,
  createTask,
  deleteTask,
  createHistoryElement, getHistory, getQueueStats
} from "./db/queue.js";
import { getZotipyStatus, setZotipyStatus } from "./db/settings.js";
import bodyParser from "body-parser";
import cors from "cors";
import SpotifyWebApi from "@miraclx/spotify-web-api-node";
import { scheduleJob } from "node-schedule";

const app = Express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const job = scheduleJob("*/1 * * * *", async function () {
  console.log("Checking zotify queue status...");
  const zotipyStatus = await getZotipyStatus();
  if (zotipyStatus[0]["value"] != "running") {
    const nextTask = await getNexTask();
    if (nextTask.length > 0) {
      const test = await setZotipyStatus("running");
      console.log("Starting zotify");
      const date_added=new Date().toISOString();
      const zotify = spawn("zotify", [
        "--username",
        process.env.SPOTIFY_USERNAME,
        "--password",
        process.env.SPOTIFY_PASSWORD,
        nextTask[0].url,
      ]);
      zotify.stdout.on("data", (data) => {
        console.log(`zotify stdout:\n${data}`);
      });

      zotify.stderr.on("data", (data) => {
        console.error(`zotify stderr:\n${data}`);
      });
      zotify.on('exit', async function (code, signal) {
        const test2 = await setZotipyStatus("stopped");
      const del = await deleteTask(nextTask[0].id);
      const history = await createHistoryElement({
        url: nextTask[0].url,
        artist: nextTask[0].artist,
        album: nextTask[0].album,
        image: nextTask[0].image,
        total_tracks: nextTask[0].total_tracks,
        release_year: nextTask[0].release_year,
        dateadded: date_added,

      });
      });
      
    }
  }
});

app.post("/queue", async (req, res) => {
  const result = await createQueueElement(req.body).then();
  const queueElements = await getNextQueueElement();

  if (queueElements[0]["type"] == "album") {
    createTask(req.body);
  }
  if (queueElements[0]["type"] == "artist") {
    const spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENTID,
      clientSecret: process.env.SPOTIFY_CLIENTSECRET,
      redirectUri: "http://localhost:1337/",
    });
    const aaa = await spotify.clientCredentialsGrant();
    const token = aaa.body.access_token;
    spotify.setAccessToken(token);
    const artistid = queueElements[0]["url"].replace(
      "https://open.spotify.com/artist/",
      ""
    );
    spotify
      .getArtistAlbums(artistid, {
        include_groups: "album",
        limit: 50,
      })
      .then(
        function (data) {
          data.body.items.map(getAlbum);

          async function getAlbum(item) {
            const task = await createTask({
              url: item.external_urls.spotify,
              artist: item.artists[0].name,
              album: item.name,
              image: item.images[0].url,
              release_year: new Date(item.release_date).getFullYear(),
              total_tracks: item.total_tracks,
            });
          }
        },
        function (err) {
          console.error(err);
        }
      );
  }
  const del = await deleteQueueElement(result[0]);
  res.status(201).json({ id: result[0] });
});

app.get("/currentTask", async (req, res) => {
  const result = await getNexTask();
  if(Object.keys(result).length>0)
    res.status(200).json(result[0]);
  else
    res.status(200).json({image: "https://placehold.jp/30/000000/ffffff/600x600.png?text=No+download+active", release_year: 0, artist: '', total_tracks: 0, album: ''})
    
});

app.get("/history", async (req, res) => {
  const result = await getHistory();
  if(Object.keys(result).length>0)
    res.status(200).json(result);
  else
    res.status(200).json()
});

app.get("/queuestats", async (req, res) => {
  const result = await getQueueStats();
  res.status(200).json(result);    
});

app.get("/test", async (req, res) => {
  const result = await getQueueStats();
  res.status(200).json(result);
});

app.delete("/queue/:id", async (req, res) => {
  const result = await deleteQueueElement(req.params.id);
  res.status(201).json({ id: result[0] });
});

app.listen(1337, () => {
  console.log("Server is running on port 1337");
});
