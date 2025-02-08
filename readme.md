# Action ou vérité by nduboi ⛵
Personal Project  
## Download 💾

To download the game, run the following commands:

```bash
git clone git@github.com:nduboi/Action-ou-verite.git
cd Action-ou-verite
```

## How to play? :desktop_computer:

### You need to modify one file:

Create a file named `api_token.env` and fill it with secure information. This token will be used to secure the communication between the API and the server.
```env
SECRET_KEY_JWT=(secure_token)
```

### Once you have created the file:

```bash
docker-compose up -d
```

Go to this website: http://localhost:8001

## Play fast:

Go to this platform and log in with your Docker Hub account:

https://labs.play-with-docker.com/

Run this command:
```bash
git clone https://github.com/nduboi/Truth-or-Dare.git && cd Truth-or-Dare
echo SECRET_KEY_JWT=default > api_token.env
docker-compose up 
```

After this, open port 8001 and have fun for 4 hours. After this, all data will be lost.

## Requirements

Docker  

Docker Compose

## Contribution 👏
**Created by:** 📝

[@nduboi](https://github.com/nduboi)

