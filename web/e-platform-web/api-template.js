// 1. USER BROWSER
const result = await fetch('RENDER_URL/api/v1/RESOURCE', {
  method: 'POST/GET/PATCH/DELETE',
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify(data)
});

// 2. RENDER SERVICE
router.post('/RESOURCE', authenticate, async (req, res) => {
  // Verify user
  // Do business logic
  // Talk to Firestore
  await db.collection('COLLECTION').doc(id).set(data);
  res.json({ success: true });
});
