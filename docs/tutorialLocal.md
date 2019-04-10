In order to use this IoT Agent, it must be noted that LoRa / LoRaWAN technologies are intended to be used with devices
and that a meshed network architecture is proposed by this standard including multiple hardware and software elements,
e.g, end-nodes or devices, gateways, network servers, application servers, IoT platforms and applications. Even,
depending on the mappings of the software components over the hardware elements, multiple variations from this basic
architecture can be derived. Further information can be found in
[What is the LoRaWAN Specification?](https://lora-alliance.org/about-lorawan).

Therefore, the characteristics of the LoRaWAN protocol imply that in order to test this agent in realistic conditions,
it is not possible to intend using just a laptop and the IoT Agent and the user may need a complete LoRaWAN
infrastructure. Nevertheless, in order to provide a step-by-step process and to target audiences with different levels
of expertise, in the following subsections this guide includes also simulation or testing scenarios that allow getting
started with LoRaWAN and IoT agent concepts.

# Testing the LoRaWAN IoT agent without using physical devices and gateways and without deploying or using a LoRaWAN infrastructure. A local MQTT message broker is deployed in order to perform the testing

-   From the root folder of the repository, run:

```bash
docker-compose -f examples/docker-compose.yml up
```

-   In order to verify that the _FIWARE LoRaWAN IoT Agent_ is running, execute:

```bash
curl -X GET   http://localhost:4041/iot/about
```

-   The output should be:

```json
{ "libVersion": "2.6.0-next", "port": 4041, "baseRoot": "/" }
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

-In order to start using the IoTA, a new device must be provisioned. Execute the following command replacing
_ApplicationId_, _ApplicationAccessKey_, _DeviceEUI_ and _ApplicationEUI_ with the appropriate values extracted in
previous steps.

```bash
curl -X POST \
  http://localhost:4041/iot/devices \
  -H 'Content-Type: application/json' \
  -H 'fiware-service: atosioe' \
  -H 'fiware-servicepath: /lorattn' \
  -d '{
  "devices": [
    {
      "device_id": "device001",
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
            "host": "localhost",
            "provider": "TTN"
          },
          "dev_eui": "deviceEui001",
          "app_eui": "appEui001",
          "application_id": "applicationId001",
          "application_key": "2B7E151628AED2A6ABF7158809CF4F3C"
        }
      }
    }
  ]
}'
```

This command will create a simple LoRaWAN device, with just one declared active attribute: temperature.

# Testing the LoRaWAN IoT agent without using physical devices and gateways and without deploying a LoRaWAN infrastructure. _The Things Network (TTN)_ stack will be used to perform the simulation

# Testing the LoRaWAN IoT agent without using physical devices and gateways. _LoRaServer.io_ stack will be deployed locally in order to perform the simulation.

# Supported LoRaWAN stacks/technologies

## The Things Network (TTN)

1.  Register your LoRaWAN gateways following `https://www.thethingsnetwork.org/docs/gateways/registration.html`.
2.  Create one or several applications following `https://www.thethingsnetwork.org/docs/applications/add.html`.
3.  Register your LoRaWAN devices within your applications following
    `https://www.thethingsnetwork.org/docs/devices/registration.html`.
4.  In order to use FIWARE IoT Agent for LoRaWAN protocol, you will need the following information:

-   Application ID (step 2)
-   Application key (step 2)
-   Device EUI (step 3)
-   App EUI (step 3)
-   Application server information
    -   Host (step 3)
    -   Username: It is the Application ID.
    -   Password (step 3)

## LoRaServer.io

1.  Install/deploy LoRa Server project. Docker installation method is recommended:
    `https://www.loraserver.io/install/docker/`
2.  Follow the [Getting started](https://www.loraserver.io/use/getting-started/) page to register your network-server
    and to create a service-profile, gateway, device-profile, application. Finally, add your LoRaWAN devices. Register
    your network-server: `https://www.loraserver.io/lora-app-server/use/network-servers/`
3.  In order to use FIWARE IoT Agent for LoRaWAN protocol, you will need the following information:

-   Application ID
-   Application key
-   Device EUI
-   App EUI
-   Application server information
    -   Host where MQTT broker is running.
    -   Username if it is defined.
    -   Password if it is defined.

# API Walkthrough

This section of the _Users Manual_ provides examples of how to use the IoTA API to provision LoRaWAN devices using three
different mechanisms.

All of them use a relatively simple device or node reporting the following measurements or observations:

-   The barometric pressure
-   The relative humidity
-   The temperature
-   A generic digital input
-   A generic digital output

## Device provisioning

This option allows provisioning a specific device, describing its attributes and LoRaWAN information. **Thus, using a
single Application Server, we can provision devices reporting different types of measurements.**

```bash
curl localhost:4061/iot/devices -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'fiware-service: smartgondor' --header 'fiware-servicepath: /gardens' -d @- <<EOF
{
  "devices": [
    {
      "device_id": "lora_n_003",
      "entity_name": "LORA-N-003",
      "entity_type": "LoraDevice",
      "timezone": "America/Santiago",
      "attributes": [
        {
          "object_id": "bp0",
          "name": "barometric_pressure_0",
          "type": "hpa"
        },
        {
          "object_id": "di3",
          "name": "digital_in_3",
          "type": "Number"
        },
        {
          "object_id": "do4",
          "name": "digital_out_4",
          "type": "Number"
        },
        {
          "object_id": "rh2",
          "name": "relative_humidity_2",
          "type": "Number"
        },
        {
          "object_id": "t1",
          "name": "temperature_1",
          "type": "Number"
        }
      ],
      "internal_attributes": {
        "lorawan": {
          "application_server": {
            "host": "eu.thethings.network",",
            "username": "ari_ioe_app_demo1",
            "password": "pwd1",
            "provider": "TTN"
          },
          "dev_eui": "1119343755556A14",
          "app_eui": "4569343567897875",
          "application_id": "ari_ioe_app_demo1",
          "application_key": "444B8EF16415B5F6ED777EAFE695C49",
          "data_model": "cayennelpp"
        }
      }
    }
  ]
}
EOF
```

-   provider: Identifies the LoRaWAN stack. **Current possible value is TTN.**
-   data_model: Identifies the data model used by the device to report new observations. **Current possible values are
    cayennelpp,cbor and application_server. The last one can be used in case the payload format decoding is done by the
    application server.**

The IoTa will automatically subscribe to new observation notifications from the device. Whenever a new update is
received, it will be translated to NGSI and forwarded to the Orion Context Broker.

You can query the corresponding entity in the Context Broker with:

```bash
curl localhost:1026/v2/entities/LORA-N-003 -s -S -H 'Accept: application/json' --header 'fiware-service: smartgondor' --header 'fiware-servicepath: /gardens' | python -mjson.tool
```

## Configuration provisioning

If a group of devices reports the same observations (i.e., smart meters for a neighborhood or building), the
_configuration API_ can be used to pre-provision all of them with a single request.**With this approach, all the devices
sharing the same configuration must be registered under the same Application Server.**

```bash
curl localhost:4061/iot/services -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'fiware-service: smartgondor' --header 'fiware-servicepath: /gardens' -d @- <<EOF
{
	"services": [
   {
    "entity_type": "LoraDeviceGroup",
    "apikey": "",
    "resource": "4569343567897875",
    "attributes": [
      {
        "object_id": "bp0",
        "name": "barometric_pressure_0",
        "type": "Number"
      },
      {
        "object_id": "di3",
        "name": "digital_in_3",
        "type": "Number"
      },
      {
        "object_id": "do4",
        "name": "digital_out_4",
        "type": "Number"
      },
      {
        "object_id": "rh2",
        "name": "relative_humidity_2",
        "type": "Number"
      },
      {
        "object_id": "t1",
        "name": "temperature_1",
        "type": "Number"
      }
    ],
    "internal_attributes": {
        "lorawan": {
          "application_server": {
            "host": "eu.thethings.network",",
            "username": "ari_ioe_app_demo1",
            "password": "pwd1",
            "provider": "TTN"
          },
          "app_eui": "4569343567897875",
          "application_id": "ari_ioe_app_demo1",
          "application_key": "444B8EF16415B5F6ED777EAFE695C49",
          "data_model": "cayennelpp"
    }
  }
]
}
EOF
```

As it can be seen, the **resource** property of the payload must match the App EUI.

In this case, the IoTA will subscribe to any observation coming from the LoRaWAN application server. Whenever a new
update arrives, it will create the corresponding device internally and also in the Context Broker using the
pre-provisioned configuration. Finally, it will forward appropriate context update requests to the Context Broker to
update the attributes' values.

## Static configuration

Finally, it is also possible to provide a static configuration for the IoTa. As it happens with the previous
alternative, this approach is useful for groups of devices which report the same observations. Again, **all the devices
sharing the same _Type_ must be registered under the same Application Server.**

```javascript
var config = {};

config.iota = {
    timestamp: false,
    logLevel: "DEBUG",
    contextBroker: {
        host: "localhost",
        port: "1026",
        ngsiVersion: "v2"
    },
    server: {
        port: 4041
    },
    service: "howtoService",
    subservice: "/howto",
    providerUrl: "http://localhost:4061",
    deviceRegistrationDuration: "P1M",
    defaultType: "Thing",
    defaultResource: "/iot/d",
    deviceRegistry: {
        type: "mongodb"
    },
    mongodb: {
        host: "localhost",
        port: "27017",
        db: "iotagentLoraTest"
    },
    types: {
        Mote: {
            service: "factory",
            subservice: "/robots",
            attributes: [
                {
                    object_id: "bp0",
                    name: "barometric_pressure_0",
                    type: "hpa"
                },
                {
                    object_id: "di3",
                    name: "digital_in_3",
                    type: "Number"
                },
                {
                    object_id: "do4",
                    name: "digital_out_4",
                    type: "Number"
                },
                {
                    object_id: "rh2",
                    name: "relative_humidity_2",
                    type: "Number"
                },
                {
                    object_id: "t1",
                    name: "temperature_1",
                    type: "Number"
                }
            ]
        }
    }
};

module.exports = config;
```
