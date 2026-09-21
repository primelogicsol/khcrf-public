/**
 * seedDonations.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds rich dummy data to exercise EVERY filter on the donations dashboard:
 *
 *  ✅ Status           : CAPTURED, FAILED, REFUNDED
 *  ✅ Payment Method   : RAZORPAY (card/upi/netbanking), BANK_TRANSFER,
 *                        UPI_STATIC_QR, CHEQUE, DEMAND_DRAFT
 *  ✅ Donor Type       : INDIVIDUAL, INSTITUTIONAL, CORPORATE, IN_KIND, LEGACY
 *  ✅ Purpose          : 6 categories spanning all real categories
 *  ✅ Currency         : INR, USD, GBP
 *  ✅ Receipt Status   : GENERATED (has receipt), PENDING/NONE (no receipt)
 *  ✅ Date Range       : Spread across last 90 days
 *  ✅ Search           : Distinct names, emails, payment IDs
 *  ✅ Offline Queue    : All lifecycle states (AWAITING_VERIFICATION, RECEIVED,
 *                        DEPOSITED, VERIFIED, CLEARED, REJECTED, BOUNCED)
 *  ✅ Webhook Events   : payment.captured, payment.failed, refund.created
 *
 * Run: npx ts-node --project tsconfig.json prisma/seedDonations.ts
 * Or:  npx tsx prisma/seedDonations.ts
 */

import { prisma } from '../src/config/db';

// ─── Helpers ────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function randomRzpPayId() {
  return `pay_${Math.random().toString(36).slice(2, 14).toUpperCase()}`;
}
function randomRzpOrderId() {
  return `order_${Math.random().toString(36).slice(2, 14).toUpperCase()}`;
}
function randomUtr() {
  return `UTR${Date.now()}${Math.floor(Math.random() * 9999)}`;
}
function randomChequeNo() {
  return `CHQ${Date.now()}${Math.floor(Math.random() * 999)}`;
}
function randomEvtId() {
  return `evt_${Math.random().toString(36).slice(2, 18)}`;
}

// ─── Categories ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Artisan Tools & Equipment',     slug: 'artisan-tools' },
  { name: 'Craft Education & Training',    slug: 'craft-education' },
  { name: 'Policy Advocacy',               slug: 'policy-advocacy' },
  { name: 'Product Photography',           slug: 'product-photography' },
  { name: 'Workshop Improvement',          slug: 'workshop-improvement' },
  { name: 'General Support',               slug: 'general-support' },
];

// ─── Donors ─────────────────────────────────────────────────────────────────

const DONORS = [
  { name: 'Arjun Mehta',        email: 'arjun.mehta@gmail.com',     phone: '9876543210', type: 'INDIVIDUAL',    isAnonymous: false },
  { name: 'Priya Sharma',       email: 'priya.sharma@outlook.com',  phone: '9123456789', type: 'INDIVIDUAL',    isAnonymous: false },
  { name: 'TechCorp India Ltd', email: 'csr@techcorp.in',           phone: '1800123456', type: 'CORPORATE',     isAnonymous: false },
  { name: 'Sunrise Foundation', email: 'grants@sunrise.org',        phone: '9988776655', type: 'INSTITUTIONAL', isAnonymous: false },
  { name: 'Robert Williams',    email: 'rob.w@globalaid.uk',        phone: null,         type: 'LEGACY',        isAnonymous: false },
  { name: 'Anonymous Patron',   email: 'anon1@anonymous-proxy.org', phone: null,         type: 'INDIVIDUAL',    isAnonymous: true  },
  { name: 'Craft Supplies Co',  email: 'inkind@craftsupplies.com',  phone: '9001122334', type: 'IN_KIND',       isAnonymous: false },
  { name: 'Fatima Al-Hassan',   email: 'fatima@uaedonate.ae',       phone: null,         type: 'INDIVIDUAL',    isAnonymous: false },
];

// ─── Main Seed ───────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding donation dashboard test data...\n');

  // 1. Upsert categories
  console.log('📂 Upserting categories...');
  const cats: Record<string, { id: string; name: string }> = {};
  for (const cat of CATEGORIES) {
    const c = await prisma.donationCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    cats[cat.slug] = c;
    console.log(`   ✓ ${c.name}`);
  }

  // 2. Upsert donors
  console.log('\n👤 Upserting donors...');
  const donors: Record<string, { id: string }> = {};
  for (const d of DONORS) {
    const donor = await prisma.donor.upsert({
      where: { email: d.email },
      update: {},
      create: {
        name: d.name,
        email: d.email,
        phone: d.phone,
        type: d.type,
        isAnonymous: d.isAnonymous,
        recognitionConsent: !d.isAnonymous,
      },
    });
    donors[d.email] = donor;
    console.log(`   ✓ ${d.name} (${d.type})`);
  }

  // 3. Donation Transactions — covers all status / method / currency / receipt combos
  console.log('\n💳 Creating donation transactions...');

  const txDefs = [
    // ── CAPTURED — various methods and purposes ──────────────────────────
    {
      donorEmail: 'arjun.mehta@gmail.com',
      amount: 5000, currency: 'INR', status: 'CAPTURED',
      paymentMethod: 'card', categorySlug: 'artisan-tools',
      createdAt: daysAgo(2), withReceipt: true,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    {
      donorEmail: 'priya.sharma@outlook.com',
      amount: 2500, currency: 'INR', status: 'CAPTURED',
      paymentMethod: 'upi', categorySlug: 'craft-education',
      createdAt: daysAgo(5), withReceipt: true,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    {
      donorEmail: 'csr@techcorp.in',
      amount: 50000, currency: 'INR', status: 'CAPTURED',
      paymentMethod: 'netbanking', categorySlug: 'policy-advocacy',
      createdAt: daysAgo(10), withReceipt: true,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    {
      donorEmail: 'grants@sunrise.org',
      amount: 15000, currency: 'INR', status: 'CAPTURED',
      paymentMethod: 'card', categorySlug: 'workshop-improvement',
      createdAt: daysAgo(15), withReceipt: true,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    {
      donorEmail: 'rob.w@globalaid.uk',
      amount: 200, currency: 'GBP', status: 'CAPTURED',
      paymentMethod: 'card', categorySlug: 'general-support',
      createdAt: daysAgo(20), withReceipt: true,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    {
      donorEmail: 'fatima@uaedonate.ae',
      amount: 500, currency: 'USD', status: 'CAPTURED',
      paymentMethod: 'card', categorySlug: 'product-photography',
      createdAt: daysAgo(30), withReceipt: false,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    // CAPTURED — no receipt (for receipt-pending filter)
    {
      donorEmail: 'anon1@anonymous-proxy.org',
      amount: 1000, currency: 'INR', status: 'CAPTURED',
      paymentMethod: 'upi', categorySlug: 'general-support',
      createdAt: daysAgo(1), withReceipt: false,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    {
      donorEmail: 'inkind@craftsupplies.com',
      amount: 3500, currency: 'INR', status: 'CAPTURED',
      paymentMethod: 'card', categorySlug: 'artisan-tools',
      createdAt: daysAgo(45), withReceipt: false,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    // ── FAILED ───────────────────────────────────────────────────────────
    {
      donorEmail: 'arjun.mehta@gmail.com',
      amount: 8000, currency: 'INR', status: 'FAILED',
      paymentMethod: 'card', categorySlug: 'craft-education',
      createdAt: daysAgo(7), withReceipt: false,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    {
      donorEmail: 'priya.sharma@outlook.com',
      amount: 1200, currency: 'INR', status: 'FAILED',
      paymentMethod: 'upi', categorySlug: 'workshop-improvement',
      createdAt: daysAgo(14), withReceipt: false,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    {
      donorEmail: 'rob.w@globalaid.uk',
      amount: 100, currency: 'USD', status: 'FAILED',
      paymentMethod: 'card', categorySlug: 'general-support',
      createdAt: daysAgo(60), withReceipt: false,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    // ── REFUNDED ─────────────────────────────────────────────────────────
    {
      donorEmail: 'csr@techcorp.in',
      amount: 10000, currency: 'INR', status: 'REFUNDED',
      paymentMethod: 'netbanking', categorySlug: 'policy-advocacy',
      createdAt: daysAgo(25), withReceipt: false,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
    {
      donorEmail: 'fatima@uaedonate.ae',
      amount: 250, currency: 'USD', status: 'REFUNDED',
      paymentMethod: 'card', categorySlug: 'general-support',
      createdAt: daysAgo(40), withReceipt: false,
      rzpPayId: randomRzpPayId(), rzpOrderId: randomRzpOrderId(),
    },
  ];

  let receiptCounter = 1000;
  for (const def of txDefs) {
    const donorId = donors[def.donorEmail].id;
    const catId   = cats[def.categorySlug].id;

    const tx = await prisma.donationTransaction.create({
      data: {
        donorId,
        amount: def.amount,
        currency: def.currency,
        status: def.status,
        paymentMethod: def.paymentMethod,
        razorpayPaymentId: def.rzpPayId,
        razorpayOrderId: def.rzpOrderId,
        capturedAt: def.status === 'CAPTURED' ? def.createdAt : null,
        settlementStatus: def.status === 'CAPTURED' ? 'reconciled' : 'unreconciled',
        createdAt: def.createdAt,
        allocations: {
          create: {
            categoryId: catId,
            amount: def.amount,
            createdAt: def.createdAt,
          }
        }
      }
    });

    if (def.withReceipt && def.status === 'CAPTURED') {
      receiptCounter++;
      const receiptNumber = `REC-SEED-${receiptCounter}`;
      await prisma.donationReceipt.create({
        data: {
          donationTransactionId: tx.id,
          donorId,
          receiptNumber,
          receiptUrl: `/receipts/${receiptNumber}.pdf`,
          status: 'GENERATED',
          createdAt: def.createdAt,
        }
      });
    }

    // Add refund record for REFUNDED transactions
    if (def.status === 'REFUNDED') {
      await prisma.donationRefund.create({
        data: {
          donationTransactionId: tx.id,
          razorpayRefundId: `rfnd_${Math.random().toString(36).slice(2,14).toUpperCase()}`,
          amount: def.amount,
          status: 'PROCESSED',
          reason: 'Donor requested refund',
          createdAt: def.createdAt,
        }
      });
    }

    console.log(`   ✓ ${def.status.padEnd(8)} ₹${def.amount} ${def.currency} — ${def.donorEmail} — ${def.paymentMethod} [${def.withReceipt ? 'receipt ✓' : 'no receipt'}]`);
  }

  // 4. Offline Payment Submissions — all lifecycle states
  console.log('\n📋 Creating offline payment submissions...');

  const offlineDefs = [
    // BANK_TRANSFER — awaiting verification
    {
      donorEmail: 'arjun.mehta@gmail.com',
      paymentMethod: 'BANK_TRANSFER' as const,
      amount: 7500, currency: 'INR',
      utrNumber: randomUtr(),
      originatingBank: 'HDFC Bank',
      paymentStatus: 'AWAITING_VERIFICATION',
      createdAt: daysAgo(1),
    },
    // BANK_TRANSFER — verified
    {
      donorEmail: 'priya.sharma@outlook.com',
      paymentMethod: 'BANK_TRANSFER' as const,
      amount: 3000, currency: 'INR',
      utrNumber: randomUtr(),
      originatingBank: 'ICICI Bank',
      paymentStatus: 'VERIFIED',
      createdAt: daysAgo(8),
    },
    // UPI_STATIC_QR — awaiting verification
    {
      donorEmail: 'fatima@uaedonate.ae',
      paymentMethod: 'UPI_STATIC_QR' as const,
      amount: 500, currency: 'INR',
      utrNumber: randomUtr(),
      originatingBank: null,
      paymentStatus: 'AWAITING_VERIFICATION',
      createdAt: daysAgo(2),
    },
    // UPI_STATIC_QR — verified
    {
      donorEmail: 'anon1@anonymous-proxy.org',
      paymentMethod: 'UPI_STATIC_QR' as const,
      amount: 250, currency: 'INR',
      utrNumber: randomUtr(),
      originatingBank: null,
      paymentStatus: 'VERIFIED',
      createdAt: daysAgo(12),
    },
    // CHEQUE — awaiting receipt (just submitted, instrument not yet in hand)
    {
      donorEmail: 'csr@techcorp.in',
      paymentMethod: 'CHEQUE' as const,
      amount: 25000, currency: 'INR',
      instrumentNumber: randomChequeNo(),
      issuingBank: 'State Bank of India',
      paymentStatus: 'AWAITING_RECEIPT',
      createdAt: daysAgo(3),
    },
    // CHEQUE — received (cheque in hand, not yet deposited)
    {
      donorEmail: 'grants@sunrise.org',
      paymentMethod: 'CHEQUE' as const,
      amount: 12000, currency: 'INR',
      instrumentNumber: randomChequeNo(),
      issuingBank: 'Punjab National Bank',
      paymentStatus: 'RECEIVED',
      createdAt: daysAgo(10),
    },
    // CHEQUE — deposited (cheque deposited, awaiting clearance)
    {
      donorEmail: 'rob.w@globalaid.uk',
      paymentMethod: 'CHEQUE' as const,
      amount: 8000, currency: 'INR',
      instrumentNumber: randomChequeNo(),
      issuingBank: 'HDFC Bank',
      paymentStatus: 'DEPOSITED',
      createdAt: daysAgo(18),
    },
    // CHEQUE — cleared (fully processed)
    {
      donorEmail: 'inkind@craftsupplies.com',
      paymentMethod: 'CHEQUE' as const,
      amount: 5000, currency: 'INR',
      instrumentNumber: randomChequeNo(),
      issuingBank: 'Axis Bank',
      paymentStatus: 'CLEARED',
      createdAt: daysAgo(25),
    },
    // CHEQUE — bounced
    {
      donorEmail: 'arjun.mehta@gmail.com',
      paymentMethod: 'CHEQUE' as const,
      amount: 3000, currency: 'INR',
      instrumentNumber: randomChequeNo(),
      issuingBank: 'Kotak Mahindra Bank',
      paymentStatus: 'BOUNCED',
      createdAt: daysAgo(35),
    },
    // DEMAND_DRAFT — awaiting receipt
    {
      donorEmail: 'priya.sharma@outlook.com',
      paymentMethod: 'DEMAND_DRAFT' as const,
      amount: 20000, currency: 'INR',
      instrumentNumber: randomChequeNo(),
      issuingBank: 'Bank of Baroda',
      paymentStatus: 'AWAITING_RECEIPT',
      createdAt: daysAgo(4),
    },
    // DEMAND_DRAFT — cleared
    {
      donorEmail: 'fatima@uaedonate.ae',
      paymentMethod: 'DEMAND_DRAFT' as const,
      amount: 15000, currency: 'INR',
      instrumentNumber: randomChequeNo(),
      issuingBank: 'Canara Bank',
      paymentStatus: 'CLEARED',
      createdAt: daysAgo(50),
    },
    // REJECTED
    {
      donorEmail: 'csr@techcorp.in',
      paymentMethod: 'BANK_TRANSFER' as const,
      amount: 100, currency: 'INR',
      utrNumber: randomUtr(),
      originatingBank: 'Unknown',
      paymentStatus: 'REJECTED',
      createdAt: daysAgo(20),
      rejectionReason: 'Amount does not match any open donation intent.',
    },
  ];

  for (const def of offlineDefs) {
    const donorId = donors[def.donorEmail].id;
    const isChequeOrDd = def.paymentMethod === 'CHEQUE' || def.paymentMethod === 'DEMAND_DRAFT';

    await prisma.offlinePaymentSubmission.create({
      data: {
        paymentMethod: def.paymentMethod,
        amount: def.amount,
        currency: def.currency,
        utrNumber: (def as any).utrNumber || null,
        originatingBank: (def as any).originatingBank || null,
        instrumentNumber: (def as any).instrumentNumber || null,
        issuingBank: (def as any).issuingBank || null,
        instrumentType: isChequeOrDd ? def.paymentMethod : null,
        paymentStatus: def.paymentStatus,
        submissionStatus: 'SUBMITTED',
        receiptStatus: (def.paymentStatus === 'VERIFIED' || def.paymentStatus === 'CLEARED')
          ? 'PENDING' : 'NOT_ELIGIBLE',
        rejectionReason: (def as any).rejectionReason || null,
        adminNotes: def.paymentStatus !== 'AWAITING_VERIFICATION' && def.paymentStatus !== 'AWAITING_RECEIPT'
          ? 'Reviewed by admin (seeded)' : null,
        verifiedAt: !['AWAITING_VERIFICATION','AWAITING_RECEIPT'].includes(def.paymentStatus)
          ? daysAgo(Math.max(0, 2)) : null,
        verifiedBy: !['AWAITING_VERIFICATION','AWAITING_RECEIPT'].includes(def.paymentStatus)
          ? 'seed-admin' : null,
        createdAt: def.createdAt,
        donationIntent: undefined,
      }
    });

    const methodLabel = def.paymentMethod.padEnd(16);
    const statusLabel = def.paymentStatus.padEnd(22);
    console.log(`   ✓ ${methodLabel} ${statusLabel} ₹${def.amount} — ${def.donorEmail}`);
  }

  // 5. Webhook Events — all types
  console.log('\n🪝 Creating webhook events...');

  const webhookDefs = [
    { eventType: 'payment.captured', processed: true,  error: null,         createdAt: daysAgo(1)  },
    { eventType: 'payment.captured', processed: true,  error: null,         createdAt: daysAgo(5)  },
    { eventType: 'payment.failed',   processed: true,  error: null,         createdAt: daysAgo(7)  },
    { eventType: 'payment.failed',   processed: false, error: 'Duplicate event — idempotency check skipped', createdAt: daysAgo(14) },
    { eventType: 'refund.created',   processed: true,  error: null,         createdAt: daysAgo(25) },
    { eventType: 'refund.created',   processed: false, error: 'Razorpay gateway timeout during refund hook', createdAt: daysAgo(40) },
    { eventType: 'payment.authorized', processed: true, error: null,        createdAt: daysAgo(3)  },
  ];

  for (const wh of webhookDefs) {
    const id = randomEvtId();
    await prisma.razorpayWebhookEvent.upsert({
      where: { id },
      update: {},
      create: {
        id,
        eventType: wh.eventType,
        processed: wh.processed,
        error: wh.error,
        payload: {
          event: wh.eventType,
          created_at: wh.createdAt.getTime(),
          payload: { payment: { entity: { id: randomRzpPayId(), amount: 500000, currency: 'INR' } } }
        },
        createdAt: wh.createdAt,
      }
    });
    const status = wh.processed ? '✓ processed' : '✗ failed   ';
    console.log(`   ${status}  ${wh.eventType}  ${wh.error ? `— ${wh.error.slice(0,50)}` : ''}`);
  }

  // 6. Summary
  console.log('\n✅ Seed complete!\n');
  console.log('Filter coverage summary:');
  console.log('  Status      : CAPTURED ✓  FAILED ✓  REFUNDED ✓');
  console.log('  Methods     : card ✓  upi ✓  netbanking ✓  BANK_TRANSFER ✓  UPI_STATIC_QR ✓  CHEQUE ✓  DEMAND_DRAFT ✓');
  console.log('  Donor Types : INDIVIDUAL ✓  CORPORATE ✓  INSTITUTIONAL ✓  IN_KIND ✓  LEGACY ✓  Anonymous ✓');
  console.log('  Currencies  : INR ✓  USD ✓  GBP ✓');
  console.log('  Receipts    : With receipt ✓  Without receipt ✓');
  console.log('  Offline     : AWAITING_VERIFICATION ✓  AWAITING_RECEIPT ✓  RECEIVED ✓  DEPOSITED ✓  VERIFIED ✓  CLEARED ✓  BOUNCED ✓  REJECTED ✓');
  console.log('  Webhooks    : payment.captured ✓  payment.failed ✓  refund.created ✓  payment.authorized ✓');
  console.log('  Date Range  : Spread across last 90 days — use date filters to narrow\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

