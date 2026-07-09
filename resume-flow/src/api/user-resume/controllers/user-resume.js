'use strict';

/**
 * user-resume controller
 *
 * Overrides core actions to enforce row-level authorization based on the
 * authenticated user's email matching the `userEmail` attribute on the
 * `user-resume` entries. This keeps enforcement at the router/controller
 * layer rather than relying solely on generic role permissions.
 */

import { factories } from '@strapi/strapi';


export default factories.createCoreController('api::user-resume.user-resume', ({ strapi }) => ({
	// Return only the authenticated user's resumes (no global listing)
	async find(ctx) {
		const user = ctx.state.user;
		if (!user) return ctx.unauthorized();

		ctx.query = ctx.query || {};
		// Ensure we only return records that belong to the authenticated user's email
		ctx.query.filters = {
			...(ctx.query.filters || {}),
			userEmail: user.email,
		};

		return await super.find(ctx);
	},

	async findOne(ctx) {
		const { id } = ctx.params;
		const user = ctx.state.user;
		if (!user) return ctx.unauthorized();

		const entity = await strapi.entityService.findOne('api::user-resume.user-resume', id, { populate: true });
		if (!entity) return ctx.notFound();
		if (entity.userEmail !== user.email) return ctx.forbidden();

		return await super.findOne(ctx);
	},

	async create(ctx) {
		const user = ctx.state.user;
		if (!user) return ctx.unauthorized();

		ctx.request.body = ctx.request.body || {};
		ctx.request.body.data = {
			...(ctx.request.body.data || {}),
			userEmail: user.email,
			userName: user.username || user.email,
		};

		return await super.create(ctx);
	},

	async update(ctx) {
		const { id } = ctx.params;
		const user = ctx.state.user;
		if (!user) return ctx.unauthorized();

		const entity = await strapi.entityService.findOne('api::user-resume.user-resume', id, { populate: true });
		if (!entity) return ctx.notFound();
		if (entity.userEmail !== user.email) return ctx.forbidden();

		return await super.update(ctx);
	},

	async delete(ctx) {
		const { id } = ctx.params;
		const user = ctx.state.user;
		if (!user) return ctx.unauthorized();

		const entity = await strapi.entityService.findOne('api::user-resume.user-resume', id, { populate: true });
		if (!entity) return ctx.notFound();
		if (entity.userEmail !== user.email) return ctx.forbidden();

		return await super.delete(ctx);
	}
}));
