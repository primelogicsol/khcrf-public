# Dashboard Stabilization Priorities

1. **Authentication and session integrity**
   - Scope: Auth Middlewares, Session handling
   - Regression risk: Critical
2. **Authoritative RBAC model**
   - Scope: rbacMiddleware.ts, rolePermissions.ts
   - Regression risk: Critical
3. **Pending-user role behavior**
   - Scope: UsersClient.tsx, UserController, User model
   - Regression risk: High
4. **Dashboard navigation alignment**
   - Scope: dashboard.ts, Sidebar.tsx
   - Regression risk: Medium
