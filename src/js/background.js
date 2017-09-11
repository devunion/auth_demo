import * as jquery from 'jquery';
const $ = jquery.noConflict();

import md5 from './lib/md5';

import {GET_LOGIN_INFO, SAVE_SUBMIT_INFO} from "./action-names";
import {TEST_LOGINS} from "./test-logins";

const INACTIVITY_TIMEOUT = 60*1000;

const domain2li = {};

const isRightAfterLogOut = (li, hash) => {
    let now = new Date().getTime();
    return li.last_login_time && li.last_hash === hash && now - li.last_login_time < INACTIVITY_TIMEOUT;
};

const saveSubmitInfo = (domain, hash, callback) => {
    let li = domain2li[domain];
    
    if (li && li.logins.length > 0) {
        // We will not submit the forma again if a user logged out less then a minute ago.
        if (isRightAfterLogOut(li, hash)) {
            return;
        }

        li.last_hash = hash;
        li.last_login_time = now;
    }

    callback({});
};

const addHash = (lp) => Object.assign(lp, {hash : md5(`${lp.login}@${lp.password}`)});

function getLoginInfo(url, domain, callback) {
    const config = TEST_LOGINS[domain];

    if (!config) {
        return;
    }

    const result = Object.assign(config, {
    });

    //TODO: calculate hashses
    // config.logins = config.logins.map(addHash);

    const oldLI = domain2li[domain];
    
    if (oldLI && result.logins.length > 0) {
        //TODO: config[0] should be replaced with the real config
        if (oldLI.last_hash !== result.logins[0].hash) {
            result.last_login_time = null;
        } else {
            result.last_hash = oldLI.last_hash;
            result.last_login_time = oldLI.last_login_time;
        }
    }
    domain2li[domain] = result;

    callback(result);
}

const init = () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (!sender.tab) {
            return;
        }

        switch (message.action) {
            case GET_LOGIN_INFO:
                getLoginInfo(message, message.domain, sendResponse);
                break;

            case SAVE_SUBMIT_INFO:
                saveSubmitInfo(message.domain, message.hash, sendResponse);
                break;
        }

        return true;
    });
};

$.ajaxSetup({cache: false});
init();

