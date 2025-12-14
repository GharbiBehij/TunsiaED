// bff/src/Modules/PromoCode/index.js
import promoCodeRoutes from './api/PromoCode.routes.js';

export const registerPromoCodeRoutes = (app) => {
  app.use('/promo-code', promoCodeRoutes);
};
