
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BibleVerse from '../components/ui/bible-verse';
import { Share2, Bookmark, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertBibleStudySchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const BibleStudies = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: studies, isLoading, refetch } = useQuery({
    queryKey: ['/api/bible-studies'],
  });

  const form = useForm({
    resolver: zodResolver(insertBibleStudySchema),
    defaultValues: {
      title: '',
      content: '',
      summary: '',
      imageUrl: '',
      bibleVerse: '',
      bibleReference: '',
      category: '',
      published: true
    }
  });

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await fetch('/api/bible-studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar estudo');
      }
      
      return response.json();
    }
  });

  const onSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        published: true
      };
      
      console.log('Enviando dados:', formData);
      
      await mutation.mutateAsync(formData);
      await refetch(); // Atualiza a lista após criar
      
      setDialogOpen(false);
      form.reset();
      
      toast({
        title: "Sucesso!",
        description: "Estudo bíblico publicado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao criar estudo:', error);
      toast({
        title: "Erro ao criar estudo",
        description: "Ocorreu um erro ao tentar criar o estudo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-16 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">Estudos Bíblicos</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Estudo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Estudo Bíblico</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o título do estudo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input placeholder="Cole o link da imagem" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bibleVerse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Versículo</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o versículo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bibleReference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referência</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: João 3:16" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumo</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite um breve resumo do estudo"
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite o conteúdo completo do estudo. Use links e formatação markdown se desejar."
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Novo Testamento, Doutrinas, etc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Publicar Estudo
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
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
