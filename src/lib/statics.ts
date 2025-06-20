export const STATICS = {
  APP_DOMAIN: "https://kaitopia.net",
  APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE || "title",
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "version",
  APP_OWNER: process.env.NEXT_PUBLIC_APP_OWNER || "owner",
  OWNER_GITHUB_URL: "https://github.com/sakho13",

  GOOGLE_CONTACT_FORM_URL: "https://forms.gle/smmkpkBdjGYXiZim7",

  VALIDATE: {
    NAME: {
      MAX_LENGTH: 20,
      MIN_LENGTH: 1,
    },

    QUESTION_TITLE: {
      MAX_LENGTH: 64,
      MIN_LENGTH: 1,
    },

    QUESTION_CONTENT: {
      MAX_LENGTH: 1024,
      MIN_LENGTH: 1,
    },
    QUESTION_HINT: {
      MAX_LENGTH: 1024,
    },
  },

  GUEST_LIMIT: {
    /** ゲストユーザが利用できる問題集の開始上限 */
    EXERCISE_COUNT: 5,
  },
}
