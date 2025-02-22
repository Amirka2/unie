import React from 'react';

import { LoginForm } from '@features/auth';

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const SignIn = () => {
    return (
        <div>
            <LoginForm />
        </div>
    );
};

export default SignIn;
