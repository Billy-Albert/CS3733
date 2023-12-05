import { get } from "./API"

export function listShows(searchStr) {
    // this sends the ACTUAL POST and retrieves the answer.
    get('/consumer/listShows')
        .then(function (response) {
            if (searchStr !== "")
                response.shows = response.shows.filter((show) => {return show.name.toLowerCase().includes(searchStr.toLowerCase())});
            
            document.getElementById("data-show-list").value = JSON.stringify(response.shows);
            let str = ''
            for (let s of response.shows)
                str += "Show ID: " + s.showID + " | Show: " + s.name + " | Venue Name: " + s.venueName + " | " + s.month + "/" + s.day + "/" + s.year + " | " + (Math.floor(s.hour / 10) === 0 ? "0" : "") + s.hour + ":" + (Math.floor(s.minute / 10) === 0 ? "0" : "") + s.minute + '<br>';

            // insert HTML in the <div> with 
            // constant-list
            let cd = document.getElementById('show-list')
            cd.innerHTML = str

        })
        .catch(function (error) {
            // not much to do
            console.log(error)
        })
    }
