import { Routes, Route } from "react-router-dom";
import SignUp from './SignUp';
import SignIn from './SignIn';
import AuthCheck from './AuthCheck';
import Assets from './Assets';
import Analytics from './Analytics';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthCheck />} />

      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/assets" element={<Assets />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  )
}

export default App
