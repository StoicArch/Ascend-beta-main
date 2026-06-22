class EquipmentEngine {
  static normalizeEquipment(equipment) {
    const map = {
      Machines: "Machine",
      Cables: "Cable",
      Barbells: "Barbell",
    };

    return map[equipment] || equipment;
  }

  static normalizeEquipmentList(equipment = []) {
    return [
      ...new Set(
        equipment.map((item) =>
          this.normalizeEquipment(item)
        )
      ),
    ];
  }
}

export default EquipmentEngine;
