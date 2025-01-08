import { createContext, useContext, ReactNode } from 'react';

type Template = {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  new?: boolean;
  comingSoon?: boolean;
  format?: 'chat' | 'form' | 'upload';
};

const templates: Template[] = [
  {
    id: 'general-chat',
    name: 'General Chat',
    description: 'Chat with AI about anything',
    type: 'chat',
    category: 'General',
    format: 'chat',
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    description: 'Get help with coding, debugging, and best practices',
    type: 'code',
    category: 'Development',
    format: 'chat',
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    description: 'Generate and edit images with AI',
    type: 'image',
    category: 'Creative',
    comingSoon: true,
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    description: 'Create professional resumes with AI guidance',
    type: 'document',
    category: 'Professional',
    format: 'form',
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    description: 'Generate blog posts, articles, and marketing copy',
    type: 'chat',
    category: 'Writing',
    format: 'chat',
  },
  {
    id: 'sql-expert',
    name: 'SQL Expert',
    description: 'Get help with database queries and optimization',
    type: 'code',
    category: 'Development',
    format: 'chat',
  },
  {
    id: 'essay-generator',
    name: 'Essay Generator',
    description: 'Generate well-structured essays with custom topics',
    type: 'document',
    category: 'Academic',
    format: 'form',
  },
  {
    id: 'math-solver',
    name: 'Math Solver',
    description: 'Get step-by-step solutions for math problems',
    type: 'education',
    category: 'Academic',
    format: 'form',
  },
  {
    id: 'lesson-planner',
    name: 'Lesson Planner',
    description: 'Create detailed lesson plans for any subject',
    type: 'education',
    category: 'Education',
    format: 'form',
  },
  {
    id: 'study-guide',
    name: 'Study Guide Creator',
    description: 'Generate comprehensive study guides and outlines',
    type: 'education',
    category: 'Academic',
    format: 'form',
  },
  {
    id: 'text-summarizer',
    name: 'Text Summarizer',
    description: 'Get AI-powered summaries of documents and texts',
    type: 'document',
    category: 'Productivity',
    format: 'upload',
  }
];

type TemplateContextType = {
  templates: Template[];
  getTemplate: (id: string) => Template | undefined;
};

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const getTemplate = (id: string) => templates.find(t => t.id === id);

  return (
    <TemplateContext.Provider value={{ templates, getTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplates() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
}