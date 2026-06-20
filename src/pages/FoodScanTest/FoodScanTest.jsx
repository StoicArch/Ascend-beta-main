import React, { useState } from "react";
import FoodLogEngine from "../../engine/FoodLogEngine";
import "./FoodScanTest.css";
import UserProfileEngine from "../../engine/UserProfileEngine";

export default function FoodScanTest() {
  const profile = UserProfileEngine.getProfile();

const todayCalories =
  FoodLogEngine.getTodayCalories();

const todayProtein =
  FoodLogEngine.getTodayProtein();

const caloriePercent = Math.min(
  100,
  Math.round(
    (todayCalories / profile.calories) * 100
  )
);

const proteinPercent = Math.min(
  100,
  Math.round(
    (todayProtein / profile.protein) * 100
  )
);
    const [foodData, setFoodData] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  
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

      
    } catch (err) {
     
    }

    setLoading(false);
  };

  return (
  <div className="food-page">

      <h1 className="food-title">
  AI Nutrition Scanner
</h1>

<p className="food-subtitle">
  Take a photo of your meal and let ASCEND estimate the calories and macros.
</p>

     <div className="upload-card">

  <input
    type="file"
    accept="image/*"
    capture="environment"
    onChange={handleImage}
  />

</div>

      {imagePreview && (
        <img
        className="food-preview"
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
      className="scan-btn"
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
        {loading ? "Testing..." : "LOG TODAY'S MEAL"}
      </button>

     
     {foodData && (

  <div className="food-result-card">

    <h2>
      {foodData.name || "Meal Detected"}
    </h2>

    <div className="macro-grid">

      <div>
        <span>Calories</span>
        <h3>{foodData.calories}</h3>
      </div>

      <div>
        <span>Protein</span>
        <h3>{foodData.protein}g</h3>
      </div>

      <div>
        <span>Carbs</span>
        <h3>{foodData.carbs}g</h3>
      </div>

      <div>
        <span>Fat</span>
        <h3>{foodData.fat}g</h3>
      </div>

    </div>

    <button
      className="save-meal-btn"
      onClick={() => {
        FoodLogEngine.saveMeal(foodData);
        alert("Meal Saved ✅");
      }}
    >
      Save Meal
    </button>

  </div>

)}

<div className="today-nutrition-card">

  <h2>
    Today's Nutrition
  </h2>

  <p>
    Calories
  </p>

  <div className="nutrition-bar">
    <div
      className="nutrition-fill"
      style={{
        width: `${caloriePercent}%`
      }}
    />
  </div>

  <h3>
    {todayCalories}/{profile.calories}
  </h3>

  <p>
    Protein
  </p>

  <div className="nutrition-bar">
    <div
      className="nutrition-fill"
      style={{
        width: `${proteinPercent}%`
      }}
    />
  </div>

  <h3>
    {todayProtein}/{profile.protein}g
  </h3>

</div>


    </div>
  );
}