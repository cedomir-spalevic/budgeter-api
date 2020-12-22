# budgeter-api

![Deploy main branch](https://github.com/cedomir-spalevic/budgeter-api/workflows/Deploy%20main%20branch/badge.svg)

API for Budgeter mobile app

## How to run
```
   # Run app
   npm start

   # Allow windows 10 passthrough to WSL2 (run in powershell as admin)
   netsh interface portproxy add v4tov4 listenport=4000 listenaddress=0.0.0.0 connectionport=4000 connectaddress=<ip of wsl2>
```