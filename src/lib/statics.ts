export const STATICS = {
  APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE || "title",
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "version",
  APP_OWNER: process.env.NEXT_PUBLIC_APP_OWNER || "owner",

  GOOGLE_CONTACT_FORM_URL: "https://forms.gle/smmkpkBdjGYXiZim7",

  VALIDATE: {
    NAME: {
      MAX_LENGTH: 20,
      MIN_LENGTH: 1,
    },
  },
}
