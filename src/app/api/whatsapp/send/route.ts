import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, message, mediaUrl } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Phone and message are required parameters' },
        { status: 400 }
      );
    }

    // Sanitize phone to Indonesian MSISDN
    let targetPhone = String(phone).replace(/[^0-9]/g, '');
    if (targetPhone.startsWith('0')) {
      targetPhone = '62' + targetPhone.slice(1);
    }

    const provider = process.env.WHATSAPP_PROVIDER || 'mock';
    const token = process.env.WHATSAPP_API_TOKEN;

    // 1. Fonnte Gateway Integration
    if (provider === 'fonnte' && token) {
      const fonnteResponse = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: targetPhone,
          message: message,
          url: mediaUrl,
        }),
      });

      const fonnteData = await fonnteResponse.json();
      return NextResponse.json({
        success: true,
        provider: 'fonnte',
        status: fonnteData.status ? 'delivered' : 'queued',
        gatewayResponse: fonnteData,
      });
    }

    // 2. Wablas Gateway Integration
    if (provider === 'wablas' && token) {
      const wablasResponse = await fetch('https://api.wablas.com/api/send-message', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: targetPhone,
          message: message,
        }),
      });

      const wablasData = await wablasResponse.json();
      return NextResponse.json({
        success: true,
        provider: 'wablas',
        status: wablasData.status ? 'delivered' : 'queued',
        gatewayResponse: wablasData,
      });
    }

    // 3. Default Sandbox Simulator Mode
    return NextResponse.json({
      success: true,
      provider: 'sandbox',
      status: 'simulated',
      target: targetPhone,
      info: 'Message recorded in Studio WhatsApp Activity Log (configure WHATSAPP_API_TOKEN in .env for automated live SMS/WA dispatch)',
    });
  } catch (error) {
    console.error('WhatsApp dispatch route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing dispatch' },
      { status: 500 }
    );
  }
}
