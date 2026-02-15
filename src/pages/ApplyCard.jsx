import { useState } from "react";
import { applyCard } from "../api/applicationApi";

const ApplyCard = () => {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    pan: "",
    email: "",
    income: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getErrorMessage = (err) => {
    if (!err) return "Failed to submit application";
    const resp = err.response?.data;
    if (!resp) return err.message || "Failed to submit application";
    if (typeof resp === 'string') return resp;
    if (typeof resp === 'object') return resp.message || JSON.stringify(resp);
    return String(resp);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.fullName) return "Full name is required";
    if (!form.dob) return "Date of birth is required";
    // age check
    const dobDate = new Date(form.dob);
    if (isNaN(dobDate.getTime())) return "Invalid date of birth";
    const ageDifMs = Date.now() - dobDate.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age < 18) return "Applicant must be at least 18 years old";

    if (!form.pan) return "PAN is required";
    const pan = form.pan.toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) return "PAN must be in format ABCDE1234F";

    if (!form.income) return "Annual income is required";
    const income = parseFloat(form.income);
    if (isNaN(income) || income <= 0) return "Annual income must be a positive number";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const clientValidationError = validate();
    if (clientValidationError) {
      setMessage(clientValidationError);
      return;
    }

    setLoading(true);
    try {
      // Map frontend fields to backend DTO expected fields
      const payload = {
        fullName: form.fullName,
        dob: form.dob, // ISO date string, backend expects LocalDate
        panNumber: form.pan.toUpperCase(),
        annualIncome: parseFloat(form.income),
      };

      const res = await applyCard(payload);
      setMessage(res?.message || "Application Submitted Successfully!");
      // optionally clear form
      setForm({ fullName: "", dob: "", pan: "", email: "", income: "" });
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div >
        <h1>Apply for Credit Card</h1>
        <p>Fill the form below to submit your application</p>
      </div>

      <div style={styles.resultCard}>
        <form onSubmit={handleSubmit} style={styles.form}>

          <h3 style={styles.sectionTitle}>Personal Information</h3>

          <div style={styles.infoGrid}>
            <div style={styles.formGroup}>
              <label>Full Name</label>
              <input
                name="fullName"
                placeholder="Ragul MKG"
                onChange={handleChange}
                required
                value={form.fullName}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                placeholder="dd-mm-yyyy"
                onChange={handleChange}
                required
                value={form.dob}
                style={styles.input}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label>PAN Number</label>
              <input name="pan" placeholder="ABCDE1234F" value={form.pan} onChange={handleChange} required style={{ ...styles.input, width: "100%" }} />
            </div>

          </div>

          <h3 style={styles.sectionTitle}>Financial Information</h3>

          <div style={styles.infoGrid}>
            <div style={styles.formGroup}>
              <label>Annual Income (₹)</label>
              <input
                type="number"
                name="income"
                placeholder="500000"
                onChange={handleChange}
                required
                value={form.income}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                onChange={handleChange}
                value={form.email}
                style={styles.input}
              />
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? "Submitting..." : "Submit Application →"}
            </button>
          </div>

          {message && <div style={{ marginTop: 12 }}>{message}</div>}

        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "40px",
  },
  hero: {
    marginBottom: "30px",
    background: "linear-gradient(135deg, #0f120a, #1e293b)",
    padding: "30px",
    borderRadius: "12px",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },
  resultCard: {
    backgroundColor: "#ffffff",
    padding: "35px",
    borderRadius: "14px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    maxWidth: "900px",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "10px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    width: "100%",
  },
  submitButton: {
    padding: "12px 28px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #1e40af)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(37,99,235,0.25)",
  },
};

export default ApplyCard;
