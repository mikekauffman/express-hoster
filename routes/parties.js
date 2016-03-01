var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path')
var connectionString = require(path.join(__dirname, '../', './', 'config'));

router.get('/', function(req, res) {
    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        client.query("SELECT * FROM parties ORDER BY id ASC;", function(err, result) {
            done();
            return res.json(result.rows);
        });
    });
});

router.post('/', function(req, res) {
    var data = {
      name: req.body.name,
      size: req.body.size,
      arrived_at: new Date().toISOString(),
      seated: false
    };

    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        client.query("INSERT INTO parties(name, size, arrived_at, seated) values($1, $2, $3, $4)", [data.name, data.size, data.arrived_at, data.seated]);

        client.query("SELECT * FROM parties ORDER BY id ASC", function(err, result) {
            done();
            return res.json(result.rows.pop());
        });
    });
});

router.put('/:party_id', function(req, res) {
    var id = req.params.party_id;

    var data = {
      seated: true,
      seated_at: new Date().toISOString()
    }

    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        client.query("UPDATE parties SET seated=($1), seated_at=($2) WHERE id=($3)", [data.seated, data.seated_at, id]);

        var query = client.query("SELECT * FROM parties WHERE id=($1)", [id], function(err, result) {
            done();
            return res.json(result.rows.pop());
        });
    });
});

module.exports = router;
