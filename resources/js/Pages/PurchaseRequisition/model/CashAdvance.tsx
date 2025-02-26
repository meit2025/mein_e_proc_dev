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
  const currency_from = useWatch({
    name: 'currency_from',
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
    const totalSum = winnerUnit.reduce(
      (sum: number, item: any) => sum + parseInt(item.total_amount),
      0,
    );
    setValue('total_all_amount', totalSum);

    const highestAmount = winnerUnit.reduce((max: number, item: any) => {
      return item.unit_price > max ? parseInt(item.unit_price) : max;
    }, 0);
    setValue('amount_max', highestAmount);

    const data = (parseInt(value) / 100) * parseInt(total);
    setValue('cash_advance_purchases.nominal', data);
  };

  useEffect(() => {
    if (total > 0) {
      const data = (parseInt(watch('cash_advance_purchases.dp')) / 100) * parseInt(total);
      setValue('cash_advance_purchases.nominal', data);
    }
  }, [total]);

  useEffect(() => {
    if (currency_from !== 'IDR') {
      setValue('is_cashAdvance', false);
      setValue('entertainment.jenis_kegiatan', '');
      setValue('cash_advance_purchases.dp', '');
      setValue('cash_advance_purchases.reference', '');
      setValue('cash_advance_purchases.nominal', '');
    }
  }, [currency_from]);

  return (
    <div>
      {currency_from === 'IDR' && (
        <>
          <FormSwitch
            fieldLabel='cash Advance'
            fieldName={'is_cashAdvance'}
            isRequired={false}
            disabled={disable}
          />
          {watchIsCashAdvance && (
            <>
              <hr></hr>
              <FormInput
                fieldLabel={'Persantase DP Number'}
                fieldName={'cash_advance_purchases.dp'}
                isRequired={true}
                disabled={disable}
                type={'number'}
                placeholder={'Persantase DP Number'}
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
        </>
      )}
    </div>
  );
};
export default CashAdvance;
