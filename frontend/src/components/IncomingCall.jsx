const IncomingCall = ({ caller, acceptCall, rejectCall }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">

      <div className="bg-base-200 p-6 rounded-xl text-center">
        <h2 className="text-xl font-bold mb-2">
          Incoming Call 📞
        </h2>

        <p className="mb-4">{caller?.fullName}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={acceptCall}
            className="bg-green-500 px-4 py-2 rounded"
          >
            Accept
          </button>

          <button
            onClick={rejectCall}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;