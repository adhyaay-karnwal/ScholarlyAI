import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from './mode-toggle';
import { Sparkles, Blocks } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6" />
              <span className="font-bold">Scholarly AI - By Adhyaay</span>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <ModeToggle />
            </div>
          </div>
        </header>
        <main className="container mx-auto py-6 px-4">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}