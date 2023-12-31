const mysql = require('mysql');
const db_access = require('/opt/nodejs/db_access');

exports.handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: db_access.config.host,
        user: db_access.config.user,
        password: db_access.config.password,
        database: db_access.config.database
    });

    let alreadyExists = (name) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Venues WHERE name=?", [name], (error, rows) => {
                if (error)
                    return reject(error);
                if (rows && rows.length >= 1) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    };

    let response = undefined;
    const nameTaken = await alreadyExists(event.venueName);

    if (!nameTaken) {
        let createVenue = (name, sideLeftR, sideLeftC, centerR, centerC, sideRightR, sideRightC, password) => {
            return new Promise((resolve, reject) => {
                pool.query("INSERT into Venues(name,sideLeftRows,sideLeftColumns,centerRows,centerColumns,sideRightRows,sideRightColumns,password) VALUES(?,?,?,?,?,?,?,?);",
                    [name, sideLeftR, sideLeftC, centerR, centerC, sideRightR, sideRightC, password], (error, rows) => {
                    if (error)
                        return reject(error);
                    if (rows && rows.affectedRows == 1) {
                        // Somehow retrieve VenueID and return that
                        console.log(rows.insertId);
                        return resolve(rows.insertId);
                        //return resolve(true);
                    } else {
                        return resolve(false);
                    }
                });
            });
        };

        let venueID = await createVenue(event.venueName,
                                        event.sideLeftRows,
                                        event.sideLeftColumns,
                                        event.centerRows,
                                        event.centerColumns,
                                        event.sideRightRows,
                                        event.sideRightColumns,
                                        event.password);
        response = {
            statusCode: 200,
            venueID: venueID,
            //token: token
        };
    } else {
        response = {
            statusCode: 400,
            error: "Venue with that name already exists"
        };
    }

    pool.end();
    return response;
};