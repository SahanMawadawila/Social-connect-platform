"use client";

import { useSession } from "next-auth/react";

export default function Profile() {
  const session = useSession();

  if (session.data?.user) {
    //in here user information is retrieved from the client side component
    return <div>From client: {JSON.stringify(session.data.user)}</div>;
  }

  return <div>From client: user is NOT signed in</div>;
}
