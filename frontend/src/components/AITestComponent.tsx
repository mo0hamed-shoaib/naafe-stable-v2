import React, { useState } from 'react';
import Button from './ui/Button';
import FormInput from './ui/FormInput';
import FormSelect from './ui/FormSelect';

interface AIResponse {
  success: boolean;
  data?: {
    rawResponse?: string;
    parsedResponse?: Record<string, unknown>;
    finalAssistance?: Record<string, unknown>;
    suggestions?: Array<{
      type: string;
      content: string;
      reasoning?: string;
    }>;
    enhancedContent?: {
      title: string;
      description: string;
      keywords: string;
    };
    helpfulText?: string;
  };
  message?: string;
}

const AITestComponent: React.FC = () => {
  const [formType, setFormType] = useState('service');
  const [category, setCategory] = useState('السباكة');
  const [userInput, setUserInput] = useState('أحتاج سباك محترف لإصلاح تسريب في الحمام');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: 'السباكة', label: 'السباكة' },
    { value: 'كهرباء', label: 'كهرباء' },
    { value: 'تنظيف', label: 'تنظيف' },
    { value: 'بستنة', label: 'بستنة' },
    { value: 'إصلاح منزلي', label: 'إصلاح منزلي' }
  ];

  const testAI = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token && endpoint !== '/debug-form') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/ai${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          formType,
          category,
          userInput,
          currentFields: {}
        })
      });

      const data = await response.json();
      console.log(`${endpoint} Response:`, data);
      setResult(data);
    } catch (err) {
      console.error(`${endpoint} Error:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testSimpleAI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello, can you respond with a simple JSON object like {"test": "success"}?'
        })
      });

      const data = await response.json();
      console.log('Simple AI Test Response:', data);
      setResult(data);
    } catch (err) {
      console.error('Simple AI Test Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Service Test Component</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Form Type</label>
          <FormSelect
            value={formType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormType(e.target.value)}
            options={[
              { value: 'service', label: 'Service Posting' },
              { value: 'request', label: 'Service Request' }
            ]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <FormSelect
            value={category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
            options={categories}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">User Input</label>
        <FormInput
          type="text"
          value={userInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
          placeholder="Enter your service description..."
          className="w-full"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          onClick={() => testAI('/assist-form')}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Testing...' : 'Test AI Form Assistance'}
        </Button>
        
        <Button
          onClick={() => testAI('/debug-form')}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Testing...' : 'Debug AI Form'}
        </Button>
        
        <Button
          onClick={testSimpleAI}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading ? 'Testing...' : 'Test Simple AI'}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-gray-800 font-semibold mb-2">Response Status:</h3>
            <p className="text-gray-700">{result.success ? 'Success' : 'Failed'}</p>
            {result.message && (
              <p className="text-gray-600 text-sm mt-1">{result.message}</p>
            )}
          </div>

          {result.data && (
            <div className="space-y-4">
              {result.data.rawResponse && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-yellow-800 font-semibold mb-2">Raw AI Response:</h3>
                  <pre className="text-yellow-700 text-sm whitespace-pre-wrap overflow-x-auto">
                    {result.data.rawResponse}
                  </pre>
                </div>
              )}

              {result.data.parsedResponse && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-blue-800 font-semibold mb-2">Parsed Response:</h3>
                  <pre className="text-blue-700 text-sm whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(result.data.parsedResponse, null, 2)}
                  </pre>
                </div>
              )}

              {result.data.finalAssistance && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-green-800 font-semibold mb-2">Final Assistance:</h3>
                  <pre className="text-green-700 text-sm whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(result.data.finalAssistance, null, 2)}
                  </pre>
                </div>
              )}

              {result.data.suggestions && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <h3 className="text-indigo-800 font-semibold mb-2">Suggestions:</h3>
                  <div className="space-y-2">
                    {result.data.suggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 bg-white rounded border">
                        <p className="font-medium text-indigo-700">{suggestion.type}:</p>
                        <p className="text-indigo-600">{suggestion.content}</p>
                        {suggestion.reasoning && (
                          <p className="text-indigo-500 text-sm mt-1">{suggestion.reasoning}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.data.enhancedContent && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="text-purple-800 font-semibold mb-2">Enhanced Content:</h3>
                  <div className="space-y-2">
                    <p><strong>Title:</strong> {result.data.enhancedContent.title}</p>
                    <p><strong>Description:</strong> {result.data.enhancedContent.description}</p>
                    <p><strong>Keywords:</strong> {result.data.enhancedContent.keywords}</p>
                  </div>
                </div>
              )}

              {result.data.helpfulText && (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <h3 className="text-teal-800 font-semibold mb-2">Helpful Text:</h3>
                  <p className="text-teal-700">{result.data.helpfulText}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AITestComponent; 