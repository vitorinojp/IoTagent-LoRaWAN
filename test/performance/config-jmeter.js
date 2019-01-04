/*
 * Copyright 2018 Atos Spain S.A
 *
 * This file is part of iotagent-lora
 *
 * iotagent-lora is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * iotagent-lora is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with iotagent-lora.
 * If not, seehttp://www.gnu.org/licenses/.
 *
 */

var config = {};

config.iota = {
    timestamp: false,
    logLevel: 'DEBUG',
    contextBroker: {
        host: 'localhost',
        port: '1026',
        ngsiVersion: 'v2'
    },
    server: {
        port: 4041
    },
    types: {
        'Device': {
            service: 'jmeter',
            subservice: '/jmeter',
            commands: [],
            lazy: [],
            attributes: [
                {
                    object_id: 't1',
                    name: 'temperature_1',
                    type: 'Number'
                }
            ],
            internalAttributes: {
                lorawan: {
                    application_server: {
                        host: 'localhost',
                        provider: 'TTN'
                    },
                    app_eui: '70B3D57ED000985F',
                    application_id: 'ari_ioe_app_demo1',
                    application_key: '9BE6B8EF16415B5F6ED4FBEAFE695C49'
                }
            }
        }
    },
    service: 'howtoService',
    subservice: '/howto',
    providerUrl: 'http://localhost:4061',
    deviceRegistrationDuration: 'P1M',
    defaultType: 'Thing',
    defaultResource: '/iot/d',
    deviceRegistry: {
        type: 'mongodb'
    },
    mongodb: {
        host: 'localhost',
        port: '27017',
        db: 'iotagentLoraJmeter'
    }
};

module.exports = config;
