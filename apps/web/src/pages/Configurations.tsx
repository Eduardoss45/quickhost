import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateUserPayload } from '@/types';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { PasswordField } from '@/components/custom/PasswordField';
import { BirthDatePicker } from '@/components/custom/BirthDatePicker';
import { ProfileImageField } from '@/components/custom/ProfileImageField';
import { configurationsSchema, ConfigurationsFormData } from '@/schemas/configurations.schema';
import { TfiClose } from 'react-icons/tfi';

function Configurations() {
  const { user, updateProfile } = useUser();

  const form = useForm<ConfigurationsFormData>({
    resolver: zodResolver(configurationsSchema),
    defaultValues: {
      username: '',
      email: '',
      cpf: '',
      birth_date: '',
      social_name: '',
      phone_number: '',
      password: '',
      profile_picture: undefined,
    },
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      username: user.username ?? '',
      email: user.email ?? '',
      cpf: user.cpf ?? '',
      birth_date: user.birth_date ?? '',
      social_name: user.social_name ?? '',
      phone_number: user.phone_number ?? '',
      password: '',
      profile_picture: undefined,
    });
  }, [user, form]);

  const onSubmit = async (data: ConfigurationsFormData) => {
    const payload: UpdateUserPayload = {};
    (['username', 'cpf', 'birth_date', 'social_name', 'phone_number'] as const).forEach(key => {
      const value = data[key];
      if (value) payload[key] = value;
    });

    await updateProfile(
      payload,
      data.profile_picture instanceof File ? data.profile_picture : undefined
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <Link to="/" className="flex items-center gap-2 mb-4">
        <TfiClose className="text-3xl" />
      </Link>

      <h2 className="text-2xl font-bold mb-6">Minhas informações</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {[
            ['username', 'Nome Completo'],
            ['cpf', 'CPF'],
            ['social_name', 'Nome Social'],
            ['phone_number', 'Telefone'],
          ].map(([name, label]) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof ConfigurationsFormData}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input {...field} className="p-6 w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de nascimento</FormLabel>
                <FormControl>
                  <BirthDatePicker field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    value={user?.email ?? ''}
                    disabled
                    className="p-6 w-full opacity-70 cursor-not-allowed"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Senha</FormLabel>
            <Button
              className="py-4 bg-orange-400 border-none text-white"
              type="button"
              variant="outline"
            >
              Solicitar redefinição de senha
            </Button>
          </FormItem>

          <FormField
            control={form.control}
            name="profile_picture"
            render={({ field }) => (
              <ProfileImageField value={field.value} onChange={file => field.onChange(file)} />
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              className="py-4 bg-blue-600 border-none text-white"
              type="reset"
              variant="outline"
              onClick={() => form.reset()}
            >
              Redefinir
            </Button>
            <Button className="py-4 bg-green-600 border-none text-white" type="submit">
              Salvar alterações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Configurations;
