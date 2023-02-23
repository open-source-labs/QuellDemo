import quellBirdIcon from '../assets/images/quell_logos/QUELL-quail only.svg';
import GitHubIcon from '@mui/icons-material/GitHub';
import MediumIcon from '../assets/images/icons/medium-icon.png'
import '../stylesheets/Navbar.css';
import { memo } from 'react';

const Footer = memo(() => {

  return (
    <div className="footerContainer">
      <div className="footer-image">
        <img height="25px" width="30px" className="quell-bird-logo" src={quellBirdIcon}/>
      </div>
      <div className="footer-text">
      <h1 style={{fontSize: '18px'}}>{'\u00A9'}2023 Quell | MIT License</h1>
      </div>
      <div className="footer-links">
        <a href="https://github.com/open-source-labs/Quell"><GitHubIcon sx={{color: 'black'}} /></a>
        <a href="https://medium.com/@katie.sandfort/quello-world-quell-releases-new-updates-to-address-critical-bug-fixes-e08699e3f5d9"><img className="medium-icon" src={MediumIcon}/></a>
      </div>
    </div>
  )
})

export default Footer;