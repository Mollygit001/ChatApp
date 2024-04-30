const fs = require('fs');

const users = [];

// join user to chat
function userJoin(id, username, room) {
   const user = { id, username, room };

   users.push(user);

   return user;
}

// get current user
function getCurrentUser(id) {
   return users.find((user) => user.id === id);
}


// user leaves chat
function userLeave(id) {
   const index = users.findIndex((user) => user.id === id);

   if (index !== -1) {
      return users.splice(index, 1)[0];
   }
}

// get room users
function getRoomUsers(room) {
   return users.filter((user) => user.room === room);
}

// Function to save users to file
function saveUsersToFile() {
   const usersString = JSON.stringify(users, null, 2); // Convert users array to a string
   fs.writeFile('userLogs.txt', usersString, (err) => {
      if (err) {
         console.error('Error writing users to file:', err);
      } else {
         console.log('Users saved to file successfully.');
      }
   });
}

module.exports = {
   users,
   userJoin,
   getCurrentUser,
   userLeave,
   getRoomUsers,
   saveUsersToFile,
};
