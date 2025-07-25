const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors')({ origin: true });

admin.initializeApp();

// 🔐 Replace with your real Paystack secret key
const PAYSTACK_SECRET_KEY = 'sk_test_898ef46a55e744a277ae93ad2e17dcf48587bfa0';

exports.verifyBVN = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send({ error: 'Only POST allowed' });
    }

    const { bvn } = req.body;
    if (!bvn) {
      return res.status(400).send({ error: 'BVN is required' });
    }

    try {
      const response = await axios.get(`https://api.paystack.co/bank/resolve_bvn/${bvn}`, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      });

      return res.status(200).send(response.data);
    } catch (err) {
      console.error('BVN Lookup Error:', err.response?.data || err.message);
      return res.status(500).send({ error: 'Failed to verify BVN' });
    }
  });
});