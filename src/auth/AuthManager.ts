import * as bcrypt from 'bcrypt';
import entityManager from '../persistence/EntityManager';

import User from './User';
import {createLogger} from '../logging';

const log = createLogger('AuthManager');

export class AuthManager {
    public async authenticateUser(email: string, password: string): Promise<User | null> {
        try {
            log.info('Finding user with email: %s', email);
            const user: User = await entityManager.findOne(User, {email});

            if(!user) {
                return null;
            }

            const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
            if(!passwordsMatch) {
                return null;
            }
            else {
                return user;
            }
        }
        catch(err) {
            console.log("Error while authenticating: %s", err.stack);
            return null;
        }
    }

    public async isFirstUserCreated() {
        const user: User = await entityManager.findOne(User, {});
        return !!user;
    }

    public createPasswordHash(plainText: string): Promise<string> {
        return bcrypt.hash(plainText, 10);
    }
}

export default new AuthManager();