import { useFormContext } from 'react-hook-form';
import FormInput from '@/components/Input/formInput';
import { useEffect, useState } from 'react';

interface StructDropdown {
  id: string;
  tabel: string;
  name: string;
}

interface EntertainmentInput {
    date_entertaiment: string;
    place_entertaiment: string;
    address_entertaiment: string;
    type_entertaiment: string;
    name_dientertained: string;
    position_dientertained: string;
    name_company: string;
    type_business: string;
    type_activity: string;
  }

export const CustomeForm = () => {
    const { watch, getValues } = useFormContext();
    const category = watch('account_assignment_category');
    const dataInitial = getValues();
    const [data, setData] = useState(dataInitial.EBKN ?? [{ id: 0 }]);

    const addData = () => {
        const newData = [...data, { id: data.length + 1 }];
        setData(newData);
    };

  const [inputs, setInputs] = useState([
    {
      deletion_indicator:"",
      cost_center:"",
      item_number:"",
      purchase_requisition_number:"",
      order_number:"",
      asset_number:"",
      main_asset_number:"",
    },
  ]);

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      {
        deletion_indicator: "",
        cost_center: "",
        item_number: "",
        purchase_requisition_number: "",
        order_number: "",
        asset_number: "",
        main_asset_number: "",
      },
    ]);
  };

  const handleRemoveInput = (index:any) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    console.log
    setInputs(newInputs);
  };

  const handleInputChange = (index:any, event:any) => {
    const { name, value } = event.target;
    const newInputs = [...inputs];
    newInputs[index][name as keyof typeof newInputs[0]] = value;
    setInputs(newInputs);
  };

  const [inputsEntertaiment, setInputsEntertaiment] = useState<EntertainmentInput[]>([
    {
      date_entertaiment: '',
      place_entertaiment: '',
      address_entertaiment: '',
      type_entertaiment: '',
      name_dientertained: '',
      position_dientertained: '',
      name_company: '',
      type_business: '',
      type_activity: '',
    },
  ]);

  const handleAddInputEntertaiment = () => {
    setInputsEntertaiment([
      ...inputsEntertaiment,
      {
        date_entertaiment: '',
        place_entertaiment: '',
        address_entertaiment: '',
        type_entertaiment: '',
        name_dientertained: '',
        position_dientertained: '',
        name_company: '',
        type_business: '',
        type_activity: '',
      },
    ]);
  };

  const handleRemoveInputEntertaiment = (index: number) => {
    const newInputsEntertaiment = inputsEntertaiment.filter((_, i) => i !== index);
    setInputsEntertaiment(newInputsEntertaiment);
  };

  const handleInputChangeEntertaiment = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const newInputsEntertaiment = [...inputsEntertaiment];
    newInputsEntertaiment[index][name as keyof EntertainmentInput] = value;
    setInputsEntertaiment(newInputsEntertaiment);
  };

  return (
    <>
        <FormInput
            fieldLabel={'Short Text'}
            fieldName={'short_text'}
            isRequired={category === 'A' ? true : false}
            disabled={false}
            style={{
            }}
            type={'text'}
            placeholder={''}
            classNames={''}
        />

        <div className="w-full mt-8 border rounded-md shadow-md">
            <div className='p-4'>
                Purchase Requisition Item
            </div>
            {inputs.map((input, index) => (
            <div key={index} className="p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Form {index + 1}</h3>
                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        fieldLabel={'Short Text'}
                        fieldName={`EBKN[${index}].cost_center`}
                        isRequired={category === 'A' ? true : false}
                        disabled={false}
                        style={{}}
                        type={'text'}
                        placeholder={''}
                        classNames={''}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => handleRemoveInput(index)}
                    className="mt-4 bg-red-500 text-white p-2 rounded-md"
                >
                    Hapus Form
                </button>
            </div>
        ))}
        <button
            type="button"
            onClick={handleAddInput}
            className="mt-4 bg-blue-500 text-white p-2 m-4 rounded-md"
        >
            Tambah Form
        </button>
        </div>

    </>
  );
};

export default CustomeForm;
