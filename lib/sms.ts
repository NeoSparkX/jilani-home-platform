import { normalizePhoneNumber } from "@/lib/utils";

export async function sendSMS(phone: string, message: string) {
    // 1. Sandbox configuration to protect your wallet balance in development
    // if (process.env.NODE_ENV === "development") {
    //     console.log(`[SMS SANDBOX] To: ${phone} | Message: ${message}`);
    //     return { success: true };
    // }

    // 2. Format phone number exactly for Bangladeshi carrier requirements
    // Ensures spacing, brackets, plus signs, and global country codes are normalized
    const formattedPhone = normalizePhoneNumber(phone) || phone.replace(/\D/g, '');

    try {
        const API_KEY = process.env.SMSNOC_API_TOKEN;
        const URL = 'https://smsnoc.com/api/v1/send-sms';

        if (!API_KEY) {
            console.warn(`[SMS SKIPPED] SMSNOC_API_TOKEN is missing. Skipping SMS to: ${formattedPhone}`);
            return { success: true, skipped: true };
        }

        // 3. Fire Recommended POST Request with Bearer Token Authorization
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                to: formattedPhone,         // Matches official parameter 'to'
                message: message,           // Matches official parameter 'message'
                sender_id: process.env.SMSNOC_SENDER_ID // Matches official parameter 'sender_id'
            })
        });

        const result = await response.json();

        // 4. Validate exact API response schema flags
        if (response.ok && result.status === 'success') {
            console.log(`✅ SMS Gateway Delivery Confirmed | Count: ${result.message_count} | Type: ${result.sms_type}`);
            return { success: true, count: result.message_count, type: result.sms_type };
        } else {
            console.error("❌ SMSNOC Gateway Error Payload:", result);
            return { success: false, error: result.error || "Gateway rejected authorization or payload structure." };
        }

    } catch (error: any) {
        console.error("🚨 Critical Connection Failure to SMSNOC API:", error);
        return { success: false, error: error.message || "Gateway endpoint unreachable." };
    }
}