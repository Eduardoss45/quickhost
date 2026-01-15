import { useFormContext } from 'react-hook-form';
import { FormValues } from '@/schemas/accommodation-form.schema';

const UserForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div>
      <div className="form-control">
        <label htmlFor="name">Nome</label>
        <input type="text" id="name" placeholder="Digite o seu nome" {...register('name')} />
        {errors.name && <span className="error-message">{errors.name.message}</span>}
      </div>

      <div className="form-control">
        <label htmlFor="email">E-mail:</label>
        <input type="email" id="email" placeholder="Digite o seu e-mail" {...register('email')} />
        {errors.email && <span className="error-message">{errors.email.message}</span>}
      </div>
    </div>
  );
};

export default UserForm;
