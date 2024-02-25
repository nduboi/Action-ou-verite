# Action ou verité by nduboi ⛵
Project Personel  
## Download 💾

To download the game you need to do this command

```bash
git@github.com:nduboi/Action-ou-verite.git
cd Action-ou-verite
```

## How to play ? :desktop_computer:

### You need to create 4 files :

First a file named : mail.env you need to fill with your informations
```env
MAIL_HOST=STMP_SERVER
MAIL_ADRESS=Email_adress
MAIL_PASSWORD=App_password
MAIL_PORT=STMP_PORT
```

Second file named : pma.env you need to fill with your informations
```env
PMA_HOST=(database_service) by default db
PMA_PORT=(database_port) by default 3306
```

Next file named : api_token.env you need to fill with secured informations
This token will be use to secured the communication btw the api and the server
```env
API_TOKEN=(secure_token)
```

Finally file named db_log.env you need to fill with your informations
```env
MYSQL_ROOT_PASSWORD=(database_root_password) choose a password
MYSQL_DATABASE=(database_name) choose a name
MYSQL_USER=(database_user) choose a username
MYSQL_PASSWORD=(database_password) choose a password
MYSQL_HOST=(database_service) by default db
```

### When you have created all files :  

```bash
docker-compose up -d
```

Go to this website http://localhost:80

## Requirements

Docker  

Docker compose

## Contribution 👏
**Created by :** 📝

[@nduboi](https://github.com/nduboi)