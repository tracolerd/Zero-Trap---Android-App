/**
 * একবার চালিয়ে সব পুরনো ইউজার + সম্পর্কিত Firestore ডাটা মুছে ফেলা।
 *
 * প্রস্তুতি:
 * 1) Firebase Console → Project settings → Service accounts → Generate new private key
 *    → JSON ফাইল ডাউনলোড করে প্রজেক্ট রুটে রাখো, নাম দাও যেমন: serviceAccount.json
 *    (এই ফাইল git-এ commit করবে না — .gitignore-এ আছে)
 *
 * 2) টার্মিনাল (প্রজেক্ট রুট থেকে):
 *    npm install
 *    set PURGE_CONFIRM=YES_I_UNDERSTAND
 *    set GOOGLE_APPLICATION_CREDENTIALS=serviceAccount.json
 *    node scripts/purgeAllUsersOnce.js
 *
 * PowerShell:
 *    $env:PURGE_CONFIRM="YES_I_UNDERSTAND"
 *    $env:GOOGLE_APPLICATION_CREDENTIALS="serviceAccount.json"
 *    node scripts/purgeAllUsersOnce.js
 */

const admin = require('firebase-admin');

const COLLECTIONS_TO_DELETE = [
  'users',
  'usernames',
  'helpRequests',
  'liveLocations',
  'chats',
  'reports',
  'notifications',
  'helpHistory',
];

async function main() {
  if (process.env.PURGE_CONFIRM !== 'YES_I_UNDERSTAND') {
    console.error(
      'বাতিল: প্রথমে PURGE_CONFIRM=YES_I_UNDERSTAND সেট করো (ভুলে চালালে ডাটা মুছবে না)।'
    );
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production' && process.env.PURGE_ALLOW_PRODUCTION !== 'YES_I_UNDERSTAND') {
    console.error(
      'বাতিল: production ডাটা মুছতে PURGE_ALLOW_PRODUCTION=YES_I_UNDERSTAND আলাদাভাবে সেট করতে হবে।'
    );
    process.exit(1);
  }

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('বাতিল: GOOGLE_APPLICATION_CREDENTIALS এ সার্ভিস অ্যাকাউন্ট JSON এর পাথ দাও।');
    process.exit(1);
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  const db = admin.firestore();
  const auth = admin.auth();

  console.log('Firestore কালেকশন মুছছি (recursive)...');
  for (const name of COLLECTIONS_TO_DELETE) {
    const ref = db.collection(name);
    try {
      await db.recursiveDelete(ref);
      console.log('  ✓', name);
    } catch (e) {
      if (e.code === 5 || /not found/i.test(String(e.message))) {
        console.log('  —', name, '(খালি বা নেই)');
      } else {
        console.error('  ✗', name, e.message);
        throw e;
      }
    }
  }

  console.log('Firebase Auth ইউজার মুছছি...');
  let pageToken;
  let total = 0;
  do {
    const res = await auth.listUsers(1000, pageToken);
    const uids = res.users.map((u) => u.uid);
    if (uids.length) {
      const del = await auth.deleteUsers(uids);
      total += uids.length;
      if (del.failureCount) {
        console.error('কিছু ডিলিট ফেল:', del.errors);
      }
    }
    pageToken = res.pageToken;
  } while (pageToken);

  console.log('শেষ। Auth থেকে মোট ইউজার ডিলিট চেষ্টা:', total);
  console.log('এখন থেকে যারা নতুন রেজিস্টার করবে শুধু তারাই থাকবে।');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
