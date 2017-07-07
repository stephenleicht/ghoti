import * as React from 'react';

import * as styles from './Navigation.css';


export default function Navigation() {
    return (
        <nav className={styles.navigation}>
            <div className={styles.header}>Ghoti</div>
            <ul>
                <li>People</li>
            </ul>
        </nav>
    )
}