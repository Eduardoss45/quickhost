import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUser } from '@/hooks/new/useUser';
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
    <div>
      <div>
        <h1>Bem vindo(a) de volta!</h1>

        <p>
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Digite seu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        {...field}
                      />
                      <button type="button" onClick={togglePasswordVisibility}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p>
              Ao fazer login, você concorda com nossos <Link to="#">Termos de Serviço</Link> e de{' '}
              <Link to="#">Privacidade</Link>.
            </p>

            <Button type="submit" disabled={loading}>
              {loading ? 'Carregando...' : 'Fazer Login'}
            </Button>
          </form>
        </Form>
      </div>

      <div>
        <img src={bg} alt="Imagem de uma casa grande e pessoas andando no jardim" />
      </div>
    </div>
  );
}

export default Login;
