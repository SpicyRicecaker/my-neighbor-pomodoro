import type { Load } from "@sveltejs/kit"

export const load: Load = ({ data }) => {
  return {
    theme: data!.theme,
  }
}
