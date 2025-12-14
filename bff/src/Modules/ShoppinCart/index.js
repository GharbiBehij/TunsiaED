// bff/src/Modules/ShoppingCart/index.js
import promoCodeRoutes from './api/PromoCode.routes.js';

export const registerShoppingCartRoutes = (app) => {
  app.use('/api/v1/promo-code', promoCodeRoutes);
};
