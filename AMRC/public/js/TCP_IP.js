/*
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3012;
app.use(express.json());
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './src/pug');
app.use(express.static('./public'));
app.use(bodyParser.json());
const net = require('net');


const IP = '192.168.1.221';
const Port = 19204;
const Port2 = 19206;

//데이터를 전달하는 함수
function packMsg(reqId, msgType, msg = {}) {
    const jsonStr = JSON.stringify(msg);
    const msgLen = msg ? jsonStr.length : 0;
    const rawMsg = Buffer.alloc(16);
    rawMsg.writeUInt8(0x5A, 0);
    rawMsg.writeUInt8(0x01, 1);
    rawMsg.writeUInt16BE(reqId, 2);
    rawMsg.writeUInt32BE(msgLen, 4);
    rawMsg.writeUInt16BE(msgType, 8);
    rawMsg.writeUInt32BE(0, 10);

    if (msgLen > 0) {
        const jsonBuffer = Buffer.from(jsonStr, 'ascii');
        rawMsg.length = 16 + jsonBuffer.length;
        jsonBuffer.copy(rawMsg, 16);
    }

    console.log(rawMsg.toString('hex').toUpperCase());
    return rawMsg;
}

const client = new net.Socket();

app.post("/connect", (req, res) => {
    if (client && client.destroy) {
        client.destroy();
    }
    client.connect(Port, IP, (error) => {
        if (error) {
            console.error('failed');
            res.json("failed");
        } else {
            console.log('connect_robot');
            res.json("connect");
        }
        //console.log('Connected to server');
        //client.setNoDelay();
        //const testMsg = packMsg(1, 1000, 0);
        //client.write(testMsg);
    });

});

app.post("/location", (req, res) => {
    // 기존 소켓 연결 종료
    if (client && client.destroy) {
        client.destroy();
    }

    // 새로운 소켓 연결 설정
    client.connect(Port2, IP, () => {
        console.log('연결')
        client.setNoDelay();
        let location_json = {"dist":5.0,"vx":0.5,"vy":0.5}

        const testMsg = packMsg(1, 3055, location_json);
        client.write(testMsg);
        res.json('start!');
    });
});


//데이터를 받아올 때의 함수

client.on('data', (data) => {
    console.log('Received data');
    let jsonDataLen = 0;
    let backReqNum = 0;
    if (data.length < 16) {
        console.log('Pack head error:', data);
        client.destroy();
    } else {
        const header = {
            0: data.readUInt8(0),
            1: data.readUInt8(1),
            2: data.readUInt16BE(2),
            3: data.readUInt32BE(4),
            4: data.readUInt16BE(8),
            5: data.slice(10, 16),
        };
        console.log(header);
        jsonDataLen = header[3];
        backReqNum = header[4];
    }

    let receivedData = data;
    let readSize = 1024;
    const dataAll = Buffer.from([]);

    if (jsonDataLen > 0) {
        const readCallback = () => {
            const recv = client.read(readSize);
            receivedData = Buffer.concat([receivedData, recv]);
            jsonDataLen -= recv.length;

            if (jsonDataLen <= readSize) {
                readSize = jsonDataLen;
            }

            if (jsonDataLen === 0) {
                // Buffer 데이터에서 JSON 데이터 추출
                const jsonDataBuffer = receivedData.slice(16);
                const jsonData = JSON.parse(jsonDataBuffer.toString('utf8'));
                console.log('Received JSON data:');
                console.log(jsonData);
                console.log(dataAll.toString('hex').toUpperCase());
                client.destroy();
            } else {
                client.once('readable', readCallback);
            }
        };

        client.once('readable', readCallback);
    } else {
        console.log(dataAll.toString('hex').toUpperCase());
        client.destroy();
    }
});



client.on('error', (err) => {
    console.error('Socket error:', err);
    client.destroy();
});

client.on('close', () => {
    console.log('Connection closed');
});


app.get('/', (req, res) => {
    res.render('AMRC');
});

app.listen(port, () => {
    console.log(`${port} START!`)
});
*/