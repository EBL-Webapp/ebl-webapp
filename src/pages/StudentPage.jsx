import { Routes, Route } from 'react-router-dom';
import Offenses from '../components/Offenses';
import StudentData from '../components/StudentData';
import HouseCouncilLink from '../components/HouseCouncilLink';

function StudentPage() {
  return (
    <div className="mt-10 text-center">
      <h1 className="text-3xl font-bold mb-8">Welcome to the Student Page</h1>
      <Routes>
        <Route path="offenses" element={<Offenses />} />
        <Route path="data" element={<StudentData />} />
        <Route path="house-council" element={<HouseCouncilLink />} />
      </Routes>
    </div>
  );
}

export default StudentPage;
