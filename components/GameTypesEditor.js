
import { useState } from "react";

export default function GameTypesEditor({ game, onUpdateGame }) {
  // Track values being actively edited (to allow empty strings during typing)
  const [editingValues, setEditingValues] = useState({});

  function update(gtid, patch) {
    onUpdateGame({
      ...game,
      gameTypes: game.gameTypes.map((g) => (g.id === gtid ? { ...g, ...patch } : g)),
    });
  }

  function handleNumberChange(gtid, field, value) {
    // Store the raw value (including empty strings) during editing
    setEditingValues(prev => ({
      ...prev,
      [`${gtid}-${field}`]: value
    }));
  }

  function handleNumberBlur(gtid, field, value) {
    // On blur, convert to number and update parent (default to 0 if empty)
    const numValue = value === "" ? 0 : parseInt(value, 10);
    update(gtid, { [field]: isNaN(numValue) ? 0 : numValue });
    
    // Clear editing state
    setEditingValues(prev => {
      const next = { ...prev };
      delete next[`${gtid}-${field}`];
      return next;
    });
  }

  function getDisplayValue(gtid, field, actualValue) {
    const key = `${gtid}-${field}`;
    // If actively editing, show the editing value, otherwise show actual value
    return editingValues.hasOwnProperty(key) ? editingValues[key] : actualValue;
  }

  return (
    <div className="card">
      <h2 className="section-title">Speltypes</h2>
      
      <div style={{ marginTop: 12, display: "grid", gap: 16 }}>
        {game.gameTypes.map((gt) => (
          <div 
            key={gt.id} 
            style={{ 
              padding: "16px", 
              border: "1px solid #e3e6ea", 
              borderRadius: "8px",
              backgroundColor: "#fafbfc"
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "12px" }}>
              {gt.name}
            </div>
            
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="form-label" style={{ marginBottom: "6px" }}>Basispunten</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={getDisplayValue(gt.id, 'basePoints', gt.basePoints)}
                    onChange={(e) => handleNumberChange(gt.id, 'basePoints', e.target.value)}
                    onBlur={(e) => handleNumberBlur(gt.id, 'basePoints', e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
                
                <div>
                  <label className="form-label" style={{ marginBottom: "6px" }}>Max winnaars</label>
                  <div style={{ 
                    padding: "14px 16px", 
                    backgroundColor: "#fff", 
                    border: "1px solid #e3e6ea",
                    borderRadius: "4px",
                    minHeight: "48px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "16px"
                  }}>
                    {gt.maxWinners || "Onbeperkt"}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="form-label" style={{ marginBottom: "6px" }}>Min troeven</label>
                  <div style={{ 
                    padding: "14px 16px", 
                    backgroundColor: "#fff", 
                    border: "1px solid #e3e6ea",
                    borderRadius: "4px",
                    minHeight: "48px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "16px"
                  }}>
                    {gt.minTrumps === null ? "-" : gt.minTrumps === 0 ? "Variabel" : gt.minTrumps}
                  </div>
                </div>

                {gt.extraPointsPerTrump != null && (
                  <div>
                    <label className="form-label" style={{ marginBottom: "6px" }}>Extra punten/troef</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={getDisplayValue(gt.id, 'extraPointsPerTrump', gt.extraPointsPerTrump)}
                      onChange={(e) => handleNumberChange(gt.id, 'extraPointsPerTrump', e.target.value)}
                      onBlur={(e) => handleNumberBlur(gt.id, 'extraPointsPerTrump', e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                )}

                {gt.allTrumpsBonus != null && (
                  <div>
                    <label className="form-label" style={{ marginBottom: "6px" }}>Alle troeven bonus</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={getDisplayValue(gt.id, 'allTrumpsBonus', gt.allTrumpsBonus)}
                      onChange={(e) => handleNumberChange(gt.id, 'allTrumpsBonus', e.target.value)}
                      onBlur={(e) => handleNumberBlur(gt.id, 'allTrumpsBonus', e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
