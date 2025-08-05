

const TestPage = () => {
  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-deep-teal mb-4">
          🎉 Application is Working!
        </h1>
        <p className="text-lg text-text-secondary mb-6">
          The React application is running successfully.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Test Information:
          </h2>
          <ul className="text-left space-y-2 text-text-secondary">
            <li>✅ React is working</li>
            <li>✅ TypeScript is working</li>
            <li>✅ Tailwind CSS is working</li>
            <li>✅ DaisyUI is working</li>
            <li>✅ Custom colors are working</li>
          </ul>
          <div className="mt-6 p-4 bg-light-cream rounded-lg">
            <h3 className="font-semibold text-text-primary mb-2">Navigation Test:</h3>
            <div className="space-y-2">
              <a href="/categories" className="block text-deep-teal hover:text-deep-teal/80 underline">
                → Go to Categories Page
              </a>
              <a href="/search" className="block text-deep-teal hover:text-deep-teal/80 underline">
                → Go to Search Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 