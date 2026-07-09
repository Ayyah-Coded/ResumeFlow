'use strict';

/**
 * user-resume router
 *
 * Restrict default collection actions to avoid exposing all resumes.
 * Row-level authorization is enforced in the controller by checking
 * the authenticated user's email against the `userEmail` field.
 */

import { factories } from '@strapi/strapi';

// Only expose non-collection endpoints (no open list endpoint).
export default factories.createCoreRouter('api::user-resume.user-resume', {
	only: ['findOne', 'create', 'update', 'delete'],
	config: {
 		findOne: { policies: ['api::user-resume.is-owner'] },
 		create: { policies: ['api::user-resume.is-owner'] },
 		update: { policies: ['api::user-resume.is-owner'] },
 		delete: { policies: ['api::user-resume.is-owner'] }
 	}
});
