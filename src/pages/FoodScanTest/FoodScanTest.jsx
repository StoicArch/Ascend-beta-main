import React, { useMemo, useState } from "react";
import FoodLogEngine from "../../engine/FoodLogEngine";
import "./FoodScanTest.css";
import UserProfileEngine from "../../engine/UserProfileEngine";
import PremiumEngine from "../../engine/PremiumEngine";
import DashboardCoachEngine from "../../engine/DashboardCoachEngine";

export default function FoodScanTest() {
  const profile = UserProfileEngine.getProfile();
  const isPremium = PremiumEngine.isPremium();
  const [, setMeals] = useState(FoodLogEngine.getMeals());
  const [manualText, setManualText] = useState("");
  const [foodData, setFoodData] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);

  const todayMeals = FoodLogEngine.getTodayMeals();
  const todayTotals = FoodLogEngine.getDailyTotals();
  const recommendations = DashboardCoachEngine.getNutritionRecommendations();
  const mealHistory = FoodLogEngine.getHistoryByDate();
  const historyDates = Object.keys(mealHistory).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const caloriePercent = Math.min(
    100,
    Math.round((todayTotals.calories / Number(profile.calories || 1)) * 100)
  );

  const proteinPercent = Math.min(
    100,
    Math.round((todayTotals.protein / Number(profile.protein || 1)) * 100)
  );

  const previewMeal = useMemo(() => {
    if (!manualText.trim()) return null;
    return FoodLogEngine.estimateMeal(manualText.trim());
  }, [manualText]);

  const refreshMeals = (updatedMeals) => {
    setMeals(updatedMeals || FoodLogEngine.getMeals());
  };

  const saveManualMeal = () => {
    if (!manualText.trim()) {
      alert("Enter a meal first.");
      return;
    }

    refreshMeals(FoodLogEngine.saveManualMeal(manualText.trim()));
    setManualText("");
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file || !isPremium) return;

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDimension = 1024;
        const scale = Math.min(
          1,
          maxDimension / Math.max(img.width, img.height)
        );

        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
        const base64 = compressedDataUrl.split(",")[1];

        setImagePreview(compressedDataUrl);
        setImageBase64(base64);
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const scanFood = async () => {
    if (!imageBase64 || loading || !isPremium) return;

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
        data.response.replace("```json", "").replace("```", "")
      );

      setFoodData({
        ...parsedFood,
        source: "scanner",
      });
    } catch (err) {
      alert("Scanner could not read this meal. Log it manually instead.");
    }

    setLoading(false);
  };

  const saveScannedMeal = () => {
    if (!foodData) return;

    refreshMeals(FoodLogEngine.saveMeal(foodData));
    setFoodData(null);
    setImagePreview("");
    setImageBase64("");
  };

  const deleteMeal = (meal) => {
    if (!FoodLogEngine.canEditMeal(meal)) return;
    refreshMeals(FoodLogEngine.deleteMeal(meal.id));
  };

  const renameMeal = (meal) => {
    if (!FoodLogEngine.canEditMeal(meal)) return;
    const name = prompt("Meal name", meal.name);
    if (!name) return;
    refreshMeals(FoodLogEngine.updateMeal(meal.id, { name }));
  };

  return (
    <div className="food-page">
      <div className="food-header">
        <div>
          <h1 className="food-title">Nutrition</h1>
          <p className="food-subtitle">
            Log meals manually for free, scan food with Premium, and track
            daily macros.
          </p>
        </div>
      </div>

      <div className="today-nutrition-card">
        <h2>Today's Nutrition</h2>

        <p>Calories</p>
        <div className="nutrition-bar">
          <div
            className="nutrition-fill"
            style={{ width: `${caloriePercent}%` }}
          />
        </div>
        <h3>
          {todayTotals.calories}/{profile.calories} kcal
        </h3>

        <p>Protein</p>
        <div className="nutrition-bar">
          <div
            className="nutrition-fill"
            style={{ width: `${proteinPercent}%` }}
          />
        </div>
        <h3>
          {todayTotals.protein}/{profile.protein}g
        </h3>

        <div className="macro-grid">
          <div>
            <span>Carbs</span>
            <h3>{todayTotals.carbs}g</h3>
          </div>
          <div>
            <span>Fat</span>
            <h3>{todayTotals.fat}g</h3>
          </div>
        </div>
      </div>

      <div className="manual-log-card">
        <h2>Manual Food Logging</h2>
        <p>Type meals like Rice and chicken, 2 eggs, 1 cup milk, or 2 slices bread.</p>

        <div className="manual-row">
          <input
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Rice and chicken"
          />
          <button onClick={saveManualMeal}>Log Meal</button>
        </div>

        {previewMeal && (
          <div className="food-result-card compact">
            <h3>{previewMeal.name}</h3>
            <div className="macro-grid">
              <div>
                <span>Calories</span>
                <h3>{previewMeal.calories}</h3>
              </div>
              <div>
                <span>Protein</span>
                <h3>{previewMeal.protein}g</h3>
              </div>
              <div>
                <span>Carbs</span>
                <h3>{previewMeal.carbs}g</h3>
              </div>
              <div>
                <span>Fat</span>
                <h3>{previewMeal.fat}g</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="recommendation-card">
        <h2>AI Nutrition Recommendations</h2>
        {recommendations.map((item, index) => {
          const locked = !isPremium && index > 0;

          return (
            <div
              className={locked ? "recommendation-item blurred" : "recommendation-item"}
              key={item.type}
            >
              <span>{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.message}</p>
              {locked && <button onClick={() => window.location.href = "/premium"}>Unlock Premium</button>}
            </div>
          );
        })}
      </div>

      <div className="scanner-card">
        <h2>AI Food Scanner</h2>
        {isPremium ? (
          <>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImage}
            />

            {imagePreview && (
              <img className="food-preview" src={imagePreview} alt="Food preview" />
            )}

            <button
              className="scan-btn"
              onClick={scanFood}
              disabled={loading || !imageBase64}
            >
              {loading ? "Scanning..." : "Scan Meal"}
            </button>
          </>
        ) : (
          <div className="premium-lock-card">
            <h3>Scanner Locked</h3>
            <p>Premium members can scan meals. Manual logging stays free.</p>
            <button onClick={() => window.location.href = "/premium"}>
              Unlock Premium
            </button>
          </div>
        )}
      </div>

      {foodData && (
        <div className="food-result-card">
          <h2>{foodData.name || "Meal Detected"}</h2>
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
          <button className="save-meal-btn" onClick={saveScannedMeal}>
            Save Meal
          </button>
        </div>
      )}

      <div className="meal-list-card">
        <h2>Today's Meals</h2>
        {todayMeals.length === 0 ? (
          <p>No meals logged today.</p>
        ) : (
          todayMeals.map((meal) => (
            <div className="meal-row" key={meal.id}>
              <div>
                <strong>{meal.name}</strong>
                <span>
                  {meal.calories} kcal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                </span>
              </div>
              <div>
                <button onClick={() => renameMeal(meal)}>Edit</button>
                <button onClick={() => deleteMeal(meal)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="meal-list-card">
        <h2>Nutrition History</h2>
        {historyDates.length === 0 ? (
          <p>No nutrition history yet.</p>
        ) : (
          historyDates.map((date) => {
            const totals = FoodLogEngine.getDailyTotals(date);

            return (
              <div className="history-day" key={date}>
                <h3>{date}</h3>
                <p>
                  {totals.calories} kcal • {totals.protein}g protein • {totals.carbs}g carbs • {totals.fat}g fat
                </p>
                {mealHistory[date].map((meal) => (
                  <div className="history-meal" key={meal.id || meal.name}>
                    {meal.name}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
