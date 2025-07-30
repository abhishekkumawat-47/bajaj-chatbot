# Bajaj Finserv Insurance Chatbot

> **AI-Powered Insurance Assistant** - Transforming complex policy documents into instant, human-friendly answers

[![Next.js](https://img.shields.io/badge/Next.js-13.0+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-API-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

## 🎯 Overview

The Bajaj Finserv Insurance Chatbot is an intelligent conversational AI system designed to democratize insurance policy understanding. By leveraging Google's Gemini API and advanced document processing, it transforms lengthy, complex insurance documents into instant, conversational answers that customers can actually understand.

### The Problem We Solve

- **Document Complexity**: Insurance policies are notoriously difficult to navigate
- **Customer Frustration**: Users spend hours searching through PDFs for simple answers
- **Support Overhead**: Repetitive queries overwhelm customer service teams
- **Accessibility Gap**: Complex legal language excludes many potential customers

### Our Solution

An AI assistant that reads policy documents for you and answers questions in plain English, instantly.

## ✨ Key Features

### 🚀 **Instant Intelligence**
- **Sub-2 Second Response Time**: Lightning-fast answers powered by optimized Gemini API integration
- **Natural Language Processing**: Ask questions the way you naturally think about them
- **Context-Aware Responses**: Understands policy nuances and cross-references multiple documents

### 📄 **Document Mastery**
- **Multi-Document Analysis**: Processes and cross-references 5+ core insurance policy documents
- **Smart Extraction**: Advanced PDF parsing with intelligent content summarization
- **Dynamic Context Building**: Creates relevant context for each query without information overload

### 🎨 **User Experience Excellence**
- **Conversational Interface**: Clean, intuitive chat experience built with Next.js
- **Mobile-First Design**: Responsive design optimized for all device types
- **Progressive Enhancement**: Works seamlessly across different network conditions

## 🏗️ Architecture & Technology Stack

### **Frontend Layer**
```
Next.js 13+ (App Router)
├── TypeScript for type safety
├── Tailwind CSS for styling
├── React Hooks for state management
└── Responsive design components
```

### **Backend Infrastructure**
```
Next.js API Routes
├── RESTful endpoint design
├── Error handling & validation
├── Rate limiting capabilities
└── Structured logging
```

### **AI & Processing Engine**
```
Google Gemini API
├── Advanced prompt engineering
├── Context optimization
├── Response formatting
└── Fallback handling

PDF Processing Pipeline
├── pdf-parse for text extraction
├── Content cleaning & normalization
├── Semantic chunking
└── JSON serialization
```

### **Data Management**
```
Static Document Store
├── Pre-processed policy content
├── Optimized for query performance
├── Version control ready
└── Backup & recovery systems
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Google AI Studio API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/abhishekkumawat-47/bajaj-chatbot.git
cd bajaj-chatbot
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment setup**
```bash
cp .env.example .env.local
```

Add your Google Gemini API key:
```env
GOOGLE_AI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the chatbot in action.

## 📁 Project Structure

```
bajaj-finserv-chatbot/
├── 📂 src/
│   ├── 📂 app/                    # Next.js 13+ app directory
│   │   ├── api/ask/route.ts       # Main chatbot API endpoint
│   │   ├── chat/page.tsx          # Chat interface
│   │   └── layout.tsx             # Root layout
│   ├── 📂 components/             # React components
│   │   ├── ChatInterface.tsx      # Main chat component
│   │   ├── MessageBubble.tsx      # Individual message display
│   │   └── TypingIndicator.tsx    # Loading states
│   ├── 📂 lib/                    # Utility functions
│   │   ├── extractText.ts         # PDF processing logic
│   │   ├── gemini.ts              # AI integration
│   │   └── utils.ts               # Helper functions
│   └── 📂 types/                  # TypeScript definitions
├── 📂 documents/                  # Policy PDF storage
├── 📂 data/
│   └── static_docs.json           # Processed document content
├── 📂 public/                     # Static assets
└── 📋 Configuration files
```

## 💡 Usage Examples

### Basic Policy Inquiry
```
User: "What happens if I need an air ambulance?"
Bot: "Air ambulance services are covered up to 150km from your location. Beyond that distance, you'll receive 50% reimbursement of the additional costs."
```

### Claim Process Questions
```
User: "How do I file a claim for my recent surgery?"
Bot: "Submit your claim within 30 days using our online portal or mobile app. You'll need your policy number, hospital bills, and discharge summary."
```

### Coverage Verification
```
User: "Is dental treatment covered under my family plan?"
Bot: "Routine dental care isn't covered, but emergency dental treatments due to accidents are included up to ₹25,000 per year."
```

## 🤝 Contributing

We welcome contributions!

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is proprietary software developed for Bajaj Finserv Ltd. 

**Internal Use Only** - Not licensed for external distribution or commercial use without explicit written permission from Bajaj Finserv Ltd.

## 👥 Team

Built with ❤️ by the Team doggy_Vinod

- **UI/UX Developer**: Vinod Singh Rathore -  Our Doggy
- **AI/ML Engineer**: Vidhan Bansal
- **Frontend Developer**: Abhishek kumawat , Aditya Agarwal
- **Backend Developer**: Abhishek kumawat , Aditya Agarwal

---

**Made with 🚀 for Bajaj Finserv customers**

*Transforming insurance from complex to conversational, one query at a time.*
