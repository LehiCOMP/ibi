import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { insertForumReplySchema } from '@shared/schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Extend the schema to add validation rules
const formSchema = insertForumReplySchema.extend({
  content: z.string().min(5, {
    message: "A resposta deve ter pelo menos 5 caracteres",
  }).max(1000, {
    message: "A resposta não pode exceder 1000 caracteres",
  }),
});

interface CreateReplyFormProps {
  topicId: number;
  onReplyCreated?: () => void;
}

const CreateReplyForm = ({ topicId, onReplyCreated }: CreateReplyFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicId,
      content: '',
      authorId: 1, // Default to admin user for now
    },
  });
  
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await apiRequest('POST', '/api/forum-replies', values);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Resposta enviada!",
        description: "Sua resposta foi publicada com sucesso.",
      });
      if (onReplyCreated) {
        onReplyCreated();
      }
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar resposta",
        description: error.message || "Ocorreu um erro ao enviar sua resposta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Escreva sua resposta aqui..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Resposta"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateReplyForm;
