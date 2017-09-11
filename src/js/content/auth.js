import * as jquery from 'jquery';
const $ = jquery.noConflict();

import {getDomain} from './utils';

import {Messages} from "./messages";
import {FormDetector} from "./forms";
import {Robot} from './robot';

class BasicAuth {
    static _canSubmit(msg) {
        return msg.last_domain !== getDomain() || msg.last_hash !== msg.logins[0].hash;
    }

    _submitForm(form, data) {
        form.fill(data);


        Messages.saveSubmitInfo(data.hash, () => {
            form.submit();
        });
    };

    auth(data) {
        const loginForm = FormDetector.getLoginForm();

        if (loginForm) {
            if (data.logins.length > 1) {
                // TODO:
                // It is possible that a user can have more than one account for the same site.
                // We need to provide him an ability to choose the necessary acc. Some dialog should be displayed and
                // a user will be able to choose a login to proceed.

            } else if (data.logins.length === 1) {

                // TODO:
                // We need to handle a couple of not very obvious things here.
                //
                // 1. We need to avoid cyclic form resubmission in the case when a user has provided incorrect credentials.
                // At the same time we should allow a user to sign in again if he has updated his login/pass in the system.
                // That is why we're using hash which is md5 of login+pass. We don't need to allow form submission
                // if a user trying to do that with he same hash.
                //
                // 2. We need to prevent immediate sign in when a user signing out from a site.

                if (BasicAuth._canSubmit(data)) {
                    this._submitForm(loginForm, data.logins[0]);
                }
            }
        }
    }
}

// TODO: save submit info
class ContinuousAuth {
    _getValue(val, logins) {
        switch(val) {
            case '${LOGIN}':
                return logins[0].login;

            case '${PASSWORD}':
                return logins[0].password;

            default:
                return val;
        }
    }

    //TODO: add timeout to avoid infinite invocation
    _waitFor(selector, callback){
        let el = $(selector);

        if (el.length > 0) {
            callback(el);
        } else {
            setTimeout(() => this._waitFor(selector, callback), 20);
        }
    }

    _handleStep(steps, logins) {
        if (steps.length > 0) {
            let step = steps.shift();

            this._waitFor(step.next, (next)=> {
                let val = this._getValue(step.value, logins);

                Robot.typeString($(step.selector)[0], val);

                if (step.next_action === 'click') {
                    Robot.click(next[0]);

                    this._handleStep(steps, logins);
                }
            });
        }
    };

    auth(data) {
        this._handleStep(data.auth_flow.steps.slice(), data.logins);
    }
}

const ba = new BasicAuth();
const ca = new ContinuousAuth();

export class Auth {
    static basicAuth(data) {
        ba.auth(data);
    }

    static continuousAuth(data) {
        ca.auth(data)
    }
}