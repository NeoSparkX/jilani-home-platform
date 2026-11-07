import { Resend } from 'resend';

// Initialize the Resend client safely
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const defaultFrom = `JILANI HOME <hello@${process.env.RESEND_DOMAIN || 'jilanihome.com'}>`;

export async function sendEmail(from: string = defaultFrom, to: string, subject: string, htmlContent: string, attachments?: { filename: string, content: Buffer }[]) {
    // If no API key is configured, skip safely without breaking builds or runtime
    if (!resend) {
        console.warn(`[EMAIL SKIPPED] RESEND_API_KEY is missing. Skipping email to: ${to} | Subject: "${subject}"`);
        return { success: true, skipped: true };
    }

    try {
        const payload: any = {
            from: from,
            to: [to],
            subject: subject,
            html: htmlContent,
        };

        if (attachments) {
            payload.attachments = attachments;
        }

        const data = await resend.emails.send(payload);

        if (data.error) {
            console.error("Resend API Error:", data.error);
            return { success: false, error: data.error.message };
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("Failed to reach Resend:", error);
        return { success: false, error: "Email Gateway is unreachable." };
    }
}