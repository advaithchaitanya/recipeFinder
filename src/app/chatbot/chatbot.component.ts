import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  inputMessage = '';
  loading = false;
  chatHistory: Message[] = [];

  async sendMessage() {
    const question = this.inputMessage.trim();
    if (!question) return;

    this.chatHistory.push({ role: 'user', text: question });
    this.inputMessage = '';
    this.loading = true;

    const API_KEY = 'AIzaSyCrfTRsygEaIl6ndzu3FJrbFAfMyg5n37M'; // 🔐 Replace safely later
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: question }]
          }]
        })
      });

      const data = await response.json();
      console.log(data);
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '🤔 No response.';
      this.chatHistory.push({ role: 'bot', text: reply });

    } catch (error) {
      this.chatHistory.push({ role: 'bot', text: '❌ Error fetching response.' });
      console.error(error);
    } finally {
      this.loading = false;
    }
  }
}
