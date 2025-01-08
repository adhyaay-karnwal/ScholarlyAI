import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Loader2, Upload } from 'lucide-react';
import { useTemplates } from '@/contexts/template-context';
import { cn } from '@/lib/utils';
import { chatWithGemini, templatePrompts } from '@/lib/gemini';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export function Chat({ 
  templateId, 
  onBack 
}: { 
  templateId: string;
  onBack: () => void;
}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { getTemplate } = useTemplates();
  const template = getTemplate(templateId);

  const getFormFields = () => {
    switch (templateId) {
      case 'resume-builder':
        return [
          { name: 'jobTitle', label: 'Desired Job Title' },
          { name: 'experience', label: 'Years of Experience' },
          { name: 'skills', label: 'Key Skills (comma separated)' },
          { name: 'education', label: 'Education Background' },
        ];
      case 'essay-generator':
        return [
          { name: 'topic', label: 'Essay Topic' },
          { name: 'type', label: 'Type of Essay (e.g., Argumentative, Expository)' },
          { name: 'length', label: 'Desired Length (words)' },
        ];
      case 'math-solver':
        return [
          { name: 'problem', label: 'Math Problem' },
          { name: 'subject', label: 'Subject (e.g., Algebra, Calculus)' },
        ];
      case 'lesson-planner':
        return [
          { name: 'subject', label: 'Subject' },
          { name: 'grade', label: 'Grade Level' },
          { name: 'duration', label: 'Lesson Duration' },
          { name: 'objectives', label: 'Learning Objectives' },
        ];
      case 'study-guide':
        return [
          { name: 'subject', label: 'Subject' },
          { name: 'topics', label: 'Key Topics (comma separated)' },
          { name: 'level', label: 'Academic Level' },
        ];
      default:
        return [];
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    setInput(prompt);
    await sendMessage(prompt);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd process the file here
      setMessages([
        { role: 'assistant', content: 'File upload functionality is coming soon! For now, please paste your text directly.' }
      ]);
    }
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || isLoading) return;

    const newMessages = [
      ...messages,
      { role: 'user' as const, content: messageText }
    ];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      if (template?.comingSoon) {
        setMessages([
          ...newMessages,
          { 
            role: 'assistant', 
            content: 'This template is coming soon! Please try another template or use the general chat.' 
          }
        ]);
        return;
      }

      const response = await chatWithGemini(
        messageText,
        templatePrompts[templateId as keyof typeof templatePrompts]
      );

      setMessages([
        ...newMessages,
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: 'Sorry, there was an error processing your request. Please try again.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4">
      <div className="mb-6 flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center space-x-2 hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Templates</span>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{template?.name}</h2>
          <p className="text-sm text-muted-foreground">
            {template?.description}
            {template?.comingSoon && " (Coming Soon)"}
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        {template?.format === 'form' && messages.length === 0 && (
          <Card className="p-6">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {getFormFields().map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [field.name]: e.target.value
                    }))}
                    required
                  />
                </div>
              ))}
              <Button type="submit" className="w-full">Generate</Button>
            </form>
          </Card>
        )}

        {template?.format === 'upload' && messages.length === 0 && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileUpload}
                  accept=".pdf,.txt,.doc,.docx"
                />
                <Label
                  htmlFor="file-upload"
                  className="flex flex-col items-center space-y-4 cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="font-medium">Upload a file or paste text</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, TXT, DOC up to 10MB
                    </p>
                  </div>
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-input">Or paste your text here</Label>
                <Textarea
                  id="text-input"
                  placeholder="Paste your text here..."
                  className="min-h-[200px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button 
                  onClick={() => sendMessage()} 
                  className="w-full"
                  disabled={!input.trim()}
                >
                  Summarize
                </Button>
              </div>
            </div>
          </Card>
        )}

        <ScrollArea className="h-[500px] rounded-lg border">
          <div className="p-4 space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  "flex max-w-[80%] rounded-lg px-4 py-2",
                  message.role === 'user'
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating response...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {(template?.format === 'chat' || messages.length > 0) && (
          <div className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={template?.comingSoon ? "This template is coming soon" : "Type your message..."}
              className="min-h-[60px]"
              disabled={template?.comingSoon}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button 
              size="icon" 
              onClick={() => sendMessage()}
              disabled={isLoading || template?.comingSoon || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}