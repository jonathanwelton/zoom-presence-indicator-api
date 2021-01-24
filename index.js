const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const HubClient = require('./hubClient');
const client = new HubClient();

app.get('/presence', (req, res) => {
	if (req.headers.authorization === config.VERIFICATION_TOKEN) {
		res.send({ activity: client.getLatestPresenceActivity() });
	} else {
		res.status(401).end('Access unauthorized');
	}
});

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
	let event;

	try {
		event = JSON.parse(req.body);
	} catch (err) {
		res.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	if (req.headers.authorization === config.ZOOM_VERIFICATION_TOKEN) {
		res.status(200);

		if (event.event === 'user.presence_status_updated') {
			client.handlePresenceEvent(event).catch(reason => {
				console.log("handlePresenceEvent threw exception", reason);
			})
		}

		res.send();

	} else {
		res.status(403).end('Access forbidden');
	}
});

var port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server is up and running on port ${port}.`)
})