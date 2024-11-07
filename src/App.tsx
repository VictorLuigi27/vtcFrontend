import { BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Body from './components/Body/body';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        <Body/>

        <Routes>
          {/* Routes ici pour plus tard */}
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
