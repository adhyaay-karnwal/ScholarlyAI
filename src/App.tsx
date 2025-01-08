import { useState } from 'react';
import { Layout } from './components/layout';
import { TemplateGrid } from './components/template-grid';
import { Chat } from './components/chat';
import { TemplateProvider } from './contexts/template-context';

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <TemplateProvider>
      <Layout>
        {selectedTemplate ? (
          <Chat 
            templateId={selectedTemplate} 
            onBack={() => setSelectedTemplate(null)}
          />
        ) : (
          <TemplateGrid onSelect={setSelectedTemplate} />
        )}
      </Layout>
    </TemplateProvider>
  );
}

export default App;