import { useState, useEffect } from "react";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useAcknowledgementForm, useSubmitAcknowledgementForm } from "../../../../hooks/useStudents";
import Loading from "../../../../components/Loading";

const AcknowledgementForm = () => {
  const { studentNumber } = useGlobalContext();

  const { data: submissions = [], isLoading } = useAcknowledgementForm(studentNumber);
  const submitMutation = useSubmitAcknowledgementForm();

  const alreadySubmitted = submissions.length > 0;

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomKey: "",
    studyTable: "",
    jalousies: "",
    windowScreens: "",
    bedfoam: "",
    closet: "",
    closetDoorHandle: "",
    chair: "",
    semester: "",
    studentSign: "",
    parentSign: ""
  });

  // Pre-fill form if a submission already exists
  useEffect(() => {
    if (submissions.length > 0) {
      const existing = submissions[0];
      setFormData({
        roomNumber: existing.roomNumber || "",
        roomKey: existing.roomKey_propertyNumber || "",
        studyTable: existing.studyTable_propertyNumber || "",
        jalousies: existing.jalousies_propertyNumber || "",
        windowScreens: existing.window_propertyNumber || "",
        bedfoam: existing.bedfoam_propertyNumber || "",
        closet: existing.closet_propertyNumber || "",
        closetDoorHandle: existing.ClosetDoorHandle_propertyNumber || "",
        chair: existing.chair_propertyNumber || "",
        semester: existing.semester || "",
        studentSign: "Signed",
        parentSign: "Signed",
      });
    }
  }, [submissions]);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      await submitMutation.mutateAsync({ studentNumber, formData });
      alert("Your information is now inserted!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 h-64 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const disabled = alreadySubmitted;

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">
        Acknowledgement of Accountability Form
      </h2>
      {submitMutation.isPending && <Loading />}
      <form onSubmit={submitForm}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-6 text-xs sm:text-sm mt-6">
          <div>
            <p>Ask the dorm manager personally for this one</p>
            <span className="font-semibold">Room Number: </span>
            <input
              required
              type="text"
              name="roomNumber"
              placeholder="e.g. A47"
              onChange={updateForm}
              className={`${disabled ? 'cursor-not-allowed' : ''}`}
              value={formData.roomNumber}
              disabled={disabled}
            />
            <div className="border-b border-gray-400" />
          </div>
          <div className="font-semibold">
            <p>What semester are you planning to stay?</p>
            <input
              name="semester"
              onChange={updateForm}
              className={`border-b p-2 mt-1 border-gray-400 w-[100%] ${disabled ? 'cursor-not-allowed' : ''}`}
              placeholder="Choose 1 or 2"
              type="number"
              value={formData.semester}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="mb-6 text-xs sm:text-sm">
          <h3 className="font-semibold mb-2">List of Provided Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300">
              <thead className="bg-gray-100 text-xs sm:text-sm">
                <tr>
                  <th className="p-2 border border-gray-300">Quantity</th>
                  <th className="p-2 border border-gray-300">Unit</th>
                  <th className="p-2 border border-gray-300">Description</th>
                  <th className="p-2 border border-gray-300">Property Number (leave blank if not present)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { qty: "1", unit: "pc", desc: "Room key", name: "roomKey" },
                  { qty: "1", unit: "unit", desc: "Study Table", name: "studyTable" },
                  { qty: "", unit: "pcs", desc: "Jalousies (complete)", name: "jalousies" },
                  { qty: "", unit: "", desc: "Window Screens (no holes)", name: "windowScreens" },
                  { qty: "1", unit: "pc", desc: "Bedfoam (cover has no stain)", name: "bedfoam" },
                  { qty: "1", unit: "unit", desc: "Closet", name: "closet" },
                  { qty: "2", unit: "pcs", desc: "Closet door handle", name: "closetDoorHandle" },
                  { qty: "1", unit: "pc", desc: "Chair", name: "chair" },
                ].map((item) => (
                  <tr key={item.name}>
                    <td className="p-2 border border-gray-300">{item.qty}</td>
                    <td className="p-2 border border-gray-300">{item.unit}</td>
                    <td className="p-2 border border-gray-300">{item.desc}</td>
                    <td className="p-2 border border-gray-300">
                      <input
                        required
                        onChange={updateForm}
                        type="text"
                        name={item.name}
                        className={`w-full border px-2 py-1 border-gray-300 rounded-xl ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                        value={formData[item.name]}
                        disabled={disabled}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6 text-xs sm:text-sm space-y-3">
          <p>
            I hereby acknowledge that I have received the above-mentioned items/properties in good condition. I am liable for any damages or loss and will return the said items/properties complete and in good condition upon my check-out at the end of each semester.
          </p>
          <p>In case of loss or damage, I will pay or exchange the items/properties with a new one:</p>
          <ul className="ml-4 list-disc">
            <li>Room key – P60.00</li>
            <li>Jalousie – P100.00</li>
            <li>Closet door handle – P60.00</li>
            <li>Window Screens – P100.00</li>
            <li>Bedfoam stain – P300.00</li>
            <li>Chair – P500.00</li>
          </ul>
        </div>

        <div className="text-xs sm:text-sm">
          <div>
            <input
              onChange={updateForm}
              name="studentSign"
              type="text"
              placeholder="John Doe"
              className={`w-[100%] p-2 bg-gray-200 rounded-xl ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              value={formData.studentSign}
              disabled={disabled}
            />
            <span className="block text-center text-gray-600 mt-1">Enter your name to sign</span>
          </div>
        </div>

        <div className="gap-6 text-xs sm:text-sm mt-10">
          <div>
            <input
              onChange={updateForm}
              name="parentSign"
              type="text"
              placeholder="Mary Doe"
              className={`w-[100%] p-2 bg-gray-200 rounded-xl ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              value={formData.parentSign}
              disabled={disabled}
            />
            <span className="block text-center text-gray-600 mt-1">Parent should enter their own name to sign</span>
          </div>
        </div>

        <button
          disabled={disabled || submitMutation.isPending}
          type="submit"
          className={`bg-[#4E0303] text-white sc-regular p-2 rounded-xl justify-end hover:bg-gray-500 mt-4 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {submitMutation.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default AcknowledgementForm;