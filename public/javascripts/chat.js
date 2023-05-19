let name = null;
let roomNo = null;
let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    console.log("chat init")
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        console.log("joined")
        if (userId === name) {
            // it enters the chat
            // console.log("hideLoginInterface")
            hideLoginInterface(room, userId);
            // console.log("writeChatHistory")
            writeChatHistory(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnHistory('<b style="padding: 15px">'+userId+'</b>' + ' joined room ' + room);
        }

    });
    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        // if (userId === name) who = 'Me';
        // write on history
        writeOnHistory('<b style="padding: 15px">' + who + ':</b> ' + chatText);
        writeHistory(room, userId, chatText);
    });

    connectToRoom();
}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    socket.emit('chat', roomNo, name, chatText);
}

// function validateForm()
// {
//     var chatText = document.forms["chatForm"]["chat_input"].value;
//     if (chatText == null || chatText == "")
//     {
//         alert("Please input the word");
//         return false;
//     }
// }

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;
    if (!name) name = 'Unknown-' + Math.random();
    socket.emit('create or join', roomNo, name);
}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}

/**
 * get the chat record from the mongodb
 * @param room
 * @param userId
 */
function writeChatHistory(room, userId) {
    console.log("writeChatHistory")
    $.ajax({
        type : 'GET',
        url : "/chat/fetchChatRecordList",
        async : false,
        dataType : 'json',
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: {
            "chat_room": room
        },
        success : function(data, status) {
            console.log("data:" + data)
            var who =''
            var chat_text =''
            for (let i = 0; i < data.chat.length; i++) {
                // console.log("record:" + data.chat[i]._id)
                // console.log("user:" + data.chat[i].user)
                // console.log("chat_text:" + data.chat[i].chat_text)
                // if (userId === name) who = 'Me';
                // else
                who =  data.chat[i].user;
                chat_text = data.chat[i].chat_text;
                writeOnHistory('<b style="padding: 15px">' + who + ':</b> ' + chat_text);
            }
        },
        complete : function() {
        },
        error : function(data, status, e) {
            alert('error！');
        }
    });
}

/**
 * using http request to save the chat record to the mongodb
 *
 * @param room
 * @param userId
 * @param chatText
 */
function writeHistory(room, userId, chatText) {
    var chatRecord =
        { time: new Date(), chat_room: roomNo, user: userId, chat_text: chatText };
    $.ajax({
        type : 'POST',
        url : "/chat/insert",
        async : false,
        data: chatRecord,
        dataType : 'json',
        success : function(data, status) {
            // alert('success！');
        },
        complete : function() {
        },
        error : function(data, status, e) {
            alert('error！');
        }
    });
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' ' + room;

    console.log("userId:", userId)
}
