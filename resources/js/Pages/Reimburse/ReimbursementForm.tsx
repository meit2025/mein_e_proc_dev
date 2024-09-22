import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia'; // Use Inertia for making requests

interface Props {
    csrf_token: string; // Add the csrf_token to the props interface
}

const ReimbursementForm: React.FC<Props> = ({ csrf_token }) => {
    const [formData, setFormData] = useState([
        {
            type: '',
            requester: '',
            remark: '',
            balance: '',
            receipt_date: '',
            start_date: '',
            end_date: '',
            start_balance_date: '',
            end_balance_date: '',
            currency: ''
        }
    ]);

    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedFormData = [...formData];
        updatedFormData[index][name] = value;
        setFormData(updatedFormData);
    };

    const addNewReimbursement = () => {
        setFormData([
            ...formData,
            {
                type: '',
                requester: '',
                remark: '',
                balance: '',
                receipt_date: '',
                start_date: '',
                end_date: '',
                start_balance_date: '',
                end_balance_date: '',
                currency: ''
            }
        ]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Use Inertia for POST request
        Inertia.post('/reimburse', formData, {
            headers: {
                'X-CSRF-TOKEN': csrf_token // Attach the CSRF token to the request header
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {formData.map((data, index) => (
                <div key={index}>
                    <h3>Reimbursement {index + 1}</h3>
                    <div>
                        <label>Type (Reimburse Type ID): </label>
                        <input
                            type="text"
                            name="type"
                            value={data.type}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                        />
                    </div>
                    <div>
                        <label>Requester (User NIP): </label>
                        <input
                            type="text"
                            name="requester"
                            value={data.requester}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                        />
                    </div>
                    <div>
                        <label>Remark: </label>
                        <input
                            type="text"
                            name="remark"                            
                            value={data.remark}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                        />
                    </div>
                    <div>
                        <label>Balance: </label>
                        <input
                            type="number"
                            name="balance"                            
                            value={data.balance}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                        />
                    </div>
                    <div>
                        <label>Receipt Date: </label>
                        <input
                            type="date"
                            name="receipt_date"
                            value={data.receipt_date}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                        />
                    </div>
                    <div>
                        <label>Start Date: </label>
                        <input
                            type="date"
                            name="start_date"
                            value={data.start_date}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                        />
                    </div>
                    <div>
                        <label>End Date: </label>
                        <input
                            type="date"
                            name="end_date"
                            value={data.end_date}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                        />
                    </div>
                    <div>
                        <label>Start Balance Date: </label>
                        <input
                            type="date"
                            name="start_balance_date"
                            value={data.start_balance_date}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                        />
                    </div>
                    <div>
                        <label>End Balance Date: </label>
                        <input
                            type="date"
                            name="end_balance_date"
                            value={data.end_balance_date}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                        />
                    </div>
                    <div>
                        <label>Currency (Code): </label>
                        <input
                            type="text"
                            name="currency"
                            value={data.currency}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                        />
                    </div>
                </div>
            ))}

            <button type="button" onClick={addNewReimbursement}>Add New Reimbursement</button>
            <br/>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ReimbursementForm;
