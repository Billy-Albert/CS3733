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

    let validate = (adminPassword) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Admin WHERE password=?", [adminPassword], (error, rows) => {
                if (error)
                    return reject(error);
                if (rows && rows.length == 1) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    };

    let response = undefined;
    const validUser = await validate(event.adminPassword);

    if (validUser) {
        response = {
            statusCode: 200,
            success: true
        };
    } else {
        response = {
            statusCode: 400,
            error: "Invalid Administrator credentials"
        };
    }
    
    pool.end();
    return response;
};