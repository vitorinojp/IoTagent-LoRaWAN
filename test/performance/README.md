# Load testing

This document explains how to run load tests to get performance metrics and to analyze stability of the **FIWARE LoRaWAN IoT Agent**, abstracting the complexity of setting up a complete LoRaWAN infrastructure** (e.g., end-nodes, network servers, application server, etc).

## Architecture

The testing scenario is focused on the **FIWARE LoRaWAN IoT Agent** and therefore it allows simulating massive amounts of incoming data from LoRaWAN end-nodes. Currently, the agent supports two different LoRaWAN stacks: [LoRaServer.io](https://www.loraserver.io/) and [TTN](https://www.thethingsnetwork.org/). In both cases, the interconnetion of the application server to the agent is done by means of a [MQTT broker](https://mosquitto.org/). Thus, running a load test agains the agent just requires injecting a huge number of messages in the MQTT broker.

In addition, in order to provide a correct and realistic functionality, an **Orion Context Broker** is required so that the agent can send the **updateContext** requests.

## Testing scenario

The provided Jmeter test file will apply the following parameters:
* 1000 threads. Each one of them will simulate data from a different device, pushing to the corresponding MQTT topic: ari_ioe_app_demo1/devices/lora_n_${__threadNum}/up
* 360 seconds of ramp-up period.
The payloads have the following form:
```json
{"app_id":"ari_ioe_app_demo1","dev_id":"lora_n_${__threadNum}","hardware_serial":"3339343771356214","port":99,"counter":243,"payload_raw":"AHMAAAFnARACaAADAGQEAQA=","payload_fields":{"barometric_pressure_0":0,"digital_in_3":100,"digital_out_4":0,"relative_humidity_2":0,"temperature_1":27.2},"metadata":{"time":"2018-04-01T13:43:31.591541572Z","frequency":868.5,"modulation":"LORA","data_rate":"SF12BW125","airtime":1646592000,"coding_rate":"4/5","gateways":[{"gtw_id":"ari_ioe_lab_gateway_3","gtw_trusted":true,"timestamp":2577141228,"time":"2018-04-01T13:48:46Z","channel":2,"rssi":-5,"snr":6.75,"rf_chain":1,"latitude":43.44151,"longitude":-3.859349,"location_source":"registry"}]}}
```
As it can be seen, all messages use the same payload with the execption of **dev_id** field that will correspond to the simulated device. This payload has been collected from a real deployment with a TTN stack and reports CayenneLpp data.

Finally, it must be noted that provisioning the devices will not be necessary since a static configuration file will be passed to the agent, defining the active attributes for the devies and the connection details with the MQTT broker.
## Prerequisites
### Apache Jmeter 5.0
Apache Jmeter 5.0 will be used to simulate load data coming northbound from the LoRaWAN underlying infrastructure. The installation process just requires to download the appropriate [release](http://ftp.cixug.es/apache//jmeter/binaries/apache-jmeter-5.0.tgz). As it is explained in https://jmeter.apache.org/usermanual/get-started.html#requirements, Java 8 or Java 9 are required.

### MQTT Jmeter Plugin
By default, Jmeter does not support MQTT. Therefore, the installation of [MQTT Jmeter plugin](https://github.com/emqx/mqtt-jmeter) is required.
* Download [Release 1.0.1](https://github.com/emqx/mqtt-jmeter/releases/download/1.0.1/mqtt-xmeter-1.0.1-jar-with-dependencies.jar)
* Copy the downloaded file to <jmeter_folder>/lib/ext

### Docker and docker-compose

[Docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/) will be used to execute the additional components required by the agent: MongoDB, the MQTT broker and the Orion Context Broker. Although, the IoT Agent could be also run using Docker, it is recommended to use a native installation from the sources in order to get accurate results.

## Running the test
1. Start required components. Before executing this command, please check that there are not running instances of MongoDB, Orion CB or MQTT or other services using the ports 271017, 1026 and 1883. In that case, plase stop them before running the command. 
```console
docker-compose -f test/performance/docker-compose.yml up
```
2. Once all the components have started properly, start the agent with the appropriate configuration file.
```console
node bin/iotagent-lora test/performance/config-jmeter.js
```
3. Execute Jmeter:
 ```console
<jmeter_folder>/bin/jmeter
```
4. Open the Jmeter file located at test/performance/lora_jmeter.jmx.
5. Start the test. In this point, you should see in the log of the agent that measurements are received in CayenneLpp format, translated to NGSI and forwarded to the CB.
6. (Optional) Instead of using the Jmeter GUI, the non-GUI mode can be launched:
```console
<jmeter_folder>/bin/jmeter -n -t test/performance/lora_jmeter.jmx -l results.out -e
```
