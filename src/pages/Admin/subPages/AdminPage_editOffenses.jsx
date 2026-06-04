import { useState, useEffect } from "react";
import Loading from '../../../components/Loading';
import PaginationControls from '../../../components/PaginationControls';
import { useGlobalContext } from '../../../context/GlobalContext';
import {
  useOffenseTypes,
  useStudentOffenses,
  useStudentsForOffenses,
  useCreateOffenseType,
  useCreateOffense,
  useUpdateOffense,
  useDeleteOffense,
} from '../../../hooks/useOffenses';
import { X, Search, PlusCircle, AlertTriangle, Trash2, Edit2 } from 'lucide-react';

 
const MessageModal = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm zain-regular text-black">
        <h3 className="text-xl font-semibold mb-4 text-[#114516]">{title}</h3>
        <p className="mb-6 text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-[#114516] text-white rounded-xl hover:bg-[#1e6a23] transition-colors duration-200 shadow-md"
        >
          OK
        </button>
      </div>
    </div>
  );
};

 
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm zain-regular text-black">
        <h3 className="text-xl font-semibold mb-4 text-red-600 flex items-center gap-2">
          <AlertTriangle size={20} /> Confirm Action
        </h3>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-around gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 bg-gray-200 text-black rounded-xl hover:bg-gray-300 transition-colors duration-200 shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 shadow-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

function AdminPage_editOffenses() {
  const { session } = useGlobalContext();
  const adminID = session?.session?.user?.id || 'Unknown';

  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(1);
  const [mainSearchTerm, setMainSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const rowsPerPage = 10;

  // Modals states
  const [specificStudentModal, setSpecificStudentModal] = useState(false);
  const [specificStudent, setSpecificStudent] = useState(null);
  const [isEditOffenseModal, setIsEditOffenseModal] = useState(false);
  const [addOffenseModal, setAddOffenseModal] = useState(false);
  const [showAddOffenseTypeModal, setShowAddOffenseTypeModal] = useState(false);

  // Form states
  const [offenseHighlight, setOffenseHighlight] = useState({
    offenseID: '',
    admin: '',
    offenseName: '',
    offensePkey: ''
  });

  // Add offense states (for step-by-step)
  const [addOffenseSearchTerm, setAddOffenseSearchTerm] = useState('');
  const [debouncedAddOffenseSearch, setDebouncedAddOffenseSearch] = useState('');
  const [addOffensePage, setAddOffensePage] = useState(1);
  const [specificStudentToAddOffense, setSpecificStudentToAddOffense] = useState(null);
  const [selectedOffenseTypeId, setSelectedOffenseTypeId] = useState('');
  const [steps, set_steps] = useState({ step1: true, step2: false });

  // Add offense type states
  const [newOffenseTypeName, setNewOffenseTypeName] = useState('');
  const [newOffenseSeverity, setNewOffenseSeverity] = useState('');

  // Message/Confirm modal states
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ title: '', message: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalAction, setConfirmModalAction] = useState(() => { });

  // Debounce the add-offense search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAddOffenseSearch(addOffenseSearchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [addOffenseSearchTerm]);

  // Fetch data
  const { data: studentsData, isLoading: isLoadingStudents } = useStudentsForOffenses(
    activeSearchTerm,
    currentPage,
    rowsPerPage
  );

  const { data: addOffenseStudentsData } = useStudentsForOffenses(
    debouncedAddOffenseSearch,
    addOffensePage,
    5
  );

  const { data: offenseTypes = [], isLoading: isLoadingOffenseTypes } = useOffenseTypes();

  const { data: studentOffenses = [] } = useStudentOffenses(
    specificStudent?.studentNumber
  );

  // Mutations
  const createOffenseTypeMutation = useCreateOffenseType();
  const createOffenseMutation = useCreateOffense();
  const updateOffenseMutation = useUpdateOffense();
  const deleteOffenseMutation = useDeleteOffense();

  const isLoading = isLoadingStudents || isLoadingOffenseTypes;

  const tableData = studentsData?.data || [];
  const totalRows = studentsData?.count || 0;

  // Modal Handlers
  const handleShowMessage = (title, message) => {
    setMessageModalContent({ title, message });
    setShowMessageModal(true);
  };

  const handleShowConfirm = (message, action) => {
    setConfirmModalMessage(message);
    setConfirmModalAction(() => action);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    setShowConfirmModal(false);
    confirmModalAction();
  };

  const handleMainSearch = () => {
    setCurrentPage(1);
    setActiveSearchTerm(mainSearchTerm);
  };

  const handleOpenSpecificStudent = (student) => {
    setSpecificStudent(student);
    setSpecificStudentModal(true);
  };

  const handleOpenEdit = (offense) => {
    setOffenseHighlight({
      offenseID: offense.offenceInstance,
      admin: offense.adminName,
      offenseName: offense.List_of_Offenses?.offenseName || '',
      offensePkey: offense.offenseID
    });
    setIsEditOffenseModal(true);
  };

  const editSpecificOffense = async (event) => {
    event.preventDefault();
    if (!offenseHighlight.offensePkey) {
      handleShowMessage("Validation Error", "Please select an offense type.");
      return;
    }

    try {
      await updateOffenseMutation.mutateAsync({
        offenseRecordID: offenseHighlight.offenseID,
        studentNumber: specificStudent?.studentNumber,
        data: {
          offenseID: offenseHighlight.offensePkey,
        }
      });
      handleShowMessage("Success", "Offense updated successfully!");
      setIsEditOffenseModal(false);
    } catch (error) {
      handleShowMessage("Error", "Error updating offense: " + error.message);
    }
  };

  const deleteSpecificOffense = async () => {
    handleShowConfirm("Are you sure you want to delete this offense?", async () => {
      try {
        await deleteOffenseMutation.mutateAsync({
          offenseRecordID: offenseHighlight.offenseID,
          studentNumber: specificStudent?.studentNumber
        });
        handleShowMessage("Success", "Offense deleted successfully!");
        setIsEditOffenseModal(false);
      } catch (error) {
        handleShowMessage("Error", "Error deleting offense: " + error.message);
      }
    });
  };

  const handleAddOffenseModal = () => {
    setAddOffenseModal(prev => {
      if (prev) {
        setAddOffenseSearchTerm('');
        setAddOffensePage(1);
        setSpecificStudentToAddOffense(null);
        setSelectedOffenseTypeId('');
        set_steps({ step1: true, step2: false });
      }
      return !prev;
    });
  };

  const handleSelectStudentForOffense = (student) => {
    setSpecificStudentToAddOffense(student);
    set_steps({ step1: false, step2: true });
  };

  const handleAddOffenseSubmit = async (event) => {
    event.preventDefault();
    if (!specificStudentToAddOffense || !selectedOffenseTypeId) {
      handleShowMessage("Error", "Please select both a student and an offense type.");
      return;
    }

    try {
      await createOffenseMutation.mutateAsync({
        studentNumber: specificStudentToAddOffense.studentNumber,
        offenseID: parseInt(selectedOffenseTypeId, 10), // Convert to integer
        adminID: adminID
      });
      handleShowMessage("Success", `Offense added for ${specificStudentToAddOffense.studentName}!`);
      handleAddOffenseModal();
    } catch (error) {
      const errorMsg = error?.message || error?.toString?.() || 'Unknown error occurred';
      console.error('Add offense error:', error);
      handleShowMessage("Error", "Failed to add offense: " + errorMsg);
    }
  };

  const handleAddOffenseTypeSubmit = async (event) => {
    event.preventDefault();
    if (!newOffenseTypeName.trim() || !newOffenseSeverity) return;

    try {
      await createOffenseTypeMutation.mutateAsync({
        offenseName: newOffenseTypeName.trim(),
        offenseCharge: newOffenseSeverity
      });
      handleShowMessage("Success", `Offense type "${newOffenseTypeName}" added!`);
      setShowAddOffenseTypeModal(false);
      setNewOffenseTypeName('');
      setNewOffenseSeverity('');
    } catch (error) {
      handleShowMessage("Error", "Failed to add offense type: " + error.message);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen font-sans">
      {(isLoading) && <Loading />}

      {showMessageModal && (
        <MessageModal
          title={messageModalContent.title}
          message={messageModalContent.message}
          onClose={() => setShowMessageModal(false)}
        />
      )}

      {showConfirmModal && (
        <ConfirmationModal
          message={confirmModalMessage}
          onConfirm={handleConfirmAction}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {/* Student Offenses Modal */}
      {specificStudentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-[#114516] text-white">
              <div>
                <h2 className="text-2xl font-bold">{specificStudent?.studentName}</h2>
                <p className="text-sm opacity-90">{specificStudent?.studentNumber}</p>
              </div>
              <button
                onClick={() => setSpecificStudentModal(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {studentOffenses.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <AlertTriangle size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No offenses recorded for this student.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {studentOffenses.map((offense) => (
                      <div key={offense.offenceInstance} className="bg-gray-50 border rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                        <div>
                          <h4 className="font-bold text-lg text-gray-800">{offense.List_of_Offenses?.offenseName}</h4>
                          <div className="flex gap-4 mt-1 text-sm text-gray-600">
                            <span>Severity: <span className="font-semibold text-red-600">{offense.List_of_Offenses?.offenseSeverity}</span></span>
                            <span>Recorded by: {offense.adminName || 'System'}</span>
                            <span>Date: {offense.timestamp ? new Date(offense.timestamp).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(offense)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Offense Modal */}
      {isEditOffenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-90 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6 text-[#114516]">Update Offense</h3>
            <form onSubmit={editSpecificOffense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offense Type</label>
                <select
                  value={String(offenseHighlight.offensePkey)}
                  onChange={(e) => setOffenseHighlight(prev => ({ ...prev, offensePkey: e.target.value }))}
                  className="w-full border-2 border-black rounded-xl px-4 py-2 text-black focus:ring-2 focus:ring-[#114516] outline-none"
                >
                  <option value="">Select an offense...</option>
                  {offenseTypes.map(t => (
                    <option key={t.offenseID} value={String(t.offenseID)}>{t.offenseName} ({t.offenseSeverity})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOffenseModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={deleteSpecificOffense}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Offense"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-[#114516] text-white rounded-xl hover:bg-[#1e6a23] transition-colors shadow-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Offense Modal */}
      {addOffenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-90 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 bg-[#114516] text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Add New Offense</h3>
              <button onClick={handleAddOffenseModal} className="hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-8">
              {steps.step1 && (
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search student by name or number..."
                      value={addOffenseSearchTerm}
                      onChange={(e) => { setAddOffenseSearchTerm(e.target.value); setAddOffensePage(1); }}
                      className="w-full pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#114516] outline-none shadow-sm"
                    />
                  </div>

                  <div className="min-h-75 border rounded-2xl overflow-hidden bg-gray-50">
                    <table className="w-full">
                      <thead className="bg-gray-100 text-xs text-gray-500 uppercase">
                        <tr>
                          <th className="px-4 py-3 text-left">Student</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {(addOffenseStudentsData?.data || []).map(student => (
                          <tr key={student.studentNumber} className="hover:bg-white">
                            <td className="px-4 py-3">
                              <p className="font-bold text-gray-800">{student.studentName}</p>
                              <p className="text-xs text-gray-500">{student.studentNumber}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleSelectStudentForOffense(student)}
                                className="text-[#114516] hover:bg-[#114516]/10 p-2 rounded-lg"
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <PaginationControls
                    currentPage={addOffensePage}
                    totalRows={addOffenseStudentsData?.count || 0}
                    rowsPerPage={5}
                    onPageChange={setAddOffensePage}
                  />
                </div>
              )}

              {steps.step2 && (
                <form onSubmit={handleAddOffenseSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-[#114516]/5 p-4 rounded-2xl border border-[#114516]/10">
                    <p className="text-sm font-medium text-[#114516]">Selected Student</p>
                    <p className="text-lg font-bold text-gray-800">{specificStudentToAddOffense?.studentName}</p>
                    <p className="text-sm text-gray-600 font-mono">{specificStudentToAddOffense?.studentNumber}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Offense Type</label>
                    <select
                      required
                      value={String(selectedOffenseTypeId)}
                      onChange={(e) => {
                        setSelectedOffenseTypeId(e.target.value);
                      }}
                      className="w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#114516] shadow-sm bg-white text-black"
                    >
                      <option value="">-- Choose Offense Type --</option>
                      {offenseTypes && offenseTypes.length > 0 ? (
                        offenseTypes.map(t => (
                          <option key={`offense-${t.offenseID}`} value={String(t.offenseID)}>{t.offenseName} ({t.offenseSeverity})</option>
                        ))
                      ) : (
                        <option disabled>No offense types available</option>
                      )}
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => set_steps({ step1: true, step2: false })}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedOffenseTypeId}
                      className="flex-2 py-3 bg-[#114516] text-white rounded-2xl font-bold hover:bg-[#1e6a23] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                    >
                      Submit Record
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Offense Types Modal */}
      {showAddOffenseTypeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-90 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#4E0303]">Manage Offense Types</h3>
              <button onClick={() => setShowAddOffenseTypeModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
            </div>

            {/* List of Possible Offenses */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Possible Offenses</h4>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-2xl p-3 bg-gray-50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="text-left pb-2 font-semibold">Offense Name</th>
                      <th className="text-right pb-2 font-semibold">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offenseTypes.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="text-center py-4 text-gray-400">No offense types configured.</td>
                      </tr>
                    ) : (
                      offenseTypes.map(t => (
                        <tr key={t.offenseID} className="border-b border-gray-100 last:border-0 hover:bg-gray-100/50">
                          <td className="py-2 text-gray-800">{t.offenseName}</td>
                          <td className="py-2 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              t.offenseSeverity === 'Major' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {t.offenseSeverity}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Form to Add New Offense Type */}
            <form onSubmit={handleAddOffenseTypeSubmit} className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase">Create New Offense Type</h4>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Offense Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Insubordination"
                  value={newOffenseTypeName}
                  onChange={(e) => setNewOffenseTypeName(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#4E0303] outline-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Severity</label>
                <select
                  required
                  value={newOffenseSeverity}
                  onChange={(e) => setNewOffenseSeverity(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#4E0303] outline-none shadow-sm bg-white"
                >
                  <option value="">Select Severity...</option>
                  <option value="Minor">Minor</option>
                  <option value="Major">Major</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#4E0303] text-white rounded-2xl font-bold hover:bg-red-800 transition-all shadow-lg active:scale-[0.98]"
              >
                Create Offense Type
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="marcellus-sc-regular text-[#114516] py-10 text-3xl md:text-5xl text-center md:text-left drop-shadow-sm">
          Offense Management
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search students..."
              value={mainSearchTerm}
              onChange={(e) => setMainSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMainSearch()}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#114516] shadow-sm transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleMainSearch}
              className="bg-[#114516] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#1e6a23] transition-all shadow-md active:scale-95"
            >
              Search
            </button>
            <button
              onClick={handleAddOffenseModal}
              className="flex items-center gap-2 bg-[#114516] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#16551b] transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <PlusCircle size={20} /> Record Offense
            </button>
            <button
              onClick={() => setShowAddOffenseTypeModal(true)}
              className="bg-transparent border-2 border-[#4E0303] text-[#4E0303] px-4 py-3 rounded-2xl font-bold hover:bg-[#4E0303] hover:text-white transition-all shadow-sm active:scale-95"
            >
              Manage Types
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#114516]/5">
                <tr>
                  <th className="px-8 py-5 text-left text-sm font-bold text-[#114516] uppercase tracking-wider">Student Number</th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-[#114516] uppercase tracking-wider">Full Name</th>
                  <th className="px-8 py-5 text-center text-sm font-bold text-[#114516] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoadingStudents ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-10 text-center"><Loading /></td>
                  </tr>
                ) : tableData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <Search size={64} />
                        <p className="text-xl">{activeSearchTerm ? 'No students match your search.' : 'Search for a student to manage offenses.'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tableData.map((student) => (
                    <tr key={student.studentNumber} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap font-mono text-gray-600">{student.studentNumber}</td>
                      <td className="px-8 py-5 whitespace-nowrap font-bold text-gray-800">{student.studentName}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleOpenSpecificStudent(student)}
                          className="px-6 py-2 bg-[#4E0303] text-white rounded-xl font-bold hover:bg-red-800 transition-all shadow-sm active:scale-95"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <PaginationControls
            rowsPerPage={rowsPerPage}
            totalRows={totalRows}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminPage_editOffenses;
