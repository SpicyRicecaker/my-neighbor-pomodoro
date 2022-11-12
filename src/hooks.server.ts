/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Handle } from "@sveltejs/kit";
import { parse } from 'cookie';

// This getSession returns a `session` object that is accessible on the client
// Keep in mind that cookies are stored on server
// /** @type {import('@sveltejs/kit').GetSession} */
// export const getSession: GetSession = async (event: { locals: any }) => {}
// Deciding to not make the token accessible in session

export const handle: Handle = async function ({ event, resolve }) {
    // Parse the cookie w/ user & token
    const cookies = parse(event.request.headers.get('cookie') || '');
    if (cookies) {
        if (cookies['theme']) {
            (event.locals as any).theme = cookies['theme'];
        }
    }

    // Then append token cookie
    const response = await resolve(event);

    return response;
}
