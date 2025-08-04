// Imports
import React, { useState, useEffect } from 'react';
import './Gigs.css';
import CustomButton from './CustomButton';
import './CustomButton.css';
import DangerModal from './DangerModal';

// Gigs board
function Gigs({ userName }) {
  const LOCAL_STORAGE_KEY = 'fuhgetaboutit_gigs';

  // Load gigs from localStorage or fallback to sample data
  const [gigs, setGigs] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const loaded = stored
      ? JSON.parse(stored)
      : [
          {
            id: 1,
            name: 'Gustavo Salazar',
            owner: 'Gustavo Salazar',
            title: 'A Mrs. Doubtfire Situation',
            skills: 'Espionage, House-Keeping',
            description:
              'There’s a guy who needs to get into his ex-wife’s house without her knowing. Need someone who can cook, clean, and not be noticed. Must be able to do a good British accent.',
            date: '2025-05-26T10:15:00',
          },
          {
            id: 2,
            name: 'Johnny Tightlips',
            owner: 'Johnny Tightlips',
            title: 'Need muscle for pawn shop job',
            skills: 'Intimidation, Getaway Driving',
            description:
              'We’re hitting a pawn shop in Granite City. Need someone who doesn’t ask questions. Quick in and out.',
            date: '2025-05-26T10:15:00',
          },
          {
            id: 3,
            name: 'Petey No-Nose',
            owner: 'Petey No-Nose',
            title: 'Safe cracking on the East Side',
            skills: 'Safecracking, Locksmith',
            description:
              'There’s a stash in an old bank building. Security’s light but the safe is old school. Must bring own tools. Lunch not provided.',
            date: '2025-05-25T14:30:00',
          },
          {
            id: 4,
            name: 'Louie DeLuca',
            owner: 'Louie DeLuca',
            title: 'Stand-in for alibi at Italian joint',
            skills: 'Acting, Lying, Alibi Construction',
            description:
              'Just need someone to eat meatballs and pretend they’ve known me for 15 years. Dress nice.',
            date: '2025-05-24T18:00:00',
          },
        ];

    return loaded.map((g) => (g.owner ? g : { ...g, owner: g.name }));
  });

  // View state and form input handling
  const [view, setView] = useState('list');
  const [selectedGig, setSelectedGig] = useState(null);
  const [gigToDelete, setGigToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    skills: '',
    description: '',
  });

  // Auto save gigs
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gigs));
  }, [gigs]);

  // Switch to form view and reset form
  const handleAddClick = () => {
    setFormData({ name: '', title: '', skills: '', description: '' });
    setView('form');
  };

  // Save a new gig
const handleSaveGig = () => {
  const { name, title, skills, description } = formData;
  if (!name || !title || !skills || !description) return;

  if (selectedGig) {
    // update existing gig
    const updatedGigs = gigs.map((gig) =>
      gig.id === selectedGig.id
        ? {
            ...gig,
            name,
            title,
            skills,
            description,
            date: new Date().toISOString(),
          }
        : gig
    );
    setGigs(updatedGigs);
    setSelectedGig(null); 
  } else {
    // Create new gig
    const newGig = {
      id: Date.now(),
      name,
      title,
      skills,
      description,
      owner: userName,
      date: new Date().toISOString(),
    };
    setGigs([newGig, ...gigs]);
  }

  setFormData({ name: '', title: '', skills: '', description: '' });
  setView('list');
};

  // Delete a gig after confirmation.
const handleRemoveGig = (id) => {
  const target = gigs.find(g => g.id === id);
  if (target) {
    setGigToDelete(target);
    setShowDeleteModal(true);
  }
};

const confirmDeleteGig = () => {
  if (gigToDelete) {
    setGigs(gigs.filter((g) => g.id !== gigToDelete.id));
    setView('list');
  }
  setShowDeleteModal(false);
  setGigToDelete(null);
};

const cancelDeleteGig = () => {
  setShowDeleteModal(false);
  setGigToDelete(null);
};

  // Prefill form with gig info
  const handleEditGig = () => {
    setFormData({ ...selectedGig });
    setView('form');
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open gig  detail
  const handleGigClick = (gig) => {
    setSelectedGig(gig);
    setView('detail');
  };

  // Newest first
  const sortedGigs = [...gigs].sort((a, b) => new Date(b.date) - new Date(a.date));

  // UI rendering
  return (
    <div className="gigs-container">
      <img src="/gigs-logo.png" alt="Gigs Logo" className="screen-logo" />

      <div className="gigs-header">
        {view === 'list' && (
          <CustomButton label="Add Gig" onClick={handleAddClick} />
        )}
      </div>

        {view === 'form' && (
        <div className="gig-form">
          <label>
            Name:
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Gig Title:
            <input
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Special Skills Required:
            <input
              name="skills"
              value={formData.skills}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
            />
          </label>
            <div className="gig-form-actions">
            <CustomButton label="Save" onClick={handleSaveGig} />
            <CustomButton label="Close" onClick={() => setView('list')} />
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="gig-list">
          {sortedGigs.length === 0 ? (
            <p className="no-gigs">No gigs available.</p>
          ) : (
            sortedGigs.map((gig) => (
              <div
                key={gig.id}
                className="gig-title"
                onClick={() => handleGigClick(gig)}
              >
                {gig.title}
              </div>
            ))
          )}
        </div>
      )}

      {view === 'detail' && selectedGig && (
        <div className="gig-detail">
          <h2>{selectedGig.title}</h2>
          <p>
            <strong>Posted by:</strong> {selectedGig.name}
          </p>
          <p>
            <strong>Posted on:</strong>{' '}
            {new Date(selectedGig.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Required Skills:</strong> {selectedGig.skills}
          </p>
          <p>
            <strong>Description:</strong> {selectedGig.description}
          </p>

          <div className="gig-detail-actions">
            <CustomButton label="Close" onClick={() => setView('list')} />
            <CustomButton label="Edit" onClick={handleEditGig} />
            <CustomButton
              label="Remove"
              onClick={() => handleRemoveGig(selectedGig.id)}
            />
          </div>
        </div>
      )}
      {showDeleteModal && gigToDelete && (
          <DangerModal
            message={`Are you sure you want to delete "${gigToDelete.title}"?`}
            onConfirm={confirmDeleteGig}
            onCancel={cancelDeleteGig}
            />
)}
    </div>
  );
}

export default Gigs;
