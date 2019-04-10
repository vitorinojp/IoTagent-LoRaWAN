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
curl -X GET   http://localhost:4061/iot/about
```

-   The output should be:

```json
{ "libVersion": "2.6.0-next", "port": 4061, "baseRoot": "/" }
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
