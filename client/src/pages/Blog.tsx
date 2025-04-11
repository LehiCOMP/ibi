import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, MessageSquare, ChevronRight } from 'lucide-react';

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/blog-posts'],
  });

  // Get featured post and other posts
  const featuredPost = posts?.find(post => post.featured);
  const regularPosts = posts?.filter(post => !post.featured);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">Blog</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Featured Blog Post */}
        {isLoading ? (
          <Card className="w-full overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Skeleton className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-8 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ) : featuredPost ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64 bg-neutral-light">
                <img 
                  src={featuredPost.imageUrl || "https://images.unsplash.com/photo-1560184611-ff3e53f00e8f?q=80&w=2070&auto=format&fit=crop"} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover"
                />
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
                <span className="text-white text-xs px-2 py-1 bg-accent rounded">Destaque</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/65.jpg" 
                  alt="Author" 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">Pastora Maria Silva</p>
                  <p className="text-xs text-neutral-dark">
                    {new Date(featuredPost.createdAt).toLocaleDateString('pt-BR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })} · {featuredPost.readTime} min de leitura
                  </p>
                </div>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">{featuredPost.title}</h3>
              <p className="text-neutral-dark mb-4">{featuredPost.summary}</p>
              <div className="flex justify-between items-center">
                <Link href={`/blog/${featuredPost.id}`} className="text-primary hover:text-primary-dark font-medium">
                  Continuar lendo
                </Link>
                <div className="flex text-neutral-medium text-sm">
                  <span className="flex items-center mr-3">
                    <Eye className="h-4 w-4 mr-1" />
                    {featuredPost.views}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    24
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Recent Blog Posts */}
        <div className="space-y-6">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <Skeleton className="sm:w-1/3 h-32 sm:h-auto" />
                  <CardContent className="sm:w-2/3 p-4">
                    <Skeleton className="h-3 w-48 mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            regularPosts?.slice(0, 3).map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-1/3 h-32 sm:h-auto bg-neutral-light">
                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="sm:w-2/3 p-4">
                  <div className="flex items-center text-xs text-neutral-dark mb-2">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('pt-BR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span className="mx-2">•</span>
                    <span>Pastor João Oliveira</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-neutral-dark text-sm mb-3 line-clamp-2">{post.summary}</p>
                  <div className="flex justify-between items-center">
                    <Link href={`/blog/${post.id}`} className="text-primary hover:text-primary-dark text-sm font-medium">
                      Ler mais
                    </Link>
                    <div className="flex space-x-1 text-neutral-medium">
                      <span className="text-xs flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        18
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* More Blog Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isLoading && regularPosts?.slice(3).map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-neutral-light">
              {post.imageUrl && (
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center text-xs text-neutral-dark mb-2">
                <span>
                  {new Date(post.createdAt).toLocaleDateString('pt-BR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
                <span className="mx-2">•</span>
                <span>{post.readTime} min de leitura</span>
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{post.title}</h3>
              <p className="text-neutral-dark text-sm mb-4">{post.summary}</p>
              <Link href={`/blog/${post.id}`} className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
                Ler mais
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;