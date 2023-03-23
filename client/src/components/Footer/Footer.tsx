import styles from './Footer.modules.css';
import quellBirdIcon from '/client/src/assets/images/quell_logos/quell-bird.svg';

import GitHubIcon from '@mui/icons-material/GitHub';
import MediumIcon from '/client/src/assets/images/icons/medium-icon.png';
import { memo } from 'react';

const Footer = memo(() => {
  return (
    <div className="footerContainer">
      <div className="footer-image">
        <img className="bird-icon" src={quellBirdIcon} />
      </div>
      <div className="footer-text">
        <p style={{ fontSize: '18px' }}>{'\u00A9'}2023 Quell | MIT License</p>
      </div>
      <div className="footer-links">
        <a href="https://github.com/open-source-labs/Quell">
          <GitHubIcon sx={{ color: 'black' }} />
        </a>
        <a href="https://medium.com/@katie.sandfort/quello-world-quell-releases-new-updates-to-address-critical-bug-fixes-e08699e3f5d9">
          <img className="medium-icon" src={MediumIcon} />
        </a>
      </div>
    </div>
  );
});

export default Footer;
