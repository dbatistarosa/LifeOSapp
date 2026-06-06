const isDev = import.meta.env.DEV;

export const analytics = {
  track: (event, properties = {}) => {
    if (isDev) {
      console.log(`[Analytics] ${event}`, properties);
    }
    // In production, send to analytics service
  },
  page: (pageName) => {
    if (isDev) {
      console.log(`[Analytics] Page: ${pageName}`);
    }
  },
  identify: (userId, traits = {}) => {
    if (isDev) {
      console.log(`[Analytics] Identify: ${userId}`, traits);
    }
  },
};

export default analytics;
