import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MyTeam from './pages/MyTeam';
import TeamView from './pages/TeamView';
import EditTeam from './pages/EditTeam';
import AddMatch from './pages/AddMatch';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import EditMatch from './pages/EditMatch';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/create-team" element={<MyTeam />} />
          <Route path="/team/:teamId" element={<TeamView />} />
          <Route path="/team/:teamId/edit" element={<EditTeam />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/add-match" element={<AddMatch />} />
          <Route path="/matches/:matchId" element={<MatchDetail />} />
          <Route path="/matches/:matchId/edit" element={<EditMatch />} />
        </Routes>
      </main>
    </>
  );
}
