
// import { cookies } from "next/headers";

import ChatPage from "../hooks/chatPage";


export default function ChatPageWrapper() {
  // const cookieStore = cookies();
  // const user = getUserFromCookie({ cookies: cookieStore });
  // const userId = user?.id; // your JWT must contain { id: "...mongoId..." }
 const userId = '68fc54812c64def857ae273b' // TEMP hardcoded userId for testing

  return <ChatPage currentUserId={userId} />;
}
