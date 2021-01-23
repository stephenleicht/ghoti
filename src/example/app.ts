import ghoti from "../Ghoti";

import Person from "./Person";


ghoti.configure({
    models: [
        Person,
    ]
})

ghoti.run()
    .catch(err => {
        console.error(err.stack);
    })
