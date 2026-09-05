import { NextRequest, NextResponse } from 'next/server';

export interface WebhookOrderPayload {
  event: 'order.created' | 'order.cancelled' | 'order.paid';
  source?: 'tiktok_shop_live' | 'tokopedia' | 'shopee' | 'manual_simulator';
  sku: string;
  buyer_name: string;
  buyer_handle: string;
  buyer_phone: string;
  shipping_address?: string;
  shipping_city?: string;
  courier_name?: string;
  sold_price: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: Partial<WebhookOrderPayload> = await req.json();

    if (!body.sku || !body.sold_price || !body.buyer_handle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required webhook fields: sku, sold_price, buyer_handle',
        },
        { status: 400 }
      );
    }

    // Format phone to 628... if provided
    let cleanPhone = body.buyer_phone ? body.buyer_phone.replace(/[^0-9]/g, '') : '';
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json(
      {
        success: true,
        source: body.source || 'tiktok_shop_live',
        event: body.event || 'order.created',
        order_number: orderNumber,
        item: {
          sku: body.sku.toUpperCase(),
          sold_price: body.sold_price,
        },
        buyer: {
          name: body.buyer_name || `Customer ${body.buyer_handle}`,
          handle: body.buyer_handle.startsWith('@') ? body.buyer_handle : `@${body.buyer_handle}`,
          phone: cleanPhone || '6281298765432',
          city: body.shipping_city || 'Kota Sukabumi',
        },
        ingested_at: new Date().toISOString(),
        message: `Order live TikTok berhasil diterima dan didaftarkan ke antrean logistik PindahTangan.`,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid JSON payload';
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/webhooks/orders',
    supported_events: ['order.created', 'order.paid', 'order.cancelled'],
    supported_platforms: ['TikTok Shop Live', 'Tokopedia', 'Shopee'],
    documentation: 'Send POST request with JSON body { event, sku, buyer_handle, buyer_name, buyer_phone, sold_price }',
  });
}
