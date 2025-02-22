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
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4 sm:mb-6">
        Verification Requests
      </h2>
      
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-blue-50 to-white"
            >
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-white-100 flex items-center justify-center">
                    <span className="text-blue-700 font-medium">
                      {request.studentName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                      {request.studentName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {request.projectName} • <span className="text-blue-600">{request.role}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {request.details}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button 
                    className="flex-1 sm:flex-none bg-green-500 text-white px-4 py-2 rounded-lg 
                             shadow-sm hover:bg-green-600 active:bg-green-700 transition-colors
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Approve
                  </button>
                  <button 
                    className="flex-1 sm:flex-none bg-red-500 text-white px-4 py-2 rounded-lg
                             shadow-sm hover:bg-red-600 active:bg-red-700 transition-colors
                             focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">No verification requests at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default VerificationRequests;
