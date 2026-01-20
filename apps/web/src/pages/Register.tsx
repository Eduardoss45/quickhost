import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { PasswordField } from '@/components/custom/PasswordField';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useUser } from '@/hooks/useUser';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/schemas/register.schema';
import type { RegisterFormData } from '@/schemas/register.schema';
import { Link } from 'react-router-dom';
import { BirthDatePicker } from '@/components/custom/datapickers/BirthDatePicker';

import bg from '../image/login.png';

function Register() {
  const { register: registerUser, loading } = useUser();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      birth_date: undefined as unknown as string,
      username: '',
      email: '',
      cpf: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = data => {
    registerUser(data);
  };

  return (
    <div className="flex flex-1 justify-center flex-row gap-24">
      <div className="w-full my-6">
        <h1 className="text-2xl font-bold">Cadastro</h1>
        <p>
          Já tem uma conta?{' '}
          <Link to="/login" className="underline decoration-current underline-offset-4 font-medium">
            Faça Login
          </Link>
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-1xl">Nome de usuário</FormLabel>
                  <FormControl>
                    <Input className="p-6" {...field} placeholder="Digite seu nome de usuário" />
                  </FormControl>
                  <div className="mb-6">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-1xl">Email</FormLabel>
                  <FormControl>
                    <Input className="p-6" type="email" {...field} />
                  </FormControl>
                  <div className="mb-6">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-1xl">CPF</FormLabel>
                  <FormControl>
                    <Input className="p-6" inputMode="numeric" {...field} />
                  </FormControl>
                  <div className="mb-6">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-1xl">Data de nascimento</FormLabel>

                  <FormControl>
                    <BirthDatePicker field={field} />
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
                <PasswordField label="Senha" placeholder="Digite sua senha" field={field} />
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-1xl mt-6">Confirmar senha</FormLabel>
                  <FormControl>
                    <Input className="p-6" type="password" {...field} />
                  </FormControl>
                  <div className="mb-6">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="bg-orange-400 py-5 px-8 text-white">
              {loading ? 'Aguarde...' : 'Finalizar'}
            </Button>
          </form>
        </Form>
      </div>

      <div className="w-full">
        <img
          className="w-full h-full object-cover"
          src={bg}
          alt="Imagem de um ambiente agradável"
        />
      </div>
    </div>
  );
}

export default Register;
