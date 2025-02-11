import React from 'react';

interface VerificationRequest {
  studentName: string;
  projectName: string;
  role: string;
  details: string;
}

interface VerificationRequestsProps {
  requests: VerificationRequest[];
}

const VerificationRequests: React.FC<VerificationRequestsProps> = ({ requests }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Verification Requests</h2>
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md bg-gradient-to-r from-yellow-50 to-white hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-gray-800">{request.studentName}</p>
                  <p className="text-gray-600">{request.projectName} - {request.role}</p>
                  <p className="text-sm text-gray-500 mt-2 mb-3">{request.details}</p>
                  <button className="bg-green-500 text-white px-4 py-2 mr-2 rounded-lg shadow-md hover:bg-green-600 transition-colors">
                    Approve
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No verification requests at the moment.</p>
      )}
    </div>
  );
};

export default VerificationRequests;
