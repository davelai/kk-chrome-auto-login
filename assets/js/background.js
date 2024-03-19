chrome.webNavigation.onCompleted.addListener(
    (tab) => {
        if (!ifLoginPage(tab.url)) {
            return;
        }

        let service = getService(tab.url);
        const environment = getEnvironment(tab.url);
        const account = accountInfo(environment, service);
        switch (service) {
            case 'rbms':
                rbmsLogin(tab, account.username, account.password);
                break;
            case 'be2':
                be2Login(tab, account.username, account.password);
                break;
        }
    }
);

function be2Login(tab, account, password) {
    chrome.scripting.executeScript({
        target: {tabId: tab.tabId},
        func: (account, password) => {
            const loginButton = Array.from(document.querySelectorAll('.button-text')).find(el => el.textContent.trim() === 'Log In');
            if (loginButton) {
                // 初始按鈕
                loginButton.click();
                return;
            }

            // 彈出視窗
            document.querySelector('input[type="email"]').value = account;
            const passwordInput = document.querySelector('.login-panel-password input[type="password"]');
            for (let i = 0; i < password.length; i++) {
                const char = password.charAt(i);
                passwordInput.value += char;
                const event = new KeyboardEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    key: char,
                });
                passwordInput.dispatchEvent(event);
            }

            setTimeout(() => {
                document.querySelector('button[type="button"]').click();
            }, 500);
        },
        args: [account, password]
    }, () => {});
}

function rbmsLogin(tab, account, password) {
    // <input type="text" class="form-control" placeholder="用戶名" name="username" value="">
    // <input type="password" class="form-control" placeholder="密碼" name="password">
    // <button type="submit" className="btn btn-primary btn-block btn-flat">登錄</button>

    chrome.scripting.executeScript({
        target: {tabId: tab.tabId},
        func: (account, password) => {
            document.querySelector('input[name="username"]').value = account;
            document.querySelector('input[name="password"]').value = password;
            document.querySelector('button[type="submit"]').click();
        },
        args: [account, password]
    }, () => {});
}

function ifLoginPage(url) {
    return url.includes('login');
}

function getDomain(url) {
    return url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
}

function getEnvironment(url) {
    return url.includes('sit') ? 'sit' : 'production';
}

function accountInfo(environment, $service) {
    const accounts = {
        'sit': {
            'rbms': {
                'username': 'sit-rbms-username',
                'password': 'sit-rbms-password'
            },
            'be2': {
                'username': 'sit-be2-username',
                'password': 'sit-be2-password'
            }
        },
        'production': {
            'rbms': {
                'username': 'prod-rbms-username',
                'password': 'prod-rbms-password'
            },
            'be2': {
                'username': 'prod-be2-username',
                'password': 'prod-be2-password'
            }
        }
    }

    return accounts[environment][$service];
}

function getService(url) {
    if (url.includes('rbms')) {
        return 'rbms';
    }

    if (url.includes('be2')) {
        return 'be2';
    }

    throw new Error('Service not found');
}
