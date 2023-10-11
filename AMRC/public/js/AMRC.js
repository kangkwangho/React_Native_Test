let IP_value = "";
let BTN_value = 0;
let touchInterval;
let setting_display = false;
let isButtonClicked = false;
let settingClicked = false;
let screenOnOff = false;
let charging_value = false;
let charging_interval;
let battery_number = 0;
let EMC_value = false;
let EMC_interval;
let moveStop = false;
let currnet_move_check = false;
let battery_charging_value = 60;

//메인화면
$(".inner > img").on("touchstart", function () {
    let className = $(this).attr('class');
    let classNumber = className[5];
    AMR_IP(classNumber);
    connect_AMR(IP_value, classNumber);

    $(".inner").animate({
        opacity: 0
    }, 500);
    setTimeout(() => {
        $(".inner").css(
            "display", "none"
        );
    }, 501);
    IP_value = "";
});

//forkward
$('.controller_box2').on('touchstart', () => {
    $.ajax({
        url: "/forward",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
});
$('.controller_box2').on('touchend', () => {
    $.ajax({
        url: "/forward2",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
});

//backward
$('.controller_box8').on('touchstart', () => {
    $.ajax({
        url: "/backward",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
});
$('.controller_box8').on('touchend', () => {
    $.ajax({
        url: "/backward2",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
});



//left turn
$('.controller_box4').on('touchstart', () => {
    $.ajax({
        url: "/location_left",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
});
$('.controller_box4').on('touchend', () => {
    $.ajax({
        url: "/location_left2",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
});

//right turn
$('.controller_box6').on('touchstart', () => {
    $.ajax({
        url: "/location_right",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
});
$('.controller_box6').on('touchend', () => {
    $.ajax({
        url: "/location_right2",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
});


//에러 제거
$(".alert").on('touchend', () => {
    $.ajax({
        url: "/error",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ offset: 89, data: 1 }),
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    })
});

//move_stop
$('.moveStop_Btn').on("touchstart", () => {
    if (!moveStop) {
        if (currnet_move_check) {
            $.ajax({
                url: "/moveStop_Btn",
                type: "POST",
                contentType: "application/json",
                data: {},
                success: function (response) {
                },
                error: function (xhr, status, error) {
                }
            });
            moveStop = true;
            currnet_move_check = false;
            $(".moveStop_Btn").text("Move again");
        }
    } else {
        $.ajax({
            url: "/moveAgain_Btn",
            type: "POST",
            contentType: "application/json",
            data: {},
            success: function (response) {
            },
            error: function (xhr, status, error) {
            }
        });
        moveStop = false;
        currnet_move_check = true;
        $(".moveStop_Btn").text("Move stop");
    }
});

//cancleTheMove
$('.cancleTheMove_Btn').on("touchstart", () => {
    currnet_move_check = false;
    moveStop = false;
    $(".moveStop_Btn").text("Move stop");
    $.ajax({
        url: "/cancleTheMove_Btn",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    })
});

//테스트1
$('#test1').on('touchstart', (event) => {
    $.ajax({
        url: "/test1",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
});

//테스트2
$('#test2').on('touchstart', (event) => {
    $.ajax({
        url: "/test2",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
});

//controller mobile click
$('.common-style').on("touchstart", function () {
    let className2 = $(this).attr('class');
    let classNumber2 = className2[14];
    touchInterval = setInterval(() => {
        switch (classNumber2) {
            case '2':
                ajax_basic("/forward");
                break;
            case '4':
                ajax_basic("/location_left");
                break;
            case '6':
                ajax_basic("/location_right");
                break;
            case '8':
                ajax_basic("/backward");
                break;
        }
    }, 200);
});

$('.common-style').on("touchend", function () {
    clearInterval(touchInterval);
});

//gainControl mobile 
$('.gainControl').on('touchstart', () => {
    if (!isButtonClicked) {
        isButtonClicked = true;
        $('.messageArea > p').text("gainControl");
        $('.messageArea > p').css("transform", "translate(0, 0)");
        ajax_basic2("/gainControl");
        setTimeout(() => {
            $('.messageArea > p').text("");
            $('.messageArea > p').css("transform", "translate(0, 2rem)");
            isButtonClicked = false;
        }, 1500);
    }
});

//transControl mobile 
$('.transferControl').on('touchstart', () => {
    if (!isButtonClicked) {
        isButtonClicked = true;
        $('.messageArea > p').text("transferControl");
        $('.messageArea > p').css("transform", "translate(0, 0)");
        ajax_basic2("/transferControl");
        setTimeout(() => {
            $('.messageArea > p').text("");
            $('.messageArea > p').css("transform", "translate(0, 2rem)");
            isButtonClicked = false;
        }, 1500)
    }
});

//move there
$(".movePoint_Btn").on("touchstart", () => {
    let pointNumber = $(".input_point").val();
    if (pointNumber == "") {
        $(".input_point").attr("placeholder", "Please enter the points");
        setTimeout(() => {
            $(".input_point").attr("placeholder", "Point");
        }, 2000);
    } else {
        currnet_move_check = true;
        $.ajax({
            url: "/move_there",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ "moveNumber": pointNumber }),
            success: function (response) {
            },
            error: function (xhr, status, error) {
            }
        });
        setTimeout(() => {
            $(".input_point").val("");
        }, 2000);
    }
});

//letter-p(setting)
settingBox(".letter-p");
//close Btn
settingBox("#closeBox");



//jacking lift control send-------------------------------------------------------

//liftUp
$('#jacking_lift_up').on("touchstart", () => {
    $(".setting_box_1 > input").val("");
    ajax_basic3("/liftUp", 49, 1);
});

//liftDown
$('#jacking_lift_down').on("touchstart", () => {
    $(".setting_box_1 > input").val("");
    ajax_basic3("/liftUp", 50, 1);
});

//liftStop
$('#jacking_lift_stop').on("touchstart", () => {
    ajax_basic3("/liftUp", 51, 1);
});

//liftSend
$('#jacking_lift_send').on("touchstart", () => {
    let jackingLiftHeight = $("#jackingLiftHeight").val() * 1000;
    ajax_basic3("/liftUp", 52, jackingLiftHeight);
});

//***************************************************************************************
//***************************************************************************************

//liftstop_fork
$('#fork_lift_stop').on("touchstart", () => {
    currnet_move_check = false;
    moveStop = false;
    $(".moveStop_Btn").text("Move stop");
    $.ajax({
        url: "/cancleTheMove_Btn",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    })
});
//liftSend_fork
$('#CDD16_fork_lift_send').on("touchstart", () => {
    let forkLiftHeight = $("#forkLiftHeight").val();
    ajax_basic3("/liftUp_fork", 12, forkLiftHeight);
});

//liftSend_fork
$('#CBD15_fork_lift_up').on("touchstart", () => {
    ajax_basic3("/liftUp_fork", 12, 0.205);
});

//liftSend_fork
$('#CBD15_fork_lift_down').on("touchstart", () => {
    ajax_basic3("/liftUp_fork", 12, 0.085);
});

//***************************************************************************************
//***************************************************************************************

//jacking lift control send..end-------------------------------------------------------

$(".controller_box3").on("touchstart", () => {
    $.ajax({
        url: "/BB",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
});

//speed
$(".speed_box_2 > input").click(function () {
    let select_option = $(".speed_box_1 > #optionTypes").val();
    let speed_level = $(".speed_box_2 > #optionTypes").val();
    if (select_option == "forward") {
        if (speed_level == "level1") {
            speed_option("/speed_forward", 0.5);
        } else if (speed_level == "level2") {
            speed_option("/speed_forward", 1.25);
        } else if (speed_level == "level3") {
            speed_option("/speed_forward", 2.0);
        } else {
        }
    } else if (select_option == "turn") {
        if (speed_level == "level1") {
            speed_option("/speed_turn", 0.4);
        } else if (speed_level == "level2") {
            speed_option("/speed_turn", 0.8);
        } else if (speed_level == "level3") {
            speed_option("/speed_turn", 1.2);
        } else {
        }
    } else {
    }
});



























//Pending Approval Users
$('#pending_Approval_Details').hide();
$(document).ready(() => {

    $.ajax({
        url: "/pending_approval_users",
        type: "GET",
        data: {},
        success: function (response) {
            $.each(response, function (index, item) {
                let pending_approval_users_DB = `
                    <div class="user1 user">
                        <div class="userID">${item.Username}</div>
                        <div class="userPWD">${item.Password}</div>
                        <div class="userAdd">
                            <input class="select_user" type="checkbox">
                        </div>
                        <div class="userDelete">
                            <div class="xi-close-min delete_user"></div>
                        </div>
                    </div>
                `;
                $(".pending_Approval_Details_value").prepend(pending_approval_users_DB);
            });
        },
        error: function () {

        }
    });
});
if (masterValue == "master") {
    $("#wrap").append(
        "<img id='master' src='./img/master.png'>"
    );
    $("#master").on("touchstart", function () {
        $('#pending_Approval_Details').show();
        $('#screen').show();
    });
    $(".pending_Approval_Details_title > .xi-close-min").on("touchstart", function () {
        $('#pending_Approval_Details').hide();
        $('#screen').hide();
        $.ajax({
            url: "/server_restart",
            type: "POST",
            data: {},
            success: function (response) {
            },
            error: function (xhr, status, error) {
            }
        });
    });

    $(document).on("touchstart", ".delete_user", async function () {
        const userElement = $(this).closest(".user");
        const delete_db = userElement.find(".userID").text();
            userElement.remove();

        try {
            await deleteFromDatabase(delete_db);
        } catch (error) {
            console.log(error);
        }
    });

    async function deleteFromDatabase(delete_db) {
        try {
            const response = await $.ajax({
                url: "/delete_db",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ delete_db: delete_db })
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    let add_userID;
    let add_userPWD;
    $("#approval_BTN").on("touchstart", function () {
        let selectUserIDs = [];
        let selectUsePWDs = [];
        $(".user .select_user:checked").each(function () {
            add_userID = $(this).closest(".user").find(".userID").text();
            add_userPWD = $(this).closest(".user").find(".userPWD").text();
            selectUserIDs.push(add_userID);
            selectUsePWDs.push(add_userPWD);
        });
        $.ajax({
            url: "/addUser_db",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ "userID": selectUserIDs, "userPWD": selectUsePWDs }),
            success: function (response) {
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
        $(".userAdd .select_user:checked").closest(".user").remove();
    });
    $(".inner").on("touchstart", () => {
        $("#master").hide();
    });
} else {
}