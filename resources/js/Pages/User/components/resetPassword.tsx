import FormMapping from '@/components/form/FormMapping';
import { EDIT_USER_PASSWORD } from '@/endpoint/user/api';
import { LIST_PAGE_USER } from '@/endpoint/user/page';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import { useForm } from 'react-hook-form';

const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    texttype: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
  },
  {
    type: 'input',
    texttype: 'password',
    name: 'password_confirmation',
    label: 'Confirmation Password',
    placeholder: 'Enter your password',
    required: true,
  },
];

function ResetPassword({ id }: { id: number }) {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        <div className='card-body'>
          <FormMapping
            methods={methods}
            formModel={formModel}
            url={`${EDIT_USER_PASSWORD}/${id}`}
            redirectUrl={LIST_PAGE_USER}
          />
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
