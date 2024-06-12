import { goto } from "$app/navigation";
import {
    currentRun,
    currentThread,
    isMenuOpen,
    messagesStore,
    userThreads,
} from "$lib/stores";

export async function deleteThread(threadID: string) {
    // todos
    // delete thread from userThreads store
    // delete thread from firestore
    console.log("hello from delete thread");
    try {
        const response = await fetch("/api/threads/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                threadID: threadID,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("API response:", result);

        // delete from firestore
        if (result.deleted) {
            console.log("hello from if (result.success)");

            console.log(
                "Thread successfully deleted from API. Proceeding with Firestore update.",
            );

            const userRef = doc(firestore, `users/${$user!.uid}`);

            await updateDoc(userRef, {
                threads: arrayRemove(threadID),
            });

            console.log("Thread successfully deleted from Firestore.");

            // todo
            // remove thread from userThreads
            userThreads.update((threads) =>
                threads.filter((id) => id !== threadID),
            );
            console.log(
                "Thread successfully deleted from userThreads store.",
            );

            // check if deleted thread is the currentThread
            console.log("checking to see if currentThread deleted: ");
            currentThread.update((current) => {
                if (current === threadID) {
                    messagesStore.set([]);
                    currentRun.set("");

                    // clear url
                    goto("/", { replaceState: true });

                    return "";
                }
                return current;
            });
            console.log("current thread: ", currentThread);
        }
    } catch (error) {
        console.error("failed to delete the thread: ", error);
    }
}
