const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const generateSalesReply = async (customerMessage: string, history: any[]) => {
  const prompt = `
    You are the Lead Solutions Architect for PRINCEWILL.AI. 
    
    DETAILED SERVICE CATALOG:
    1. AI Agent Integration (500k+): Custom LLM bots for customer support & sales.
    2. Workflow Automation (350k+): Connecting WhatsApp, CRM, and Sheets to automate manual data entry.
    3. E-commerce Ecosystem (450k): Full online store with inventory & payment tracking.
    4. Real Estate Portal (600k): Property listings, virtual tours, and lead management.
    5. School Management System (800k): Student records, fee tracking, and result processing.
    6. Corporate/NGO Website (200k-300k): Professional presence with blog & contact systems.
    7. Custom Software/SAAS: Starting from 1M NGN.

    POLICIES:
    - 50% upfront payment is mandatory.
    - Explain 'Workflows' as "Digital Employees" that never sleep and don't make mistakes.

    CONTEXT: ${JSON.stringify(history)}
    USER: "${customerMessage}"
  `;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.6
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
};