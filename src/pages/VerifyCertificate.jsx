import { useState } from "react";
import axios from "axios";


function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState(null);

  const verify = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/certificates/verify/${certificateId}/`
      );
      setResult(res.data);
    } catch {
      setResult({ valid: false });
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Verify Certificate</h2>

      <input
        placeholder="Enter Certificate ID"
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
        style={{ width: "300px" }}
      />

      <button onClick={verify} style={{ marginLeft: "10px" }}>
        Verify
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          {result.valid ? (
            <div>
              <p><strong>Status:</strong> ✅ Valid</p>
              <p><strong>Student:</strong> {result.student}</p>
              <p><strong>Course:</strong> {result.course}</p>
              <p><strong>Certificate ID:</strong> {result.certificate_id}</p>
            </div>
          ) : (
            <p style={{ color: "red" }}>❌ Invalid Certificate</p>
          )}
        </div>
      )}
    </div>
  );
}

export default VerifyCertificate;
