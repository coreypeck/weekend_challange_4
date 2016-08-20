var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';

router.post('/', function(req, res) {
    var task = req.body;
    console.log(req.body);

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('INSERT INTO tasks (task_name, task_description, completion_status) ' +
            'VALUES ($1, $2, $3)', [task.taskName, task.taskSummary, task.taskStatus],
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
    });
});
router.get('/', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('SELECT * FROM tasks', function(err, result) {
            done(); // closes connection, I only have 10!

            if (err) {
                res.sendStatus(500);
            }

            res.send(result.rows);
        });
    });
});
router.put('/status/:id', function(req, res) {
    var id = req.params.id;
    var task = req.body;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }
        client.query('UPDATE tasks SET completion_status = $1 WHERE id = $2', [task.status, id],
            function(err, result) {
                done();
                if (err) {
                    res.sendStatus(500);
                    console.log("Error in pg.connect:", err);
                } else {
                    res.sendStatus(200);
                }
            });

    });

});
module.exports = router;
