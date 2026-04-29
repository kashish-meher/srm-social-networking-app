import Notification from '../models/Notification.js';

export async function createNotification({ io, getUsers, recipient, sender, type, postId, message }) {
  console.log('🔔 createNotification called:', { recipient, sender, type });

  if (!recipient) { console.log('❌ No recipient'); return; }
  if (sender && recipient.toString() === sender.toString()) {
    console.log('❌ Sender = Recipient, skipping'); return;
  }

  const notif = await Notification.create({ recipient, sender, type, postId, message });
  const populated = await Notification.findById(notif._id).populate('sender', 'name profilePic');

  // ✅ Call getUsers() to get the LIVE users object
  const users = getUsers ? getUsers() : {};
  console.log('🔌 Online users:', users);

  const recipientSocket = users[recipient.toString()];
  console.log('🔌 Recipient socket:', recipientSocket);

  if (recipientSocket && io) {
    io.to(recipientSocket).emit('newNotification', populated);
    console.log('📡 Emitted to socket:', recipientSocket);
  }

  return populated;
}