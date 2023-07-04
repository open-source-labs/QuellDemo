import styles from './TeamCards.modules.css';
import { useState, useEffect, memo } from 'react';
import Linkedin from '/client/src/assets/images/icons/QUELL-icons-linkedin.svg';
import Github from '/client/src/assets/images/icons/QUELL-icons-github.svg';
import Header from '/client/src/assets/images/quell_logos/quell-bird-border.svg';
import { TeamArr } from '../teaminfo';

// Props for the TeamMember component
interface TeamMemberProps {
  src: string; // Profile picture source
  bio: string; // Team member's bio
  name: string; // Team member's name
  linkedin: string; // Link to the team member's LinkedIn profile
  github: string; // Link to the team member's GitHub profile
}

// Individual team member card component
const TeamMember = ({ src, bio, name, linkedin, github }: TeamMemberProps) => {
  return (
    <div className={styles.profilePic}>
      <img src={src} alt="Quell Team Member"></img>
      <p className={styles.name}>{name}</p>
      <p>{bio}</p>
      <div className={styles.socialIcons}>
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

// Team component
const Team = memo(() => {
  const [renderFx, toggleRenderFx] = useState<string>('unrendered');

  // Runs once on render, then updates the state to trigger a CSS transition effect
  useEffect(() => {
    setTimeout(() => {
      toggleRenderFx('rendered');
    }, 550);
  }, []);

  // Scrolls back to the top of the page
  useEffect(() => {
    if (window.location.href.includes('scroll-demo')) {
      window.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id={renderFx}>
      <h1 id={styles.heading}>Team Quell</h1>
      <img id={styles.logo} src={Header}></img>
      <h2>The Good Eggs of Quell</h2>
      <div id={styles.team}>
        {TeamArr.map((currTeamObj: TeamMemberProps, i: number) => {
          return (
            <article key={i} className={styles.card}>
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

export default Team;
