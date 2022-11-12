import type { ServerLoad } from "@sveltejs/kit"

export const load: ServerLoad = ({ locals }) => {
  return (locals as any).theme
    ? {
        // only include properties needed client-side —
        // exclude anything else attached to the user
        // like access tokens etc
        theme: (locals as any).theme,
      }
    : {
        // only include properties needed client-side —
        // exclude anything else attached to the user
        // like access tokens etc
        theme: "Gruvbox Material Dark",
      }
}
