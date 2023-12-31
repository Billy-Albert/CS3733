import { post } from "./API"

export function listShowsAdmin() {
    // this sends the ACTUAL POST and retrieves the answer.
    let venueNameField = document.getElementById("venue-name-list");
    let passwordField = document.getElementById("data-admin-password");

    let data = {'venueName': venueNameField.value,
                'adminPassword': passwordField.value};

    console.log(data)

    const handler = (json) => {
        console.log(json);
        venueNameField.value = '';
        let str = "";
        for (let s of json.shows)
            str += "Show ID: " + s.showID + " | Show: " + s.name + " | Venue Name: " + s.venueName + " | " + s.month + "/" + s.day + "/" + s.year + " | " + (Math.floor(s.hour / 10) === 0 ? "0" : "") + s.hour + ":" + (Math.floor(s.minute / 10) === 0 ? "0" : "") + s.minute + " | Active: " + (s.active ? "Yes" : "No") + " | Seats Sold: " + s.seatsSold + " | Seats Remaining: " + (s.seatsTotal - s.seatsSold) + " | Total Proceeds: $" + (s.seatsSold * s.startingPrice) + '<br>';
        
        document.getElementById("show-list").innerHTML = str;
    }

    post('/admin/listShows', data, handler);
}
