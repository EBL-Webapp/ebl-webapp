import { useState, useEffect } from "react";
import { getSession } from "../../../../getSession";
import { fetchColumnValue } from "../../../../fetchColumnValue";
import supabase from "../../../../supabase_client";

const AcknowledgementForm = () => {
  const [studentNumber, setStudentNumber] = useState("");
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
  const [submitButton, setSubmitButton] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState([]);
  const [isFormLoaded, setIsFormLoaded] = useState(false);

  const getStudentNum = async () => {
    const temp_session = await getSession();
    const temp_studentNum = await fetchColumnValue("Students", "userID", temp_session.session.user.id, "studentNumber");
    setStudentNumber(temp_studentNum);
  };

  const getSubmission = async () => {
    const { data, error } = await supabase
      .from("Acknowledgemet_of_Accountability_Form")
      .select("*")
      .eq("studentNumber", studentNumber)
      .eq("isArchived", false);

    if (error) {
      console.log("Error in retrieving past submissions");
      return;
    }

    if (data.length > 0) {
      setSubmitButton(true);
      setActiveSubmission(data);
      
      // Pre-fill form with existing data
      setFormData({
        roomNumber: data[0].roomNumber || "",
        roomKey: data[0].roomKey_propertyNumber || "",
        studyTable: data[0].studyTable_propertyNumber || "",
        jalousies: data[0].jalousies_propertyNumber || "",
        windowScreens: data[0].window_propertyNumber || "",
        bedfoam: data[0].bedfoam_propertyNumber || "",
        closet: data[0].closet_propertyNumber || "",
        closetDoorHandle: data[0].ClosetDoorHandle_propertyNumber || "",
        chair: data[0].chair_propertyNumber || "",
        semester: data[0].semester || "",
        studentSign: "Signed",
        parentSign: "Signed"
      });
    }
    
    setIsFormLoaded(true);
  };

  const updateForm = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();

    const { error } = await supabase
      .from("Acknowledgemet_of_Accountability_Form")
      .insert([{
        "studentNumber": studentNumber,
        roomNumber: formData.roomNumber,
        roomKey_propertyNumber: formData.roomKey,
        studyTable_propertyNumber: formData.studyTable,
        jalousies_propertyNumber: formData.jalousies,
        window_propertyNumber: formData.windowScreens,
        bedfoam_propertyNumber: formData.bedfoam,
        closet_propertyNumber: formData.closet,
        ClosetDoorHandle_propertyNumber: formData.closetDoorHandle,
        chair_propertyNumber: formData.chair,
        semester: formData.semester
      }]);

    if (error) {
      console.log("Error inserting data: ", error.message);
      return;
    } else {
      alert("Your information is now inserted!");
      setSubmitButton(true);
    }
  };

  useEffect(() => {
    getStudentNum();
  }, []);

  useEffect(() => {
    if (studentNumber) {
      getSubmission();
    }
  }, [studentNumber]);

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">
        Acknowledgement of Accountability Form
      </h2>
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
              className={`${submitButton ? 'cursor-not-allowed' : ''}`}
              value={formData.roomNumber}
              disabled={submitButton}
            />
            <div className="border-b border-gray-400" />
          </div>
          <div className="font-semibold">
            <p>What semester are you planning to stay?</p>
            <input
              name="semester"
              onChange={updateForm}
              className={`border-b p-2 mt-1 border-gray-400 w-[100%] ${submitButton ? 'cursor-not-allowed' : ''}`}
              placeholder="Choose 1 or 2"
              type="number"
              value={formData.semester}
              disabled={submitButton}
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
                <tr>
                  <td className="p-2 border border-gray-300">1</td>
                  <td className="p-2 border border-gray-300">pc</td>
                  <td className="p-2 border border-gray-300">Room key</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      required
                      onChange={updateForm}
                      type="text"
                      name="roomKey"
                      className={`w-full border px-2 py-1 border-gray-300 rounded-xl ${submitButton ? 'cursor-not-allowed opacity-50' : ''}`}
                      value={formData.roomKey}
                      disabled={submitButton}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-300">1</td>
                  <td className="p-2 border border-gray-300">unit</td>
                  <td className="p-2 border border-gray-300">Study Table</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      required
                      onChange={updateForm}
                      type="text"
                      name="studyTable"
                      className={`w-full border px-2 py-1 border-gray-300 rounded-xl ${submitButton ? 'cursor-not-allowed opacity-50' : ''}`}
                      value={formData.studyTable}
                      disabled={submitButton}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-300"></td>
                  <td className="p-2 border border-gray-300">pcs</td>
                  <td className="p-2 border border-gray-300">Jalousies (complete)</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      required
                      onChange={updateForm}
                      type="text"
                      name="jalousies"
                      className={`w-full border px-2 py-1 border-gray-300 rounded-xl ${submitButton ? 'cursor-not-allowed opacity-50' : ''}`}
                      value={formData.jalousies}
                      disabled={submitButton}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-300"></td>
                  <td className="p-2 border border-gray-300"></td>
                  <td className="p-2 border border-gray-300">Window Screens (no holes)</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      required
                      onChange={updateForm}
                      type="text"
                      name="windowScreens"
                      className={`w-full border px-2 py-1 border-gray-300 rounded-xl ${submitButton ? 'cursor-not-allowed opacity-50' : ''}`}
                      value={formData.windowScreens}
                      disabled={submitButton}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-300">1</td>
                  <td className="p-2 border border-gray-300">pc</td>
                  <td className="p-2 border border-gray-300">Bedfoam (cover has no stain)</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      required
                      onChange={updateForm}
                      type="text"
                      name="bedfoam"
                      className={`w-full border px-2 py-1 border-gray-300 rounded-xl ${submitButton ? 'cursor-not-allowed opacity-50' : ''}`}
                      value={formData.bedfoam}
                      disabled={submitButton}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-300">1</td>
                  <td className="p-2 border border-gray-300">unit</td>
                  <td className="p-2 border border-gray-300">Closet</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      required
                      onChange={updateForm}
                      type="text"
                      name="closet"
                      className={`w-full border px-2 py-1 border-gray-300 rounded-xl ${submitButton ? 'cursor-not-allowed opacity-50' : ''}`}
                      value={formData.closet}
                      disabled={submitButton}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-300">2</td>
                  <td className="p-2 border border-gray-300">pcs</td>
                  <td className="p-2 border border-gray-300">Closet door handle</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      required
                      onChange={updateForm}
                      type="text"
                      name="closetDoorHandle"
                      className={`w-full border px-2 py-1 border-gray-300 rounded-xl ${submitButton ? 'cursor-not-allowed opacity-50' : ''}`}
                      value={formData.closetDoorHandle}
                      disabled={submitButton}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-300">1</td>
                  <td className="p-2 border border-gray-300">pc</td>
                  <td className="p-2 border border-gray-300">Chair</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      required
                      onChange={updateForm}
                      type="text"
                      name="chair"
                      className={`w-full border px-2 py-1 border-gray-300 rounded-xl ${submitButton ? 'cursor-not-allowed opacity-50' : ''}`}
                      value={formData.chair}
                      disabled={submitButton}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6 text-xs sm:text-sm space-y-3">
          <p>
            I hereby acknowledge that I have received the above-mentioned items/properties in good condition. I am liable for any damages or loss and will return the said items/properties complete and in good condition upon my check-out at the end of each semester.
          </p>
          <p>
            In case of loss or damage, I will pay or exchange the items/properties with a new one:
          </p>
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
              className={`w-[100%] p-2 bg-gray-200 rounded-xl ${submitButton ? 'cursor-not-allowed opacity-50' : ''}`}
              value={formData.studentSign}
              disabled={submitButton}
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
              className={`w-[100%] p-2 bg-gray-200 rounded-xl ${submitButton ? 'cursor-not-allowed opacity-50' : ''}`}
              value={formData.parentSign}
              disabled={submitButton}
            />
            <span className="block text-center text-gray-600 mt-1">Parent should enter their own name to sign</span>
          </div>
        </div>

        <button
          disabled={submitButton}
          type="submit"
          className={`bg-[#4E0303] text-white sc-regular p-2 rounded-xl justify-end hover:bg-gray-500 ${submitButton ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AcknowledgementForm;