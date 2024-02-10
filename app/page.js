import UserInterface from "@/components/UserInterface";

export default function Home() {
  return (
    <main>
      <div className="min-h-screen ">
        <UserInterface
          basePath={'/'}
        />
      </div>
    </main>
  );
}
