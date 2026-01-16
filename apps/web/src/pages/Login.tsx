import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUser } from '@/hooks/useUser';
import { loginSchema, LoginFormData } from '@/schemas/login.schema';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import bg from '../image/login.png';

function Login() {
  const { login, loading } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <div className="flex justify-center flex-row gap-24">
      <div className="w-1/2 my-6">
        <h1 className="text-2xl font-bold">Bem vindo(a) de volta!</h1>
        <p>
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="underline decoration-current underline-offset-4 font-medium"
          >
            Cadastrar-se
          </Link>
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-1xl">Email</FormLabel>
                  <FormControl>
                    <Input className="p-6" type="email" placeholder="Digite seu email" {...field} />
                  </FormControl>
                  <div className="mb-6">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-1xl">Senha</FormLabel>
                  <FormControl>
                    <div className="flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring shadow-xs">
                      <Input
                        className="flex-1 border-none outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none p-6 shadow-none"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="px-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </FormControl>
                  <div className="mb-6">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <p className="mb-3">
              Ao fazer login, você concorda com nossos{' '}
              <Link to="#" className="underline decoration-current underline-offset-4 font-medium">
                Termos de Serviço
              </Link>{' '}
              e de{' '}
              <Link to="#" className="underline decoration-current underline-offset-4 font-medium">
                Privacidade
              </Link>
              .
            </p>

            <Button type="submit" disabled={loading} className="bg-orange-400 py-5 px-8 text-white">
              {loading ? 'Carregando...' : 'Acessar'}
            </Button>
          </form>
        </Form>
      </div>
      <div className="w-1/2">
        <img
          className="w-full h-full object-cover"
          src={bg}
          alt="Imagem de uma casa grande e pessoas andando no jardim"
        />
      </div>
    </div>
  );
}

export default Login;
