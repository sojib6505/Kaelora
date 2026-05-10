import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "3rem 1.5rem" }}>
      <h1 style={{ fontSize: "96px", fontWeight: "500", lineHeight: "1", letterSpacing: "-4px", marginBottom: "0.5rem" }}>
        4<span style={{ color: "#D85A30" }}>0</span>4
      </h1>
      <div style={{ width: "48px", height: "3px", background: "#D85A30", borderRadius: "2px", margin: "0 auto 1.5rem" }}></div>
      <h2 style={{ fontSize: "22px", fontWeight: "500", marginBottom: "0.75rem" }}>পেজটি খুঁজে পাওয়া যায়নি</h2>
      <p style={{ fontSize: "15px", color: "#888", maxWidth: "360px", lineHeight: "1.7", marginBottom: "2rem" }}>
        আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে, নাম পরিবর্তন হয়েছে, অথবা এটি কখনো ছিল না।
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/" style={{ padding: "10px 24px", borderRadius: "8px", background: "#D85A30", color: "#fff", textDecoration: "none", fontWeight: "500" }}>
          🏠 হোমে ফিরুন
        </Link>
        <Link to="/shop" style={{ padding: "10px 24px", borderRadius: "8px", border: "1px solid #ddd", textDecoration: "none", fontWeight: "500" }}>
          🛍️ শপিং করুন
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;