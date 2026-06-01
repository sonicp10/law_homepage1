async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "테스트봇",
        phone: "010-9999-8888",
        preferredType: "개인파산",
        source: "TEST_SCRIPT"
      })
    });
    const json = await res.json();
    console.log(json);
  } catch (err) {
    console.error(err);
  }
}
test();
