function getLocationValuesFromTable() {
    var table = document.getElementById('myTable');
    var locationValues = [];

    // 遍历表格行
    for (var i = 1; i < table.rows.length; i++) {
        var location = table.rows[i].cells[3].textContent;
        locationValues.push(location);
    }

    return locationValues;
}

navigator.geolocation.getCurrentPosition(
    function(position) {
        var userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        // 执行位置比较逻辑
        compareLocations(userLocation);
    },
    function(error) {
        console.error('无法获取用户位置：', error);
    }
);

// 比较位置
function compareLocations(userLocation,location){

}

