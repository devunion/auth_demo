export const TEST_LOGINS = {
    'extensiondev.com': {
        logins: [
            {login: 'admin', password: "<PASSWORD_REMOVED>"}
        ],
        auth_flow: {
            type: 'basic',
        }
    },

    'accounts.google.com': {
        logins: [
            {login: 'devunion@gmail.com', password: '<PASSWORD_REMOVED>'}
        ],
        auth_flow: {
            type: 'continuous',
            steps: [
                {
                    value: '${LOGIN}',
                    selector: 'input[type="email"]',
                    next: '#identifierNext',
                    next_action: 'click'
                },
                {
                    value: '${PASSWORD}',
                    selector: 'input[type="password"]',
                    next: '#passwordNext',
                    next_action: 'click'
                }
            ]
        }
    },
    'signin.webex.com': {
        logins: [
            {login: 'pm@toolbardev.com'}
        ],
        auth_flow: {
            type: 'continuous',
            steps: [{
                value: '${LOGIN}',
                selector: '#username',
                next: '#login-btn-next',
                next_action: 'click'
            }]
        }
    },
    'idbroker.webex.com': {
        logins: [
            {password: 'QWEasd123@'}
        ],
        auth_flow: {
            type: 'continuous',
            steps: [{
                value: '${PASSWORD}',
                selector: '#IDToken2',
                next: '#Button1',
                next_action: 'click'
            }]
        }
    }
};