import type { ChatResponse } from '../types/chat';
import { mockBusinesses } from '../data/businesses';

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  let response = "Lo siento, no pude procesar tu mensaje. ¿Puedes intentarlo de nuevo?";
  let suggestions: string[] = [];

  try {
    const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // make sure this env var is set
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un asistente para una aplicación de directorio de negocios locales. Responde siempre en español.

Datos de negocios disponibles: ${JSON.stringify(
              mockBusinesses.map(b => ({
                id: b.id,
                name: b.name,
                category: b.category,
                description: b.description,
                rating: b.rating,
                address: b.address,
                phone: b.phone,
                tags: b.tags,
              }))
            )}.

Responde en uno de dos formatos:

1) Un array JSON de lugares con claves "name" y "link".
   Ejemplo:
   [
     {"name": "Café Central", "link": "/business/1"},
     {"name": "Bistró Luna", "link": "/business/2"}
   ]

2) Una sola oración corta informativa, máximo 100 caracteres.

Nota importante: El mapa de la aplicación no está conectado a servicios de mapas en línea,
por lo que no puede proporcionar indicaciones de dirección.`,
          },
          { role: "user", content: message },
        ],
        max_tokens: 400,
      }),
    });

    const data = await apiResponse.json();
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";

    try {
      // Try parsing JSON list of places
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const limit = 10;
        const truncated = parsed.slice(0, limit);

        response = truncated
          .map((p: { name: string; link: string }) => `${p.name} - ${p.link}`)
          .join("\n");

        if (parsed.length > limit) {
          response += `\n...y ${parsed.length - limit} más disponibles.`;
          suggestions = ["Ver más resultados", "Ver en mapa", "Buscar similares"];
        } else {
          suggestions = ["Ver en mapa", "Buscar similares", "Más detalles"];
        }

        response +=
          "\n\nNota: El mapa no está conectado a servicios de mapas en línea, por lo que no puedo proporcionar indicaciones de dirección.";
      } else {
        // If it's not JSON, return as a short sentence
        response = raw.length > 150 ? raw.slice(0, 150) : raw;
      }
    } catch {
      // Fallback: short text sentence
      response =
        (raw.length > 150 ? raw.slice(0, 150) : raw) +
        "\n\nNota: El mapa no está conectado a servicios de mapas en línea.";
      suggestions = ["Más detalles", "Buscar similares", "Ver en mapa"];
    }
  } catch {
    response = "Hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.";
  }

  return { message: response, suggestions };
};
