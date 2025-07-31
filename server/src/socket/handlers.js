const logger = require('../utils/logger');

const socketHandlers = (socket, io) => {
  // Join user to their personal room
  socket.on('join', (userId) => {
    socket.join(userId);
    logger.info(`User ${userId} joined their personal room`);
  });

  // Handle vital signs updates
  socket.on('vitalSignsUpdate', (data) => {
    // Broadcast vital signs update to all connected clients
    socket.broadcast.emit('vitalSignsUpdate', data);
    logger.info(`Vital signs updated for patient: ${data.patientId}`);
  });

  // Handle emergency alerts
  socket.on('emergencyAlert', (data) => {
    // Broadcast emergency alert to all connected clients
    io.emit('emergencyAlert', {
      ...data,
      timestamp: new Date(),
      severity: 'critical'
    });
    logger.warn(`Emergency alert broadcasted: ${data.type} - ${data.message}`);
  });

  // Handle notification acknowledgment
  socket.on('notificationAck', (notificationId) => {
    logger.info(`Notification acknowledged: ${notificationId}`);
  });

  // Handle real-time chat messages (for team communication)
  socket.on('chatMessage', (data) => {
    // Broadcast to specific room or all users
    if (data.room) {
      socket.to(data.room).emit('chatMessage', {
        ...data,
        timestamp: new Date()
      });
    } else {
      socket.broadcast.emit('chatMessage', {
        ...data,
        timestamp: new Date()
      });
    }
    logger.info(`Chat message sent by user: ${data.userId}`);
  });

  // Handle user status updates (online/offline)
  socket.on('userStatus', (data) => {
    socket.broadcast.emit('userStatus', {
      userId: data.userId,
      status: data.status,
      timestamp: new Date()
    });
  });

  // Handle patient monitoring updates
  socket.on('patientMonitoring', (data) => {
    // Broadcast to medical staff
    socket.broadcast.emit('patientMonitoring', {
      ...data,
      timestamp: new Date()
    });
    logger.info(`Patient monitoring update: ${data.patientId}`);
  });

  // Handle system alerts
  socket.on('systemAlert', (data) => {
    io.emit('systemAlert', {
      ...data,
      timestamp: new Date()
    });
    logger.warn(`System alert: ${data.message}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
};

module.exports = socketHandlers;
