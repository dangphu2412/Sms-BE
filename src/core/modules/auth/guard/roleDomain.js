import { Role } from 'core/rules';
import { SpecificRoleGuard } from './specificRole.guard';
import { UnionRoleGuard } from './unionRole.guard';

export const hasAdminRole = new SpecificRoleGuard(Role.ADMIN.name);

export const hasLeaderRole = new SpecificRoleGuard(Role.LEADER.name);

export const hasAdminOrLeaderRole = new UnionRoleGuard(Role.ADMIN.name, Role.LEADER.name);
