const moment = require('moment');
const MQTT = require('async-mqtt');
const storage = require('node-persist');
let path = require('path');
const config = require('./config');

let appDir = path.dirname(require.main.filename);
let iotHubName = config.AZURE_IOT_HUB_NAME;
let iotHubdeviceId = config.AZURE_IOT_HUB_DEVICE_ID;
let iotHubPassword = config.AZURE_IOT_HUB_PASSWORD
let userName = `${iotHubName}.azure-devices.net/${iotHubdeviceId}/api-version=2016-11-14`;
let iotHubTopic = `devices/${iotHubdeviceId}/messages/events/`;

class HubClient {
	constructor() {
		this.isInit = false;
		this.lastEvent = undefined;
		this.hubConfigured = typeof iotHubName !== 'undefined' &&
												typeof iotHubdeviceId !== 'undefined' &&
												typeof iotHubPassword !== 'undefined';

		if (this.hubConfigured) {
			this.client = MQTT.connect(`mqtts://${iotHubName}.azure-devices.net:8883`, {
				keepalive: 10,
				clientId: iotHubdeviceId,
				protocolId: 'MQTT',
				clean: false,
				protocolVersion: 4,
				reconnectPeriod: 1000,
				connectTimeout: 30 * 1000,
				username: userName,
				password: iotHubPassword,
				rejectUnauthorized: false,
			});

			this.client.on("error",function(error) {
				console.log("Can't connect" + error);
			});
		}
	}

	async init() {
		await storage.init({
			dir: `${appDir}/storage`
		});
		this.lastEvent = await storage.getItem('lastEvent');
		if (this.lastEvent && this.lastEvent.dateTime) {
			this.lastEvent.dateTime = moment(this.lastEvent.dateTime);
		} else {
			this.lastEvent = {};
		}
		this.isInit = true;
	}

	async handlePresenceEvent(event) {
		if (!this.isInit) {
			await this.init()
		}

		if (event.event !== 'user.presence_status_updated' ||
			!(event.payload && event.payload.object)) {
			return;
		}

		let eventObject = event.payload.object;

		let normal = {
			dateTime: moment(eventObject.date_time),
			email: eventObject.email,
			profileId: eventObject.id,
			presence: eventObject.presence_status
		}

		if (!this.lastEvent.dateTime || this.lastEvent.dateTime.isBefore(normal.dateTime)) {
			this.lastEvent = normal;
			await storage.setItem('lastEvent', this.lastEvent);

			if (this.hubConfigured && this.client.connected) {
				await this.client.publish(iotHubTopic, normal.presence);
			}
		}
	}

	getLatestPresenceActivity() {
		return this.lastEvent ? this.lastEvent.presence : null;
	}
}

module.exports = HubClient;