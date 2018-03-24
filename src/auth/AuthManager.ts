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
                log.info('user not found')
                return null;
            }
            console.log(user.password);
            const passwordsMatch = await bcrypt.compare(password, user.password);
            console.log(passwordsMatch);
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
}

export default new AuthManager();