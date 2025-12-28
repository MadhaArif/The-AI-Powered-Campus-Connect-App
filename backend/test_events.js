

async function testEvents() {
  try {
    const res = await fetch("http://localhost:5001/events");
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}

testEvents();
