const admin = require("firebase-admin");
const serviceAccount = require("../visualization-assistant-firebase-adminsdk-ffj1i-cec985c20b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

async function updateThreads() {
  const usersRef = firestore.collection("users");
  const snapshot = await usersRef.get();

  snapshot.forEach(async (doc) => {
    const userData = doc.data();
    let threads = userData.threads || [];

    // Correct the data structure
    threads = threads
      .map((thread) => {
        if (typeof thread.id === "string") {
          // Correctly structured thread
          return {
            id: thread.id,
            name: thread.name || null,
            archived: thread.archived || false,
            favorite: thread.favorite || false,
          };
        } else if (typeof thread.threadID === "string") {
          // Fix the nested threadID structure
          return {
            id: thread.threadID,
            name: thread.name || null,
            archived: thread.archived || false,
            favorite: thread.favorite || false,
          };
        }
      })
      .filter((thread) => thread !== undefined);

    // Handle archived threads
    let archivedThreads = userData.archivedThreads || [];
    archivedThreads = archivedThreads.map((threadID) => ({
      id: threadID,
      name: null,
      archived: true,
      favorite: false,
    }));

    const allThreads = [...threads, ...archivedThreads];

    await doc.ref.update({
      threads: allThreads,
      archivedThreads: [], // Optionally clear the archivedThreads field if merging
    });

    console.log(`Updated threads for user: ${doc.id}`);
  });

  console.log("All user threads updated successfully.");
}

updateThreads().catch((error) => {
  console.error("Error updating threads: ", error);
});
