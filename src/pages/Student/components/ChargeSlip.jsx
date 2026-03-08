import React, { useMemo } from 'react';
import { useGlobalContext } from '../../../context/GlobalContext';
import { useStaticCharges, useStudentAppliances } from '../../../hooks/usePayments';
import { useStudent } from '../../../hooks/useStudents';
import Loading from '../../../components/Loading';

const ChargeSlipSection = () => {
  const { studentNumber } = useGlobalContext();

  // 1. Fetch Student record (for Surplus/Deficit balance)
  const { data: studentInfo = {}, isLoading: isLoadingStudent } = useStudent(studentNumber);

  // 2. Fetch Static Charges (Rent, etc.)
  const { data: staticCharges = {}, isLoading: isLoadingCharges } = useStaticCharges();

  // 3. Fetch Student Appliances
  const { data: devices = [], isLoading: isLoadingDevices } = useStudentAppliances(studentNumber);

  const isLoading = isLoadingStudent || isLoadingCharges || isLoadingDevices;

  // Calculate Total
  const total = useMemo(() => {
    let sum = staticCharges.rent || 0; // Assuming 'rent' is the key for Dormitory Rental
    devices.forEach(device => {
      sum += (device.list_of_appliances?.cost || 0);
    });
    return sum;
  }, [staticCharges, devices]);

  if (isLoading) {
    return (
      <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 h-64 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6  font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">Charge Slip</h2>

      <div className="mb-6 text-xs sm:text-sm">
        <h3 className="font-semibold mb-2">For the following:</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Dormitory Rental:</span>
            <p className="w-40 border-b border-gray-400">{staticCharges.rent || 0}</p>
          </div>
          {/* <div className="flex justify-between">
            <span>Surcharge:</span>
            <div className="w-40 border-b border-gray-400" />
          </div> */}
          <div className="flex justify-between font-semibold">
            <span>Amount Due (May include missed payments):</span>
            <p className='w-40 border-b text-red-600'>{studentInfo.surplus_deficit_payment || 0}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 text-xs sm:text-sm">
        <h3 className="font-semibold mb-2">List of Appliances</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300">Item</th>
                <th className="p-2 border border-gray-300">QTY</th>
                <th className="p-2 border border-gray-300">AMT</th>
              </tr>
            </thead>
            <tbody>
              {devices.length > 0 ? devices.map((x, index) => (
                <tr key={index}>
                  <td className="p-2 border border-gray-300">{x.list_of_appliances?.applianceName || 'Unknown'}</td>
                  <td className="p-2 border border-gray-300">{x.quantity}</td>
                  <td className="p-2 border border-gray-300">{x.list_of_appliances?.cost || 0}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="text-center p-2">No Devices...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end font-semibold text-xs sm:text-sm">
        <span className="mr-2">TOTAL AMOUNT PER MONTH:</span>
        <p className="w-40 border-b border-gray-400 text-center">{total}</p>
      </div>
    </div>
  );
};

export default ChargeSlipSection;
