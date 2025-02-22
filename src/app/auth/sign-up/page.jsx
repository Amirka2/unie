import React from 'react';

import { RegisterForm } from '@features/auth';

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const SignUp = () => {
    return (
        <div>
            <RegisterForm />
        </div>
    );
};

export default SignUp;
