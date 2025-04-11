import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Estendendo o schema para validação adicional
const loginSchema = z.object({
  username: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  displayName: z.string().min(3, "O nome de exibição deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, navigate] = useLocation();

  // Redirecionar para a página inicial se já estiver autenticado
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      email: "",
      avatar: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      const { confirmPassword, ...registerData } = data;
      console.log("Enviando dados de registro:", registerData);
      await registerMutation.mutateAsync(registerData);
      toast({
        title: "Conta criada com sucesso!",
        description: "Por favor, verifique seu email para confirmar sua conta.",
      });
    } catch (error: any) {
      console.error("Erro no registro:", error);
      toast({
        title: "Erro ao criar conta",
        description: error?.message || "Erro ao tentar criar a conta",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Formulário */}
      <div className="md:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Igreja Batista Independente
            </CardTitle>
            <CardDescription className="text-center">
              Acesse sua conta ou crie uma nova para participar da nossa comunidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Usuário</Label>
                      <Input
                        id="login-username"
                        {...loginForm.register("username")}
                        placeholder="Seu nome de usuário"
                      />
                      {loginForm.formState.errors.username && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        {...loginForm.register("password")}
                        placeholder="Sua senha"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Usuário</Label>
                      <Input
                        id="register-username"
                        {...registerForm.register("username")}
                        placeholder="Escolha um nome de usuário"
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-displayname">Nome de Exibição</Label>
                      <Input
                        id="register-displayname"
                        {...registerForm.register("displayName")}
                        placeholder="Como você quer ser chamado"
                      />
                      {registerForm.formState.errors.displayName && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.displayName.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        {...registerForm.register("email")}
                        placeholder="Seu email"
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-avatar">Avatar (URL)</Label>
                      <Input
                        id="register-avatar"
                        {...registerForm.register("avatar")}
                        placeholder="URL da sua foto (opcional)"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        {...registerForm.register("password")}
                        placeholder="Escolha uma senha"
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-confirmpassword">Confirmar Senha</Label>
                      <Input
                        id="register-confirmpassword"
                        type="password"
                        {...registerForm.register("confirmPassword")}
                        placeholder="Confirme sua senha"
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        "Cadastrar"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Seção Hero */}
      <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 flex flex-col justify-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo à nossa comunidade online</h1>
          <p className="text-xl mb-6">
            "Igreja unida é uma igreja que avança"
          </p>
          <p className="mb-8">
            Junte-se à nossa família e participe de estudos bíblicos, fóruns de discussão, blog
            e fique por dentro de todos os eventos da nossa igreja.
          </p>
          <blockquote className="border-l-4 border-white pl-4 italic">
            "Tudo posso naquele que me fortalece." - Filipenses 4:13
          </blockquote>
        </div>
      </div>
    </div>
  );
}