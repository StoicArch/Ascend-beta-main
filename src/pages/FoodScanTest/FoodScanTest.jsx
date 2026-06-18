import React, { useState } from "react";
import FoodLogEngine from "../../engine/FoodLogEngine";

export default function FoodScanTest() {
    const [foodData, setFoodData] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

 const handleImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 700;
      const scale = maxWidth / img.width;

      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.65);
      const base64 = compressedDataUrl.split(",")[1];

      setImagePreview(compressedDataUrl);
      setImageBase64(base64);
    };

    img.src = reader.result;
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

      const parsedFood = JSON.parse(
  data.response
    .replace("```json", "")
    .replace("```", "")
);

setFoodData(parsedFood);

      console.log(data);

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

      {foodData && (
  <button
    onClick={() => {
      FoodLogEngine.saveMeal(foodData);
      alert("Meal Saved");

      alert(
  JSON.stringify(
    FoodLogEngine.getMeals(),
    null,
    2
  )
);
    }}


  >
    Save Meal
  </button>
)}
    </div>
  );
}