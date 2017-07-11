import ghoti from "../Ghoti";

import Person from "./Person";
import Fish from './Fish';


ghoti.configure({
    models: [
        Person,
        Fish
    ]
})

ghoti.run()
    .catch(err => {
        console.error(err.stack);
    })
