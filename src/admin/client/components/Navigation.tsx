import * as React from 'react';
import { Link } from 'react-router-dom';


import * as styles from './Navigation.css';

interface NavigationProps {
    models: {[modelName: string]: any} //TODO: Create model map type
}

export default function Navigation({ models }: NavigationProps) {
    return (
        <nav className={styles.navigation}>
            <div className={styles.header}>Ghoti</div>
            <ul>
                {Object.values(models).map((m) => (
                    <li key={m.modelMeta.namePlural}>
                        <Link to={`/models/${m.modelMeta.namePlural}`}>{m.modelMeta.namePlural}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}