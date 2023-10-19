export const getAccessToken = (state) => state.auth.accessToken;
export const getUserData = (state) => state.auth.userData;
export const getAllChats = (state) => state.chats.allChats;
export const getSelectedChat = (state) => state.chats.selectedChat;
export const getNotificationState = (state) => state.chats.notificationState
export const getSearchedChatsAndUsers = (state) =>
  state.search.searchedChatsAndUsers;

export const getToastContent = (state)=> state.toast

export const getLatestMessageDirectory = (state)=>state.chats.latestMessageDirectory;

export const getOnlineUsers = (state)=>state.chats.onlineUsers;