const ModbusRTU = require('modbus-serial');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3012;
const mysql = require("mysql");
const cookieParser = require('cookie-parser');
const exec = require('child_process').exec;


////////////////////////////////////////////////////////////////////
let con = mysql.createConnection({
    connectionLimit: 10,
    host: "localhost",
    user: "pepe",
    password: "Password@0000",
    database: "AMR_Controller"
});

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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
    }
})

app.post("/speed_turn", (req, res) => {
    try {
        turn_speed = req.body.speed_value;
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
    }
});

/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////
//mysql 로그인 자체가 mysql 실행
//로그인 한 번 하면 24시간 쿠키 생겨서 로그인창 다시 확인하려면 쿠키 지워서 확인
con.connect();


//로그인 화면
app.get('/', (req, res) => {
    try {
        res.render('AMRC_login');
    } catch (error) {
        console.error("에러 발생:", error.message);
        // 에러 처리
        res.status(500).json({ success: false, message: "서버 에러" });
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
        res.status(500).json({ success: false, message: "서버 에러" });
    }
});

app.post("/login", (req, res) => {
    let { userID, userPWD } = req.body;
    let sql = `SELECT * from Users WHERE Username = ?`;

    //[userID] 값은 변수 sql ? 에 들어가는 값이다.
    con.query(sql, [userID], (err, result) => {
        if (err) throw err;
        try {
            if (userID == result[0].Username && userPWD == result[0].Password) {

                //set cookie time
                const oneDay = 24 * 60 * 60 * 1000 // 1day
                const expirationDate = new Date(Date.now() + oneDay);
                res.cookie("persistentCookie", "This is a persistent cookie", {
                    expires: expirationDate,
                });

                //res.redirect('/Login-complete'); -> 리다이렉트 되는데 res.render가 콘솔에 읽힘(미들웨에 문제?)
                let master_value = result[0].master_user;
                res.json({ result: true, master: master_value });

            } else {
                console.log("false");
                res.json({ success: false });
            }
        } catch (error) {
            console.error("에러 발생:", error.message);
            // 에러 처리
            res.status(500).json({ success: false, message: "서버 에러" });
        }
    })
});
/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////
/////////  LOG-IN /////////////////////////////////////////////////////////////////

/////////  Sign up /////////////////////////////////////////////////////////////////
/////////  Sign up /////////////////////////////////////////////////////////////////
/////////  Sign up /////////////////////////////////////////////////////////////////
app.post("/submit_1", (req, res) => {
    let { master_checkbox, create_id, create_pwd } = req.body;

    let sql = `SELECT Username FROM Users WHERE Username = ?`
    con.query(sql, [create_id], (err, result) => {
        if (result.length > 0) {
            res.json({ "result": "A account already exists" })
        } else {
            if (master_checkbox) {
                sql = `SELECT master_user FROM Users WHERE master_user = "master"`;
                con.query(sql, (err, result) => {
                    //빈배열인지 확인하는 방법은 보편적으로 .length > 0 으로 확인한다
                    if (result.length > 0) {
                        res.json({ "result": "A master account already exists" });
                    } else {
                        //master가 없을 때 추가가능
                        let values = [create_id, create_pwd, "master"];
                        sql = 'INSERT INTO Users (Username, Password, master_user) VALUES (?,?,?)'
                        con.query(sql, values, (err, result) => {
                            if (err) throw err;
                            res.json({ "result": "Account addition completed(master)" });
                        });
                    }
                });
            } else {
                sql = `SELECT master_user FROM Users WHERE master_user = "master"`;
                con.query(sql, (err, result) => {
                    if (result.length > 0) {
                        //create id
                        let values = [create_id, create_pwd];
                        sql = 'INSERT INTO Pending_Approval_User(Username, Password) VALUES (?,?)'
                        con.query(sql, values, (err, result) => {
                            if (err) throw err;
                            res.json({ "result": "Account addition completed" });
                        });
                    } else {
                        res.json({ "result": "Please create a master account" });
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
    let sql = "select * from Pending_Approval_User";
    con.query(sql, (err, result) => {
        res.json(result);
    });
});



app.post("/delete_db", async (req, res) => {
    try {
        const delete_db = req.body.delete_db;
        console.log(delete_db);

        const sql = 'DELETE FROM Pending_Approval_User WHERE Username = ?';
        await con.query(sql, [delete_db]);

        res.json({ success: true, message: "삭제가 성공적으로 완료되었습니다." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "삭제 중 오류가 발생했습니다." });
    }
});


app.post("/addUser_db", (req, res) => {
    let add_userIDs = req.body.userID;
    let add_userPWDs = req.body.userPWD;
    let master_user_value = null;
    // 사용자 추가 Promise 함수
    function addUser(username, password, master_user) {
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO Users (Username, Password, master_user) VALUES (?, ?, ?)";
            con.query(sql, [username, password, master_user], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`사용자 ${username} 추가됨`);
                    resolve();
                }
            });
        });
    }

    function deleteUser(username) {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM Pending_Approval_User WHERE Username = ?';
            con.query(sql, [username], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`사용자 ${username} 삭제됨`);
                    resolve();
                }
            });
        });
    }
    let userID_values = [];
    let userID_value;
    async function processUsers() {
        for (let i = 0; i < add_userIDs.length; i++) {
            await addUser(add_userIDs[i], add_userPWDs[i], master_user_value);
            await deleteUser(add_userIDs[i]);
            userID_value = add_userIDs[i];
            userID_values.push(userID_value);
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
    let { current_id, current_pwd, new_id, new_pwd } = req.body;
    let sql_value = [new_id, new_pwd, current_id, current_pwd];

    let sql = "SELECT Username FROM Users WHERE Username = ? AND Password = ?";
    con.query(sql, [current_id, current_pwd], (err, result) => {
        if (result.length == 0) {
            res.json({ error: "User not found." });
            console.log('a');
        } else {
            console.log('b');
            sql = "UPDATE Users SET Username = ?, Password = ? WHERE Username = ? AND Password = ?";
            con.query(sql, sql_value, (err, result) => {
                res.json({ success: "User information updated successfully." });
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
    console.log("current_id :" + current_master_id);
    console.log("current_pwd :" + current_master_pwd);
    console.log("change_id :" + change_master_id);
    console.log("change_pwd :" + change_master_pwd);
    //ID의 존재여부 확인
    let sql = "SELECT Username from Users WHERE Username = ?";
    con.query(sql, [current_master_id], (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            res.json({ error: "User not found." });
        } else {
            //master_user 여부 확인
            sql = "SELECT master_user FROM Users WHERE Username = ?";
            con.query(sql, [current_master_id], (err, result) => {
                if (err) throw err;
                if (result[0].master_user != "master") {
                    res.json({ error: "Please double-check the master ID and password." });
                } else {
                    if (current_master_pwd == "" || change_master_id == "" || change_master_pwd == "") {
                        res.json({ error: "Please enter your ID and password." });
                    } else {
                        //현재 입력한 master ID, PWD 존재 확인
                        sql = "SELECT Username, Password FROM Users WHERE Username = ? AND Password = ?";
                        con.query(sql, [current_master_id, current_master_pwd], (err, result) => {
                            if (err) throw err;
                            if (result.length == 0) {
                                res.json({ error: "Please double-check the master ID and password." });
                            } else {
                                //위임할 ID,PWD 존재 확인
                                sql = "SELECT Username, Password FROM Users WHERE Username = ? AND Password = ?";
                                con.query(sql, [change_master_id, change_master_pwd], (err, result) => {
                                    if (err) throw err;
                                    if (result.length == 0) {
                                        res.json({ error: "Please double-check the ID and password." });
                                    } else {
                                        //master_user 위임
                                        sql = "UPDATE Users SET master_user = CASE WHEN Username = ? THEN 'master' WHEN Username = ? THEN NULL END";
                                        con.query(sql, [change_master_id, current_master_id], (error, result) => {
                                            if (err) throw err;
                                            res.json({ success: "User information updated successfully." });
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