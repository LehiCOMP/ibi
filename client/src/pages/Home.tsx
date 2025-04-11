import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ChevronRight, Book, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BibleVerse from '../components/ui/bible-verse';

const Home = () => {
  // Fetch featured content
  const { data: studies, isLoading: studiesLoading } = useQuery({
    queryKey: ['/api/bible-studies'],
  });
  
  const { data: blogPosts, isLoading: blogLoading } = useQuery({
    queryKey: ['/api/blog-posts'],
  });
  
  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['/api/forum-topics'],
  });
  
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/events'],
  });
  
  // Get the three most recent Bible studies
  const recentStudies = studies?.slice(0, 3);
  
  // Get featured blog post and recent posts
  const featuredPost = blogPosts?.find(post => post.featured);
  const recentPosts = blogPosts?.filter(post => !post.featured).slice(0, 3);
  
  // Get the three most recent forum topics
  const recentTopics = topics?.slice(0, 3);
  
  // Get the three upcoming events
  const upcomingEvents = events?.slice(0, 3);

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-primary text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Bem-vindo à nossa comunidade online</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Um espaço para fortalecer sua fé, compartilhar conhecimento e construir relacionamentos.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/estudos" className="bg-secondary hover:bg-secondary-dark text-neutral-darkest px-6 py-3 rounded-md font-medium transition">
              Explorar Estudos Bíblicos
            </Link>
            <Link href="/eventos" className="bg-white hover:bg-neutral-light text-primary px-6 py-3 rounded-md font-medium transition">
              Ver Próximos Eventos
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Highlight Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Highlight Card - Bible Studies */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-primary-light flex items-center justify-center">
                <Book className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold mb-2">Estudos Bíblicos</h3>
                <p className="text-neutral-dark mb-4">Aprofunde seu conhecimento com nossos estudos semanais e recursos.</p>
                <Link href="/estudos" className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
                  Ver estudos
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Highlight Card - Forum */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-accent flex items-center justify-center">
                <MessageSquare className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold mb-2">Fórum de Discussão</h3>
                <p className="text-neutral-dark mb-4">Participe de conversas enriquecedoras com nossa comunidade.</p>
                <Link href="/forum" className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
                  Participar agora
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Highlight Card - Events */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-secondary flex items-center justify-center">
                <Calendar className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold mb-2">Eventos</h3>
                <p className="text-neutral-dark mb-4">Fique por dentro dos próximos eventos e atividades da igreja.</p>
                <Link href="/eventos" className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
                  Ver calendário
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Bible Studies Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary">Estudos Bíblicos</h2>
            <Link href="/estudos" className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
              Ver todos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studiesLoading ? (
              // Skeleton loading state
              Array(3).fill(0).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))
            ) : (
              recentStudies?.map((study) => (
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        <button aria-label="Salvar" className="p-1 hover:text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-secondary py-10 md:py-16 mb-12 rounded-lg">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-darkest mb-4">Faça parte da nossa comunidade</h2>
            <p className="text-neutral-darkest mb-8 max-w-2xl mx-auto">Junte-se a nós em nossos cultos presenciais ou participe online. Estamos ansiosos para conhecê-lo e caminhar juntos na fé.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/eventos" className="bg-white hover:bg-neutral-light text-primary px-6 py-3 rounded-md font-medium transition">
                Horários de Culto
              </Link>
              <Link href="/" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition">
                Entre em Contato
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
