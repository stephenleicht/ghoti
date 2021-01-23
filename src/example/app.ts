import ghoti from "../Ghoti";

import Person from "./Person";
import CustomModel from "../model/CustomModel";


ghoti.configure({
    models: [
        Person,
        CustomModel
    ]
})

ghoti.run()
    .catch(err => {
        console.error(err.stack);
    })
