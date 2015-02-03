var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');

var mysqlPool = mysql.createPool({
    host: 'jobdatabase-instance.c2gvfuzbyz3i.eu-central-1.rds.amazonaws.com',
    port: 3306,
    database: 'JobDatabase',
    user: 'nikos',
    password: '66reggae',

//    host: 'localhost',
//    port: 3306,
//    database: 'jobdatabase',
//    user: 'root',
//    password: 'qwerty',

    acquireTimeout: 2000,
    connectionLimit: 20,
    queueLimit: 100
});

/* GET all jobs */
router.get('/jobs', function (req, res) {

    mysqlPool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            return;
        } else {
            var q = "SELECT * FROM jobs, fields WHERE jobs.ID = fields.jobID";
            connection.query(q, function (err, rows) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    connection.release();
                    //console.log("###################")
                    //console.log(rows.length)
                    //console.log("###################")
                    //reconstruct json
                    var previousJobID = 0;
                    var hitJobId;
                    var timesThisJobHasHit = 0;
                    for (var i = 0; i < rows.length; i++) {
                        var j = rows[i];
                        if (i !== 0) {
//                                console.log("")
//                                console.log(">>> checking new entry: " + j.title + " " + j.field)
//                                console.log(">>> : " + previousJobID + " " + j.jobID)
                            if (previousJobID === j.jobID) {//we found a job with 1 or more fields
//                                    console.log("match: " + previousJobID + " " + j.jobID + " " + j.title)
                                hitJobId = previousJobID;
                                if (hitJobId === j.jobID) {//repeated hit
                                    timesThisJobHasHit++;
//                                        console.log("repeated hit: " + timesThisJobHasHit)
                                } else {
                                    timesThisJobHasHit = 0
                                }
                                var arrayOfFields = [];
                                for (var x = 0; x < timesThisJobHasHit; x++) {
                                    arrayOfFields.push(rows[i - 1].field[x])
//                                        console.log("pushed: " + rows[i - 1].field[x] + " into " + rows[i].jobID)
                                }
                                //add to array current jobs field, and push array into job
                                arrayOfFields.push(j.field)
                                j.field = arrayOfFields
//                                    console.log(rows[i].jobID + " Now is: " + j.field)
                                previousJobID = j.jobID
                                //and remove previous job
                                rows.splice(i - 1, 1);
//                                    console.log("removed: " + rows[i - 1].jobID + " " + rows[i - 1].title)
                                i--;
                            } else {
                                //console.log("NOT match: " + previousJobID + " " + j.jobID + " " + j.title)
                                timesThisJobHasHit = 0
                                previousJobID = j.jobID
                                var arrayOfFields = [];
                                arrayOfFields.push(j.field)
                                j.field = arrayOfFields
                            }
                        } else {
                            previousJobID = j.jobID
//                                console.log("previousJobID :" + previousJobID)
                            var arrayOfFields = [];
                            arrayOfFields.push(j.field)
                            j.field = arrayOfFields
                        }
                    }
                    res.send(rows);
                }
            });

        }
    });
});

module.exports = router;