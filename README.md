
## How to use
### Chrome Extension

1. `npm install`
2. `npm run dev`
3. modify account and password in `src/background.js`
   ```javascript
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
    ```
4. install Chrome extension
