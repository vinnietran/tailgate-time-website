import {
  EmailAuthProvider,
  GoogleAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  type User
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export class DeleteAccountReauthRequiredError extends Error {
  code = "auth/requires-recent-login";

  constructor(message = "Reauthentication is required before deleting this account.") {
    super(message);
    this.name = "DeleteAccountReauthRequiredError";
  }
}

function hasProvider(user: User, providerId: string) {
  return user.providerData.some((provider) => provider.providerId === providerId);
}

async function reauthenticateForDelete(user: User, password?: string) {
  if (hasProvider(user, "password")) {
    const email = user.email?.trim();
    const nextPassword = password?.trim();
    if (!email || !nextPassword) {
      throw new DeleteAccountReauthRequiredError(
        "Enter your current password to delete this account."
      );
    }
    const credential = EmailAuthProvider.credential(email, nextPassword);
    await reauthenticateWithCredential(user, credential);
    return;
  }

  if (hasProvider(user, "google.com")) {
    await reauthenticateWithPopup(user, new GoogleAuthProvider());
  }
}

export async function deleteCurrentAccount(options?: { password?: string }) {
  if (!auth?.currentUser) {
    throw new Error("No authenticated user found.");
  }

  if (!db) {
    throw new Error("Firestore is unavailable in this environment.");
  }

  const user = auth.currentUser;
  await reauthenticateForDelete(user, options?.password);

  await deleteDoc(doc(db, "users", user.uid));
  await deleteUser(user);
}
