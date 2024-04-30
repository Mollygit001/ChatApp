const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
   ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
   outputRoomName(room);
   outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
   outputMessage(message);

   // Scroll down
   chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
   e.preventDefault();

   // Get message text 
   const msg = e.target.elements.msg.value;

   // Emit message to server 
   socket.emit('chatMessage', msg); 

   // Clear input
   e.target.elements.msg.value = '';
   e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
   const div = document.createElement('div');
   div.classList.add('message');
   div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
                     <p class="text">${message.text}</p>`;
   
   const deleteButton = createDeleteButton(); // Create delete button
   div.appendChild(deleteButton); // Append delete button to message

   chatMessages.appendChild(div);

   // Set timeout to remove delete button after 10 seconds
   setTimeout(() => {
       deleteButton.remove(); // Remove delete button
   }, 10000);
}

// Create delete button for a message
function createDeleteButton() {
   const deleteButton = document.createElement('button');
   deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
   deleteButton.classList.add('delete-btn');
   deleteButton.onclick = function () {
       this.parentElement.remove(); // Remove the message when delete button is clicked
   };
   return deleteButton;
}

// Add room name to DOM
function outputRoomName(room) {
   roomName.innerHTML = room;
}

let isFirstUser = true; // Variable to track if the current user is the first one joining the room

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map((user, index) => `<li>${index === 0 && isFirstUser ? `${user.username}:[Admin]` : user.username}</li>`).join('')}
    `;
    isFirstUser = false; // Update isFirstUser after displaying users
}


// Check if username is already taken in the room
socket.on('usernameTaken', () => {
   alert('Username is already taken in this room. Please choose another username.');
});
