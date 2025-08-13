import React from 'react';
import aboutLogo from '../assets/about-logo.png';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <img src={aboutLogo} alt="About Logo" className="about-logo" />

      <div className="about-box">
<p style={{ marginBottom: '2em' }}>
  You're a villain who cares about results. You don't want anymore half-butted jobs. You don't want to hire your cousin's friend of a friend. You don't want to deal with shady black market recruiters.
</p>

<p style={{ marginBottom: '2em' }}>
  HNCH is here to solve all of your henchpeople hiring woes.
</p>

<p style={{ marginBottom: '2em' }}>
  This platform eliminates the guesswork. Every candidate comes with a profile, complete with skills, experience, and a criminal background summary that’s actually useful. You’ll know who served time, who snitched, and who might still be on probation. No fluff. No mystery.
</p>

<p style={{ marginBottom: '2em' }}>
  Hiring is straightforward. Sort by cost, years of experience, or just scroll until someone looks intimidating enough to trust. You don’t need a middleman anymore. You need reliability.
</p>

<p style={{ marginBottom: '2em' }}>
  HNCH exists because your operation deserves better than amateurs and secondhand referrals. If it all goes sideways, it won’t be because you hired blind.
</p>
<p style={{ marginBottom: '2em' }}>
  We love you.
</p>
      </div>
    </div>
  );
}

export default About;