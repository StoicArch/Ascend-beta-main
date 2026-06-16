import React, { useState } from "react";

export default function FoodScanTest() {
  const [imagePreview, setImagePreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];

      setImagePreview(reader.result);
      setImageBase64(base64);
    };

    reader.readAsDataURL(file);
  };

  const testVision = async () => {
    if (!imageBase64 || loading) return;

    setLoading(true);
    setResult("");

    try {
      const response = await fetch(
        "https://ascend-backend-v27s.onrender.com/vision-test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imageBase64,
          }),
        }
      );

      const data = await response.json();

      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult("Vision test failed.");
    }

    setLoading(false);
  };

  return (
   <div
  style={{
    padding: "20px",
    paddingBottom: "120px",
    color: "white",
    minHeight: "100vh",
    overflowY: "auto",
  }}
>
      <h1>Food Scan Test</h1>

      <input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={handleImage}
/>

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Food preview"
          style={{
  width: "100%",
  maxWidth: "360px",
  maxHeight: "55vh",
  objectFit: "contain",
  marginTop: "20px",
  borderRadius: "16px",
}}
        />
      )}

      <button
        onClick={testVision}
        disabled={loading || !imageBase64}
        style={{
          display: "block",
          marginTop: "20px",
          padding: "12px 16px",
          borderRadius: "12px",
          fontWeight: "800",
        }}
      >
        {loading ? "Testing..." : "Test Vision"}
      </button>

      {result && (
        <pre
          style={{
            marginTop: "20px",
            whiteSpace: "pre-wrap",
            background: "#111",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}