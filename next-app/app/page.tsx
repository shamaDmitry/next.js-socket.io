import ChatClient from "@/components/ChatClient";

export default function Page() {
  return (
    <main className="p-12">
      <div className="text-center mb-4">
        <h1>Minimal Chat</h1>
        <p>Open another browser window to test real-time messages.</p>
      </div>

      <ChatClient />
    </main>
  );
}
