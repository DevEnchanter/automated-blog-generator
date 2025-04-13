import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';

export const useFormWithValidation = <T extends z.ZodType<any, any>>(
  schema: T,
  initialValues: z.infer<T>
) => {
  return useForm({
    initialValues,
    validate: zodResolver(schema),
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
  });
}; 