'use strict';

/**
 * Policy: is-owner
 * - Ensures the request is authenticated.
 * - For `create` requests, injects the authenticated user's email into the data.
 * - For requests with an `id` param (`findOne`, `update`, `delete`), verifies the
 *   `userEmail` on the target entity matches the authenticated user's email.
 */

export default async (ctx, next) => {
  const { state, params, request, notFound, forbidden, unauthorized } = ctx;
  const user = state.user;
  if (!user) return ctx.unauthorized();

  // For create: attach ownership fields
  if (ctx.method === 'POST') {
    request.body = request.body || {};
    request.body.data = {
      ...(request.body.data || {}),
      userEmail: user.email,
      userName: user.username || user.email,
    };

    return await next();
  }

  // For actions that target an existing entity, ensure ownership matches
  const id = params && params.id;
  if (id) {
    const entity = await strapi.entityService.findOne('api::user-resume.user-resume', id, { populate: true });
    if (!entity) return ctx.notFound();
    if (entity.userEmail !== user.email) return ctx.forbidden();
    return await next();
  }

  // Default: allow (e.g., other actions already covered)
  return await next();
};
