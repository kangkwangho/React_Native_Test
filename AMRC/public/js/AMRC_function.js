//setTimeout_Func
function setTimeout_Func(number) {
    setTimeout(() => {
        $('.inner').eq(number - 1).css("display", "flex");
        setTimeout(() => {
            innerList.style.width = `${outer.clientWidth}px`;
            innerList.style.marginLeft = 0;
            $('.inner-list').css('display', 'flex');
            $('.inner-list').css('justify-content', 'center');
            $('.inner').eq(number - 1).animate({
                "opacity": 1
            }, 200);
        }, 100);
    }, 600);
    setTimeout(() => {
        $('.outer').animate({
            "opacity": 0
        }, 500);
        setTimeout(() => {
            $('.outer').css("display", "none");
        }, 510);
    }, 1500);
    setTimeout(() => {
        $('#screen').css("display", "none");
        $('.content').css("display", "flex");
        $('.content').animate({
            "opacity": 1
        }, 500);
        setTimeout(() => {
            $(".battery_level").css("width", battery_number + "%");
        }, 1000);
    }, 2500)
    setTimeout(() => {
        innerList.style.width = `${outer.clientWidth * inners.length}px`;
        $('.inner-list').css('justify-content', 'unset');
    });
}

//setting box
function settingBox(value) {
    $(value).on("click", () => {
        $(".setting_box_1 > input").val("");
        $("#optionTypes")[0].selectedIndex = 0;
        $(".speed_box_2 > #optionTypes")[0].selectedIndex = 0;
        if (!settingClicked) {
            settingClicked = true;
            if (!setting_display) {
                setting_display = true;
                $('.settingArea').css("opacity", 1);
                $('.settingArea').css("display", "block");
                $("#screen").css("display", "block");
            } else {
                setting_display = false;
                $('.settingArea').css("opacity", 0);
                setTimeout(() => {
                    $('.settingArea').css("display", "none");
                    $("#screen").css("display", "none");
                }, 500);
            }
            setTimeout(() => {
                settingClicked = false;
            }, 600);
        }
    });
}


































/*
let setting_content_fork = `
    <p>control</p>
    <div class="setting_box">
        <div class="setting_box_1">
            <p>Lift up to current height(m):</p>
            <input type="number" placeholder="0.000" step="0.010" id="forkLiftHeight">
        </div>
        <div class="setting_box_2 settingContent">
            <input id="fork_lift_send" type="button" value="Send">
            <input id="fork_lift_stop" type="button" value="Stop">
        </div>
        <div class="setting_box_3 settingContent">
            <input id="fork_lift_up" type="button" value="Up">
            <input id="fork_lift_down" type="button" value="Down">
        </div>
    </div>
`;
    class  추가하는 방안으로 !  아니면 show() hide()  를  이용해  숨겨놓고  해당 ip 로  접속시 보이게하기
*/

























// 이제 myHtml 변수에 해당 HTML 코드가 담겨 있습니다.

// 연결
function connect_AMR(ip, number) {
    $.ajax({
        url: "/connect",
        type: "POST",
        contentType: "application/json",
        //port 수정란 고려 일단, 고정으로
        data: JSON.stringify({ ip_value: `${ip}`, port_value: '502' }),
        success: function (response) {
            
//****************************************************************************************
//****************************************************************************************

            if (response.current) {
                if (ip == "192.168.5.221") {
                    $(".setting_fork2").hide();
                    $(".setting_fork").hide();
                    //jacking height value
                    jackingRobot_height();
                } else if (ip == "192.168.5.222") {
                    //roller height value
                } else if (ip == "192.168.5.223") {
                    //piking height value
                } else if (ip == "192.168.0.166") {
                    $(".setting_fork2").hide();
                    $(".setting_jacking").hide();
                    //fork height value
                    forkRobot_height();
                } else if (ip == "192.168.0.101") {
                    $(".setting_fork").hide();
                    $(".setting_jacking").hide();
                    forkRobot_height();
                } else if (ip == "192.168.0.204") {
                    $(".setting_fork2").hide();
                    $(".setting_jacking").hide();
                    //fork height value
                    forkRobot_height();
                }

//****************************************************************************************
//****************************************************************************************

                speed_option("/speed_forward", 1.25);
                speed_option("/speed_turn", 0.8);
                robotLocation_X();
                robotLocation_Y();
                robotLocation_angle();
                battery_Remaining();
                battery_isCharging();
                EMC_check();
                $('#screen').css("display", "block");
                $('#header > img').animate({
                    "left": 1 + "rem"
                }, 1000);
                setTimeout_Func(number);
            } else {
                $('.message').html(`${response.comment}`);
                $('.outer').css("display", "none");
                $("#ERROR").css("display", "flex");
            }
        },
        error: function (xhr, status, error) {
        }
    });
}

//alert
setInterval(() => {
    ajax_basic_alert("/error3", [0, 0, 0, 0, 0, 0], "err3")
}, 1000)

//robot speed
function robot_speed(forward_value, turn_value) {
    $(".forwardSpeed").text(forward_value);
    $(".turnSpeed").text(turn_value);
}

//************************************************************************************
//************************************************************************************

//로봇 IP 가져오기
function AMR_IP(value) {
    switch (value) {
        case '1':
            IP_value = "192.168.5.221"
            $("#lobot_ID").text("AMB150-J")
            break;
        case '2':
            break;
        case '3':
            break;
        case '4':
            break;
        case '5':
            IP_value = "192.168.0.204"
            $("#lobot_ID").text("CPD15-T")
            break;
        case '6':
            break;
        case '7':
            IP_value = "192.168.0.166"
            $("#lobot_ID").text("CDD16")
            break;
        case '8':
            IP_value = "192.168.0.101"
            $("#lobot_ID").text("CBD15")
            break;
    }
}

//************************************************************************************
//************************************************************************************

function ajax_basic(value) {
    $.ajax({
        url: value,
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    })
}

function ajax_basic2(value) {
    $.ajax({
        url: value,
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    })
}

let alert_interval;
let alert_value = false;

function ajax_basic_alert(value, value2, value3) {
    $.ajax({
        url: value,
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
            let alert_data = response.data;
            if (!alert_value) {
                if (alert_data != `${value2}`) {
                    alert_interval = setInterval(() => {
                        $(".alert_on").toggle();
                    }, 1000);
                    alert_value = true;
                }
            } else {
                if (alert_data == `${value2}`) {
                    $(".alert_on").hide();
                    clearInterval(alert_interval);
                    alert_value = false;
                }
            }
        },
        error: function (xhr, status, error) {
        }
    })
}

//POST.. node에서 req.body 확인하고 사용하기
function ajax_basic3(url_value, offset_value, data_value) {
    $.ajax({
        url: url_value,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ offset: offset_value, data: data_value }),
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    })
}

//screenOnOff(z-index: 300)
function screenOnOff_Func() {
    if (!screenOnOff) {
        $("#screen").css("display", "block");
        screenOnOff = true;
    } else {
        $("#screen").css("display", "none");
        screenOnOff = false;
    }
}
/*
// 배터리  
function battery_value(value) {
    if (41 > value && value > 24) {
        $(".battery_level").css("background-color", "yellow");
    } else if (value < 25) {
        $(".battery_level").css("background-color", "red");
    } else if (value > 40) {
        $(".battery_level").css("background-color", "rgb(56, 255, 0)");
    } else { }
}
*/

//ip 연결  후에 넣어주기
//battery_Remaining
function battery_Remaining() {
    $.ajax({
        url: "/battery",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
            battery_number = Number(response.battery.data[0]);
            battery_live_value(battery_number);
            setTimeout(() => {
                $(".battery_level").css("width", battery_number + "%");
                //battery_value(battery_number);
            }, 3000);
        },
        error: function (xhr, status, error) {
        }
    });
    setTimeout(() => {
        battery_Remaining();
    }, 10000);
}

//battery_live_value
function battery_live_value(value) {
    $('.battery_value').text(`${value}%`);
}

///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function battery_isCharging_width() {
    $(".battery_level").css("width", battery_charging_value + "%");
    $(".battery_level").css("background-color", "yellow");
    battery_charging_value += 20;
    if (battery_charging_value == 120) {
        battery_charging_value = 60;
    }
}

//battery icon hide
$(".charging-icon").hide();



//battery_isCharging
function battery_isCharging() {
    $.ajax({
        url: "/isCharging",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
            if (response.status) {
                battery_isCharging_width();
                //battery icon show
                $(".charging-icon").show();
            } else {
                $(".battery_level").css("background-color", "#38ff00");
                $(".charging-icon").hide();
            }
        },
        error: function (xhr, status, error) {
        }
    });
    setTimeout(() => {
        battery_isCharging();
    }, 1000);
}

//EMC css animation  class add !!
function EMC_check() {
    $.ajax({
        url: "/EMC",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
            if (response.EMC) {
            } else {
            }
        },
        error: function (xhr, status, error) {
        }
    });
    setTimeout(() => {
        EMC_check();
    }, 500);
}
//Robot location X
function robotLocation_X() {
    $.ajax({
        url: "/robotLocation_X",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
            let responseData = response.data;
            let data = new Uint16Array(responseData);

            let buffer = new ArrayBuffer(4);
            let view = new DataView(buffer);

            view.setUint16(0, data[0], true);
            view.setUint16(2, data[1], true);

            let floatValue = view.getFloat32(0, true);
            let result_X_value = floatValue.toFixed(3);
            $('.location_X').text(`${result_X_value}m,`);
        },
        error: function (xhr, status, error) {
        }
    });
    setTimeout(() => {
        robotLocation_X();
    }, 500);
}

//Robot location Y
function robotLocation_Y() {
    $.ajax({
        url: "/robotLocation_Y",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
            let responseData = response.data;
            let data = new Uint16Array(responseData);

            let buffer = new ArrayBuffer(4);
            let view = new DataView(buffer);

            view.setUint16(0, data[0], true);
            view.setUint16(2, data[1], true);

            let floatValue = view.getFloat32(0, true);
            let result_Y_value = floatValue.toFixed(3);
            $('.location_Y').text(`${result_Y_value}m,`);
        },
        error: function (xhr, status, error) {
        }
    });
    setTimeout(() => {
        robotLocation_Y();
    }, 500);
}

//Robot location angle
function robotLocation_angle() {
    $.ajax({
        url: "/robotLocation_angle",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
            //angle
            let responseData = response.data;
            let data = new Uint16Array(responseData);

            let buffer = new ArrayBuffer(4);
            let view = new DataView(buffer);

            view.setUint16(0, data[0], true);
            view.setUint16(2, data[1], true);

            let floatValue = view.getFloat32(0, true);
            let degrees = (floatValue * 180 / Math.PI).toFixed(3);
            $('.location_angle').text(`${degrees}°`);
        },
        error: function (xhr, status, error) {
        }
    });
    setTimeout(() => {
        robotLocation_angle();
    }, 500);
}

//jacking height
function jackingRobot_height() {
    $.ajax({
        url: "/robot_height",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
            let height = response.data * 0.001;
            $(".height").text(`${height.toFixed(3)}m`);
        },
        error: function (xhr, status, error) {
        }
    });
    setTimeout(() => {
        jackingRobot_height();
    }, 500);
}

$(".xi-log-out").on("click", () => {
    location.reload();
});

let fork_height_live = 0;
//fork height
function forkRobot_height() {
    $.ajax({
        url: "/robot_height_fork",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
            //fork height
            let responseData = response.data;
            let data = new Uint16Array(responseData);

            let buffer = new ArrayBuffer(4);
            let view = new DataView(buffer);

            view.setUint16(0, data[0], true);
            view.setUint16(2, data[1], true);

            let floatValue = view.getFloat32(0, true);
            let height = floatValue;
            fork_height_live = height;
            $(".height").text(`${height.toFixed(3)}m`);
        },
        error: function (xhr, status, error) {
        }
    });
    setTimeout(() => {
        forkRobot_height();
    }, 500);
}

$(".xi-log-out").on("click", () => {
    location.reload();
});

//TEST 3X  ********************************************************************
//TEST 3X  ********************************************************************
function TEST3X() {
    $.ajax({
        url: "/TEST3X",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
    setTimeout(() => {
        TEST3X();
    }, 500);
}

//TEST 1X  ********************************************************************
//TEST 1X  ********************************************************************
function TEST1X() {
    $.ajax({
        url: "/TEST1X",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
            if (response.EMC) {
            } else {
            }
        },
        error: function (xhr, status, error) {
        }
    });
    setTimeout(() => {
        TEST1X();
    }, 500);
}



function speed_option(url_value, json_value) {
    $.ajax({
        url: url_value,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ "speed_value": json_value }),
        success: function (response) {
            console.log(response)
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
    if (url_value == "/speed_forward") {
        if (json_value == 0.5) {
            $(".forwardSpeed").text("level 1");
            return;
        } else if (json_value == 1.25) {
            $(".forwardSpeed").text("level 2");
            return;
        } else if (json_value == 2.0) {
            $(".forwardSpeed").text("level 3");
            return;
        }
    } else if (url_value == "/speed_turn") {
        if (json_value == 0.4) {
            $(".turnSpeed").text("level 1");
            return;
        } else if (json_value == 0.8) {
            $(".turnSpeed").text("level 2");
            return;
        } else if (json_value == 1.2) {
            $(".turnSpeed").text("level 3");
            return;
        }
    }
}