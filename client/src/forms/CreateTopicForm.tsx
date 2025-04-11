import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { insertForumTopicSchema } from '@shared/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Extend the schema to add validation rules
const formSchema = insertForumTopicSchema.extend({
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres",
  }).max(100, {
    message: "O título não pode exceder 100 caracteres",
  }),
  content: z.string().min(20, {
    message: "A descrição deve ter pelo menos 20 caracteres",
  }).max(1000, {
    message: "A descrição não pode exceder 1000 caracteres",
  }),
});

interface CreateTopicFormProps {
  onTopicCreated?: () => void;
}

const CreateTopicForm = ({ onTopicCreated }: CreateTopicFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      authorId: 1, // Default to admin user for now
    },
  });
  
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await apiRequest('POST', '/api/forum-topics', values);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Tópico criado com sucesso!",
        description: "Seu tópico foi publicado no fórum.",
      });
      if (onTopicCreated) {
        onTopicCreated();
      }
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar tópico",
        description: error.message || "Ocorreu um erro ao criar o tópico. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título do seu tópico" {...field} />
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
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva seu tópico em detalhes..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            "Publicar Tópico"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateTopicForm;
