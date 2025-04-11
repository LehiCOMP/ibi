import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Share2, Bookmark, Clock, Calendar } from 'lucide-react';
import BibleVerse from '../components/ui/bible-verse';

const StudyDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: study, isLoading } = useQuery({
    queryKey: [`/api/bible-studies/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/estudos" className="flex items-center text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Estudos Bíblicos
          </Link>
          
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-10 rounded-full mr-2" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          
          <Skeleton className="h-60 w-full mb-6" />
          
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5 mb-6" />
          
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl text-primary mb-4">Estudo não encontrado</h2>
          <p className="mb-6">O estudo que você está buscando não existe ou foi removido.</p>
          <Link href="/estudos" className="text-primary hover:text-primary-dark font-medium">
            Voltar para Estudos Bíblicos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/estudos" className="flex items-center text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para Estudos Bíblicos
        </Link>
        
        {study.category && (
          <div className="inline-block px-3 py-1 bg-secondary text-neutral-darkest text-sm rounded-full mb-4">
            {study.category}
          </div>
        )}
        
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">{study.title}</h1>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img 
              src="https://randomuser.me/api/portraits/men/42.jpg" 
              alt="Author" 
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <p className="font-medium">Pastor João Oliveira</p>
              <div className="flex text-xs text-neutral-dark">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(study.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  10 min de leitura
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button aria-label="Compartilhar" className="p-1 text-neutral-dark hover:text-primary transition">
              <Share2 className="h-5 w-5" />
            </button>
            <button aria-label="Salvar" className="p-1 text-neutral-dark hover:text-primary transition">
              <Bookmark className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {study.imageUrl && (
          <div className="mb-6">
            <img 
              src={study.imageUrl}
              alt={study.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        
        {study.bibleVerse && (
          <BibleVerse reference={study.bibleReference} className="text-lg mb-6">
            "{study.bibleVerse}"
          </BibleVerse>
        )}
        
        <div className="prose max-w-none">
          <p className="mb-4">{study.content}</p>
          
          {/* This is a placeholder for the full content that would be stored in the database */}
          <h2>Introdução</h2>
          <p>
            As parábolas eram histórias simples com profundo significado espiritual que Jesus utilizava para transmitir verdades importantes de maneira acessível a todos. 
            Através dessas narrativas do cotidiano, ele tornava conceitos complexos do Reino de Deus compreensíveis para seus ouvintes.
          </p>
          
          <h2>Por que Jesus falava em parábolas?</h2>
          <p>
            Jesus utilizava parábolas por diversos motivos:
          </p>
          <ul>
            <li>Para tornar mensagens profundas acessíveis a pessoas de todos os níveis de entendimento</li>
            <li>Para provocar reflexão e questionamento nos ouvintes</li>
            <li>Para cumprir profecias que indicavam que o Messias falaria por parábolas</li>
            <li>Para ocultar verdades daqueles que endureciam seus corações, enquanto revelava aos que tinham fé</li>
          </ul>
          
          <h2>Aplicações para hoje</h2>
          <p>
            As parábolas de Jesus continuam relevantes para nossos dias. Elas nos ensinam sobre:
          </p>
          <ul>
            <li>O valor infinito do Reino de Deus</li>
            <li>A importância do perdão e da misericórdia</li>
            <li>Nossa responsabilidade de usar bem os dons que recebemos</li>
            <li>A necessidade de vigilância e preparação para a volta de Cristo</li>
          </ul>
        </div>
        
        <div className="mt-8 pt-6 border-t border-neutral-light">
          <h3 className="font-heading text-xl font-semibold mb-4">Compartilhe suas reflexões</h3>
          <p className="text-neutral-dark mb-4">
            Este estudo foi útil para você? Compartilhe suas reflexões ou perguntas nos comentários abaixo.
          </p>
          <div className="bg-neutral-lightest p-4 rounded-lg text-center">
            <p className="mb-2">Para comentar, você precisa estar logado.</p>
            <button className="text-primary font-medium">Fazer login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyDetail;
