let name = null;
let roomNo = null;
let socket = io();

function addrecord() {
    var img = [];
    var allowImgFileSize = '101376';
    let fileInput = document.getElementById('inputs');
    // let uploaddIv = document.getElementById('uploadDIv');
    fileInput.addEventListener('change', function() {
        var file = this.files;
        for(var i = 0; i < file.length; i++) {
            var curr = fileInput.files[0].size;
            if(curr > allowImgFileSize * 101376) {
                layer.msg("The image file size exceeds the limit, please upload a file smaller than 99M");
            } else {
                reads(file[i]);
                img.push(fileInput.files[0]);
            }
        }
        console.log(img);

    });

}

function reads(fil) {
    var reader = new FileReader();
    reader.readAsDataURL(fil);
    reader.onload = function () {
        document.getElementById("uploadBox").innerHTML += "<div class='divImg' id='uploadImg'><img src='" + reader.result + "' class='imgBiMG'></div>";
    }
}

function save() {
    var url = preview.src;
    var a = document.createElement('a');
    var event = new MouseEvent('click')
    a.download = 'beautifulGirl'
    a.href = url;
    a.dispatchEvent(event)
}
