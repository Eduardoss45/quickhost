import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PiArrowCircleLeftThin } from 'react-icons/pi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

import { PasswordField } from '@/components/custom/PasswordField';
import { ProfileImageField } from '@/components/custom/ProfileImageField';

import { configurationsSchema, ConfigurationsFormData } from '@/schemas/configurations.schema';

import useEdit from '../hooks/useEdit';

function Configurations() {
  const id_user = localStorage.getItem('id_user');
  const token = localStorage.getItem('token');

  const { fetchUserData, editUser } = useEdit(id_user, token);

  const form = useForm<ConfigurationsFormData>({
    resolver: zodResolver(configurationsSchema),
  });

  useEffect(() => {
    fetchUserData().then(data => form.reset(data));
  }, []);

  const onSubmit = async (data: ConfigurationsFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
    await editUser(formData);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <Link to="/" className="flex items-center gap-2 mb-4">
        <PiArrowCircleLeftThin />
        Voltar
      </Link>

      <h2 className="text-2xl font-bold mb-6">Minhas informações</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {[
            ['username', 'Nome Completo'],
            ['cpf', 'CPF'],
            ['birth_date', 'Data de Nascimento'],
            ['social_name', 'Nome Social'],
            ['email', 'Email'],
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
            name="password"
            render={({ field }) => (
              <PasswordField label="Senha" placeholder="Digite sua nova senha" field={field} />
            )}
          />

          <FormField
            control={form.control}
            name="profile_picture"
            render={({ field }) => (
              <ProfileImageField value={field.value} onChange={file => field.onChange(file)} />
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="reset" variant="outline" onClick={() => form.reset()}>
              Redefinir
            </Button>
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Configurations;
