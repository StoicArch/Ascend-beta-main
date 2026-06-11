class PremiumEngine {
  static validCodes = [
    "ASCENDEARLY2026",
    "ASCENDVIP",
    "FOUNDER",
  ];

  static isPremium() {
    return localStorage.getItem("ascendPremium") === "true";
  }

  static unlockPremium() {
    localStorage.setItem("ascendPremium", "true");
    return true;
  }

  static lockPremium() {
    localStorage.removeItem("ascendPremium");
  }

  static redeemCode(code) {
    if (!code) return false;

    const cleanCode = code.trim().toUpperCase();

    if (this.validCodes.includes(cleanCode)) {
      this.unlockPremium();
      localStorage.setItem("premiumCodeUsed", cleanCode);
      return true;
    }

    return false;
  }

  static getCodeUsed() {
    return localStorage.getItem("premiumCodeUsed");
  }
}

export default PremiumEngine;