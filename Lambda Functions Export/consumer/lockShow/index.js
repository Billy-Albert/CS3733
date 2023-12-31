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

    let response = undefined;

    let lockShow = (showID, lockedUntil) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE Shows SET locked=1, lockedUntil=? WHERE showID=?;", [lockedUntil, showID], (error, rows) => {
                if (error)
                    return reject(error);
                if (rows && rows.affectedRows == 1) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    };

    let locked = await lockShow(event.showID, event.lockedUntil);
    response = {
        statusCode: (locked ? 200 : 400),
        success: locked
    };

    pool.end();
    return response;
};