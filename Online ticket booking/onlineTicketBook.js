var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    const userId = localStorage.getItem("userId");
    var URL = "https://fir-1c7de-default-rtdb.firebaseio.com";
    $scope.orderDetails = {};
    $scope.movieList = [{
        "imgUrl": "./image/wakanda.avif",
        "title": "Wakanda Forever",
        "description": "",
        "price": "15"
    }, {
        "imgUrl": "./image/black-adam.avif",
        "title": "Black Adam",
        "description": "",
        "price": "50"
    }, {
        "imgUrl": "./image/lyle-lyle-crocodile.avif",
        "title": "Lyle Lyle Crocodile",
        "description": "",
        "price": "20"
    }, {
        "imgUrl": "./image/malcolms.avif",
        "title": "Mr. Malcolm's List",
        "description": "",
        "price": "30"
    }, {
        "imgUrl": "./image/mrs-harris-goes-to-paris.avif",
        "title": "Mrs. Harris Goes to Paris",
        "description": "",
        "price": "35"
    }, {
        "imgUrl": "./image/anyday.avif",
        "title": "Any Day Now",
        "description": "",
        "price": "40"
    }, {
        "imgUrl": "./image/bulletTrain.avif",
        "title": "Bullet Train",
        "description": "",
        "price": "20"
    }, {
        "imgUrl": "./image/fireheart.avif",
        "title": "Fire Heart",
        "description": "",
        "price": "25"
    }, {
        "imgUrl": "./image/goodboss.avif",
        "title": "Good Boss",
        "description": "",
        "price": "30"
    }, {
        "imgUrl": "./image/topgun.avif",
        "title": "Top Gun",
        "description": "",
        "price": "50"
    }, {
        "imgUrl": "./image/goodmorning.avif",
        "title": "Good Morning",
        "description": "",
        "price": "30"
    }];
    $scope.seatList = [];
    $("#orderDivId").show();
    $("#biilingId").hide();
    $scope.viewOrderTableData = [];

    $scope.onload = function () {
        for (i = 1; i <= 50; i++) {
            $scope.seatList.push(i);
        }
    }
    $scope.placeOrder = function (data) {
        $scope.orderDetails = data;
        $scope.getOrderTableData("BOOKING");
    }
    $scope.addOrder = function () {

        if (checkIsNull($("#contactId").val()) || checkIsNull($("#userEmailId").val())
            || checkIsNull($("#bookingDateId").val()) || checkIsNull($("#seatId").val())) {
            alert("Please fill all the required data");
        } else {
            let reqstBody = {
                "price": $scope.orderDetails.price,
                "orderDate": new Date($("#bookingDateId").val()).toISOString().split('T')[0],
                "status": "pending",
                "contactId": $("#contactId").val(),
                "userEmailId": $("#userEmailId").val(),
                "seatId": $("#seatId").val(),
                "title": $scope.orderDetails.title

            };
            $.ajax({
                type: 'post',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + "/bookticket/" + userId + ".json",
                data: JSON.stringify(reqstBody),
                success: function (response) {
                    $('#placeOrderModalId').modal('hide');
                    $scope.switchMenu("BILLING", "billingTabId");
                    alert("Operation has been completed sucessfully!!!");
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }
    $scope.getOrderTableData = function (type) {
        $scope.viewOrderTableData = [];
        let orderList = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/bookticket/" + userId + ".json",
            success: function (response) {
                for (let i in response) {
                    let eventData = response[i];
                    eventData["orderId"] = i;
                    orderList.push(eventData);
                }
                const seatNo = [];
                orderList.forEach(function (obj) {
                    seatNo.push(Number(obj.seatId));
                })
                if (type != "BOOKING") {
                    $scope.viewOrderTableData = orderList.filter(function (obj) {
                        if (type == "BILLING") {
                            return obj.status === "pending";
                        } else {
                            return obj.status != "pending";
                        }
                    })
                } else {
                    $scope.seatList = [];
                    for (i = 1; i <= 50; i++) {
                        if (!seatNo.includes(i)) {
                            $scope.seatList.push(i);
                        }
                    }
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.getOrderData = function (data) {
        $("#ammountId").val(data.price);
        $scope.orderDetails = data;

    }
    $scope.payBill = function () {
        if ($("#paymentModeId").val() == "") {
            alert("Please select payment mode");
        } else {
            let requestBody = {
                "status": $("#paymentModeId").val()
            }
            $.ajax({
                type: 'patch',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + "/bookticket/" + userId + "/" + $scope.orderDetails.orderId + ".json",
                data: JSON.stringify(requestBody),
                success: function (response) {
                    $('#processToPayModalId').modal('hide');
                    $scope.getOrderTableData("BILLING");
                    alert("Payment sucessfully!!!");
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }
    $scope.logout = function () {
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
        window.location.href = "loginReg.html";
    }
    $scope.switchMenu = function (type, id) {
        $(".menuCls").removeClass("active");
        $('#' + id).addClass("active");
        $("#orderDivId").hide();
        $("#biilingId").hide();
        if (type == "MENU") {
            $("#orderDivId").show();
        } else if (type == "BILLING") {
            $("#biilingId").show();
            $scope.getOrderTableData("BILLING");
        } else if (type == "HISTORY") {
            $("#biilingId").show();
            $scope.getOrderTableData("HISTORY");
        }
    }
    function checkIsNull(value) {
        return value === "" || value === undefined || value === null ? true : false;
    }
    function resetData() {
        $("#bookingDateId").val("");
        $("#seatId").val("");
        $("#userEmailId").val("");
        $("#passwordId").val("");
        $("#contactId").val("");

    }
    $(document).ready(function () {
        $('#placeOrderModalId').on('hidden.bs.modal', function (e) {
            resetData();
        })
    });
});
