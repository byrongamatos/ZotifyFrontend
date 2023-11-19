# Zotify Frontend

### A web interface to make life easier when using [zotify](https://github.com/zotify-dev/zotify/).


### Features
  - Download artist discographies
  - Download single albums
  - Download history
  - Queue multiple artists / albums
  
### Install
Using docker compose:

```
services:
  zotify_backend:
    image: xasiklas/zotifybackend:latest
    container_name: zotifybackend
    stdin_open: true
    tty: false
    ports:
      - "1337:1337"
    environment:
      - PUID=1026
      - PGID=100
      - SPOTIFY_CLIENTID=Your spotify clientid
      - SPOTIFY_CLIENTSECRET=Your spotify client secret
      - SPOTIFY_USERNAME=Your spotify username
      - SPOTIFY_PASSWORD=Your spotify password
    volumes:
      - /YourDownloadFolder:/media

  zotify_frontend:
    image: xasiklas/zotipyfrontend:latest
    container_name: zotifyfrontend
    stdin_open: true
    tty: true
    ports:
      - "5173:5173"
    environment:
      - BACKEND_URL=http://YourServerHostName:1337
    
```

Please use a burner account in order to login to Spotify.

### Roadmap

- [ ] Remove items from the queue
- [ ] Choose what whether to download singles/EPs/compilations