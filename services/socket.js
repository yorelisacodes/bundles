const users = []

const moment = require('moment')

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  }
}

// JOIN USER TO CHAT =======
function userJoin(id, username, room) {
const user = { id, username, room}

users.push(user)

return user

}

// GET CURRENT USER ========
function getCurrentUser(id) {
  return users.find(user => user.id === id)
}


// USER LEAVES CHAT ========
function userLeave(id) {
  const index = users.findIndex(user => user.id === id)

  if(index !== -1){
    return users.splice(index, 1)[0]
  }
   
}

// GET ROOM USERS 
function getRoomUsers(room){
  return users.filter(user => user.room === room)
}


module.exports = {
  userJoin,
  getCurrentUser, 
  userLeave,
  getRoomUsers,
  formatMessage
}
