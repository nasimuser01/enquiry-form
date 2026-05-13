import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitEnquiry } from './enquirySlice';
import FormField from '../../components/FormField/FormField';
import Button from '../../components/Button/Button';

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  enquiryType: '',
  message: '',
};

const enquiryOptions = [
  { value: 'fines', label: 'Fines' },
  { value: 'taxes', label: 'Taxes' },
  { value: 'grants', label: 'Grants & Schemes' },
  { value: 'debt', label: 'Debt Recovery' },
  { value: 'other', label: 'Other' },
];

function EnquiryForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.enquiryType)
      newErrors.enquiryType = 'Please select an enquiry type';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    dispatch(
      submitEnquiry({ ...formData, submittedAt: new Date().toISOString() }),
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Customer Enquiry Form</h2>

      <FormField
        id='firstName'
        name='firstName'
        label='First Name'
        value={formData.firstName}
        onChange={handleChange}
        error={errors.firstName}
        required
      />

      <FormField
        id='lastName'
        name='lastName'
        label='Last Name'
        value={formData.lastName}
        onChange={handleChange}
        error={errors.lastName}
        required
      />

      <FormField
        id='email'
        name='email'
        label='Email'
        type='email'
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <FormField
        id='phone'
        name='phone'
        label='Phone'
        type='tel'
        value={formData.phone}
        onChange={handleChange}
      />

      <FormField
        id='enquiryType'
        name='enquiryType'
        label='Enquiry Type'
        type='select'
        value={formData.enquiryType}
        onChange={handleChange}
        error={errors.enquiryType}
        options={enquiryOptions}
        required
      />

      <FormField
        id='message'
        name='message'
        label='Message'
        type='textarea'
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        rows={5}
        required
      />

      <Button type='submit' variant='primary'>
        Submit Enquiry
      </Button>
    </form>
  );
}

export default EnquiryForm;
