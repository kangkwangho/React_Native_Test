const ModbusRTU = require('modbus-serial');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3011;
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const exec = require('child_process').exec;


////////////////////////////////////////////////////////////////////
app.use(cookieParser());
app.use(express.json());
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './src/pug');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })); // URL-encoded form 데이터를 파싱

//연결 함수
let isConnected = false;
let current_status = {};
const modbusClient = new ModbusRTU();
function connect_AMR(value1, value2, res) {
    try {
        modbusClient.connectTCP(`${value1}`, { port: value2 }, err => {
            if (err) {
                console.log(err);
                console.log('---------------------------');
                console.log('연결 시도된 IP   :' + value1);
                console.log('연결 시도된 PORT :' + value2);
                console.log('---------------------------');
                isConnected = false;
            } else {
                console.log('---------------------------');
                console.log('****PLC가 연결되었습니다****');
                console.log('연결 된 IP   :' + value1);
                console.log('연결 된 PORT :' + value2);
                console.log('---------------------------');
                current_status = {
                    "current": true,
                    "comment": `연결에 성공하였습니다. 연결 ip : ${value1}  연결 port : ${value2}`,
                };
                res.json(current_status);
                isConnected = true;
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

//연결
app.post("/connect", (req, res) => {
    try {
        let { ip_value, port_value } = req.body;
        connect_AMR(ip_value, port_value, res);
        //res.status(200).json({ success: true, message: "기다리는 중..." });
        // 연결 상태 확인과 다시 연결 시도
        function checkConnection() {
            if (!isConnected) {
                console.log('연결이 끊겼습니다. 다시 연결 시도 중...');
                connect_AMR(ip_value, port_value, res); // 다시 연결을 시도하는 함수 호출
            }
        }

        // 일정한 간격으로 연결 상태 확인
        const checkInterval = setInterval(checkConnection, 5000); // 예: 5초마다 확인

        // 서버가 종료될 때 clearInterval로 인터벌을 정리
        process.on('exit', () => {
            clearInterval(checkInterval);
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//리프트 리미트 업다운
app.post("/liftUp", (req, res) => {
    try {
        let { offset, data } = req.body;
        modbusClient.writeRegister(offset, data, (err) => {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    status: '리프트가 움직입니다.'
                })
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//리프트 리미트 업다운(fork)
app.post("/liftUp_fork", (req, res) => {
    try {
        let { offset, data } = req.body;
        float32_menual(offset, data, res);
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//float32_menual_Func1(일반)
function float32_menual(address, value, res) {
    try {
        const startAddress = address;
        const floatValue = value;
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setFloat32(0, floatValue, true);
        const data = new Uint16Array(buffer);
        modbusClient.writeRegisters(startAddress, data, (err) => {
            if (err) {
                res.json(err);
            } else {
                console.log(`전달한 데이터: ${data}`);
                res.json({
                    status: 'success'
                })
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

//float32_menual_Func1(전후좌우)
function float32_menual2(address, value, address2, value2, res) {
    try {
        const startAddress2 = address;
        const floatValue2 = value;
        const buffer2 = new ArrayBuffer(4);
        const view2 = new DataView(buffer2);
        view2.setFloat32(0, floatValue2, true);
        const data2 = new Uint16Array(buffer2);
        modbusClient.writeRegisters(startAddress2, data2, (err) => {
            if (err) {
            } else {
            }
        });
        const startAddress = address2;
        const floatValue = value2;
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setFloat32(0, floatValue, true);
        const data = new Uint16Array(buffer);
        modbusClient.writeRegisters(startAddress, data, (err) => {
            if (err) {
                res.json(err);
            } else {
                console.log(`전달한 데이터: ${data}`);
                res.json({
                    status: 'success'
                })
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
}





//speed *****************************************************************
//speed *****************************************************************

app.post("/speed_forward", (req, res) => {
    try {
        forward_speed = req.body.speed_value;
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
})

app.post("/speed_turn", (req, res) => {
    try {
        turn_speed = req.body.speed_value;
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
})

//speed *****************************************************************
//speed *****************************************************************




app.post("/forward", (req, res) => {
    float32_menual2(21, forward_speed, 14, 2, res);
});
app.post("/forward2", (req, res) => {
    float32_menual2(21, -0.001, 14, 0.001, res);
});

//후진
app.post("/backward", (req, res) => {
    float32_menual2(21, -forward_speed, 14, 2, res);
});
app.post("/backward2", (req, res) => {
    float32_menual2(21, 0.001, 14, 0.001, res);
});

//왼쪽 턴
app.post("/location_left", (req, res) => {
    float32_menual2(25, turn_speed, 18, 0.7, res);
});
app.post("/location_left2", (req, res) => {
    float32_menual2(25, -0.001, 18, 0.001, res);
});


//오른쪽 턴   (0.1, 0.25, 0.5)
app.post("/location_right", (req, res) => {
    float32_menual2(25, -turn_speed, 18, 0.7, res)
});
app.post("/location_right2", (req, res) => {
    float32_menual2(25, 0.001, 18, 0.001, res)
});

//move_stop
app.post("/moveStop_Btn", (req, res) => {
    try {
        modbusClient.writeCoil(3, 1, (err) => {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    status: 'move stop'
                })
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
})

//move_again
app.post("/moveAgain_Btn", (req, res) => {
    try {
        modbusClient.writeCoil(4, 1, (err) => {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    status: 'move again'
                })
            }
        })
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
})

//cancle the move
app.post("/cancleTheMove_Btn", (req, res) => {
    try {
        modbusClient.writeCoil(5, 1, (err) => {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    status: 'cancle the move!'
                })
            }
        })
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
})

//에러 제거
app.post("/error", (req, res) => {
    try {
        let { offset, data } = req.body;
        modbusClient.writeRegister(offset, data, (err) => {
            if (err) {
                res.json(err);
            } else {
                console.log('데이터 전달 성공');
                res.json({
                    status: 'success'
                });
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//move there
app.post("/move_there", (req, res) => {
    try {
        let moveNumber = req.body.moveNumber;
        modbusClient.writeRegister(0, moveNumber, (err) => {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    status: `Data : ${moveNumber}`
                });
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//RDS 켜져있으면 제어권 가져오기
app.post("/gainControl", (req, res) => {
    try {
        modbusClient.writeCoil(9, 1, (err) => {
            if (err) {
                res.json(err);
            } else {
                console.log('gainControl 전환');
                res.json({
                    status: 'gainControl 전환'
                });
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//RDS 에게 제어권 다시 주기
app.post("/transferControl", (req, res) => {
    try {
        modbusClient.writeCoil(10, 1, (err) => {
            if (err) {
                res.json(err);
            } else {
                console.log('transferControl 전환');
                res.json({
                    status: 'transferControl 전환'
                });
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//battery
app.post("/battery", (req, res) => {
    try {
        modbusClient.readInputRegisters(12, 1, (err, data) => {
            if (err) {
            } else {
                res.json({ "battery": data })
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.post("/isCharging", (req, res) => {
    try {
        modbusClient.readDiscreteInputs(2, 1, (err, data) => {
            if (err) {
            } else {
                res.json({ "status": data.data[0] });
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//Robot Location X
app.post("/robotLocation_X", (req, res) => {
    try {
        modbusClient.readInputRegisters(0, 2, (err, data) => {
            if (err) {
            } else {
                res.json({ "data": data.data })
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//Robot Location Y
app.post("/robotLocation_Y", (req, res) => {
    try {
        modbusClient.readInputRegisters(2, 2, (err, data) => {
            if (err) {
            } else {
                res.json({ "data": data.data })
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//Robot Location angle
app.post("/robotLocation_angle", (req, res) => {
    try {
        modbusClient.readInputRegisters(4, 2, (err, data) => {
            if (err) {
            } else {
                res.json({ "data": data.data })
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//Robot Height
app.post("/robot_height", (req, res) => {
    try {
        modbusClient.readInputRegisters(63, 1, (err, data) => {
            if (err) {
            } else {
                res.json({ "data": data.data });
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

//Robot Height(fork)
app.post("/robot_height_fork", (req, res) => {
    try {
        modbusClient.readInputRegisters(56, 2, (err, data) => {
            if (err) {
            } else {
                res.json({ "data": data.data });
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});



/////////  test /////////////////////////////////////////////////////////////////
/////////  test /////////////////////////////////////////////////////////////////
/////////  test /////////////////////////////////////////////////////////////////

/*
//TEST 3X
app.post("/TEST3X", (req, res) => {
    modbusClient.readInputRegisters(63, 1, (err, data) => {
        if (err) {
        } else {
            res.json({ "data": data.data });
        }
    })
});

//TEST 1x
app.post("/TEST1X", (req, res) => {
    modbusClient.readDiscreteInputs(3, 1, (err, data) => {
        if (err) {
        } else {
            res.json({ "EMC": data.data[0] })
        }
    })
});

//test1
app.post("/test1", (req, res) => {
    const startAddress = 4; // 시작 레지스터 주소 (00015)
    const floatValue = 0.2; // 보낼 float32 값
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, floatValue, true); // true는 little-endian 바이트 순서를 사용합니다.
    const data = new Uint16Array(buffer);
    modbusClient.writeRegister(startAddress, data, (err) => {
        if (err) {
            res.json(err);
        } else {
            console.log('데이터 전달 성공');
            res.json({
                status: floatValue
            });
        }
    });
});

//test2
app.post("/test2", (req, res) => {
    modbusClient.writeRegister(0, 19, (err) => {
        if (err) {
            res.json(err);
        } else {
            console.log('데이터 전달 성공');
            res.json({
                status: 'success'
            });
        }
    });
});
*/

/////////  test /////////////////////////////////////////////////////////////////
/////////  test /////////////////////////////////////////////////////////////////
/////////  test /////////////////////////////////////////////////////////////////

//1x
app.post("/EMC", (req, res) => {
    try {
        modbusClient.readDiscreteInputs(3, 1, (err, data) => {
            if (err) {
            } else {
                res.json({ "EMC": data.data[0] })
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.listen(port, () => {
    console.log(`${port} START!`)
});

//TEST 3X
app.post("/error3", (req, res) => {
    try {
        modbusClient.readInputRegisters(119, 6, (err, data) => {
            if (err) {
            } else {
                res.json({ "data": data.data });
            }
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////
//로그인 한 번 하면 24시간 쿠키 생겨서 로그인창 다시 확인하려면 쿠키 지워서 확인
const db = new sqlite3.Database('mydatabase.db');


db.serialize(function () {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      Username TEXT NOT NULL,
      Password TEXT NOT NULL,
      master_user TEXT
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS Pending_Approval_User (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      Username TEXT NOT NULL,
      Password TEXT NOT NULL,
      master_user TEXT
    )
  `);

});


//로그인 화면
app.get('/', (req, res) => {
    try {
        res.render('AMRC_login');
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.get('/Login-complete', (req, res) => {
    try {
        //window.location.href = "/Login-complete?data=master";
        let master_value = req.query.data;
        //쿠키의 객체가 있는지 확인 및 설정된 이름의 쿠키가 있는지 여부
        if (req.cookies && req.cookies.persistentCookie) {
            res.render("AMRC", { master: master_value });
        } else {
            //로그인 화면으로 리다이렉션
            res.redirect('/');
        }
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.post("/login", (req, res) => {
    const { userID, userPWD } = req.body;
    const sql = `SELECT * from users WHERE username = ?`;

    db.get(sql, [userID], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Server Error' });
        }
        console.log(row);
        if (row) {
            if (userID === row.Username && userPWD === row.Password) {
                // 쿠키 설정
                const oneDay = 24 * 60 * 60 * 1000; // 1일
                const expirationDate = new Date(Date.now() + oneDay);
                res.cookie("persistentCookie", "This is a persistent cookie", {
                    expires: expirationDate,
                });

                res.json({ success: true, master: row.master_user });
            } else {
                console.log("false");
                res.json({ success: false });
            }
        } else {
            console.log("사용자가 존재하지 않음");
            res.json({ success: false, message: "The user does not exist" });
        }
    });
});
/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////

/////////  Sign up /////////////////////////////////////////////////////////////////
/////////  Sign up /////////////////////////////////////////////////////////////////
/////////  Sign up /////////////////////////////////////////////////////////////////
app.post("/submit_1", (req, res) => {
    const { master_checkbox, create_id, create_pwd } = req.body;

    const checkUserSql = `SELECT username FROM users WHERE username = ?`;

    db.get(checkUserSql, [create_id], (err, userRow) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ result: "Server Error" });
        }

        if (userRow) {
            return res.json({ result: "The account already exists" });
        } else {
            if (master_checkbox) {
                const checkMasterSql = `SELECT username FROM users WHERE master_user = 'master'`;

                db.get(checkMasterSql, (err, masterRow) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ result: "Server Error" });
                    }

                    if (masterRow) {
                        return res.json({ result: "The master account already exists" });
                    } else {
                        const insertMasterSql = 'INSERT INTO users (username, password, master_user) VALUES (?, ?, ?)';
                        const values = [create_id, create_pwd, "master"];

                        db.run(insertMasterSql, values, function (err) {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ result: "Server Error" });
                            }
                            return res.json({ result: "Account addition completed (Master)" });
                        });
                    }
                });
            } else {
                const checkMasterSql = `SELECT username FROM users WHERE master_user = 'master'`;

                db.get(checkMasterSql, (err, masterRow) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ result: "Server Error" });
                    }

                    if (masterRow) {
                        const insertPendingSql = 'INSERT INTO pending_approval_user (username, password) VALUES (?, ?)';
                        const values = [create_id, create_pwd];

                        db.run(insertPendingSql, values, function (err) {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ result: "Server Error" });
                            }
                            return res.json({ result: "Account addition completed" });
                        });
                    } else {
                        return res.json({ result: "Please create the master account first" });
                    }
                });
            }
        }
    });
});
/////////  Sign up /////////////////////////////////////////////////////////////////
/////////  Sign up /////////////////////////////////////////////////////////////////
/////////  Sign up /////////////////////////////////////////////////////////////////

//Pending_Approval_User
//Pending_Approval_User
app.get("/pending_approval_users", (req, res) => {
    const sql = "SELECT * FROM pending_approval_user";

    db.all(sql, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: '서버 에러' });
        }
        return res.json(rows);
    });
});



app.post("/delete_db", (req, res) => {
    try {
        const delete_db = req.body.delete_db;
        console.log(delete_db);

        const sql = 'DELETE FROM pending_approval_user WHERE username = ?';
        db.run(sql, [delete_db], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "An error occurred during deletion" });
            }
            return res.json({ success: true, message: "Deletion was completed successfully" });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "An error occurred during deletion" });
    }
});


app.post("/addUser_db", (req, res) => {
    const add_userIDs = req.body.userID;
    const add_userPWDs = req.body.userPWD;
    const master_user_value = null;
    let userID_values = [];

    // 사용자 추가 Promise 함수
    function addUser(username, password, master_user) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO users (username, password, master_user) VALUES (?, ?, ?)";
            db.run(sql, [username, password, master_user], function (err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`사용자 ${username} 추가됨`);
                    resolve();
                }
            });
        });
    }

    // 사용자 삭제 Promise 함수
    function deleteUser(username) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM pending_approval_user WHERE username = ?';
            db.run(sql, [username], function (err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`사용자 ${username} 삭제됨`);
                    resolve();
                }
            });
        });
    }

    async function processUsers() {
        for (let i = 0; i < add_userIDs.length; i++) {
            await addUser(add_userIDs[i], add_userPWDs[i], master_user_value);
            await deleteUser(add_userIDs[i]);
            userID_values.push(add_userIDs[i]);
            console.log("result:" + userID_values);
        }
        res.json({ userID_values: userID_values });
    }

    processUsers().catch((error) => {
        console.error("오류 발생:", error);
        res.status(500).send("오류 발생: " + error.message);
    });
});
//Pending_Approval_User
//Pending_Approval_User

//server restart
app.post("/server_restart", (req, res) => {
    function restartServer() {
        exec('AMRC_node.js', (error, stdout, stderr) => {
            if (error) {
                console.error('Error:', error);
            } else {
                console.log('Server restarted.');
            }
        });
    }

    for (let i = 0; i < 5; i++) {
        console.log(`Restarting server ${i + 1}...`);
        restartServer();
    }
});

//Edit account
//Edit account
app.post("/change_user_DB", (req, res) => {
    const { current_id, current_pwd, new_id, new_pwd } = req.body;

    // 사용자 정보 검증
    const checkUserSql = "SELECT username FROM users WHERE username = ? AND password = ?";
    db.get(checkUserSql, [current_id, current_pwd], (err, userRow) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Server Error" });
        }

        if (!userRow) {
            return res.json({ error: "User not found" });
        } else {
            // 사용자 정보 업데이트
            const updateUserInfoSql = "UPDATE users SET username = ?, password = ? WHERE username = ? AND password = ?";
            db.run(updateUserInfoSql, [new_id, new_pwd, current_id, current_pwd], function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "An error occurred during user information update" });
                }
                return res.json({ success: "User information has been successfully updated" });
            });
        }
    });
});
//Edit account
//Edit account

//change master
//change master
app.post("/change_master", (req, res) => {
    let { current_master_id, current_master_pwd, change_master_id, change_master_pwd } = req.body;
    //ID의 존재여부 확인
    let sql = "SELECT Username from users WHERE Username = ?";
    db.get(sql, [current_master_id], (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            res.json({ error: "User not found." });
        } else {
            //master_user 여부 확인
            sql = "SELECT master_user FROM users WHERE Username = ?";
            db.get(sql, [current_master_id], (err, result) => {
                if (err) throw err;
                if (result.master_user != "master") {
                    res.json({ error: "Please double-check the master ID and password." });
                } else {
                    if (current_master_pwd == "" || change_master_id == "" || change_master_pwd == "") {
                        res.json({ error: "Please enter your ID and password." });
                    } else {
                        //현재 입력한 master ID, PWD 존재 확인
                        sql = "SELECT Username, Password FROM users WHERE Username = ? AND Password = ?";
                        db.get(sql, [current_master_id, current_master_pwd], (err, result) => {
                            if (err) throw err;
                            if (result.length == 0) {
                                res.json({ error: "Please double-check the master ID and password." });
                            } else {
                                //위임할 ID,PWD 존재 확인
                                sql = "SELECT Username, Password FROM users WHERE Username = ? AND Password = ?";
                                db.get(sql, [change_master_id, change_master_pwd], (err, result) => {
                                    if (err) throw err;
                                    if (result.length == 0) {
                                        res.json({ error: "Please double-check the ID and password." });
                                    } else {
                                        //master_user 위임
                                        db.serialize(function () {
                                            db.run("BEGIN TRANSACTION");
                                            sql = "UPDATE users SET master_user = CASE WHEN Username = ? THEN NULL WHEN Username = ? THEN 'master' END";
                                            console.log(current_master_id,change_master_id);
                                            db.run(sql, [current_master_id, change_master_id], function (err, result) {
                                                console.log("결과" +result)
                                                if (err) {
                                                    db.run("ROLLBACK");
                                                    throw err;
                                                } else {
                                                    db.run("COMMIT");
                                                    res.json({ success: "User information updated successfully." });
                                                }
                                            });
                                        });

                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});