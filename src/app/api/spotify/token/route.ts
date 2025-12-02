// import { NextResponse } from "next/server";

// export async function POST() {
//   const basic = Buffer.from(
//     process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
//   ).toString("base64");

//   const res = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: {
//       Authorization: `Basic ${basic}`,
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: "grant_type=client_credentials",
//   });

//   const data = await res.json();
//   return NextResponse.json(data);
// }
