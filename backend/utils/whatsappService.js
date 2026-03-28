// This is a placeholder for real WhatsApp integration (e.g. Twilio, Meta API)
// For now, it logs to console, but can be easily connected to an API.

export const sendWhatsAppMessage = async (mobile, message) => {
    try {
        console.log(`[WhatsApp Simulation] To: ${mobile} | Message: ${message}`);
        
        // Example with fetch (commented out):
        /* 
        await fetch('https://api.whatsapp.com/send', {
            method: 'POST',
            body: JSON.stringify({ to: mobile, text: message }),
            headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}` }
        });
        */

        return { success: true };
    } catch (error) {
        console.error('WhatsApp Error:', error);
        return { success: false, error: error.message };
    }
};

export const sendBookingAlert = async (booking, type = 'APPROVED') => {
    const mobile = booking.user?.mobile || booking.mobile;
    if (!mobile) return;

    let message = '';
    const name = booking.user?.name || 'Customer';

    if (type === 'APPROVED') {
        message = `Namaste ${name}! 🙏\n\nAapki booking (ID: ${booking._id.slice(-6)}) APPROVE ho gayi hai.\n\nDinesh Bartan Bhandar aane ke liye dhanyavad!`;
    } else if (type === 'REMINDER') {
        message = `Namaste ${name}! 😊\n\nReminder: Aapke bartan kal (${new Date(booking.endDate).toLocaleDateString()}) wapas karne ki tareekh hai.\n\n- Dinesh Bartan Bhandar`;
    }

    return await sendWhatsAppMessage(mobile, message);
};
