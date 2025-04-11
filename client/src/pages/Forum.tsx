import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import CreateTopicForm from '../forms/CreateTopicForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Forum = () => {
  const { data: topics, isLoading, refetch } = useQuery({
    queryKey: ['/api/forum-topics'],
  });
  
  const [displayCount, setDisplayCount] = useState(5);
  const [open, setOpen] = useState(false);
  
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5);
  };
  
  const handleTopicCreated = () => {
    setOpen(false);
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">Fórum de Discussão</h1>
      
      <div className="mb-8">
        <p className="text-lg text-neutral-dark max-w-3xl">
          Participe de discussões sobre diversos temas relacionados à fé, teologia e vida cristã.
          Compartilhe suas experiências e aprenda com outros membros da comunidade.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 bg-primary-light text-white flex justify-between items-center">
          <h3 className="font-semibold">Discussões Recentes</h3>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-primary hover:bg-neutral-light">
                Iniciar Nova Discussão
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl font-heading">Iniciar Nova Discussão</DialogTitle>
              </DialogHeader>
              <CreateTopicForm onTopicCreated={handleTopicCreated} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="divide-y divide-neutral-light">
          {isLoading ? (
            Array(5).fill(0).map((_, index) => (
              <Card key={index} className="rounded-none shadow-none border-0">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="md:w-8/12">
                      <div className="flex items-start">
                        <Skeleton className="w-10 h-10 rounded-full mr-3" />
                        <div className="flex-1">
                          <Skeleton className="h-6 w-4/5 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    </div>
                    <div className="flex md:w-4/12 mt-4 md:mt-0 justify-between md:justify-end md:space-x-8">
                      <Skeleton className="h-12 w-16" />
                      <Skeleton className="h-12 w-16" />
                      <Skeleton className="h-12 w-24 hidden md:block" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            topics?.slice(0, displayCount).map((topic) => (
              <div key={topic.id} className="p-4 flex flex-col md:flex-row md:items-center transition hover:bg-neutral-lightest">
                <div className="md:w-8/12">
                  <div className="flex items-start">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Avatar do usuário" 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-medium text-lg">
                        <Link href={`/forum/${topic.id}`} className="hover:text-primary">
                          {topic.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-neutral-dark mb-2 line-clamp-1">{topic.content}</p>
                      <div className="flex items-center text-xs text-neutral-dark">
                        <span>Iniciado por Pedro Almeida</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(topic.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex md:w-4/12 mt-4 md:mt-0 justify-between md:justify-end md:space-x-8">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">{topic.replyCount}</div>
                    <div className="text-xs text-neutral-dark">Respostas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">{topic.views}</div>
                    <div className="text-xs text-neutral-dark">Visualizações</div>
                  </div>
                  <div className="text-center hidden md:block">
                    <div className="text-sm text-neutral-dark">Última resposta</div>
                    <div className="text-xs text-neutral-dark">
                      {topic.lastReplyAt ? new Date(topic.lastReplyAt).toLocaleDateString('pt-BR') : 'Sem respostas'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {topics && displayCount < topics.length && (
          <div className="p-4 bg-neutral-lightest flex justify-center">
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary-dark font-medium"
              onClick={handleLoadMore}
            >
              Carregar mais tópicos
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="font-heading text-xl font-semibold mb-4">Diretrizes do Fórum</h3>
        <ul className="list-disc pl-5 space-y-2 text-neutral-dark">
          <li>Seja respeitoso com todos os membros da comunidade.</li>
          <li>Evite linguagem ofensiva ou conteúdo inapropriado.</li>
          <li>Mantenha as discussões relacionadas aos temas da comunidade.</li>
          <li>Não compartilhe informações pessoais de terceiros sem permissão.</li>
          <li>Os moderadores reservam-se o direito de remover qualquer conteúdo que viole estas diretrizes.</li>
        </ul>
      </div>
    </div>
  );
};

export default Forum;
