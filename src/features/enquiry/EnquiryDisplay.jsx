import { useDispatch, useSelector } from 'react-redux';
import { resetEnquiry } from './enquirySlice';
import DetailRow from '../../components/DetailRow/DetailRow';
import Button from '../../components/Button/Button';

function EnquiryDisplay() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.enquiry);

  if (!data) return null;

  const handleNewEnquiry = () => {
    dispatch(resetEnquiry());
  };

  const formattedDate = new Date(data.submittedAt).toLocaleString('en-AU');

  return (
    <div className='enquiry-display'>
      <h2>✓ Enquiry Submitted Successfully</h2>
      <p>Thank you for your enquiry. We have received the following details:</p>

      <dl className='details'>
        <DetailRow label='Name' value={`${data.firstName} ${data.lastName}`} />
        <DetailRow label='Email' value={data.email} />
        <DetailRow label='Phone' value={data.phone} />
        <DetailRow label='Enquiry Type' value={data.enquiryType} />
        <DetailRow label='Message' value={data.message} />
        <DetailRow label='Submitted At' value={formattedDate} />
      </dl>

      <Button onClick={handleNewEnquiry} variant='primary'>
        Submit Another Enquiry
      </Button>
    </div>
  );
}

export default EnquiryDisplay;
