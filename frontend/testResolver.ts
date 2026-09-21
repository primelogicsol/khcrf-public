import { 
  resolveProtectedResourceAccess, 
  UserEntity, 
  ResourceEntity 
} from './src/lib/auth/protectedResourceResolver';

const mockResource = (overrides: Partial<ResourceEntity> = {}): ResourceEntity => ({
  id: 'RES-001',
  resourceType: 'PUBLICATION',
  accessStatus: 'READY',
  requiredEntitlement: 'STANDARD_PUBLICATIONS',
  ...overrides
});

const mockUser = (overrides: Partial<UserEntity> = {}): UserEntity => ({
  id: 'USER-001',
  membershipStatus: 'APPROVED',
  entitlements: ['STANDARD_PUBLICATIONS'],
  ...overrides
});

const testCases = [
  {
    name: 'anonymous + READY',
    user: null,
    resource: mockResource(),
    expectedState: 'SIGN_IN_OR_APPLY'
  },
  {
    name: 'logged in + no membership',
    user: mockUser({ membershipStatus: 'NONE' }),
    resource: mockResource(),
    expectedState: 'MEMBERSHIP_REQUIRED'
  },
  {
    name: 'application under review',
    user: mockUser({ membershipStatus: 'UNDER_REVIEW' }),
    resource: mockResource(),
    expectedState: 'APPLICATION_UNDER_REVIEW'
  },
  {
    name: 'approved + READY + entitlement',
    user: mockUser(),
    resource: mockResource(),
    expectedState: 'ACCESS_GRANTED'
  },
  {
    name: 'approved + READY + wrong entitlement',
    user: mockUser({ entitlements: ['SOME_OTHER_ENTITLEMENT'] }),
    resource: mockResource(),
    expectedState: 'ENTITLEMENT_REQUIRED'
  },
  {
    name: 'approved + LOCKED + entitlement',
    user: mockUser(),
    resource: mockResource({ accessStatus: 'LOCKED' }),
    expectedState: 'RESOURCE_RESERVED'
  },
  {
    name: 'expired membership',
    user: mockUser({ membershipStatus: 'EXPIRED' }),
    resource: mockResource(),
    expectedState: 'MEMBERSHIP_INACTIVE'
  },
  {
    name: 'WITHDRAWN resource overrides membership',
    user: mockUser(),
    resource: mockResource({ accessStatus: 'WITHDRAWN' }),
    expectedState: 'RESOURCE_WITHDRAWN'
  },
  {
    name: 'missing entitlement configuration',
    user: mockUser(),
    resource: mockResource({ requiredEntitlement: undefined }),
    expectedState: 'ACCESS_DENIED'
  }
];

let failed = 0;
console.log('--- RUNNING PROTECTED RESOURCE RESOLVER TESTS ---');
testCases.forEach(tc => {
  const result = resolveProtectedResourceAccess(tc.user, tc.resource);
  if (result.state === tc.expectedState) {
    console.log(`✅ PASS: ${tc.name} -> ${result.state}`);
  } else {
    console.log(`❌ FAIL: ${tc.name} -> Expected ${tc.expectedState}, got ${result.state}`);
    failed++;
  }
});

if (failed === 0) {
  console.log('\\nAll tests passed successfully!');
  process.exit(0);
} else {
  console.log(`\\n${failed} test(s) failed.`);
  process.exit(1);
}
