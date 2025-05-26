import {use, useEffect, useState} from 'react';
import { getSession } from '../../../getSession';
import { fetchColumnValue } from '../../../fetchColumnValue';
import supabase from '../../../supabase_client';

const ChargeSlipSection = () => {

  const [studentInfo, setStudentInfo] = useState({});
  const [devices, setDevices] = useState([]);
  const [total, setTotal] = useState(0);

  const getInfo = async () => {
    const session_temp = await getSession();
    const stud_num = await fetchColumnValue("Students", "userID", session_temp.session.user.id, "studentNumber")
    const {data , error} = await supabase
      .from("Students")
      .select("*")
      .eq("userID", session_temp.session.user.id);

    if(error){
      console.log("Error in getting student info: ", error.message);
      return;
    }

    const temp1 = data[0];

    // Next we'll get the rental
    const {data : data2, error : error2} = await supabase.from("staticCharge").select("charge").eq("staticChargeID", 1);
    if(error2){
      console.log("Error getting rent: ", error2.message);
      return;
    }

    const temp2 = data2[0];

    // Let's get their devices
    const {data : data3, error : error3} = await supabase.from("appliance_per_student").select("*, list_of_appliances (applianceName, cost)").eq("studentNumber", stud_num).neq("quantity", 0);
    if(error3){
      console.log("Error in getting the appliances")
    }

    setDevices(data3);
    let total = data2[0].charge; 
    data3.forEach((x) => total += x.list_of_appliances.cost);
    setTotal(total);
    
    setStudentInfo({...temp1, ...temp2});
  };

  useEffect(() => {
    getInfo();
  }, [])

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6  font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">Charge Slip</h2>



      <div className="mb-6 text-xs sm:text-sm">
        <h3 className="font-semibold mb-2">For the following:</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Dormitory Rental:</span>
            <p  className="w-40 border-b border-gray-400">{studentInfo.charge}</p>
          </div>
          {/* <div className="flex justify-between">
            <span>Surcharge:</span>
            <div className="w-40 border-b border-gray-400" />
          </div> */}
          <div className="flex justify-between font-semibold">
            <span>Amount Due (May include missed payments):</span>
            <p className='w-40 border-b-1'>{studentInfo.surplus_deficit_payment}</p>
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
                {devices.length > 0 ? devices.map((x) => (
                  <tr key={x.applianceOwned}>
                    <td className="p-2 border border-gray-300">{x.list_of_appliances.applianceName}</td>
                    <td className="p-2 border border-gray-300">{x.quantity}</td>
                    <td className="p-2 border border-gray-300">{x.list_of_appliances.cost}</td>
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
        <p className="w-40 border-b border-gray-400 text-center">{total || "hello"}</p>
      </div>
    </div>
  );
};

export default ChargeSlipSection;
