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

import { useUser } from '@/hooks/new/useUser';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/schemas/register.schema';
import type { RegisterFormData } from '@/schemas/register.schema';
import { Link } from 'react-router-dom';

import bg from '../image/login.png';

function Register() {
  const { register: registerUser, loading } = useUser();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      birth_date: undefined as unknown as Date,
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
    <div className="flex flex-1 justify-around flex-row gap-24">
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

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring shadow-xs">
                          <Button
                            type="button"
                            variant="ghost"
                            className="flex-1 justify-start text-left font-normal p-6 shadow-none hover:bg-transparent"
                          >
                            {field.value
                              ? format(new Date(field.value), 'dd/MM/yyyy')
                              : 'Selecione uma data'}
                          </Button>

                          <CalendarIcon className="mx-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0 bg-white shadow-md z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
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
