import styles from './About.modules.css';
import quellBanner from '/client/src/assets/images/quell_logos/quell-logo-square-no-padding.svg';
import EggOutlinedIcon from '@mui/icons-material/EggOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { memo } from 'react';

const About = memo(() => {
  return (
    <div id="about" className={styles.about}>
      <div id="scroll-about"></div>
      <div className={styles.bannerContainer}>
        <img src={quellBanner} alt="quell-banner" id={styles.quellBanner} />
      </div>
      <div className={styles.contentContainer}>
        <div>
          <h1>Quello World!</h1>
          <h2>
            Quell is an easy-to-use, lightweight JavaScript library providing a
            client- and server-side caching solution for GraphQL.
          </h2>
        </div>
        <div id={styles.featuresContainer}>
          <div className={styles.featureList}>
            <EggOutlinedIcon
              className={styles.eggIcon}
              color="primary"
              fontSize="large"
            />
            <div id="featureItem">
              <h3 className={styles.featureHeading}>
                Fast + Accurate Caching for GraphQL Developers
              </h3>
              <span className={styles.featureContent}>
                Quell optimizes speed using both client and server side caching
                and accuracy with partial/exact query caching.
              </span>
            </div>
          </div>
          <div className={styles.featureList}>
            <EggOutlinedIcon
              className={styles.eggIcon}
              color="primary"
              fontSize="large"
            />
            <div id="featureItem">
              <h3 className={styles.featureHeading}>
                Built-In Utilities for Security
              </h3>
              <span className={styles.featureContent}>
                No need to import or to code your own graphQL security
                solutions. Quell has optional built-in middleware packages that
                protect your endpoint from malicious attacks.
              </span>
            </div>
          </div>
          <div className={styles.featureList}>
            <EggOutlinedIcon
              className={styles.eggIcon}
              color="primary"
              fontSize="large"
            />
            <div id="featureItem">
              <h3 className={styles.featureHeading}>
                Simple and Easy Installation + Detailed Documentation
              </h3>
              <span className={styles.featureContent}>
                Quell prides itself on being lightweight and simple. Use Quell
                alongside with our in-depth documentation to simplify things so
                you can get started on working ASAP!
              </span>
            </div>
          </div>
          <div className={styles.featureList}>
            <EggOutlinedIcon
              className={styles.eggIcon}
              color="primary"
              fontSize="large"
            />
            <div id="featureItem">
              <h3 className={styles.featureHeading}>
                Query Monitoring + Cache View Devtool
              </h3>
              <span className={styles.featureContent}>
                Our dev tool contains all the metrics and utilities that a
                graphQL developer would need from query monitoring metrics to
                server cache data.
                <a
                  id={styles.devToolText}
                  href="https://chrome.google.com/webstore/detail/quell-developer-tool/jnegkegcgpgfomoolnjjkmkippoellod"
                >
                  Download the dev tool from the official chrome store now!
                </a>
              </span>
            </div>
          </div>
          <div className={styles.featureList}>
            <EggOutlinedIcon
              className={styles.eggIcon}
              color="primary"
              fontSize="large"
            />
            <div id="featureItem">
              <h3 className={styles.featureHeading}>Open Source</h3>
              <span className={styles.featureContent}>
                Quell is more than happy to accept any contributions and tips
                from the open source community!
              </span>
            </div>
          </div>
          <div className={styles.featureList} id={styles.callToAction}>
            <div id={styles.getStarted}>
              <ArrowForwardRoundedIcon id={styles.arrow} fontSize="large" />
              <a
                id={styles.getStartedText}
                href="https://github.com/open-source-labs/Quell"
              >
                <span>Get Started!</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default About;
