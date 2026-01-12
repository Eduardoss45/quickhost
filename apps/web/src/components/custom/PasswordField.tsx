import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type PasswordInputProps = {
  label: string;
  placeholder?: string;
  field: any;
};

export function PasswordField({ label, placeholder, field }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormItem>
      <FormLabel className="font-medium text-1xl">{label}</FormLabel>

      <FormControl>
        <div className="flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring shadow-xs">
          <Input
            {...field}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            className="flex-1 p-6 border-none outline-none ring-0 focus:ring-0 focus-visible:ring-0 shadow-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="px-3 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </FormControl>

      <FormMessage />
    </FormItem>
  );
}
