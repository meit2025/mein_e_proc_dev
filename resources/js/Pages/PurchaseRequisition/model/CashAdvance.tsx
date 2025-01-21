import FormAutocomplete from '@/components/Input/formDropdown';
import FormInput from '@/components/Input/formInput';
import FormSwitch from '@/components/Input/formSwitch';
import { useContext, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const CashAdvance = ({ disable }: { disable: boolean }) => {
  const { getValues, setValue, watch } = useFormContext();
  const [isWinner, setIsWinner] = useState(true);
  const watchIsCashAdvance = useWatch({
    name: 'is_cashAdvance',
  });

  const vendor = useWatch({
    name: 'vendors',
  });

  const getWinner = (vendor: any) => {
    if (!Array.isArray(vendor)) return null;
    return vendor.find((item: any) => item && item.winner === true);
  };

  useEffect(() => {
    const winner = getWinner(vendor);
    if (winner) {
      setIsWinner(false);
    } else {
      setIsWinner(true);
    }
  }, [vendor]);

  const total = watch('total_all_amount');

  const dataAmaout = (value: any) => {
    console.log(value);
    // get persentase dp
    const dataVendorArray = getValues('vendors').filter(
      (item: any) => (item.winner || false) === true,
    );
    const dataVendor = dataVendorArray.length > 0 ? dataVendorArray[0] : null;
    const winnerUnit = dataVendor.units || [];
    const totalSum = winnerUnit.reduce((sum: number, item: any) => sum + item.total_amount, 0);
    setValue('total_all_amount', totalSum);

    const data = (parseInt(value) / 100) * parseInt(total);
    setValue('cash_advance_purchases.nominal', data);
  };

  useEffect(() => {
    if (total > 0) {
      const data = (parseInt(watch('cash_advance_purchases.dp')) / 100) * parseInt(total);
      setValue('cash_advance_purchases.nominal', data);
    }
  }, [total]);

  return (
    <div>
      <FormSwitch
        fieldLabel='cash Advance'
        fieldName={'is_cashAdvance'}
        isRequired={false}
        disabled={disable}
      />
      {watchIsCashAdvance && (
        <>
          <hr></hr>
          {/* <FormAutocomplete<any>
            options={[
              {
                label: '50%',
                value: '50',
              },
              {
                label: '40%',
                value: '40',
              },
              {
                label: '30%',
                value: '30',
              },
              {
                label: '20%',
                value: '20',
              },
              {
                label: '10%',
                value: '10',
              },
            ]}
            fieldLabel={'Persantase DP'}
            fieldName={'cash_advance_purchases.dp'}
            isRequired={true}
            disabled={disable}
            style={{
              width: '56.5rem',
            }}
            placeholder={'Persantase DP Number'}
            classNames='mt-2'
            onChangeOutside={(value, data) => dataAmaout(value)}
          /> */}
          <FormInput
            fieldLabel={'Persantase DP Number'}
            fieldName={'cash_advance_purchases.dp'}
            isRequired={false}
            disabled={disable}
            type={'number'}
            placeholder={'Enter reference'}
            maxLength={100}
            minLength={1}
            onChanges={(data) => dataAmaout(data.target.value)}
          />
          <FormInput
            fieldLabel={'reference'}
            fieldName={'cash_advance_purchases.reference'}
            isRequired={false}
            disabled={disable}
            type={'text'}
            placeholder={'Enter reference'}
          />
          <FormInput
            fieldLabel={'amount cashadvance'}
            fieldName={'cash_advance_purchases.nominal'}
            isRequired={true}
            disabled={true}
            type={'number'}
            placeholder={'Enter amount cashadvance'}
            isRupiah={true}
            note={isWinner ? 'Please Chose The Propose Vendor' : ''}
          />
        </>
      )}
    </div>
  );
};
export default CashAdvance;
