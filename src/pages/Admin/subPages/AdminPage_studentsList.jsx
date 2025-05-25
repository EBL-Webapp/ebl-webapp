import React, { useEffect, useState } from 'react';
import supabase from '../../../supabase_client';
import StudentFullInfo from '../../../components/StudentFullInfo';

export default function AdminPage_studentsList() {
    const [studentsList, setStudentsList] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchByNameValue, setSearchByNameValue] = useState('');
    const [searchByStudentNumberValue, setSearchByStudentNumberValue] = useState('');
    const [isModalOpen_studentInfo, setModalOpen_studentInfo] = useState(false);
    const [selectedStudentNumber, setSelectedStudentNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchStudentsList = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("Students")
            .select("*")
            .eq("isArchived", false)
            .order("studentName");

        if (error) {
            console.log("Error fetching students list: ", error.message);
            setLoading(false);
            return;
        }

        setStudentsList(data);
        setFilteredStudents(data);
        console.log("Fetched students list: ", data);
        setLoading(false);
    }

    const searchByName = (e) => {
        e.preventDefault();
        
        if (!searchByNameValue.trim()) {
            setFilteredStudents(studentsList);
            return;
        }

        const filtered = studentsList.filter(student => 
            student.studentName?.toLowerCase().includes(searchByNameValue.toLowerCase())
        );
        
        setFilteredStudents(filtered);
        // Clear the other search field
        setSearchByStudentNumberValue('');
    };

    const searchByStudentNumber = (e) => {
        e.preventDefault();
        
        if (!searchByStudentNumberValue.trim()) {
            setFilteredStudents(studentsList);
            return;
        }

        const filtered = studentsList.filter(student => 
            student.studentNumber?.toLowerCase().includes(searchByStudentNumberValue.toLowerCase())
        );
        
        setFilteredStudents(filtered);
        // Clear the other search field
        setSearchByNameValue('');
    };

    const handleArchiveStudent = async (studentNumber) => {
        if (!confirm('Are you sure you want to archive this student?')) {
            return;
        }

        const { error } = await supabase
            .from("Students")
            .update({ isArchived: true })
            .eq("studentNumber", studentNumber);

        if (error) {
            console.log("Error archiving student: ", error.message);
            alert('Failed to archive student. Please try again.');
            return;
        }

        // Remove the archived student from the current list
        const updatedList = studentsList.filter(student => student.studentNumber !== studentNumber);
        setStudentsList(updatedList);
        
        // Re-apply current search filters
        let newFilteredList = updatedList;
        if (searchByNameValue.trim()) {
            newFilteredList = updatedList.filter(student => 
                student.studentName?.toLowerCase().includes(searchByNameValue.toLowerCase())
            );
        } else if (searchByStudentNumberValue.trim()) {
            newFilteredList = updatedList.filter(student => 
                student.studentNumber?.toLowerCase().includes(searchByStudentNumberValue.toLowerCase())
            );
        }
        setFilteredStudents(newFilteredList);

        console.log(`Student ${studentNumber} archived successfully`);
    };

    const handleViewStudent = (studentNumber) => {
        setSelectedStudentNumber(studentNumber);
        setModalOpen_studentInfo(true);
    };

    const clearSearch = () => {
        setSearchByNameValue('');
        setSearchByStudentNumberValue('');
        setFilteredStudents(studentsList);
    };

    useEffect(() => {
        fetchStudentsList();
    }, []);

    return (
        <div className='bg-white min-h-screen p-6'>
            <div className='max-w-6xl mx-auto'>
                <h1 className='text-2xl md:text-3xl font-bold text-black mb-6 zain-regular'>
                    Students Management
                </h1>

                {/* Search Section */}
                <div className='flex justify-center gap-3 zain-regular text-black max-md:my-5 max-md:mx-10 max-sm:flex-col mb-6'>
                    <div>
                        <form onSubmit={searchByName} className='max-md:flex max-md:flex-col'>
                            <input
                                type='text'
                                placeholder='Search by Name:'
                                value={searchByNameValue}
                                onChange={e => setSearchByNameValue(e.target.value)}
                                className='py-2 px-4 rounded-2xl border-2'
                            />
                            <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black'>
                                Search
                            </button>
                        </form>
                    </div>
                    <div>
                        <form onSubmit={searchByStudentNumber} className='max-md:flex max-md:flex-col'>
                            <input
                                type='text'
                                placeholder='Student Number:'
                                value={searchByStudentNumberValue}
                                onChange={e => setSearchByStudentNumberValue(e.target.value)}
                                className='py-2 px-4 rounded-2xl border-2'
                            />
                            <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black'>
                                Search
                            </button>
                        </form>
                    </div>
                    <div className='flex justify-around'>
                        <button 
                            onClick={clearSearch} 
                            className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black'
                        >
                            Clear Search
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className='mb-4 text-sm text-gray-600'>
                    Showing {filteredStudents.length} of {studentsList.length} students
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className='text-center py-8'>
                        <div className='text-gray-500'>Loading students...</div>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className='overflow-x-auto shadow-lg rounded-lg'>
                            <table className='w-full bg-white border border-gray-200'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                                            Student Number
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                                            Name
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                                            Assessment Status
                                        </th>
                                        <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className='px-6 py-8 text-center text-gray-500'>
                                                {(searchByNameValue || searchByStudentNumberValue) ? 'No students found matching your search.' : 'No students found.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student, index) => (
                                            <tr key={student.studentNumber} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                                    {student.studentNumber}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                    {student.studentName || 'N/A'}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        student.isAssessed 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {student.isAssessed ? 'Assessed' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-center'>
                                                    <div className='flex justify-center space-x-2'>
                                                        <button
                                                            onClick={() => handleViewStudent(student.studentNumber)}
                                                            className='bg-[#4E0303] hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200'
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleArchiveStudent(student.studentNumber)}
                                                            className='bg-[#4E0303] hover:bg-[#4E0303] text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200'
                                                        >
                                                            Archive
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Student Info Modal */}
                <StudentFullInfo 
                    isOpen={isModalOpen_studentInfo}
                    onClose={() => setModalOpen_studentInfo(false)}
                    studentNumber={selectedStudentNumber}
                />
            </div>
        </div>
    );
}