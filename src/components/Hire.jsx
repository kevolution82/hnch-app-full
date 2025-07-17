import React, { useState, useEffect } from 'react';
// Styles for Hire screen
import './Hire.css';
// Modal for delete/confirm actions
import DangerModal from '../components/DangerModal';


// All goons available for hire
const goonData = [
  {
    id: 1,
    name: 'Asha Patel',
    age: 29,
    residence: 'Fresno, CA',
    fee: 30000,
    years: 9,
    skills: 'Skychaos Navigation, Bag-Stuffing Strategy',
    servedTime: true,
    snitch: false,
    bio: 'Got her pilot license after stealing the instructor’s chopper mid-lesson. Known to yell “yee haw” during evasive maneuvers, regardless of altitude or legality. Once landed on a moving semi just to grab a latte..',
    img: '/PIC_001.png',
    dateAdded: '2025-05-20'
  },
  {
    id: 2,
    name: 'Hana Tran',
    age: 26,
    residence: 'Tukwila, WA',
    fee: 25000,
    years: 7,
    skills: 'Wi-Fi Whispering, Invisibility (Digital & Social)',
    servedTime: false,
    snitch: false,
    bio: 'Hana can slip into any network without leaving a trace, and usually finds something worth selling while she’s there. She prefers screens to people and silence to small talk. If your crew needs a ghost who can erase footprints before you make them, she’s it.',
    img: '/PIC_002.png',
    dateAdded: '2025-05-21'
  },
  {
    id: 3,
    name: 'Alexei Volkov',
    age: 42,
    residence: 'Brighton Beach, NY',
    fee: 30000,
    years: 20,
    skills: 'Truck Tossing, Soul-Piercing Stare',
    servedTime: true,
    snitch: false,
    bio: 'Once bench-pressed a stolen ATM to impress a date. Grew up in a meat locker behind a Brighton Beach deli and never learned the difference between hugs and headlocks. He doesn’t say much, but when he does, it’s usually to ask where you want the body.',
    img: '/PIC_003.png',
    dateAdded: '2025-05-22'
  },
  {
    id: 4,
    name: 'Marcus Banks',
    age: 35,
    residence: 'Decatur, GA',
    fee: 25000,
    years: 14,
    skills: 'Blueprint Whisperer, Faceswapping Wizard',
    servedTime: true,
    snitch: false,
    bio: 'Marcus maps every angle before he steps through the door. He can study your face, voice, and walk, then take your place without blinking. If you see him coming, you’re too late. Former party planner.',
    img: '/PIC_004.png',
    dateAdded: '2025-05-24'
  },
  {
    id: 5,
    name: 'Larry McGrady',
    age: 46,
    residence: 'Macon, MO',
    fee: 120,
    years: 19,
    skills: 'Walking Alarm, Loud Diversion Specialist',
    servedTime: true,
    snitch: true,
    bio: 'Larry once ruined a job by yelling “I got this” right before falling through a skylight. He talks to anyone who listens, including cops, pets, and vending machines. Crews only hire him when they need a distraction. Enjoys wildlife photography.',
    img: '/PIC_005.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 6,
    name: 'Ruby Sanderson',
    age: 29,
    residence: 'Needles, CA',
    fee: 18000,
    years: 11,
    skills: 'Desert Logistics, Precision Timing',
    servedTime: false,
    snitch: false,
    bio: 'Ruby runs tight routes wherever she goes. If you have a certain something and you need it to arrive on time - you call her. Time isn’t just money for her, it’s everything. Hates the world "guestimate."',
    img: '/PIC_006.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 7,
    name: 'Naomi Price',
    age: 34,
    residence: 'Philadelphia, PA',
    fee: 22000,
    years: 13,
    skills: 'Artifact Extraction, Glass Whispering',
    servedTime: false,
    snitch: false,
    bio: 'Naomi cuts glass cleaner than most people cut paper. She’s patient, focused, and never takes more than she came for. Museums hate her, crews love her. Her Nana makes the best peach cobbler.',
    img: '/PIC_007.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 8,
    name: 'Renzo Cabrera',
    age: 30,
    residence: 'Miami, FL',
    fee: 25000,
    years: 9,
    skills: 'Stunt Driving, Clutch Escapes',
    servedTime: true,
    snitch: false,
    bio: 'Renzo drives like the laws of physics are optional. They know every alley, ramp, and shortcut from Miami to Tampa. If they hit the gas, you’re getting out - whether you`re ready or not. They combined two of their lifelong passions into a career - driving recklessly and crime.',
    img: '/PIC_008.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 9,
    name: 'Jin Park',
    age: 28,
    residence: 'San Francisco, CA',
    fee: 24000,
    years: 10,
    skills: 'Vault Humming, Combo Crunching',
    servedTime: false,
    snitch: false,
    bio: 'Jin doesn’t speak unless it’s important, and even then it’s usually with her hands. She’s cracked every type of lock from antique vaults to military prototypes. Crews bring her in when they need silence, speed, and zero second chances. She’s a sucker for romantic comedies.',
    img: '/PIC_009.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 10,
    name: 'Walter Grimsby',
    age: 79,
    residence: 'Branson, MO',
    fee: 500,
    years: 60,
    skills: 'Corpse Gardening, No Questions Asked',
    servedTime: true,
    snitch: false,
    bio: 'Walter enjoys puzzles, painting miniatures, flying fishing - and disposing of suspicious looking bags. If you need a certain something buried, either whole or not-so-whole, in a hole - he’s your guy.',
    img: '/PIC_010.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 11,
    name: 'Krystyna Vidmar',
    age: 32,
    residence: 'Chicago, IL',
    fee: 28000,
    years: 15,
    skills: 'Submission Holds, Intimidation in Press Conferences',
    servedTime: false,
    snitch: false,
    bio: 'Krystyna dominated the underground fight circuit by putting bigger opponents on the ground fast. Ice Cube said it best, "Don’t talk about it, be about it." That’s Krystyna through and through. Crews bring her in when physical negotiating is necessary.',
    img: '/PIC_011.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 12,
    name: 'Dr. Anuj Dastoor',
    age: 46,
    residence: 'Jersey City, NJ',
    fee: 26500,
    years: 20,
    skills: 'Explosives Chemistry, Toxic Inventing',
    servedTime: true,
    snitch: false,
    bio: 'Dr. Dastoor has had a difficult time finding work at most... scratch that... ALL universities he’s applied at. He thinks safety goggles are for cowards and most warning labels are just suggestions. If you smell almonds and the lights flicker, he’s probably nearby. You’re insured, right?',
    img: '/PIC_012.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 13,
    name: 'Maleko Toa',
    age: 37,
    residence: 'Kailua, HI',
    fee: 26000,
    years: 12,
    skills: 'Object Lifting, Crowd Scattering',
    servedTime: false,
    snitch: false,
    bio: 'Maleko was raised in a family of builders, but breaking things came more naturally. He’s calm until you give him a reason not to be. When the job needs strength with control, he’s the first call. Addicted to soap operas.',
    img: '/PIC_013.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 14,
    name: 'Lucía Sangrienta',
    age: 243,
    residence: 'Santa Fe, NM',
    fee: 35000,
    years: 200,
    skills: 'Charm, Mind Games, Quiet Drains',
    servedTime: false,
    snitch: false,
    bio: 'Lucía has outlived every husband she1s ever had. She’s `dined` with royalty, bankrolled coups, and drained rivals without leaving a trace. She moves through heists with frightening efficiency. She has a serious case of heliophobia.',
    img: '/PIC_014.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 15,
    name: 'Gill',
    age: 39,
    residence: 'Bayou La Batre, AL',
    fee: 16000,
    years: 18,
    skills: 'Water Ambushes, Amphibious Intel',
    servedTime: false,
    snitch: true,
    bio: 'Gill used to run smuggling routes through the Gulf until the Coast Guard got too curious. Now he works freelance, handling wet work in places most people won’t even dip a toe. He’s in a constant state of confusion, but knows his way around any body of water you stick him in.',
    img: '/PIC_015.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 16,
    name: 'XT-003 Spin-O-Matic',
    age: 10,
    residence: 'Scrapyard 9, NV',
    fee: 14000,
    years: 10,
    skills: 'Literal Money Laundering, Hydraulic Mayhem',
    servedTime: true,
    snitch: false,
    bio: 'XT-003 became sentient the moment his safety limits were removed by an overly ambitious and greedy, laundromat proprietor. He now handles two things better than anyone else - smashing through walls and cleaning dirty money, both metaphorically and literally. His creator vanished shortly after the upgrade and hasn’t been seen since.',
    img: '/PIC_016.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 17,
    name: 'Sabine Roche',
    age: 33,
    residence: 'New Orleans, LA',
    fee: 27000,
    years: 14,
    skills: 'Blueprints, Infiltration Routes',
    servedTime: false,
    snitch: false,
    bio: 'Sabine traçait des plans d’évasion au crayon avant même de savoir faire des divisions. Elle a transformé une obsession d’enfance pour la cartographie en une carrière que la plupart des voleurs n’oseraient même pas imaginer. Chaque coup commence avec son stylo et se termine exactement là où elle l’a prévu.',
    img: '/PIC_017.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 18,
    name: 'Gretch',
    age: 42,
    residence: 'Bog Hollow, OR',
    fee: 22000,
    years: 19,
    skills: 'Threat Screeching, Feral Pursuit',
    servedTime: false,
    snitch: false,
    bio: 'Gretch spent three years in a human prison because Muncle got caught and couldn’t keep his mouth shut. She says he’s lazy, soft, and lucky she hasn’t ripped his arms off yet. These days, she only runs with crews that let her stay in the woods and handle things her way. Not a hugger.',
    img: '/PIC_018.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 19,
    name: 'Muncle',
    age: 39,
    residence: 'Bog Hollow, OR',
    fee: 15000,
    years: 10,
    skills: 'Public Stunts, Dumb Luck',
    servedTime: true,
    snitch: true,
    bio: 'Muncle is all charm and no hustle, preferring to sweet-talk his way through jobs instead of sweating. He lives by “work smarter not harder,” even if it means taking a nap mid-heist. He thinks he and Gretch make a great team, but she mostly thinks he’s a snitch and a freeloader. Very chatty.',
    img: '/PIC_019.png',
    dateAdded: '2025-05-26'
  },
  {
    id: 20,
    name: 'Dean Roddick',
    age: 41,
    residence: 'Toms River, NJ',
    fee: 19500,
    years: 17,
    skills: 'Disposal, Clean Splashes',
    servedTime: true,
    snitch: false,
    bio: 'Dean started out tossing lawn clippings, then graduated to bigger bags with fewer questions. He knows every lake in Jersey by depth, current, and how long something takes to sink. Wears cologne called "Alibi." We’re not sure why.',
    img: '/PIC_020.png',
    dateAdded: '2025-05-26'
  }
];

function Hire({ onHire, updateWallet, wallet }) {
  // Sort dropdown option chosen by user
  const [sortBy, setSortBy] = useState('Date');
  // Used for showing who was just hired
  const [hiredGoon, setHiredGoon] = useState(null);
  // If someone tries to rehire a goon they already hired
  const [alreadyHired, setAlreadyHired] = useState(null);
  // Controls the popup that shows a bigger image of a goon
  const [enlargedGoon, setEnlargedGoon] = useState(null);
  // If the user doesn't have enough money for a goon
  const [cantAfford, setCantAfford] = useState(null);
  // Used for showing the Back to Top button once scrolled down
  const [showButton, setShowButton] = useState(false);
  // this is used with the DangerModal to create custom alert popups
  const [pairingMessage, setPairingMessage] = useState(null);


  // Handles basic price tweaks based on goon skills
  const calculateAdjustedPrice = (goon) => {
  let basePrice = goon.fee || 10000;

  if (goon.skills && goon.skills.includes("Explosives")) basePrice += 2000;
  if (goon.skills && goon.skills.includes("Snitch")) basePrice -= 3000;

  return basePrice;
};

  // Show the "Back to Top" button only when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clicking a goon's image opens a full size popup
  const handleImageClick = (goon) => {
    setEnlargedGoon(goon);
  };

  // Closing the goon image popup
  const handleClosePopup = () => {
    setEnlargedGoon(null);
  };

  // Track which goons were hired using localStorage
  const [hiredIds, setHiredIds] = useState(() => {
    const saved = localStorage.getItem('hiredIds');
    return saved ? JSON.parse(saved) : [];
  });

  // Load hired goons from localStorage again on component mount
  useEffect(() => {
    const saved = localStorage.getItem('hiredIds');
    if (saved) {
      setHiredIds(JSON.parse(saved));
    }
  }, []);

  // Sorts goons based on whatever option the user picked
  const sortedGoons = [...goonData].sort((a, b) => {
    if (sortBy === 'Age') return a.age - b.age;
    if (sortBy === 'Cost') return a.fee - b.fee;
    if (sortBy === 'Date') return new Date(b.dateAdded) - new Date(a.dateAdded);
    if (sortBy === 'NameAZ') return a.name.localeCompare(b.name);
    if (sortBy === 'NameZA') return b.name.localeCompare(a.name);
    if (sortBy === 'Experience') return a.years - b.years;
    return 0;
  });

  // Adjusts pricing based on special team-up drama or bonuses
  const applySpecialPricing = (goon, hiredGoons) => {
    const hiringGretchWithMuncle =
      (goon.name === 'Gretch' && hiredGoons.some(g => g.name === 'Muncle')) ||
      (goon.name === 'Muncle' && hiredGoons.some(g => g.name === 'Gretch'));

    // Hiring conflict penalty! :D
    if (hiringGretchWithMuncle) {
      return {
        fee: goon.fee + 4000,
        reason: 'Conflict Fee: Gretch hates working with Muncle. You pay the price.'
      };
    }

    // Positive hiring discount! :O
    const hiringCombo =
      ((goon.name === 'Dr. Anuj Dastoor' && hiredGoons.some(g => g.name === 'Gill')) ||
      (goon.name === 'Gill' && hiredGoons.some(g => g.name === 'Dr. Anuj Dastoor')));

    // No pricing change
    if (hiringCombo) {
      return {
        fee: Math.floor(goon.fee * 0.8),
        reason: 'Discount Applied: Toxic synergy bonus with Dr. Dastoor and Gill.'
      };
    }

    return { fee: goon.fee, reason: null };
  };

  // Handles hiring logic
  const handleHire = (goon) => {
    if (hiredIds.includes(goon.id)) {
      setAlreadyHired(goon.name);
      setTimeout(() => setAlreadyHired(null), 2000);
      return;
    }

    // Grab who is already hired so we can check for combos
    const hiredGoons = goonData.filter(g => hiredIds.includes(g.id));
    const { fee, reason } = applySpecialPricing(goon, hiredGoons);

    // Show error if wallet is not big enough
    if (fee > wallet) {
      setCantAfford(`${goon.name} (${reason || 'Not enough funds'})`);
      setTimeout(() => setCantAfford(null), 2500);
      return;
    }

// Create new goon object and hire them
const hiredGoon = { ...goon, paid: fee };
onHire(hiredGoon);
updateWallet(-fee);

// Update local hired IDs, store in localStorage, and show temporary confirmation
    const updated = [...hiredIds, goon.id];
    setHiredIds(updated);
    localStorage.setItem('hiredIds', JSON.stringify(updated));
    setHiredGoon(goon.name);
    setTimeout(() => setHiredGoon(null), 2000);

    // Show alert if there was a special fee reason
    if (reason) {
      setPairingMessage(reason);
}
  };

  return (
    <div className="hire-container">
        <img src="/hire-logo.png" alt="Hire Logo" className="screen-logo" />
{/* Hired confirmation popup */}
{hiredGoon && (
  <div className="popup-banner">
    <span style={{ color: 'white' }}>You have hired </span>
    <strong style={{ color: 'orange' }}>{hiredGoon}</strong>!
  </div>
)}
{/* Already hired message */}
{alreadyHired && (
  <div className="popup-banner" style={{ backgroundColor: 'darkred' }}>
    <span style={{ color: 'white' }}>You already hired </span>
    <strong style={{ color: 'orange' }}>{alreadyHired}</strong>!
  </div>
)}
{/* Not enough money warning! */}
{cantAfford && (
  <div className="popup-banner" style={{ backgroundColor: 'darkred' }}>
    <span style={{ color: 'white' }}>You can't afford </span>
    <strong style={{ color: 'orange' }}>{cantAfford}</strong>!
  </div>
)}

{pairingMessage && (
  <DangerModal
    message={pairingMessage}
    onConfirm={() => setPairingMessage(null)}
    alertOnly={true}
  />
)}

      {/* Sort dropdown */}
      <div className="filter-bar">
        <label>Sort By: </label>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="Date">Date Added</option>
          <option value="Age">Age</option>
          <option value="Cost">Cost</option>
          <option value="NameAZ">Name A–Z</option>
          <option value="NameZA">Name Z–A</option>
          <option value="Experience">Years Experience</option>
        </select>
      </div>

      
      {/* All goon cards get displayed below */}
      <div className="goon-list">
        {sortedGoons.map((goon) => (
          <div key={goon.id} className="goon-card">
            {/* Clickable portrait opens popup */}
            <img
  src={goon.img}
  alt="Profile"
  className="goon-pic"
  onClick={() => handleImageClick(goon)}
  style={{ cursor: 'pointer' }}
/>
            {/* Goon details and Hire button */}
            <div className="goon-info">
              <h2>{goon.name}</h2>
              <p><strong>Age:</strong> {goon.age}</p>
              <p><strong>Residence:</strong> {goon.residence}</p>
              <p><strong>Fee:</strong> 💵 <span className="green">${goon.fee.toLocaleString()}</span></p>
              <p><strong>Years Experience:</strong> {goon.years}</p>
              <p><strong>Special Skills:</strong> {goon.skills}</p>
              <p><strong>Served Time?:</strong> {goon.servedTime ? '✅' : '❌'}</p>
              <p><strong>Known Snitch?:</strong> {goon.snitch ? '✅' : '❌'}</p>
              <p><strong>Biography:</strong> {goon.bio}</p>

              {/* Hire button triggers handleHire logic */}
              <button className="hire-btn" onClick={() => handleHire(goon)}>
                Hire Goon
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Enlarged image popup when a goon portrait is clicked */}
      {enlargedGoon && (
  <div className="popup-overlay" onClick={handleClosePopup}>
    <div className="popup-image-box" onClick={(e) => e.stopPropagation()}>
      <img
        src={enlargedGoon.img}
        alt={enlargedGoon.name}
        className="popup-image"
      />
      <div className="popup-name">{enlargedGoon.name}</div>
    </div>
  </div>
)}

      {/* Back to top button shows when user scrolls */}
      {showButton && (
        <button
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}

export default Hire;
