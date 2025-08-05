# 🤖 AI Integration Guide for Naafe

This guide explains how to set up and use the AI features in Naafe marketplace.

## 🚀 Features

### 1. **AI Form Writing Assistant**
- Helps users write better service descriptions and titles
- Provides suggestions for keywords and content optimization
- Supports both Arabic and English content

### 2. **AI Pricing Guidance**
- Analyzes user pricing against market data
- Provides intelligent pricing recommendations
- Shows market position and confidence levels

### 3. **Smart Category Suggestion**
- Suggests the best category based on user input
- Provides confidence scores for suggestions

### 4. **Form Validation Assistant**
- Real-time validation of form inputs
- Provides improvement suggestions

## 🔧 Setup

### 1. Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-r1-0528:free

# AI Service Configuration
AI_SERVICE_ENABLED=true
AI_FORM_ASSISTANCE=true
AI_PRICING_GUIDANCE=true
```

### 2. Get OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

## 📡 API Endpoints

### Form Writing Assistant
```http
POST /api/ai/assist-form
Authorization: Bearer <token>
Content-Type: application/json

{
  "formType": "service|request",
  "category": "Plumbing",
  "userInput": "أحتاج سباك محترف لإصلاح تسرب في الحمام",
  "currentFields": {
    "title": "إصلاح سباكة",
    "description": "محتوى موجود"
  }
}
```

### Pricing Guidance
```http
POST /api/ai/pricing-guidance
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Plumbing",
  "serviceType": "service|request",
  "location": "القاهرة",
  "userBudget": {
    "min": 500,
    "max": 1500
  }
}
```

### Category Suggestion
```http
POST /api/ai/suggest-category
Authorization: Bearer <token>
Content-Type: application/json

{
  "userDescription": "أحتاج شخص لإصلاح الكهرباء في المنزل"
}
```

### Form Validation
```http
POST /api/ai/validate-input
Authorization: Bearer <token>
Content-Type: application/json

{
  "fieldName": "title",
  "fieldValue": "إصلاح سباكة",
  "formType": "service",
  "category": "Plumbing"
}
```

## 🎯 Usage Examples

### Example 1: Form Writing Assistance

**User Input:** "أحتاج سباك محترف لإصلاح تسرب في الحمام"

**AI Response:**
```json
{
  "suggestions": [
    {
      "type": "title",
      "content": "إصلاح تسرب المياه في الحمام - سباك محترف",
      "reasoning": "عنوان واضح ومحدد يوضح المشكلة والحل"
    },
    {
      "type": "description",
      "content": "أحتاج سباك محترف وموثوق لإصلاح تسرب المياه في الحمام. المشكلة في صنبور المياه وتحتاج إصلاح فوري. أبحث عن شخص ذو خبرة في إصلاح السباكة المنزلية.",
      "reasoning": "وصف مفصل يوضح المشكلة والمتطلبات"
    }
  ],
  "enhancedContent": {
    "title": "إصلاح تسرب المياه في الحمام - سباك محترف",
    "description": "أحتاج سباك محترف وموثوق لإصلاح تسرب المياه في الحمام...",
    "keywords": "سباكة, إصلاح, تسرب, مياه, حمام"
  },
  "helpfulText": "تم تحسين المحتوى ليكون أكثر وضوحاً وجاذبية للعملاء المحتملين"
}
```

### Example 2: Pricing Guidance

**User Budget:** 500-1500 EGP for Plumbing

**AI Response:**
```json
{
  "recommendation": {
    "suggestedMin": 800,
    "suggestedMax": 2000,
    "confidence": 0.85,
    "reasoning": "سعرك منخفض قليلاً مقارنة بالسوق. إصلاح التسرب يتطلب خبرة ومواد جيدة"
  },
  "analysis": {
    "isReasonable": false,
    "marketPosition": "low",
    "factors": [
      "متوسط سعر إصلاح السباكة في القاهرة: 1000-2500 جنيه",
      "التسرب يتطلب خبرة خاصة",
      "تكلفة المواد والأدوات"
    ],
    "tips": [
      "فكر في رفع السعر ليعكس خبرتك",
      "أضف ضمان على العمل",
      "وضح ما يشمله السعر بالتفصيل"
    ]
  }
}
```

## 🎨 Frontend Integration

### AI Assistant Component
```tsx
<AIAssistant
  formType="service"
  category={formData.category}
  currentFields={formData}
  onSuggestionApply={handleAISuggestion}
/>
```

### Pricing Guidance Component
```tsx
<PricingGuidance
  formType="service"
  category={formData.category}
  location={formData.government}
  userBudget={userBudget}
  onPricingApply={handlePricingApply}
/>
```

## 🔒 Security Considerations

1. **API Key Protection**: Never commit your `.env` file
2. **Rate Limiting**: AI endpoints have built-in rate limiting
3. **Input Validation**: All inputs are validated before processing
4. **Authentication**: All AI endpoints require valid JWT tokens

## 📊 Monitoring

### Usage Metrics
- Track API calls per user
- Monitor response times
- Log errors and failures

### Cost Management
- OpenRouter free tier: 1000 requests/day
- Monitor usage to stay within limits
- Implement caching for repeated requests

## 🚀 Future Enhancements

1. **Smart Matching**: Match providers with requests
2. **Sentiment Analysis**: Analyze reviews and feedback
3. **Fraud Detection**: Identify suspicious patterns
4. **Market Analytics**: Provide market insights

## 🐛 Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Check your OpenRouter API key
   - Ensure it's properly set in `.env`

2. **Rate Limit Exceeded**
   - Implement request caching
   - Consider upgrading OpenRouter plan

3. **Poor AI Responses**
   - Check input quality
   - Verify category selection
   - Ensure proper Arabic text encoding

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📞 Support

For issues with AI integration:
1. Check the logs in `backend/logs/`
2. Verify API key and configuration
3. Test with the `/api/ai/test` endpoint
4. Contact the development team

---

**Note**: This AI integration uses OpenRouter's DeepSeek R1 model, which provides excellent Arabic language support and is free to use within the daily limits. 