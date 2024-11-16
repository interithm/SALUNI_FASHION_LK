import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          {/* Outer spinning circle */}
          {/* <div className="absolute w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div> */}
          {/* Inner spinning circle */}
          <div className="absolute w-8 h-8 m-4 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">Processing Order</h2>
          <p className="text-gray-600">Please wait while we process your order...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;