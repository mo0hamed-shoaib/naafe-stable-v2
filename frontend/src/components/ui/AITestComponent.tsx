import React, { useState } from 'react';
import Button from './Button';
import BaseCard from './BaseCard';

const AITestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testHealthCheck = async () => {
    setIsLoading(true);
    addResult('Testing AI health check...');
    
    try {
      const response = await fetch('/api/ai/health');
      const data = await response.json();
      
      if (data.success) {
        addResult('✅ Health check passed');
      } else {
        addResult('❌ Health check failed: ' + data.error?.message);
      }
    } catch (error) {
      addResult('❌ Health check error: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const testAIService = async () => {
    setIsLoading(true);
    addResult('Testing AI service...');
    
    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Hello AI!'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addResult('✅ AI service test passed');
        addResult('Response: ' + data.data.response);
      } else {
        addResult('❌ AI service test failed: ' + data.error?.message);
      }
    } catch (error) {
      addResult('❌ AI service error: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <BaseCard className="p-6 border-l-4 border-blue-500">
      <h3 className="text-lg font-bold text-[#0e1b18] mb-4">AI Service Test</h3>
      
      <div className="space-y-3 mb-4">
        <Button
          onClick={testHealthCheck}
          loading={isLoading}
          variant="secondary"
          size="sm"
        >
          Test Health Check
        </Button>
        
        <Button
          onClick={testAIService}
          loading={isLoading}
          variant="secondary"
          size="sm"
        >
          Test AI Service
        </Button>
        
        <Button
          onClick={clearResults}
          variant="outline"
          size="sm"
        >
          Clear Results
        </Button>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
        <h4 className="font-semibold text-[#0e1b18] mb-2">Test Results:</h4>
        {testResults.length === 0 ? (
          <p className="text-[#0e1b18] text-sm">No test results yet. Run a test to see results.</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default AITestComponent; 