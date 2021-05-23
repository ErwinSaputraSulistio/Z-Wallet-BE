# Z-Wallet-BE

## How to install & start?  
    git clone https://github.com/ErwinSaputraSulistio/Z-Wallet-BE
    cd Z-Wallet-BE
    npm install
    nodemon app.js

## Backend - List of Endpoints
    http://localhost:2345/v1/Path
#### 1.) Users :
Path | Method | Explanation
:-- | :-: | :-:
/users | POST | Create a new user
/users | GET | See all users list
/users/:id | GET | See an user information
/users/:id | PUT | Update user data
/users/change/pin/:id | PATCH | Change an user's PIN
/users/change/password/:id | PATCH | Change an user's password
/users/:id | DELETE | Delete an user
/users/login | POST | User login
/users/jwt | POST | Check user's data by login's JWT
/users/change/avatar/:id | PATCH | Change an user's avatar  

#### 2.) Transactions :
Path | Method | Explanation
:-- | :-: | :-:
/saldo/transfer | POST | Transfer saldo
/saldo/top-up/:id | POST | Top-up saldo
/saldo/history?id={id}&sort={Sender/Receiver} | GET | List of transaction histories
/saldo/history/:id | DELETE | Delete a transaction history


## Links :  
Frontend : https://github.com/ErwinSaputraSulistio/Z-Wallet-FE  
Deploy : https://z-wallet-erwinsaputrasulistio.vercel.app/  

## Build with :  
![Node Logo](https://user-images.githubusercontent.com/77045083/110448204-8dd6b980-80f3-11eb-89b6-13397ed8a31e.png)
![Express Logo](https://user-images.githubusercontent.com/77045083/111209202-52118780-85fe-11eb-8dc5-9394b3f0a9e3.png)
![PostgreSQL Logo](https://user-images.githubusercontent.com/77045083/110446881-397f0a00-80f2-11eb-8c98-ebfb3d5753c0.png) 
