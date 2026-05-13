import { useSelector } from 'react-redux';
import EnquiryForm from './features/enquiry/EnquiryForm';
import EnquiryDisplay from './features/enquiry/EnquiryDisplay';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import './App.css';

function App() {
  const submitted = useSelector((state) => state.enquiry.submitted);

  return (
    <div className='app'>
      <Header />
      <main className='app-main'>
        {submitted ? <EnquiryDisplay /> : <EnquiryForm />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
