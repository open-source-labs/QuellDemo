import styles from './TeamCards.modules.css';

import React, { useState, useEffect, memo } from 'react';
import Linkedin from '/client/src/assets/images/icons/QUELL-icons-linkedin.svg';
import Github from '/client/src/assets/images/icons/QUELL-icons-github.svg';
import Header from '/client/src/assets/images/quell_logos/quell-bird-border.svg';
import { TeamArr } from '../teaminfo';

const Team = memo(() => {
  const [renderFx, toggleRenderFx] = useState<string>('unrendered');

  // runs once on render, then procs the useState for rendered to change to renderedLogo
  // these two strings are ID's in our CSS.
  useEffect(() => {
    setTimeout(() => {
      toggleRenderFx('rendered');
    }, 550);
  }, []);

  //scrolls back to top
  useEffect(() => {
    if (window.location.href.includes('scroll-demo')) {
      window.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id={renderFx}>
      <h1 id="team-quell-heading">Team Quell</h1>
      <img id="team-quell-logo" src={Header}></img>
      <h2>The Good Eggs of Quell</h2>
      <div id="team">
        {TeamArr.map((currTeamObj: any, i: number) => {
          return (
            <article key={i} className="TeamCard">
              <TeamMember
                key={i}
                src={currTeamObj.src}
                bio={currTeamObj.bio}
                name={currTeamObj.name}
                linkedin={currTeamObj.linkedin}
                github={currTeamObj.github}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
});

interface TeamMember {
  src: string;
  bio: string;
  name: string;
  linkedin: string;
  github: string;
}

const TeamMember = ({ src, bio, name, linkedin, github }: TeamMember) => {
  return (
    <div className="profile-pics">
      <img src={src} alt="Quell Team Member"></img>
      <p className="team-member-name">{name}</p>
      <p>{bio}</p>
      <div className={styles.social_icons}>
        <a href={linkedin} target="_blank">
          <img src={Linkedin}></img>
        </a>
        <a href={github} target="_blank">
          <img src={Github}></img>
        </a>
      </div>
    </div>
  );
};

export default Team;
