import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Share2, Bookmark, Eye, MessageSquare, Calendar, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: post, isLoading } = useQuery({
    queryKey: [`/api/blog-posts/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="flex items-center text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Voltar para Blog</span>
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

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl text-primary mb-4">Postagem não encontrada</h2>
          <p className="mb-6">A postagem que você está buscando não existe ou foi removida.</p>
          <Link href="/blog" className="text-primary hover:text-primary-dark font-medium">
            Voltar para Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="flex items-center text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Voltar para Blog</span>
        </Link>
        
        {post.featured && (
          <div className="inline-block px-3 py-1 bg-accent text-white text-sm rounded-full mb-4">
            Destaque
          </div>
        )}
        
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">{post.title}</h1>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img 
              src="https://randomuser.me/api/portraits/women/65.jpg" 
              alt="Autora" 
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <p className="font-medium">Pastora Maria Silva</p>
              <div className="flex text-xs text-neutral-dark">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(post.createdAt).toLocaleDateString('pt-BR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {post.readTime} min de leitura
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
        
        {post.imageUrl && (
          <div className="mb-6">
            <img 
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        
        <div className="prose max-w-none mb-8">
          <p className="mb-4 text-lg">{post.summary}</p>
          
          <p>{post.content}</p>
          
          {/* This is a placeholder for the full content that would be stored in the database */}
          <h2>Desafios da era digital</h2>
          <p>
            Em um mundo cada vez mais conectado, as famílias enfrentam desafios únicos na criação de filhos e na manutenção de relacionamentos saudáveis. 
            O uso constante de dispositivos eletrônicos pode levar ao isolamento mesmo quando estamos fisicamente próximos.
          </p>
          
          <h3>Alguns desafios comuns incluem:</h3>
          <ul>
            <li>Tempo excessivo de tela que substitui interações familiares significativas</li>
            <li>Exposição a conteúdo inadequado ou prejudicial</li>
            <li>Comparações sociais que podem levar à insatisfação e baixa autoestima</li>
            <li>Distrações constantes durante momentos importantes de conexão familiar</li>
          </ul>
          
          <h2>Oportunidades para crescimento</h2>
          <p>
            No entanto, a tecnologia também oferece oportunidades incríveis para o fortalecimento das relações familiares quando usada com sabedoria:
          </p>
          <ul>
            <li>Aplicativos de devocionais que podem ser utilizados para momentos de estudo da Palavra em família</li>
            <li>Plataformas de comunicação que mantêm famílias conectadas mesmo quando fisicamente distantes</li>
            <li>Recursos educacionais que complementam o aprendizado espiritual</li>
            <li>Oportunidades para criar memórias através de projetos digitais compartilhados</li>
          </ul>
          
          <h2>Estabelecendo limites saudáveis</h2>
          <p>
            A chave para aproveitar os benefícios da tecnologia enquanto evitamos suas armadilhas está no estabelecimento de limites consistentes:
          </p>
          <ul>
            <li>Definir momentos livres de tecnologia, como refeições em família e horários antes de dormir</li>
            <li>Manter dispositivos eletrônicos em áreas comuns da casa, não em quartos privados</li>
            <li>Utilizar ferramentas de controle parental quando apropriado</li>
            <li>Modelar comportamentos saudáveis em relação ao uso de tecnologia como pais</li>
          </ul>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex items-center justify-between text-neutral-dark mb-6">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {post.views} visualizações
            </span>
            <span className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              24 comentários
            </span>
          </div>
          <div>
            <button className="flex items-center text-primary hover:text-primary-dark">
              <Share2 className="h-4 w-4 mr-1" />
              Compartilhar
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="font-heading text-xl font-semibold mb-4">Comentários</h3>
          
          <div className="mb-6">
            <div className="flex items-start mb-4">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Avatar do usuário" 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <div className="bg-neutral-lightest p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <p className="font-medium">Pedro Almeida</p>
                    <span className="text-xs text-neutral-dark">há 2 dias</span>
                  </div>
                  <p className="text-sm">
                    Excelente artigo! Realmente precisamos estar atentos a como a tecnologia afeta nossas famílias. Vou implementar algumas dessas sugestões em casa.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start mb-4 pl-12">
              <img 
                src="https://randomuser.me/api/portraits/women/65.jpg" 
                alt="Avatar do autor" 
                className="w-8 h-8 rounded-full mr-3"
              />
              <div className="flex-1">
                <div className="bg-neutral-lightest p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <p className="font-medium">Pastora Maria Silva</p>
                    <span className="text-xs text-neutral-dark">há 1 dia</span>
                  </div>
                  <p className="text-sm">
                    Obrigada, Pedro! Fico feliz que o artigo tenha sido útil. Compartilhe conosco depois como essas práticas funcionaram para sua família.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-lightest p-4 rounded-lg text-center">
            <p className="mb-2">Para comentar, você precisa estar logado.</p>
            <button className="text-primary font-medium">Fazer login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
