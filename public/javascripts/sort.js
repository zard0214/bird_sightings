function sort() {
    var ascendBtn = document.getElementById('ascend');
    var descendBtn = document.querySelector('[data-sort-order="descend"]');

    // Attach event listeners
    ascendBtn.addEventListener('click', function () { sortTable('ascend'); });
    descendBtn.addEventListener('click', function () { sortTable('descend'); });

    //get the date
    function parseDate(dateString) {
        return new Date(dateString);
    }
    //sort
    function sortTable(order) {
        var table = document.getElementById('myTable');
        var rows = Array.from(table.rows);
        rows.shift();

        rows.sort(function(a, b) {
            var x = parseDate(a.getElementsByTagName("TD")[1].innerHTML);
            var y = parseDate(b.getElementsByTagName("TD")[1].innerHTML);
            if (order === "ascend") {
                return x - y;
            } else if (order === "descend") {
                return y - x;
            }
        });

        // Append rows in the new order
        for (var i = 0; i < rows.length; i++) {
            table.tBodies[0].appendChild(rows[i]);
        }
    }
}