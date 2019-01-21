const express = require('express');
const helmet = require('helmet');

const server = express();

server.use(express.json());
server.use(helmet());

const knex = require('knex');

const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);
// endpoints here

server.post('/api/zoos', (req, res) => {
	const zoo = req.body;
	if (req.body.name) {
		db('zoos')
			.insert(zoo)
			.then(ids => {
				res.status(201).json(ids);
			})
			.catch(err => {
				res.status(500).json(err);
			});
	} else res.status(400).json({ error: 'You need a Zoo Name' });
});

server.get('/api/zoos', (req, res) => {
	db.from('zoos')
		.select('name')
		.then(list => {
			res.status(200).json(list);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

server.get('/api/zoos/:id', (req, res) => {
	const uniqueZoo = req.params.id;
	db.from('zoos')
		.where({ id: uniqueZoo })
		.then(zoo => {
			res.status(200).json(zoo);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

server.delete('/api/zoos/:id', (req, res) => {
	const toDelete = req.params.id;
	db('zoos')
		.where({ id: toDelete })
		.del()
		.then(numDeleted => {
			res.status(200).json(numDeleted);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

server.put('/api/zoos/:id', (req, res) => {
	toEdit = req.params.id;
	db('zoos')
		.where({ id: toEdit })
		.update(req.body)
		.then(numberUpdated => {
			res.status(200).json(numberUpdated);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

const port = 3300;
server.listen(port, function() {
	console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
