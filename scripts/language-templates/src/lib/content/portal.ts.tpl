import type { Copy } from "./copy";

/**
 * The paying candidate's own page, `/me`, and its sign-in. Every string on it.
 *
 * **Draft Thai, not yet read by Paul.** Written to `thai-candidate-voice` in
 * the sibling repo's notes: consultative, the coach as โค้ช, เรา for the work
 * done together, English loanwords where this audience lives in them (CV,
 * LinkedIn, Fit Report, recruiter). It goes through the page review queue
 * (`npm run review:page`) before the page is sent to anyone but the first
 * candidate it was built for.
 *
 * Nothing here may use the internal vocabulary `assertCandidateSafe()` bans,
 * and nothing states a figure: the token count is rendered from the ledger.
 *
 * `{name}`, `{n}`, `{date}` are filled at render by `fill()` on the page.
 */

export const PORTAL_TITLE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UE9SVEFMX1RJVExF:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UE9SVEFMX1RJVExF:TH%% };

export const PORTAL_GREETING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UE9SVEFMX0dSRUVUSU5H:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UE9SVEFMX0dSRUVUSU5H:TH%% };
export const PORTAL_GREETING_NONAME: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UE9SVEFMX0dSRUVUSU5HX05PTkFNRQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UE9SVEFMX0dSRUVUSU5HX05PTkFNRQ:TH%% };

export const PORTAL_INTRO: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UE9SVEFMX0lOVFJP:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UE9SVEFMX0lOVFJP:TH%%,
};

export const PORTAL_INTRO_SHORT: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UE9SVEFMX0lOVFJPX1NIT1JU:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UE9SVEFMX0lOVFJPX1NIT1JU:TH%%,
};

/* ------------------------------------------------------------- sign-in */

export const SIGNIN_HEADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX0hFQURJTkc:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX0hFQURJTkc:TH%% };
export const SIGNIN_BODY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX0JPRFk:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX0JPRFk:TH%%,
};
export const SIGNIN_EMAIL: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX0VNQUlM:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX0VNQUlM:TH%% };
export const SIGNIN_SEND: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX1NFTkQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX1NFTkQ:TH%% };
export const SIGNIN_SENT: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX1NFTlQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX1NFTlQ:TH%%,
};
export const SIGNIN_CODE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX0NPREU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX0NPREU:TH%% };
export const SIGNIN_VERIFY: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX1ZFUklGWQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX1ZFUklGWQ:TH%% };
export const SIGNIN_BAD_CODE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX0JBRF9DT0RF:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX0JBRF9DT0RF:TH%%,
};
export const SIGNIN_OTHER_EMAIL: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX09USEVSX0VNQUlM:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX09USEVSX0VNQUlM:TH%% };
export const SIGNIN_RESEND: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX1JFU0VORA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTklOX1JFU0VORA:TH%% };
export const NO_ACCESS_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Tk9fQUNDRVNTX0hFQURJTkc:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Tk9fQUNDRVNTX0hFQURJTkc:TH%%,
};
export const NO_ACCESS_BODY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Tk9fQUNDRVNTX0JPRFk:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Tk9fQUNDRVNTX0JPRFk:TH%%,
};
export const COACH_HERE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09BQ0hfSEVSRQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09BQ0hfSEVSRQ:TH%%,
};
export const SIGN_OUT: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTl9PVVQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0lHTl9PVVQ:TH%% };

/* ---------------------------------------------------------------- tabs */

export const TAB_OVERVIEW: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VEFCX09WRVJWSUVX:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VEFCX09WRVJWSUVX:TH%% };
export const TAB_TRACKER: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VEFCX1RSQUNLRVI:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VEFCX1RSQUNLRVI:TH%% };
export const TAB_FEED: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VEFCX0ZFRUQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VEFCX0ZFRUQ:TH%% };
export const FEED_INTRO: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9JTlRSTw:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9JTlRSTw:TH%%,
};
export const FEED_EMPTY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9FTVBUWQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9FTVBUWQ:TH%%,
};
export const FEED_NO_TARGET: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9OT19UQVJHRVQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9OT19UQVJHRVQ:TH%%,
};
export const FEED_SAVE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9TQVZF:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9TQVZF:TH%% };
export const FEED_SAVED: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9TQVZFRA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9TQVZFRA:TH%% };
export const FEED_SEEN: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9TRUVO:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9TRUVO:TH%% };
export const FEED_UPDATED: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9VUERBVEVE:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RkVFRF9VUERBVEVE:TH%% };
export const TAB_CV: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VEFCX0NW:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VEFCX0NW:TH%% };
export const TAB_COACH: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VEFCX0NPQUNI:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VEFCX0NPQUNI:TH%% };

/* ------------------------------------------------------------ overview */

export const PIPELINE_HEADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UElQRUxJTkVfSEVBRElORw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UElQRUxJTkVfSEVBRElORw:TH%% };
export const DATES_HEADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REFURVNfSEVBRElORw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REFURVNfSEVBRElORw:TH%% };
export const DATES_EMPTY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REFURVNfRU1QVFk:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REFURVNfRU1QVFk:TH%%,
};
export const DATE_FOLLOW: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REFURV9GT0xMT1c:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REFURV9GT0xMT1c:TH%% };
export const DATE_CLOSES: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REFURV9DTE9TRVM:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REFURV9DTE9TRVM:TH%% };
export const DATE_DUE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REFURV9EVUU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REFURV9EVUU:TH%% };
export const LATEST_NOTE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6TEFURVNUX05PVEU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6TEFURVNUX05PVEU:TH%% };
export const SEE_ALL: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0VFX0FMTA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0VFX0FMTA:TH%% };

/* ------------------------------------------------------------- tokens */

export const TOKENS_HEADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX0hFQURJTkc:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX0hFQURJTkc:TH%% };
export const TOKENS_OF: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX09G:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX09G:TH%% };
export const TOKENS_MATCHED: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX01BVENIRUQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX01BVENIRUQ:TH%%,
};
export const TOKENS_RULE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX1JVTEU:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX1JVTEU:TH%%,
};

/* ------------------------------------------------------- deliverables */

export const WORK_HEADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19IRUFESU5H:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19IRUFESU5H:TH%% };
export const WORK_EMPTY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19FTVBUWQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19FTVBUWQ:TH%%,
};
export const WORK_STATUS: Record<"not_started" | "in_progress" | "delivered", Copy> = {
  not_started: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19TVEFUVVMubm90X3N0YXJ0ZWQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19TVEFUVVMubm90X3N0YXJ0ZWQ:TH%% },
  in_progress: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19TVEFUVVMuaW5fcHJvZ3Jlc3M:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19TVEFUVVMuaW5fcHJvZ3Jlc3M:TH%% },
  delivered: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19TVEFUVVMuZGVsaXZlcmVk:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19TVEFUVVMuZGVsaXZlcmVk:TH%% },
};
export const WORK_DUE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19EVUU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19EVUU:TH%% };
export const WORK_DONE_ON: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19ET05FX09O:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19ET05FX09O:TH%% };

export const WORK_KIND: Record<string, Copy> = {
  fit_report: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmZpdF9yZXBvcnQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmZpdF9yZXBvcnQ:TH%% },
  coaching_session: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmNvYWNoaW5nX3Nlc3Npb24:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmNvYWNoaW5nX3Nlc3Npb24:TH%% },
  base_cv: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmJhc2VfY3Y:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmJhc2VfY3Y:TH%% },
  linkedin: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmxpbmtlZGlu:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmxpbmtlZGlu:TH%% },
  portfolio: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELnBvcnRmb2xpbw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELnBvcnRmb2xpbw:TH%% },
  country_research: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmNvdW50cnlfcmVzZWFyY2g:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmNvdW50cnlfcmVzZWFyY2g:TH%% },
  tailored_application: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELnRhaWxvcmVkX2FwcGxpY2F0aW9u:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELnRhaWxvcmVkX2FwcGxpY2F0aW9u:TH%% },
  interview_prep: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmludGVydmlld19wcmVw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmludGVydmlld19wcmVw:TH%% },
  mock_interview: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELm1vY2tfaW50ZXJ2aWV3:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELm1vY2tfaW50ZXJ2aWV3:TH%% },
  offer_review: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELm9mZmVyX3Jldmlldw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELm9mZmVyX3Jldmlldw:TH%% },
  contract_review: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmNvbnRyYWN0X3Jldmlldw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6V09SS19LSU5ELmNvbnRyYWN0X3Jldmlldw:TH%% },
};

export const BOOK_TIME: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Qk9PS19USU1F:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Qk9PS19USU1F:TH%% };
export const TOKENS_MORE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX01PUkU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX01PUkU:TH%% };
export const TOKENS_LOW: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX0xPVw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX0xPVw:TH%% };
export const TOKENS_REQUESTED: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX1JFUVVFU1RFRA:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6VE9LRU5TX1JFUVVFU1RFRA:TH%%,
};

/* ----------------------------------------------------------- Fit Report */

export const FIT_HEADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RklUX0hFQURJTkc:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RklUX0hFQURJTkc:TH%% };
export const FIT_BODY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RklUX0JPRFk:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RklUX0JPRFk:TH%%,
};
export const FIT_OPEN: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RklUX09QRU4:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RklUX09QRU4:TH%% };
export const FIT_POPUP: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RklUX1BPUFVQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RklUX1BPUFVQ:TH%%,
};

/* --------------------------------------------------------------- goal */

export const GOAL_HEADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9IRUFESU5H:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9IRUFESU5H:TH%% };
export const GOAL_PROGRESS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9QUk9HUkVTUw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9QUk9HUkVTUw:TH%% };
export const GOAL_NONE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9OT05F:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9OT05F:TH%%,
};
export const GOAL_PROMPT: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9QUk9NUFQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9QUk9NUFQ:TH%% };
export const GOAL_SET: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9TRVQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9TRVQ:TH%% };
export const GOAL_CHANGE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9DSEFOR0U:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9DSEFOR0U:TH%% };
export const GOAL_WEEK_NOTE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9XRUVLX05PVEU:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6R09BTF9XRUVLX05PVEU:TH%%,
};

/* -------------------------------------------------------------- notes */

export const NOTES_HEADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Tk9URVNfSEVBRElORw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Tk9URVNfSEVBRElORw:TH%% };

/* ---------------------------------------------------------------- CVs */

export const CV_HEADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfSEVBRElORw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfSEVBRElORw:TH%% };
export const CV_EMPTY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfRU1QVFk:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfRU1QVFk:TH%%,
};
export const CV_VERSION: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfVkVSU0lPTg:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfVkVSU0lPTg:TH%% };
export const CV_LATEST: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfTEFURVNU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfTEFURVNU:TH%% };
export const CV_THEIRS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfVEhFSVJT:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfVEhFSVJT:TH%% };
export const CV_OURS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfT1VSUw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfT1VSUw:TH%% };
export const CV_CHANGED: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfQ0hBTkdFRA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfQ0hBTkdFRA:TH%% };
export const CV_DOWNLOAD: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfRE9XTkxPQUQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfRE9XTkxPQUQ:TH%% };

/* --------------------------------------------------------------- jobs */

export const JOBS_HEADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19IRUFESU5H:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19IRUFESU5H:TH%% };
export const JOBS_INTRO: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19JTlRSTw:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19JTlRSTw:TH%%,
};
export const JOBS_EMPTY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19FTVBUWQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19FTVBUWQ:TH%%,
};
export const JOBS_ALL: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19BTEw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19BTEw:TH%% };
export const JOBS_STATUS: Record<string, Copy> = {
  interested: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMuaW50ZXJlc3RlZA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMuaW50ZXJlc3RlZA:TH%% },
  applied: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMuYXBwbGllZA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMuYXBwbGllZA:TH%% },
  screening: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMuc2NyZWVuaW5n:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMuc2NyZWVuaW5n:TH%% },
  interviewing: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMuaW50ZXJ2aWV3aW5n:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMuaW50ZXJ2aWV3aW5n:TH%% },
  offer: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMub2ZmZXI:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMub2ZmZXI:TH%% },
  accepted: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMuYWNjZXB0ZWQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMuYWNjZXB0ZWQ:TH%% },
  rejected: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMucmVqZWN0ZWQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMucmVqZWN0ZWQ:TH%% },
  withdrawn: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMud2l0aGRyYXdu:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TVEFUVVMud2l0aGRyYXdu:TH%% },
};
export const JOBS_FROM_US: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19GUk9NX1VT:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19GUk9NX1VT:TH%% };
export const JOBS_WHY: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19XSFk:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19XSFk:TH%% };
export const JOBS_POSTING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19QT1NUSU5H:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19QT1NUSU5H:TH%% };
export const JOBS_CLOSES: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19DTE9TRVM:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19DTE9TRVM:TH%% };
export const JOBS_APPLIED_ON: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19BUFBMSUVEX09O:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19BUFBMSUVEX09O:TH%% };
export const JOBS_FOLLOW_UP: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19GT0xMT1dfVVA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19GT0xMT1dfVVA:TH%% };
export const JOBS_NOTES: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19OT1RFUw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19OT1RFUw:TH%% };
export const JOBS_SAVE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TQVZF:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TQVZF:TH%% };
export const JOBS_CANCEL: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19DQU5DRUw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19DQU5DRUw:TH%% };
export const JOBS_REMOVE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19SRU1PVkU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19SRU1PVkU:TH%% };
export const JOBS_REMOVE_CONFIRM: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19SRU1PVkVfQ09ORklSTQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19SRU1PVkVfQ09ORklSTQ:TH%% };
export const JOBS_DETAILS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19ERVRBSUxT:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19ERVRBSUxT:TH%% };
export const JOBS_SEARCH: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TRUFSQ0g:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19TRUFSQ0g:TH%% };
export const JOBS_CLOSED: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19DTE9TRUQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19DTE9TRUQ:TH%% };
export const JOBS_NO_MATCH: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19OT19NQVRDSA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Sk9CU19OT19NQVRDSA:TH%% };
export const COL_ROLE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX1JPTEU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX1JPTEU:TH%% };
export const COL_COMPANY: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0NPTVBBTlk:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0NPTVBBTlk:TH%% };
export const COL_SALARY: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX1NBTEFSWQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX1NBTEFSWQ:TH%% };
export const COL_LOCATION: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0xPQ0FUSU9O:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0xPQ0FUSU9O:TH%% };
export const COL_STATUS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX1NUQVRVUw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX1NUQVRVUw:TH%% };
export const COL_SAVED: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX1NBVkVE:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX1NBVkVE:TH%% };
export const COL_DEADLINE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0RFQURMSU5F:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0RFQURMSU5F:TH%% };
export const COL_APPLIED: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0FQUExJRUQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0FQUExJRUQ:TH%% };
export const COL_FOLLOW: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0ZPTExPVw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0ZPTExPVw:TH%% };
export const COL_EXCITEMENT: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0VYQ0lURU1FTlQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09MX0VYQ0lURU1FTlQ:TH%% };
export const BACK_TO_LIST: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QkFDS19UT19MSVNU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QkFDS19UT19MSVNU:TH%% };
export const DTAB_INFO: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9JTkZP:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9JTkZP:TH%% };
export const DTAB_NOTES: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9OT1RFUw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9OT1RFUw:TH%% };
export const DTAB_CV: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9DVg:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9DVg:TH%% };
export const DTAB_COACH: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9DT0FDSA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9DT0FDSA:TH%% };
export const DTAB_INTERVIEWS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9JTlRFUlZJRVdT:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9JTlRFUlZJRVdT:TH%% };
export const DTAB_CONTACTS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9DT05UQUNUUw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RFRBQl9DT05UQUNUUw:TH%% };
export const IV_EMPTY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfRU1QVFk:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfRU1QVFk:TH%%,
};
export const IV_ADD: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfQURE:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfQURE:TH%% };
export const IV_ROUND: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfUk9VTkQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfUk9VTkQ:TH%% };
export const IV_ROUND_HINT: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfUk9VTkRfSElOVA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfUk9VTkRfSElOVA:TH%% };
export const IV_DATE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfREFURQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfREFURQ:TH%% };
export const IV_FORMAT: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfRk9STUFU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfRk9STUFU:TH%% };
export const IV_FORMATS: Record<"video" | "phone" | "onsite", Copy> = {
  video: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfRk9STUFUUy52aWRlbw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfRk9STUFUUy52aWRlbw:TH%% },
  phone: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfRk9STUFUUy5waG9uZQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfRk9STUFUUy5waG9uZQ:TH%% },
  onsite: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfRk9STUFUUy5vbnNpdGU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfRk9STUFUUy5vbnNpdGU:TH%% },
};
export const IV_INTERVIEWERS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfSU5URVJWSUVXRVJT:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfSU5URVJWSUVXRVJT:TH%% };
export const IV_NOTES: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfTk9URVM:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SVZfTk9URVM:TH%% };
export const CT_EMPTY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfRU1QVFk:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfRU1QVFk:TH%%,
};
export const CT_ADD: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfQURE:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfQURE:TH%% };
export const CT_NAME: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfTkFNRQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfTkFNRQ:TH%% };
export const CT_ROLE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfUk9MRQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfUk9MRQ:TH%% };
export const CT_ROLE_HINT: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfUk9MRV9ISU5U:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfUk9MRV9ISU5U:TH%% };
export const CT_EMAIL: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfRU1BSUw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfRU1BSUw:TH%% };
export const CT_LINKEDIN: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfTElOS0VESU4:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1RfTElOS0VESU4:TH%% };
export const JD_HEADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SkRfSEVBRElORw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SkRfSEVBRElORw:TH%% };
export const JD_HELP: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SkRfSEVMUA:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SkRfSEVMUA:TH%%,
};
export const JD_KEYWORDS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SkRfS0VZV09SRFM:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SkRfS0VZV09SRFM:TH%% };
export const JD_EMPTY: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SkRfRU1QVFk:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6SkRfRU1QVFk:TH%% };
export const LIST_REMOVE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6TElTVF9SRU1PVkU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6TElTVF9SRU1PVkU:TH%% };
export const DETAIL_DATES: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REVUQUlMX0RBVEVT:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REVUQUlMX0RBVEVT:TH%% };
export const DETAIL_OURS: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REVUQUlMX09VUlM:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6REVUQUlMX09VUlM:TH%%,
};
export const CV_SENT_HELP: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfU0VOVF9IRUxQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfU0VOVF9IRUxQ:TH%%,
};
export const CV_SENT_NONE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfU0VOVF9OT05F:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q1ZfU0VOVF9OT05F:TH%% };
export const COACH_NOTES_NONE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09BQ0hfTk9URVNfTk9ORQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q09BQ0hfTk9URVNfTk9ORQ:TH%%,
};
export const CLOSE_AS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q0xPU0VfQVM:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6Q0xPU0VfQVM:TH%% };
export const REOPEN: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UkVPUEVO:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6UkVPUEVO:TH%% };
export const SAVED_OK: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0FWRURfT0s:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6U0FWRURfT0s:TH%% };

export const ADD_JOB: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX0pPQg:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX0pPQg:TH%% };
export const ADD_ROLE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX1JPTEU:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX1JPTEU:TH%% };
export const ADD_EMPLOYER: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX0VNUExPWUVS:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX0VNUExPWUVS:TH%% };
export const ADD_COUNTRY: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX0NPVU5UUlk:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX0NPVU5UUlk:TH%% };
export const ADD_LOCATION: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX0xPQ0FUSU9O:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX0xPQ0FUSU9O:TH%% };
export const ADD_URL: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX1VSTA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX1VSTA:TH%% };
export const ADD_SALARY: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX1NBTEFSWQ:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX1NBTEFSWQ:TH%% };
export const ADD_STATUS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX1NUQVRVUw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6QUREX1NUQVRVUw:TH%% };

/* ------------------------------------------------------------- errors */

export const ERROR_FIELDS: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RVJST1JfRklFTERT:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RVJST1JfRklFTERT:TH%%,
};
export const ERROR_GENERIC: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RVJST1JfR0VORVJJQw:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6RVJST1JfR0VORVJJQw:TH%%,
};
export const LOADING: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6TE9BRElORw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3BvcnRhbC50czo6TE9BRElORw:TH%% };
