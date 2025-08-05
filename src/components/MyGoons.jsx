
import React, { useState, useEffect } from 'react';
import './Hire.css'; // reuse styles from Hire to cut down on wasteful code to save the environment.
import DangerModal from '../components/DangerModal';

// used in UserAccount for goon management
function MyGoons({ goons, onRemove, updateWallet }) {
  // Current sort dropdown value
  const [sortBy, setSortBy] = useState('Date');
  // Loads the team name from localStorage, or sets a default if it's not there
  const [teamName, setTeamName] = useState(() => {
    return localStorage.getItem('teamName') || 'Your Crew Name';
  });
  // Toggles whether the team name is being edited
  const [isEditing, setIsEditing] = useState(false);

  // Double check localStorage in case another component changed the team name
  useEffect(() => {
    const saved = localStorage.getItem('teamName');
    if (saved) setTeamName(saved);
  }, []);

  // Update team name while typing
  const handleTeamNameChange = (e) => setTeamName(e.target.value);

  // Save name change and exit edit mode
  const handleTeamNameSubmit = () => {
    setIsEditing(false);
    localStorage.setItem('teamName', teamName);
  };

  // Sorts the hired goons based on the dropdown selection
  const sortedGoons = [...goons].sort((a, b) => {
    if (sortBy === 'Age') return a.age - b.age;
    if (sortBy === 'Cost') return a.fee - b.fee;
    if (sortBy === 'Date') return new Date(b.dateAdded) - new Date(a.dateAdded);
    if (sortBy === 'NameAZ') return a.name.localeCompare(b.name);
    if (sortBy === 'NameZA') return b.name.localeCompare(a.name);
    if (sortBy === 'Experience') return a.years - b.years;
    return 0;
  });

  // Updates localStorage to remove a goon's ID after firing them
const removeFromLocalStorage = (id) => {
  const existing = localStorage.getItem('hiredIds');
  if (existing) {
    const parsed = JSON.parse(existing).map(Number);
    const updated = parsed.filter((storedId) => storedId !== Number(id));
    localStorage.setItem('hiredIds', JSON.stringify(updated));
  }
};

// Randomized message for the fire confirmation popup
const removalMessages = [
  goon => `You sure you want to let ${goon.name} go? They might not take it well.`,
  goon => `Removing ${goon.name}? Hope they don’t come back for revenge...`,
  goon => `Say goodbye to ${goon.name}? We didn’t like them either.`,
  goon => `Dump ${goon.name}? Might be time they found a new gig.`,
  goon => `Kick ${goon.name} to the curb? Cold move.`,
  goon => `Let ${goon.name} walk? You better have a good replacement.`
];

// New state for DangerModal
const [goonToRemove, setGoonToRemove] = useState(null);
const [showRemoveDialog, setShowRemoveDialog] = useState(false);

// Triggered when the user clicks "Remove Goon"
const handleRemoveClick = (goon) => {
  setGoonToRemove(goon);
  setShowRemoveDialog(true);
};

// If the user confirms in DangerModal
const confirmRemove = () => {
  if (goonToRemove) {
    removeFromLocalStorage(goonToRemove.id);
    localStorage.removeItem(`fee_${goonToRemove.id}`);
    onRemove(goonToRemove.id);
  }
  setShowRemoveDialog(false);
  setGoonToRemove(null);
};

// If the user cancels the modal
const cancelRemove = () => {
  setShowRemoveDialog(false);
  setGoonToRemove(null);
};

return (
  <div className="hire-container">
    
    {/* Click to rename your crew */}
    <div className="team-title-wrapper">
      {isEditing ? (
        <input
          className="team-title-input"
          type="text"
          value={teamName}
          onChange={handleTeamNameChange}
          onBlur={handleTeamNameSubmit}
          maxLength={25}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleTeamNameSubmit();
          }}
          autoFocus
        />
      ) : (
        <h1 className="team-title" onClick={() => setIsEditing(true)}>
          {teamName}
        </h1>
      )}
    </div>

    {showRemoveDialog && goonToRemove && (
      <DangerModal
        message={removalMessages[Math.floor(Math.random() * removalMessages.length)](goonToRemove)}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    )}

      {sortedGoons.length === 0 ? (
        <div className="no-goons-center">
          <img
            src="/nogoons.png"
            alt="No goons hired"
            className="no-goons-img"
          />
        </div>
      ) : (
        <>
          {/* Sorting options */}
          <div className="filter-bar">
            <label>Sort By: </label>
            <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
              <option value="Date">Date Added</option>
              <option value="Age">Age</option>
              <option value="Cost">Cost</option>
              <option value="NameAZ">Name A–Z</option>
              <option value="NameZA">Name Z–A</option>
              <option value="Experience">Years Experience</option>
            </select>
          </div>

           {/* This is where each goon shows up with full info and a remove button. Use icons to take up less space */}
          <div className="goon-list">
            {sortedGoons.map((goon) => (
              <div key={goon.id} className="goon-card">
                <img src={goon.img} alt="Profile" className="goon-pic" />
                <div className="goon-info">
                  <h2>{goon.name}</h2>
                  <p><strong>Age:</strong> {goon.age}</p>
                  <p><strong>Residence:</strong> {goon.residence}</p>
                  <p><strong>Fee Paid:</strong> 💵 <span className="green">${(goon.paid ?? goon.fee).toLocaleString()}</span></p>
                  <p><strong>Years Experience:</strong> {goon.years}</p>
                  <p><strong>Special Skills:</strong> {goon.skills}</p>
                  <p><strong>Served Time?:</strong> {goon.servedTime ? '✅' : '❌'}</p>
                  <p><strong>Known Snitch?:</strong> {goon.snitch ? '✅' : '❌'}</p>
                  <p><strong>Biography:</strong> {goon.bio}</p>

                  <button className="hire-btn" onClick={() => handleRemoveClick(goon)}>
                    Remove Goon
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Makes the component available for routing and use in App.jsx
export default MyGoons;
