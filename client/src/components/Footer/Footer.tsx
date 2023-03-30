import styles from './Footer.modules.css';
import quellBirdIcon from '/client/src/assets/images/quell_logos/quell-bird.svg';
import GitHubIcon from '@mui/icons-material/GitHub';
import MediumIcon from '/client/src/assets/images/icons/medium-icon.png';
import { memo } from 'react';

const Footer = memo(() => {
  return (
    <div className={styles.container}>
      <img className="bird-icon" src={quellBirdIcon} />
      <p className={styles.text}>{'\u00A9'}2023 Quell | MIT License</p>
      <div id={styles.links}>
        <a href="https://github.com/open-source-labs/Quell">
          <GitHubIcon className={styles.githubIcon} />
        </a>
        <a href="https://medium.com/@quellcache/boost-graphql-performance-with-quell-a-powerful-developer-friendly-caching-solution-4b32218dc640">
          <img className={styles.mediumIcon} src={MediumIcon} />
        </a>
      </div>
    </div>
  );
});

export default Footer;
