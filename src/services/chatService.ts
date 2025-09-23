import type { ChatResponse } from '../types/chat';
import { mockBusinesses } from '../data/businesses';

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  // Mock AI processing - no delay needed for development

  const lowerMessage = message.toLowerCase();
  let response = "I'm sorry, I didn't understand that. Can you try asking about restaurants, cafes, or specific businesses?";
  let suggestions: string[] = [];

  if (lowerMessage.includes('italian') || lowerMessage.includes('pasta') || lowerMessage.includes('pizza')) {
    const italianPlaces = mockBusinesses.filter(b => b.category === 'restaurants' && b.tags.includes('Italian'));
    if (italianPlaces.length > 0) {
      response = `I found ${italianPlaces.length} Italian restaurant(s). ${italianPlaces[0].name} is highly rated with ${italianPlaces[0].rating} stars. Would you like more details?`;
      suggestions = italianPlaces.slice(0, 3).map(b => `Tell me about ${b.name}`);
    }
  } else if (lowerMessage.includes('coffee') || lowerMessage.includes('cafe')) {
    const cafes = mockBusinesses.filter(b => b.category === 'cafes');
    response = `There are ${cafes.length} cafes in the area. ${cafes[0].name} is a great choice for coffee lovers.`;
    suggestions = cafes.slice(0, 3).map(b => `More about ${b.name}`);
  } else if (lowerMessage.includes('directions') || lowerMessage.includes('location')) {
    response = "I can help you find directions. Which business are you looking for?";
  } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone')) {
    response = "I'd be happy to provide contact information. Which business interests you?";
  } else if (lowerMessage.includes('show me') || lowerMessage.includes('find')) {
    if (lowerMessage.includes('restaurant')) {
      const restaurants = mockBusinesses.filter(b => b.category === 'restaurants');
      response = `I can show you ${restaurants.length} restaurants. What type are you looking for?`;
      suggestions = ['Italian restaurants', 'Burgers', 'Sushi', 'Thai food'];
    } else if (lowerMessage.includes('shop') || lowerMessage.includes('store')) {
      const shops = mockBusinesses.filter(b => b.category === 'shops');
      response = `There are ${shops.length} shops available. What are you shopping for?`;
      suggestions = ['Electronics', 'Books', 'Fashion', 'Home & Garden'];
    }
  }

  return { message: response, suggestions };
};