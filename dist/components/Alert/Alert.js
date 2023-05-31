import { jsx as _jsx } from "react/jsx-runtime";
import styles from './Alert.modules.css';
import { Fade, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
export const SuccessfulQuery = () => {
    const [rendered, toggleRendered] = useState(false);
    useEffect(() => {
        toggleRendered(true);
        //fades away
        setTimeout(() => {
            toggleRendered(false);
        }, 3000);
    }, []);
    return (_jsx("div", Object.assign({ id: styles.container }, { children: _jsx(Fade, Object.assign({ in: rendered, timeout: { enter: 600, exit: 550 }, mountOnEnter: true, unmountOnExit: true }, { children: _jsx(Alert, Object.assign({ className: styles.alert, onClose: () => {
                    toggleRendered(false);
                }, severity: "success" }, { children: "Successful Query!" })) })) })));
};
export const BadQuery = (props) => {
    const [rendered, toggleRendered] = useState(false);
    const [errorMessage, setMessage] = useState('Invalid query!');
    useEffect(() => {
        toggleRendered(true);
        //fades away
        setTimeout(() => {
            toggleRendered(false);
        }, 3000);
    }, []);
    return (_jsx("div", Object.assign({ id: styles.container }, { children: _jsx(Fade, Object.assign({ in: rendered, timeout: { enter: 600, exit: 550 }, mountOnEnter: true, unmountOnExit: true }, { children: _jsx(Alert, Object.assign({ className: styles.alert, onClose: () => {
                    toggleRendered(false);
                }, severity: "error" }, { children: props.errorMessage })) })) })));
};
