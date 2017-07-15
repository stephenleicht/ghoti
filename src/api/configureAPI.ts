import * as express from 'express';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { GhotiOptions } from '../GhotiOptions';
import { createLogger } from '../logging';

import {
    getModelParamHandler, 
    createModelHandler, 
    getModelListHandler, 
    getModelByIDHandler, 
    updateModelHandler, 
    deleteModelByIDHandler
} from './modelHandlers';
import authorize from './authorize';

const logger = createLogger('configureAPI');

interface User {
    username: string
}

passport.use(new LocalStrategy(
  function(username, password, done) {
      if (username !== 'test' || password !== 'test') {
          return done(null, false, { message: 'Ivalid username or password'});
      }

      return done (null, {username});

    // User.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
  }
));

passport.serializeUser(function(user: User, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username: string, done) {
  done(null, {username});
});

export default function configureAPI(config: GhotiOptions) {
    const models = config.models;

    const router = express.Router();

    router.post('/login', 
        passport.authenticate('local'),
        (req, res) => {
            res.send(JSON.stringify(req.user));
        }
    );

    router.use('/models*', authorize);
    router.param('model', getModelParamHandler(models));
    router.post('/models/:model', createModelHandler);
    router.get('/models/:model', getModelListHandler);
    router.get('/models/:model/:id', getModelByIDHandler);
    router.put('/models/:model/:id', updateModelHandler)
    router.delete('/models/:model/:id', deleteModelByIDHandler)

    return router;

}