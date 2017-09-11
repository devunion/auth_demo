import {Messages} from "./messages";
import {Auth} from "./auth";

Messages.getLoginInfo((msg) => {
    switch (msg.auth_flow.type) {
        case 'basic':
            Auth.basicAuth(msg);
            break;

        case 'continuous':
            Auth.continuousAuth(msg);
            break;
    }
});

