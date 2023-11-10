
[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
  

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# run docker
$ docker-compose up    

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## EndPoint API

```bash
/auth/signup - POST
  {
    "email": "test@test.ua",
    "password": "123",
  }  

/auth/signin - POST
  {
    "email": "test@test.ua",
    "password": "123",
  }
  
/auth/logout - POST
 Header: 
 Authorizarion: Bearer accessToken

"Secure - only for authorized users"
/auth/refresh - POST
 Header: 
 Authorizarion: Bearer refreshToken
```