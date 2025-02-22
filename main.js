const WebSocket = require('ws');
const net = require('net');

const tcpClient = new net.Socket();
// tcp connect to wechat server
tcpClient.connect(80, '43.159.235.98', function() {
    console.log('Connected to TCP server');

    // Create a WebSocket client and connect to the mmtls server
    const ws = new WebSocket('ws://geovolume.com:8880');

    // Triggered when the WebSocket connection is opened
    ws.on('open', function open() {
        // Request mmtls handshake
        ws.send(JSON.stringify({type: 1}));
    });

    // Triggered when a WebSocket message is received
    ws.on('message', function incoming(data) {
        const firstByte = data[0];
        if (firstByte === 0) {
            tcpClient.write(data.slice(1));
        } else if (firstByte === 1) {
            console.log('Received binary message from wechat server:', data.slice(1));
        } else {
            command = JSON.parse(data.toString())
            if (command.type === 0) {
                console.log('mmtls handshake successful, data can be sent to the server');

                // Data needs to be sent via WebSocket first, and then to the wechat server
                const buffer = Buffer.alloc(1 + data.length);
                buffer[0] = 0;
                data.copy(buffer, 1);
                // Send to the WebSocket server for unpacking
                ws.send(buffer);
            }
        }

    });

    // Triggered when the WebSocket connection is closed
    ws.on('close', function close() {
        console.log('Disconnected from WebSocket server');
    });

    // Triggered when a WebSocket error occurs
    ws.on('error', function error(err) {
        console.error('WebSocket error:', err);
    });


    // Triggered when TCP data is received
    tcpClient.on('data', function(data) {
        // Send to the WebSocket server for unpacking
        const buffer = Buffer.alloc(1 + data.length);
        buffer[0] = 1;
        data.copy(buffer, 1);
        // Send to the WebSocket server for unpacking
        ws.send(buffer);
    });

    // Triggered when the TCP connection is closed
    tcpClient.on('close', function() {
        console.log('Disconnected from TCP server');
    });

    // Triggered when a TCP connection error occurs
    tcpClient.on('error', function(err) {
        console.error('TCP error:', err);
    });
});