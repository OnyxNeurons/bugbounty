import YesWeHack from "@onyx/neurons/bugbounty/lib/yeswehack";
import Hackerone from "@onyx/neurons/bugbounty/lib/hackerone";

export async function POST(req: Request) {
  const { platform, email, password, otp } = await req.json();

  if ( !platform || !email || !password) {
    return Response.json({ message: "invalid inputs" }, { status: 400 });
  }

  try {
    switch (platform) {
      case "yeswehack":
        const jwt = await YesWeHack.getFullJWT(email, password, otp);
        if (!jwt) {
          return Response.json({ message: "invalid credentials" }, { status: 400 });
        } else {
          return Response.json({ message: "valid credentials" });
        }
      case "hackerone":
        const valid = await Hackerone.verifyLogin(email, password);
        if (!valid) {
          return Response.json({ message: "invalid credentials" }, { status: 400 });
        } else {
          return Response.json({ message: "valid credentials" });
        }
      default:
        return Response.json({ message: "invalid platform" }, { status: 400 });
    }
    
  } catch (e) {
    throw new Error(e);
  }
}