import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Link href="/conversation/1" passHref>
        <Button>
          Go to conversation
        </Button>
      </Link>
    </div>
  );
}
