import * as jquery from 'jquery';
const $ = jquery.noConflict();

import {Robot} from './robot';

const MAX_INPUTS_FOR_LOGIN = 4;

const LOGIN_FIELD_RULES = ["input[type='text']", "input:not([type])", "input[type='email']"];
const PASS_FIELD_RULES = ["input[type='password']", "input#password"];
const SUBMIT_FIELD_RULES = ["input[type='submit']", "button[type='submit']"];


export class Form {
    constructor(login, pass, submit, form) {
        this._login = login;
        this._pass = pass;
        this._submit = submit;
        this._form = form;
    }

    //TODO: it really should be async
    fill(data) {
        Robot.typeString(this._login[0], data.login);
        Robot.typeString(this._pass[0], data.password);
    }

    submit() {
        if (this._submit) {
            Robot.focus(this._submit[0]);
            Robot.click(this._submit[0]);
        } else {
            this._form.submit();
        }
    }
}


export class FormDetector {

    static _getVisibleForms() {
        return $("form").filter(":visible");
    }

    static _getField(rules, form) {
        for (let i=0; i < rules.length; i++) {
            let result = $(rules[i], form);

            if (result.length > 0) {
                return result;
            }
        }
    };

    static _getVisibleInputs(form) {
        return $("input:not([type=hidden])", form).filter(":visible");
    }

    static _isLoginForm(login, pass, form) {
        return pass && login && this._getVisibleInputs(form).length <= MAX_INPUTS_FOR_LOGIN;
    }

    static getLoginForm() {
        const forms = this._getVisibleForms();

        for (let i=0; i < forms.length; i++) {
            let form = forms[i];

            let login = this._getField(LOGIN_FIELD_RULES, form);
            let pass = this._getField(PASS_FIELD_RULES, form);
            let submit = this._getField(SUBMIT_FIELD_RULES, form);

            if (this._isLoginForm(login, pass, form)) {
                return new Form(login, pass, submit, form);
            }
        }

        return null;
    };
}
