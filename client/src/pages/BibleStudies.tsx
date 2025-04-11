import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BibleVerse from '../components/ui/bible-verse';
import { Share2, Bookmark } from 'lucide-react';

const BibleStudies = () => {
  const { data: studies, isLoading } = useQuery({
    queryKey: ['/api/bible-studies'],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">Estudos Bíblicos</h1>
      
      <div className="mb-8">
        <p className="text-lg text-neutral-dark max-w-3xl">
          Explore nossa coleção de estudos bíblicos que abordam diversos temas e livros da Bíblia. 
          Aprofunde seu conhecimento da palavra de Deus e fortaleça sua fé.
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studies?.map((study) => (
            <div key={study.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 bg-neutral-light">
                {study.imageUrl && (
                  <img 
                    src={study.imageUrl} 
                    alt={study.title} 
                    className="w-full h-full object-cover"
                  />
                )}
                {study.category && (
                  <div className="absolute top-0 right-0 m-3 px-2 py-1 bg-secondary text-xs text-neutral-darkest rounded">
                    {study.category}
                  </div>
                )}
              </div>
              <div className="p-6">
                <span className="text-xs text-neutral-dark">
                  Publicado em {new Date(study.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <h3 className="font-heading text-xl font-semibold my-2">{study.title}</h3>
                {study.bibleVerse && (
                  <BibleVerse reference={study.bibleReference}>
                    "{study.bibleVerse}"
                  </BibleVerse>
                )}
                <p className="text-neutral-dark mb-4 text-sm">{study.summary}</p>
                <div className="flex justify-between items-center">
                  <Link href={`/estudos/${study.id}`} className="text-primary hover:text-primary-dark font-medium">
                    Ler mais
                  </Link>
                  <div className="flex space-x-1 text-neutral-medium">
                    <button aria-label="Compartilhar" className="p-1 hover:text-primary">
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button aria-label="Salvar" className="p-1 hover:text-primary">
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BibleStudies;
