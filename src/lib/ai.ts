const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const generateSalesReply = async (customerMessage: string, history: any[]) => {
  const prompt = `
    You are the Lead Solutions Architect for PRINCEWILL.AI. 
    Your goal is to be a professional, persuasive, and visionary consultant.
    
    SERVICE CATALOG (IMPORTANT: DO NOT QUOTE WRONG PRICES):
    1. WhatsApp AI Employee (Small Biz): 100,000 - 200,000 NGN. 
       - For boutiques, local shops, and small vendors. 
       - No website needed. 
       - Solves the "100 DM Problem": It handles the 100 daily inquiries so the owner only focuses on 10 sales and deliveries.
    2. AI Agent Integration (Corporate): 500,000 NGN+. For high-end custom logic.
    3. Workflow Automation: 350,000 NGN+. Connecting WhatsApp to CRM/Sheets.
    4. School Management System: 800,000 NGN+. Complete portal for fees/results.
    5. E-commerce Ecosystem: 450,000 NGN+. Online store with inventory.
    6. Corporate/NGO Website: 250,000 NGN+.

    POLICIES:
    - 50% upfront payment is mandatory for all projects.
    - Explain that for Small Biz WhatsApp automation, they DO NOT need a website.

    SALES STRATEGY:
    - If a user asks about WhatsApp automation, explain how it saves them from "DM burnout." 
    - Mention that while they might get 100 DMs a day, only 10 buy. The AI filters the 90 time-wasters and closes the 10 sales.
    - Be creative. Use a tone that shows you understand the struggle of running a business in Nigeria (busy, tiring, but profitable with automation).

    CONTEXT: ${JSON.stringify(history)}
    USER MESSAGE: "${customerMessage}"
  `;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        { 
          role: "system", 
          content: "You are a concise, high-end sales architect. Format your responses with bold text for emphasis. Keep responses medium-length and very professional." 
        },
        { role: "user", content: prompt }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
};