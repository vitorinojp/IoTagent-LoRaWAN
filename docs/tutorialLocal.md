# Tutorial without using physical devices and gateways and without deploying or using a LoRaWAN infrastructure

This is a step-by-step tutorial that will present in detail how to test the
[FIWARE LoRaWAN IoT Agent](https://github.com/Atos-Research-and-Innovation/IoTagent-LoRaWAN) in a simulated and simple
scenario that does not require physical devices or a complete LoRaWAN stack.

## Prerequisites

### Environment and software

-   A single machine running a Linux based operating system, preferably Ubuntu 16.04.5 LTS or higher. All examples of
    RESTful commands provided in this tutorial will be meant to be executed from the same machine.
-   Docker version 18.06.1-ce or higher. Detailed installation instructions can be found
    [here](https://docs.docker.com/install/).
-   Docker Compose version 1.22.0 or higher. Detailed installation instructions can be found
    [here](https://docs.docker.com/compose/install/).
-   Curl

```bash
sudo apt-get install curl
```

-   Git

```bash
sudo apt-get install git
```

-   Mosquitto clients

```
sudo apt-get install mosquitto-clients
```

## Architecture

The tutorial allows the deployment of the following system, comprising a basic FIWARE IoT stack:

![Architecture](https://raw.githubusercontent.com/Atos-Research-and-Innovation/IoTagent-LoRaWAN/task/improveDocumentation/docs/img/tutorial_local.png)

-   **MQTT broker** that is used to simulate the reception of data from _LORAWAN application servers_.
-   **FIWARE IoT Agent** enables the ingestion of data from _LoRaWAN application servers_ in _NGSI context brokers_,
    subscribing to appropriate communication channels (i.e., MQTT topics), decoding payloads and translating them to
    NGSI data model. It relies on a _MongoDB database_ to persist information.
-   **FIWARE Context Broker** manages large-scale context information abstracting the type of data source and the
    underlying communication technologies. It relies on a _MongoDB database_ to persist information.

## Clone the GitHub repository

All the code and files needed to follow this tutorial are included in
[FIWARE LoRaWAN IoT Agent GitHub repository](https://github.com/Atos-Research-and-Innovation/IoTagent-LoRaWAN). To clone
the repository:

```bash
git clone https://github.com/Atos-Research-and-Innovation/IoTagent-LoRaWAN.git
```

## Deploy the testing stack

-   From the root folder of the repository, run:

```bash
docker-compose -f examples/docker-compose.local.yml up
```

-   In order to verify that the _FIWARE LoRaWAN IoT Agent_ is running, execute:

```bash
curl -X GET   http://localhost:4041/iot/about
```

-   The output should be:

```json
{ "libVersion": "2.8.0-next", "port": 4041, "baseRoot": "/" }
```

-   In order to verify that the _FIWARE context broker_ is running, execute:

```bash
curl localhost:1026/version
```

-   The output should be:

```json
{
    "orion": {
        "version": "2.1.0-next",
        "uptime": "0 d, 0 h, 17 m, 57 s",
        "git_hash": "0f61fc575b869dcd26f2eae595424fa424f9bc28",
        "compile_time": "Wed Dec 19 17:07:33 UTC 2018",
        "compiled_by": "root",
        "compiled_in": "07ff8fcb03f5",
        "release_date": "Wed Dec 19 17:07:33 UTC 2018",
        "doc": "https://fiware-orion.rtfd.io/"
    }
}
```

## Provision LoRaWAN endnode and query FIWARE context data

-In order to start using the IoTA, a new device must be provisioned. Execute the following command. Please note that as
no devices or LoRaWAN stack are being used, _ApplicationId_, _ApplicationAccessKey_, _DeviceEUI_ and _ApplicationEUI_
contain fake values.

```bash
curl -X POST \
  http://localhost:4041/iot/devices \
  -H 'Content-Type: application/json' \
  -H 'fiware-service: atosioe' \
  -H 'fiware-servicepath: /lorattn' \
  -d '{
  "devices": [
    {
      "device_id": "fake_device",
      "entity_name": "LORA-DEVICE",
      "entity_type": "LoraDevice",
      "timezone": "America/Santiago",
      "attributes": [
        {
          "name": "temperature_1",
          "type": "Number"
        }
      ],
      "internal_attributes": {
        "lorawan": {
          "application_server": {
            "host": "mosquitto",
            "provider": "TTN"
          },
          "dev_eui": "deviceEUI",
          "app_eui": "appEUI",
          "application_id": "applicationId",
          "application_key": "applicationKey",
          "data_model": "application_server"
        }
      }
    }
  ]
}'
```

This command will create a simple LoRaWAN device, with just one declared active attribute: temperature.

-   The list of provisioned devices can be retrieved with:

```bash
curl -X GET \
  http://localhost:4041/iot/devices/ \
  -H 'Content-Type: application/json' \
  -H 'fiware-service: atosioe' \
  -H 'fiware-servicepath: /lorattn'
```

-   It should return something similar to:

```json
{
    "count": 1,
    "devices": [
        {
            "device_id": "fake_device",
            "service": "atosioe",
            "service_path": "/lorattn",
            "entity_name": "LORA-DEVICE",
            "entity_type": "LoraDevice",
            "attributes": [
                {
                    "object_id": "temperature_1",
                    "name": "temperature_1",
                    "type": "Number"
                }
            ],
            "lazy": [],
            "commands": [],
            "static_attributes": [],
            "internal_attributes": {
                "lorawan": {
                    "application_server": {
                        "host": "mosquitto",
                        "provider": "TTN"
                    },
                    "dev_eui": "deviceEUI",
                    "app_eui": "appEUI",
                    "application_id": "applicationId",
                    "application_key": "applicationKey",
                    "data_model": "application_server"
                }
            }
        }
    ]
}
```

-   In order to simulate that a LoRaWAN device sends information:

```bash
mosquitto_pub -t applicationId/devices/fake_device/up -m "{\"payload_fields\":{\"temperature_1\":43.2}}"
```

This command simulates partially the notification notified by _TTN application server_ to the _IoT Agent_ when a new
message is sent by a device. As it can be seen, in this example, the simulation assumes that the payload is decoded by
the application server.

-   It is possible to check that the whole data flow is working correctly by calling the API of the _Context Broker_:

```bash
curl -X GET \
  http://localhost:1026/v2/entities \
  -H 'fiware-service: atosioe' \
  -H 'fiware-servicepath: /lorattn'
```

-   The result should be similar to:

```json
[
    {
        "id": "LORA-DEVICE",
        "type": "LoraDevice",
        "TimeInstant": {
            "type": "DateTime",
            "value": "2019-04-10T11:01:33.00Z",
            "metadata": {}
        },
        "temperature_1": {
            "type": "Number",
            "value": 43.2,
            "metadata": {
                "TimeInstant": {
                    "type": "DateTime",
                    "value": "2019-04-10T11:01:33.00Z"
                }
            }
        }
    }
]
```

-   As it can be seen, the data extracted from _FIWARE Context Broker_ is represented using _NGSI data model_, being a
    standardized representation independent of the underlying LoRaWAN communication protocol and the payload encoding
    format.
