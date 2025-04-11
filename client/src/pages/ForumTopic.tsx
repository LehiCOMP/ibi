import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Eye, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { queryClient } from '@/lib/queryClient';
import CreateReplyForm from '../forms/CreateReplyForm';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ForumTopic = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data, isLoading } = useQuery({
    queryKey: [`/api/forum-topics/${id}`],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM, yyyy", { locale: ptBR });
  };
  
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/forum" className="flex items-center text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Voltar para o Fórum</span>
          </Link>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-4 bg-primary-light text-white">
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="p-6">
              <div className="flex items-start mb-4">
                <Skeleton className="w-10 h-10 rounded-full mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-4 bg-primary-light text-white flex justify-between items-center">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="divide-y divide-neutral-light">
              {Array(3).fill(0).map((_, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-start">
                    <Skeleton className="w-10 h-10 rounded-full mr-3" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-primary-light text-white">
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="p-6">
              <Skeleton className="h-20 w-full mb-4" />
              <div className="flex justify-end">
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.topic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-2xl text-primary mb-4">Tópico não encontrado</h2>
          <p className="mb-6">O tópico que você está buscando não existe ou foi removido.</p>
          <Link href="/forum" className="text-primary hover:text-primary-dark font-medium">
            Voltar para o Fórum
          </Link>
        </div>
      </div>
    );
  }

  const { topic, replies } = data;

  const handleReplyCreated = () => {
    queryClient.invalidateQueries({ queryKey: [`/api/forum-topics/${id}`] });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/forum" className="flex items-center text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Voltar para o Fórum</span>
        </Link>
        
        {/* Topic */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-4 bg-primary-light text-white">
            <h1 className="font-heading text-xl font-semibold">{topic.title}</h1>
          </div>
          
          <div className="p-6">
            <div className="flex items-start mb-4">
              <img 
                src={topic.author?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
                alt="Avatar do usuário" 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">{topic.author?.displayName || "Usuário"}</p>
                <p className="text-sm mb-4">{topic.content}</p>
                <div className="flex items-center text-xs text-neutral-dark">
                  <span>{formatDate(topic.createdAt)}</span>
                  <Separator orientation="vertical" className="mx-2 h-3" />
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {topic.views} visualizações
                  </span>
                  <Separator orientation="vertical" className="mx-2 h-3" />
                  <span className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {topic.replyCount} respostas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Replies */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-4 bg-primary-light text-white flex justify-between items-center">
            <h3 className="font-semibold">Respostas</h3>
            <span className="text-sm">{topic.replyCount} respostas</span>
          </div>
          
          <div className="divide-y divide-neutral-light">
            {replies && replies.length > 0 ? (
              replies.map((reply) => (
                <div key={reply.id} className="p-4">
                  <div className="flex items-start">
                    <img 
                      src={reply.author?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
                      alt="Avatar do usuário" 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <p className="font-medium">{reply.author?.displayName || "Usuário"}</p>
                        <span className="text-xs text-neutral-dark">{formatRelativeTime(reply.createdAt)}</span>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-dark">
                <p>Nenhuma resposta ainda. Seja o primeiro a responder!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Reply Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-primary-light text-white">
            <h3 className="font-semibold">Responder a este tópico</h3>
          </div>
          
          <div className="p-6">
            <CreateReplyForm topicId={parseInt(id)} onReplyCreated={handleReplyCreated} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumTopic;
