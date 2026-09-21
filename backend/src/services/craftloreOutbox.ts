import crypto from 'crypto';

const CRAFTLORE_INTEGRATION_ENDPOINT = process.env.CRAFTLORE_INTEGRATION_ENDPOINT || 'http://localhost:5000/api/cktre/integrations/khcrf/events';
const KHCRF_TO_CRAFTLORE_SECRET = process.env.KHCRF_TO_CRAFTLORE_SECRET || 'test_secret_for_craftlore';

export async function sendCraftloreEvent(eventType: string, verificationRequestId: string, payload: any) {
    const timestamp = Date.now().toString();
    const eventId = crypto.randomUUID();
    
    const fullPayload = {
        contract_version: "CKTRE-KHCRF-1.0",
        event_id: eventId,
        event_type: eventType,
        verification_request_id: verificationRequestId,
        ...payload
    };

    const rawBody = JSON.stringify(fullPayload);
    const payloadSha256 = crypto.createHash('sha256').update(rawBody).digest('hex');
    const method = 'POST';
    const url = new URL(CRAFTLORE_INTEGRATION_ENDPOINT);
    const path = url.pathname;

    const message = `${timestamp}.${eventId}.${method}.${path}.${payloadSha256}`;
    const signature = crypto.createHmac('sha256', KHCRF_TO_CRAFTLORE_SECRET).update(message).digest('hex');

    try {
        const response = await fetch(CRAFTLORE_INTEGRATION_ENDPOINT, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'x-khcrf-signature': signature,
                'x-khcrf-timestamp': timestamp,
                'x-khcrf-event-id': eventId,
                'x-khcrf-payload-sha256': payloadSha256
            },
            body: rawBody
        });

        if (!response.ok) {
            console.error(`Failed to send event ${eventType} to Craftlore: HTTP ${response.status}`);
            return false;
        }

        console.log(`Successfully sent event ${eventType} to Craftlore for ${verificationRequestId}`);
        return true;
    } catch (e) {
        console.error(`Error sending event ${eventType} to Craftlore:`, e);
        return false;
    }
}
