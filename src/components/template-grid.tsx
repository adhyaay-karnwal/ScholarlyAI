import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTemplates } from '@/contexts/template-context';
import { Code2, Image, FileText, MessageSquare, Blocks, Bot } from 'lucide-react';

const iconMap = {
  code: Code2,
  image: Image,
  document: FileText,
  chat: MessageSquare,
  other: Blocks,
};

export function TemplateGrid({ onSelect }: { onSelect: (id: string) => void }) {
  const { templates } = useTemplates();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Templates</h1>
        <p className="text-muted-foreground">
          Choose from our collection of specialized AI templates
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const Icon = iconMap[template.type as keyof typeof iconMap] || Bot;
          return (
            <Card
              key={template.id}
              className="group relative overflow-hidden transition-all hover:shadow-lg cursor-pointer"
              onClick={() => onSelect(template.id)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  <Badge variant={template.new ? "default" : "secondary"}>
                    {template.comingSoon ? "Coming Soon" : template.new ? "New" : template.category}
                  </Badge>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}