const fetch = require('node-fetch');
const express = require('express');
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

app.use(express.json());

let distance = '';
let origin = '';
let destination = '';
let originGPS = ''
let destinationGPS = ''

app.post('/distance', (req, res) => {
    console.log(req.body);
    origin = req.body.distance.origin;
    destination = req.body.distance.destination;
    //bing maps API key
    const key = "AuLjO1RyuIi_OgwzYuV_0mSAYHRV5_JDYzHnCy9V0CAAEWOzmII-Q__ZzTCQnoIP";

    //bing free coordinates API
    const url1 = `http://dev.virtualearth.net/REST/v1/Locations?q=${origin}&&key=${key}`
    const url2 = `http://dev.virtualearth.net/REST/v1/Locations?q=${destination}&&key=${key}`
    fetch(url1)
        .then(res => res.json())
        .then(After => {
            originGPS = After.resourceSets[0].resources[0].geocodePoints[0].coordinates;
            console.log(originGPS)
            fetch(url2)
                .then(res => res.json())
                .then(After => {
                    destinationGPS = After.resourceSets[0].resources[0].geocodePoints[0].coordinates;
                    console.log(destinationGPS);
                    // bing free distance matrix API
                    const url = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${originGPS}&destinations=${destinationGPS}&travelMode=driving&key=${key}`
                    fetch(url)
                        .then(resp => resp.json())
                        .then(resAfter => {
                            distance = resAfter.resourceSets[0].resources[0].results[0].travelDistance;
                            res.send({distance});
                        }).catch(error => {
                            res.send(-1);
                        });
                        
                }).catch(error => {
                    res.sendStatus(404);
                });

        }).catch(error => {
            res.sendStatus(404);
        });;
})

let port = process.env.PORT || 5000;

app.listen(port);