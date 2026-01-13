import { useDropzone } from 'react-dropzone';
import { CiCamera } from 'react-icons/ci';
import { Button } from '../ui/button';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useUser } from '@/hooks/new/useUser';

interface Props {
  value?: File;
  onChange: (file?: File) => void;
  error?: string;
}

export function ProfileImageField({ value, onChange, error }: Props) {
  const { removeProfilePicture } = useUser();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: files => {
      if (files.length > 0) {
        onChange(files[0]);
      }
    },
  });

  const handleRemove = async () => {
    await removeProfilePicture();
    onChange(undefined);
  };

  return (
    <FormItem className="w-full">
      <FormLabel>Foto de Perfil</FormLabel>

      <FormControl>
        <div
          {...getRootProps()}
          className="border border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted"
        >
          <input {...getInputProps()} />
          <CiCamera size={48} className="mx-auto mb-2" />
          <p>
            {isDragActive ? 'Solte a imagem aqui' : value?.name || 'Clique ou arraste uma imagem'}
          </p>
        </div>
      </FormControl>

      {error && <FormMessage>{error}</FormMessage>}

      <Button
        className="py-4 bg-red-400 border-none text-white"
        type="button"
        variant="destructive"
        onClick={handleRemove}
      >
        Remover foto
      </Button>
    </FormItem>
  );
}
