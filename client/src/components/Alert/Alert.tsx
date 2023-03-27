import styles from './Alert.modules.css';
import { Fade, Alert } from '@mui/material';
import { useEffect, useState } from 'react';

export const SuccessfulQuery = () => {
  const [rendered, toggleRendered] = useState<boolean>(false);

  useEffect(() => {
    toggleRendered(true);
    //fades away
    setTimeout(() => {
      toggleRendered(false);
    }, 3000);
  }, []);

  return (
    <div id={styles.container}>
      <Fade
        in={rendered}
        timeout={{ enter: 600, exit: 550 }}
        mountOnEnter
        unmountOnExit
      >
        <Alert
          className={styles.alert}
          onClose={() => {
            toggleRendered(false);
          }}
          severity="success"
        >
          Successful Query!
        </Alert>
      </Fade>
    </div>
  );
};

export const BadQuery = (props: BadQueryProps) => {
  const [rendered, toggleRendered] = useState<boolean>(false);
  const [errorMessage, setMessage] = useState<string>('Invalid query!');

  useEffect(() => {
    toggleRendered(true);
    //fades away
    setTimeout(() => {
      toggleRendered(false);
    }, 3000);
  }, []);

  return (
    <div id={styles.container}>
      <Fade
        in={rendered}
        timeout={{ enter: 600, exit: 550 }}
        mountOnEnter
        unmountOnExit
      >
        <Alert
          className={styles.alert}
          onClose={() => {
            toggleRendered(false);
          }}
          severity="error"
        >
          {props.errorMessage}
        </Alert>
      </Fade>
    </div>
  );
};

interface BadQueryProps {
  errorMessage: string;
}
