const onSort = list => {
  list.sort((a, b) => {
    let x = a.profile.userName.toLowerCase();
    let y = b.profile.userName.toLowerCase();
    return x < y ? -1 : 1;
  });
};

export const notifications = (
  prevFriendList,
  currFriendList,
  receiverEmail,
  userEmail
) => {
  if (
    prevFriendList !== currFriendList &&
    prevFriendList.length === currFriendList.length
  ) {
    onSort(prevFriendList);
    onSort(currFriendList);

    let length = prevFriendList.length;

    for (let index = 0; index < length; index++) {
      if (
        !!!receiverEmail |
          (currFriendList[index].messages.senderEmail !== receiverEmail) &&
        currFriendList[index].messages.senderEmail !== userEmail &&
        prevFriendList[index].messages.date !==
          currFriendList[index].messages.date
      ) {
        let notifications = {};
        notifications.userName = currFriendList[index].profile.userName;
        notifications.userEmail = currFriendList[index].profile.userEmail;
        notifications.profilePicture =
          currFriendList[index].profile.profilePicture;
        notifications.message = currFriendList[index].messages.message;

        return notifications;
      } else return null;
    }
  } else {
    return null;
  }
};
