/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Handle, GetSession } from "@sveltejs/kit";
// import type { CookieSerializeOptions } from 'cookie';
import { parse } from 'cookie';

// const options: CookieSerializeOptions = {
//     path: '/',
//     httpOnly: true,
//     sameSite: 'lax',
//     secure: true,
// };

export const handle: Handle = async function ({ event, resolve }) {
    // Parse the cookie w/ user & token
    const cookies = parse(event.request.headers.get('cookie') || '');
    (event.locals as any).theme = cookies['theme'];

    // Then append token cookie
    const response = await resolve(event);

    // response.headers.set('theme') = cookies['theme'];

    // Call endpoint

    // After endpoint, append cookies to res
    // Could use bearer authorization but then we would have to set the token to local storage
    // and pass that along with each and every request. It's too much work compared to set and forget lol
    // response.headers['set-cookie'] = `${serialize('token', request.locals.token, options)}`;

    return response;
}

// This getSession returns a `session` object that is accessible on the client
// Keep in mind that cookies are stored on server
/** @type {import('@sveltejs/kit').GetSession} */
export const getSession: GetSession = async (event) => {
    return (event.locals as any).theme
        ? {
            theme: {
                // only include properties needed client-side —
                // exclude anything else attached to the user
                // like access tokens etc
                theme: (event.locals as any).theme,
            }
        }
        : {
            theme: {
                // only include properties needed client-side —
                // exclude anything else attached to the user
                // like access tokens etc
                theme: "Chrome",
            }
        };
}
// Deciding to not make the token accessible in session