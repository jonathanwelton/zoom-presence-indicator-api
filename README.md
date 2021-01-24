# Zoom Presence Indicator API

A simple Node API that receives Zoom presence events and pushes them to an Azure IoT Hub.

Based on the [Sample Zoom Webhook App](https://github.com/zoom/zoom-sample-webhookapp) and examples from [Michael Leo](https://www.michaelleo.com/zoom-busy-light/).

## Features

The API hosts two endpoints:

- '/webhook' (POST): Use this as your Zoom event notification endpoint URL
- '/presence' (GET): To return the last updated presence status

## Motivation

This app was created as part of a bigger project to display the presence status of a Zoom user on a Raspberry Pi integrated with a Unicorn pHAT. You can read the original blog post [here](https://jonathanwelton.github.io/2021/01/31/raspberry-pi-presence-light.html).

## Requirements

- [Node.js](https://nodejs.org/)

## Installation

    git clone https://github.com/jonathanwelton/zoom-presence-indicator-api.git
    cd zoom-presence-indicator-api
    npm install
    npm start

## Usage

Start by adding an .env file for all of your configuration.

The following variables should be set, although the API can be run without configuring an Azure IoT Hub:

| Variable                | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| ZOOM_VERIFICATION_TOKEN | Used to authenticate calls to /webhook               |
| VERIFICATION_TOKEN      | Used to authenticate calls to /presence              |
| AZURE_IOT_HUB_NAME      | Used to target the correct IoT Hub                   |
| AZURE_IOT_HUB_DEVICE_ID | Used to target the correct device within the IoT Hub |
| AZURE_IOT_HUB_PASSWORD  | Used to autheticate with the IoT Hub                 |

To call the '/presence' endpoint you will need to provide the verification token you configured above in an authorization header.

The response has the following shape:

```
{
    "activity": "Available"
}
```

Some possible statues:

- Available
- In_Calendar_Event
- Away
- Do_Not_Disturb
- In_Meeting
- Presenting

Other statuses may be found [here](https://support.zoom.us/hc/en-us/articles/360032554051-Status-Icons)

### Zoom App

Information on configuring a Zoom app to send presence events can be found in the [Sample Zoom Webhook App](https://github.com/zoom/zoom-sample-webhookapp) documentation

### Azure IoT Hub

Information on configuring an Azure IoT Hub is beyond the scope of this readme, but I did find [this article](https://blog-about.xyz/2019/03/22/mosquitto-to-azure-iot-hub/) useful
