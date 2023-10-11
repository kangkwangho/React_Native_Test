$("#login_BTN").on("touchstart", () => {
    let userID = $("#userID").val();
    let userPWD = $("#userPWD").val();
    $.ajax({
        url: "/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ "userID": userID, "userPWD": userPWD }),
        success: function (response) {
            if (response.result) {
                //노드 라우터로 다이렉트 연결 가능..!
                if (response.master == "master") {
                    //?뒤로는 데이터 전달 key=value&key2=value2
                    window.location.href = "/Login-complete?data=master";
                } else {
                    window.location.href = "/Login-complete";
                }
            } else {
                console.log("Login failed");
            }
        },
        error: function (xhr, status, error) {
            console.log("Error:", error);
        }
    });
});

/////// PWD eye //////////////////////////////////////////////////////
/////// PWD eye //////////////////////////////////////////////////////
$(".xi-eye-slash").hide();
$(".setting_box").hide();

$(".xi-eye").on("touchstart", () => {
    $(".xi-eye").hide();
    $(".xi-eye-slash").show();

    //만든 비밀번호 추가해 설정
    $("#userPWD").attr("type", "text");
    $("#create_pwd").attr("type", "text");
    $("#change_current_pwd").attr("type", "text");
    $("#change_pwd").attr("type", "text");
    $("#change_master_pwd").attr("type", "text");
    $("#current_master_pwd").attr("type", "text");
});

$(".xi-eye-slash").on("touchstart", () => {
    $(".xi-eye-slash").hide();
    $(".xi-eye").show();

    //만든 비밀번호 추가해 설정
    $("#userPWD").attr("type", "password");
    $("#create_pwd").attr("type", "password");
    $("#change_current_pwd").attr("type", "password");
    $("#change_pwd").attr("type", "password");
    $("#change_master_pwd").attr("type", "password");
    $("#current_master_pwd").attr("type", "password");
});

//longin_setting_BTN
$("#setting").on("touchstart", () => {
    $(".setting_box").css("display", "block");
    $(".xi-eye-slash").hide();
    $(".xi-eye").show();

    //만든 비밀번호 추가해 설정
    $("#userPWD").attr("type", "password");
    $("#create_pwd").attr("type", "password");
    $("#change_current_pwd").attr("type", "password");
    $("#change_pwd").attr("type", "password");
    $("#change_master_pwd").attr("type", "password");
    $("#current_master_pwd").attr("type", "password");
});


$(".xi-close-min").on("touchstart", () => {
    $(".setting_box").css("display", "none");
    $(".xi-eye-slash").hide();
    $(".xi-eye").show();

    //만든 비밀번호 추가해 설정
    $("#userPWD").attr("type", "password");
    $("#create_pwd").attr("type", "password");
    $("#change_current_pwd").attr("type", "password");
    $("#change_pwd").attr("type", "password");
    $("#change_master_pwd").attr("type", "password");
    $("#current_master_pwd").attr("type", "password");
});
/////// PWD eye //////////////////////////////////////////////////////
/////// PWD eye //////////////////////////////////////////////////////

$(".setting_content").on("touchstart", function () {
    $(".setting_content p").css("color", "black");
    $(this).find("p").css("color", "red");
});

$(".content_box_2-1").hide();
$(".content_box_2-2").hide();
$(".content_box_2-3").hide();
$(".content_1").on("touchstart", () => {
    //$(".content_box_1").hide();
    $(".content_box_2-1").show();
    $(".content_box_2-2").hide();
    $(".content_box_2-3").hide();
    $("#Join_BTN").addClass("content_A");
    $("#Join_BTN").removeClass("content_B");
    $("#Join_BTN").removeClass("content_C");
});

$(".content_2").on("touchstart", () => {
    $(".content_box_2-2").show();
    $(".content_box_2-1").hide();
    $(".content_box_2-3").hide();
    $("#Join_BTN").addClass("content_B");
    $("#Join_BTN").removeClass("content_A");
    $("#Join_BTN").removeClass("content_C");


});

$(".content_3").on("touchstart", () => {
    $(".content_box_2-3").show();
    $(".content_box_2-1").hide();
    $(".content_box_2-2").hide();
    $("#Join_BTN").addClass("content_C");
    $("#Join_BTN").removeClass("content_B");
    $("#Join_BTN").removeClass("content_A");

});














let signUp_resultContent_value = false;
let signUpTimeout;
$(".alert_modal").hide();
$(document).on("touchstart", ".content_A", () => {
    let master_checkbox = $("#master_checkbox").is(":checked");
    let create_id = $("#create_id").val();
    let create_pwd = $("#create_pwd").val();
    if (create_id == "" || create_pwd == "") {
        signUp_resultContent("Please check once again");
    } else {
        $.ajax({
            url: "/submit_1",
            type: "POST",
            data: JSON.stringify({ "master_checkbox": master_checkbox, "create_id": create_id, "create_pwd": create_pwd }),
            contentType: "application/json",
            success: function (response) {
                signUp_resultContent(response.result);
            },
            error: function (xhr, status, error) {
            }
        });
    }
});

function signUp_resultContent(value) {
    if (signUp_resultContent_value) {
        signUp_resultContent_value = true;
        $(".alert_modal").show();
        $(".alert_modal > p").text(value);
        signUpTimeout = setTimeout(() => {
            $(".alert_modal").hide();
            $(".alert_modal > p").text("");
            signUp_resultContent_value = false;
        }, 3000);
    } else {
        clearTimeout(signUpTimeout);
        $(".alert_modal > p").text(value);
        $(".alert_modal").show();
        setTimeout(() => {
            $(".alert_modal").hide();
            $(".alert_modal > p").text("");
            signUp_resultContent_value = false;
        }, 3000);
    }
}


























$(document).on("touchstart", ".content_B", () => {
    let current_id = $("#change_current_id").val();
    let current_pwd = $("#change_current_pwd").val();
    let new_id = $("#change_id").val();
    let new_pwd = $("#change_pwd").val();

    $.ajax({
        url: "/change_user_DB",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ current_id: current_id, current_pwd: current_pwd, new_id: new_id, new_pwd: new_pwd }),
        success: function (response) {
            if (response.error) {



                signUp_resultContent(response.error);




            } else if (response.success) {

                signUp_resultContent(response.success);

            }
        },
        error: function (xhr, status, error) {

        }
    })
});

//change master ////////////////////////////////////////////////////
//change master ////////////////////////////////////////////////////
//change master ////////////////////////////////////////////////////
let currentMasterID;
let currentMasterPwd;
let changeMasterID;
let changeMasterPwd;
$(document).on("touchstart", ".content_C", () => {
    function sendDataToServer() {
        currentMasterID = $("#current_master_id").val();
        currentMasterPwd = $("#current_master_pwd").val();
        changeMasterID = $("#change_master_id").val();
        changeMasterPwd = $("#change_master_pwd").val();

        $.ajax({
            url: "/change_master",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                current_master_id: currentMasterID,
                current_master_pwd: currentMasterPwd,
                change_master_id: changeMasterID,
                change_master_pwd: changeMasterPwd
            }),
            success: function (response) {
                if (response.error) {
                    signUp_resultContent(response.error);
                } else if (response.success) {
                    signUp_resultContent(response.success);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }
    sendDataToServer();
});

















