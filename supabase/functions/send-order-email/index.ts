import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = "re_6Fkxwtok_KFLzQwnMmbuaVFxrfvUnyCWL";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders, status: 200 });
    }

    try {
        const { orderDetails, userEmail, userName } = await req.json();

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "RNS Innobotics <onboarding@resend.dev>", // Default Resend testing sender. Change this if you have a verified domain.
                to: [userEmail], // In Resend 'Testing' mode, you can only send to your own email unless verified.
                subject: `Order Received: ${orderDetails.project_title}`,
                html: `
          <h1>Request Received!</h1>
          <p>Hi ${userName},</p>
          <p>Thank you for your order at RNS Innobotics.</p>
          <p><strong>Order ID:</strong> ${orderDetails.id}</p>
          <p><strong>Project:</strong> ${orderDetails.project_title}</p>
          <p>We will review your request and update the invoice status within 24-48 hours.</p>
          <hr />
          <p>Best Regards,<br/>RNS Innobotics Team</p>
        `,
            }),
        });

        const data = await res.json();

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
