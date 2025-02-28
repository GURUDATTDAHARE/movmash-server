const users = [];
const addUser = ({ id, name, room, host }) => {
  //   name = name.trim().toLowerCase();
  //   room = room.trim().toLowerCase();

  //   const existingUser = users.find(
  //     (user) => user.room === room && user.name === name
  //   );

  //   if (!name || !room) return { error: "Username and room are required." };
  //   if (existingUser) return { error: "Username is taken." };

  const user = { id, name, room, host };

  users.push(user);
  console.log(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUserDetail = (id) => {
  return users.find((user) => user.id === id);
};

const getHostDetail = (room) => {
  return users.find((user) => user.room === room && user.host === true);
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUser,
  removeUser,
  getUserDetail,
  getUsersInRoom,
  getHostDetail,
};
