# Support Wheel of Fate

I've build a REST API to generate schedule that shows whose turn is it to support the business by selecting two engineers at random to both complete a half day of support (shift) each.

Business Rules
- An engineer can do at most one half day shift in a day.
 - Each engineer should have completed one whole day of support in any 2 week period.
 - An engineer cannot have half day shifts on consecutive days.

 ## Description

 ### Technology Stack
 - NodeJS 14
 - ReactJS
 - Express
 - MongoDB

 ### Application
 Application structure is based on Action -> Domain -> Responder pattern. An in-cloud database is used and sample data is loaded from [MongoDB Cloud](https://cloud.mongodb.com).

 ### UI View
A web application made using ReactJS contains a calendar with the current month and will start generating the list starting from the first day of monday. e.g. if your current day is 7 (Tuesday), the next day of monday it will be on 13.

## REST API
URI: /api/v1/shifts
Method: POST

Request Header  
Content-Type: application/json  
Authorization: Bearer _token_  

Request Body  
An array of names:   
```json
[
  "Name 1",
  "Name 2"
]
```

URI: /api/v1/shifts  
Method: GET

Response  
An array of engineers  
```json
{
  "success": true,
  "data": [
    {
      "name": "Marianne Mcintyre",
      "shifts": [
        "2020-07-10",
        "2020-07-16"
      ]
    }
  ]
}
```

## Build and Run
To build the React App, from the root of the project run:  
`cd client`  
`npm run build`

To run the project with the Web Application, copy the contents of thr build folder into:  
`server/public`

In the server folder execute: `npm start` and the server with the client will start. 

An example of `.env` file for the server is:
```environment
NODE_ENV=development
PORT=4000
HOSTNAME=0.0.0.0
CONTENT_TYPE=application/json
MONGO_URL= #FILL THIS
```

For client:
```
SKIP_PREFLIGHT_CHECK=true
REACT_APP_TOKEN= #FILL THIS
```