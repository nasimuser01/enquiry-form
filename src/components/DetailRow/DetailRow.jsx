import './DetailRow.css';

function DetailRow({ label, value }) {
  if (!value) return null; // gracefully skip empty values

  return (
    <>
      <dt className='detail-row__label'>{label}</dt>
      <dd className='detail-row__value'>{value}</dd>
    </>
  );
}

export default DetailRow;
