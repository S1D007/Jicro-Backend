const admin = require('firebase-admin');
const sendNotification = async (token, title, body, channelId, sound) => {
    await admin.messaging().send(
        {
            notification: {
                title,
                body,
            },
            android: {
                notification: {
                    defaultSound: true,
                    priority: 'high',
                    sound: sound || 'service_provider',
                    sticky: true,
                    visibility: 'public',
                    channelId: channelId || 'sp',
                    lightSettings: {
                        lightOffDurationMillis: 500,
                        lightOnDurationMillis: 1000,
                        color: '#ffffff'
                    },
                    color: '#6750a4'
                }
            },
            token
        }
    )
        .then((response) => {
            
        })
        .catch((error) => {
            
        });
}

module.exports = sendNotification