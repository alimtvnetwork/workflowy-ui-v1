import { SlideLayout } from "../SlideLayout";
import { Wireframe } from "../components/Wireframe";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 17 · Auth flow" title="Sign up · sign in · sessions">
      <Wireframe>{`   /signup                       /signin
   ──────────────────────        ──────────────────────
   Email      [          ]       Email      [          ]
   Password   [          ]       Password   [          ]
   Display    [          ]
   [Create account]              [Sign in]
                                 [Forgot password?]

   On success:
     • Server sets httpOnly session cookie
     • Verification email sent (User.IsVerified = false until clicked)
     • Redirect to /home with default Inbox / Drafts / Trash seeded`}</Wireframe>
    </SlideLayout>
  );
}
